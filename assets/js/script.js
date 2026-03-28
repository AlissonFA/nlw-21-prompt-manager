// alert("JavaScript") serve para exibir mensagem de alerta, tudo que for texto vai entre aspas

// Constante não muda os dados de dentro
const elements = { 
  promptTitle: document.getElementById("prompt-title"), // Seleciona o elemento com id "prompt-title" (título do prompt)
  promptContent: document.getElementById("prompt-content"), // Seleciona o elemento com id "prompt-content" (conteúdo do prompt)
  titleWrapper: document.getElementById("title-wrapper"), // Seleciona o wrapper do título (contenedor pai)
  contentWrapper: document.getElementById("content-wrapper"), // Seleciona o wrapper do conteúdo (contenedor pai)
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  app: document.querySelector(".app"), // Seleciona o container principal do app
};

// Função que verifica se o elemento possui conteúdo e adiciona/remove classe CSS conforme necessário
function updateEditableWrapperState(element, wrapper) { 
  const hasText = element.textContent.trim().length > 0 // Só saber se tem texto ou não (se for maior que 0)
    wrapper.classList.toggle("is-empty", !hasText); // Verifica se tem a classe "is-empty", se tiver ele tira e se não tiver ele adiciona
}

// Função que atualiza o estado de todos os elementos editáveis chamando a função de atualização
function updateAllEditableStates() { 
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper); // Verifica e atualiza o estado do título
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper); // Verifica e atualiza o estado do conteúdo
}

// Função que configura os ouvintes de evento (event listeners) para detectar digitação
function attachAllEditableHandlers() { 

  // Detecta cada vez que o usuário digita no elemento do título
  elements.promptTitle.addEventListener("input", () => { 
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper); // Atualiza o estado visual do wrapper do título em tempo real
  });

  // Detecta cada vez que o usuário digita no elemento de conteúdo
  elements.promptContent.addEventListener("input", () => { 
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper); // Atualiza o estado visual do wrapper do conteúdo em tempo real
  });

  // Abre a sidebar ao clicar no botão "btnOpen"
  elements.btnOpen.addEventListener("click", () => {
    elements.app.classList.remove("sidebar-collapsed");
  });

  // Fecha a sidebar ao clicar no botão "btnCollapse"
  elements.btnCollapse.addEventListener("click", () => {
    elements.app.classList.add("sidebar-collapsed");
  });
}

// Função de inicialização que executa todas as configurações necessárias
function init() { 
  attachAllEditableHandlers(); // Anexa os event listeners aos elementos editáveis
  updateAllEditableStates(); // Verifica o estado inicial de todos os elementos (antes de qualquer interação)
}

document.addEventListener("DOMContentLoaded", init); // Aguarda o carregamento completo do DOM antes de executar a inicialização
