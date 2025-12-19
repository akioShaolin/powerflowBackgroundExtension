# PowerFlow Background Changer

Uma extensão do Chrome que permite personalizar o plano de fundo do site PowerFlow (powerflow.ecopower.com.br) com imagens personalizadas.

## Funcionalidades

- ✅ Interface interativa para inserir URLs de imagens
- ✅ Aplicação automática do plano de fundo personalizado
- ✅ Persistência das configurações na memória do Chrome
- ✅ Sincronização entre abas do navegador
- ✅ Remoção fácil do plano de fundo personalizado
- ✅ Validação de URLs de imagem
- ✅ Preview da imagem atual

## Como Instalar

1. Baixe ou clone este repositório
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor" no canto superior direito
4. Clique em "Carregar sem compactação"
5. Selecione a pasta da extensão
6. A extensão será instalada e aparecerá na barra de ferramentas

## Como Usar

1. Navegue até o site PowerFlow (https://powerflow.ecopower.com.br/)
2. Clique no ícone da extensão na barra de ferramentas
3. Cole a URL de uma imagem no campo "URL da Imagem"
4. Clique em "Aplicar Fundo" para definir a imagem como plano de fundo
5. Para remover o plano de fundo, clique em "Remover Fundo"

## Estrutura dos Arquivos

- `manifest.json` - Configuração principal da extensão
- `popup.html` - Interface do usuário da extensão
- `popup.css` - Estilos da interface
- `popup.js` - Lógica da interface e comunicação
- `content.js` - Script injetado no site para modificar o plano de fundo
- `icon16.png`, `icon48.png`, `icon128.png` - Ícones da extensão

## Tecnologias Utilizadas

- HTML5
- CSS3 (com gradientes e animações)
- JavaScript (ES6+)
- Chrome Extension APIs:
  - `chrome.storage.sync` - Para persistência de dados
  - `chrome.tabs` - Para comunicação com abas
  - `chrome.runtime` - Para mensagens entre scripts

## Funcionalidades Técnicas

### Persistência de Dados
A extensão utiliza `chrome.storage.sync` para salvar as configurações do usuário, garantindo que:
- As configurações sejam mantidas entre sessões do navegador
- As configurações sejam sincronizadas entre diferentes dispositivos (se logado na conta Google)
- As mudanças sejam aplicadas automaticamente em todas as abas abertas

### Seletor CSS Alvo
A extensão modifica especificamente a div com o seletor:
```css
#root > div > div.dashboard-content.MuiBox-root.css-0
```

### Aplicação do Plano de Fundo
O plano de fundo é aplicado usando CSS com as seguintes propriedades:
- `background-size: cover` - Para cobrir toda a área
- `background-position: center` - Para centralizar a imagem
- `background-repeat: no-repeat` - Para evitar repetição
- `background-attachment: fixed` - Para fixar a imagem durante o scroll

## Segurança

- A extensão só funciona no domínio `powerflow.ecopower.com.br`
- Validação de URLs para garantir que sejam válidas
- Verificação de existência da imagem antes da aplicação
- Uso de `!important` para garantir que os estilos sejam aplicados corretamente

## Suporte

Esta extensão foi desenvolvida especificamente para o site PowerFlow e pode não funcionar em outros sites. Para suporte ou melhorias, entre em contato com o desenvolvedor.

