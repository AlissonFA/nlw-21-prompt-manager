// alert("JavaScript") serve para exibir mensagem de alerta, tudo que for texto vai entre aspas

// Constante não muda os dados de dentro
const elements = {
  // Seleciona o elemento com id "prompt-title" (título do prompt)
  promptTitle: document.getElementById("prompt-title"),

  // Seleciona o elemento com id "prompt-content" (conteúdo do prompt)
  promptContent: document.getElementById("prompt-content"),

  // Seleciona o wrapper do título (contenedor pai)
  titleWrapper: document.getElementById("title-wrapper"),

  // Seleciona o wrapper do conteúdo (contenedor pai)
  contentWrapper: document.getElementById("content-wrapper"),
};

// Função que verifica se o elemento possui conteúdo e adiciona/remove classe CSS conforme necessário
function updateEditableWrapperState(element, wrapper) {
  // Verifica se o texto do elemento está vazio (trim remove espaços em branco)
  if (!element.textContent.trim()) {

    // Se vazio, adiciona a classe "is-empty" ao wrapper para estilização
    wrapper.classList.add("is-empty");
  } else {
    // Se possui conteúdo, remove a classe "is-empty" do wrapper
    wrapper.classList.remove("is-empty");
  }
}

// Função que atualiza o estado de todos os elementos editáveis chamando a função de atualização
function updateAllEditableStates() {
  // Verifica e atualiza o estado do título
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper);

  // Verifica e atualiza o estado do conteúdo
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper);
}

// Função que configura os ouvintes de evento (event listeners) para detectar digitação
function attachAllEditableHandlers() {
  // Detecta cada vez que o usuário digita no elemento do título
  elements.promptTitle.addEventListener("input", () => {
    // Atualiza o estado visual do wrapper do título em tempo real
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper);
  });

  // Detecta cada vez que o usuário digita no elemento de conteúdo
  elements.promptContent.addEventListener("input", () => {
    // Atualiza o estado visual do wrapper do conteúdo em tempo real
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper);
  });
}

// Função de inicialização que executa todas as configurações necessárias
function init() {
  // Anexa os event listeners aos elementos editáveis
  attachAllEditableHandlers();
  // Verifica o estado inicial de todos os elementos (antes de qualquer interação)
  updateAllEditableStates();
}

// Aguarda o carregamento completo do DOM antes de executar a inicialização
document.addEventListener("DOMContentLoaded", init);
