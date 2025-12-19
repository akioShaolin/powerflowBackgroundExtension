document.addEventListener('DOMContentLoaded', function() {
    const imageUrlInput = document.getElementById('imageUrl');
    const applyButton = document.getElementById('applyBackground');
    const removeButton = document.getElementById('removeBackground');
    const currentImageDiv = document.getElementById('currentImage');
    const statusDiv = document.getElementById('status');

    // Carregar imagem salva ao abrir o popup
    loadSavedImage();

    // Event listeners
    applyButton.addEventListener('click', applyBackground);
    removeButton.addEventListener('click', removeBackground);
    imageUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyBackground();
        }
    });

    async function loadSavedImage() {
        try {
            const result = await chrome.storage.sync.get(['powerflowBackgroundUrl']);
            if (result.powerflowBackgroundUrl) {
                imageUrlInput.value = result.powerflowBackgroundUrl;
                updateCurrentImagePreview(result.powerflowBackgroundUrl);
            }
        } catch (error) {
            console.error('Erro ao carregar imagem salva:', error);
        }
    }

    async function applyBackground() {
        const imageUrl = imageUrlInput.value.trim();
        
        if (!imageUrl) {
            showStatus('Por favor, insira uma URL de imagem válida.', 'error');
            return;
        }

        if (!isValidUrl(imageUrl)) {
            showStatus('URL inválida. Verifique o formato.', 'error');
            return;
        }

        try {
            // Verificar se a imagem existe
            await validateImage(imageUrl);
            
            // Salvar no storage do Chrome
            await chrome.storage.sync.set({ powerflowBackgroundUrl: imageUrl });
            
            // Aplicar no site atual
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab.url && tab.url.includes('powerflow.ecopower.com.br')) {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'applyBackground',
                    imageUrl: imageUrl
                });
                
                updateCurrentImagePreview(imageUrl);
                showStatus('Plano de fundo aplicado com sucesso!', 'success');
            } else {
                // Salvar mesmo se não estiver no site
                updateCurrentImagePreview(imageUrl);
                showStatus('Imagem salva! Será aplicada quando visitar o PowerFlow.', 'info');
            }
            
        } catch (error) {
            console.error('Erro ao aplicar plano de fundo:', error);
            showStatus('Erro ao carregar a imagem. Verifique a URL.', 'error');
        }
    }

    async function removeBackground() {
        try {
            // Remover do storage
            await chrome.storage.sync.remove(['powerflowBackgroundUrl']);
            
            // Remover do site atual
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab.url && tab.url.includes('powerflow.ecopower.com.br')) {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'removeBackground'
                });
            }
            
            // Limpar interface
            imageUrlInput.value = '';
            currentImageDiv.innerHTML = '<span class="no-image">Nenhuma imagem definida</span>';
            currentImageDiv.style.backgroundImage = '';
            
            showStatus('Plano de fundo removido com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao remover plano de fundo:', error);
            showStatus('Erro ao remover plano de fundo.', 'error');
        }
    }

    function updateCurrentImagePreview(imageUrl) {
        currentImageDiv.innerHTML = '';
        currentImageDiv.style.backgroundImage = `url(${imageUrl})`;
        currentImageDiv.style.border = 'none';
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type} show`;
        
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 3000);
    }

    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    function validateImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error('Imagem não encontrada'));
            img.src = url;
        });
    }
});

