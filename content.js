// Content script para modificar o plano de fundo do PowerFlow
(function() {
    'use strict';

    // Seletor da div do plano de fundo conforme especificado pelo usuário
    const BACKGROUND_SELECTOR = '#root > div > div.dashboard-content.MuiBox-root.css-0';
    
    // ID único para identificar nosso estilo customizado
    const CUSTOM_STYLE_ID = 'powerflow-background-extension-style';

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    function initialize() {
        // Carregar e aplicar imagem salva
        loadSavedBackground();
        
        // Observar mudanças no DOM para aplicar o fundo quando a div aparecer
        observeForBackgroundDiv();
    }

    async function loadSavedBackground() {
        try {
            const result = await chrome.storage.sync.get(['powerflowBackgroundUrl']);
            if (result.powerflowBackgroundUrl) {
                applyBackgroundImage(result.powerflowBackgroundUrl);
            }
        } catch (error) {
            console.error('PowerFlow Extension: Erro ao carregar imagem salva:', error);
        }
    }

    function applyBackgroundImage(imageUrl) {
        // Remover estilo anterior se existir
        removeCustomStyle();
        
        // Criar novo estilo
        const style = document.createElement('style');
        style.id = CUSTOM_STYLE_ID;
        style.textContent = `
            ${BACKGROUND_SELECTOR} {
                background-image: url("${imageUrl}") !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                background-attachment: fixed !important;
            }
        `;
        
        document.head.appendChild(style);
        
        console.log('PowerFlow Extension: Plano de fundo aplicado:', imageUrl);
    }

    function removeBackgroundImage() {
        removeCustomStyle();
        console.log('PowerFlow Extension: Plano de fundo removido');
    }

    function removeCustomStyle() {
        const existingStyle = document.getElementById(CUSTOM_STYLE_ID);
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    function observeForBackgroundDiv() {
        // Verificar se a div já existe
        const targetDiv = document.querySelector(BACKGROUND_SELECTOR);
        if (targetDiv) {
            // Se já existe, aplicar o fundo imediatamente
            loadSavedBackground();
        }

        // Observar mudanças no DOM para quando a div aparecer
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const targetDiv = document.querySelector(BACKGROUND_SELECTOR);
                    if (targetDiv && !document.getElementById(CUSTOM_STYLE_ID)) {
                        loadSavedBackground();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Escutar mensagens do popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'applyBackground':
                    applyBackgroundImage(request.imageUrl);
                    sendResponse({ success: true });
                    break;
                    
                case 'removeBackground':
                    removeBackgroundImage();
                    sendResponse({ success: true });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Ação não reconhecida' });
            }
        } catch (error) {
            console.error('PowerFlow Extension: Erro ao processar mensagem:', error);
            sendResponse({ success: false, error: error.message });
        }
        
        return true; // Manter o canal de mensagem aberto para resposta assíncrona
    });

    // Escutar mudanças no storage para sincronizar entre abas
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync' && changes.powerflowBackgroundUrl) {
            if (changes.powerflowBackgroundUrl.newValue) {
                applyBackgroundImage(changes.powerflowBackgroundUrl.newValue);
            } else {
                removeBackgroundImage();
            }
        }
    });

    console.log('PowerFlow Extension: Content script carregado');
})();

