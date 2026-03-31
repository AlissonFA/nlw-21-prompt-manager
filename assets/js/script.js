// alert("JavaScript") serve para exibir mensagem de alerta, tudo que for texto vai entre aspas

// Chave para identificar os dados salvos pela nossa aplicação no navegador
const STORAGE_KEY = "prompts_storage";

// Estado para carregar os prompts salvos e exibir
const state = {
  prompts: [],
  selectedId: null,
};

// Constante não muda os dados de dentro
const elements = {
  promptTitle: document.getElementById("prompt-title"), // Seleciona o elemento com id "prompt-title" (título do prompt)
  promptContent: document.getElementById("prompt-content"), // Seleciona o elemento com id "prompt-content" (conteúdo do prompt)
  titleWrapper: document.getElementById("title-wrapper"), // Seleciona o wrapper do título (contenedor pai)
  contentWrapper: document.getElementById("content-wrapper"), // Seleciona o wrapper do conteúdo (contenedor pai)
  sidebar: document.querySelector(".sidebar"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  app: document.querySelector(".app"), // Seleciona o container principal do app
  btnSave: document.getElementById("btn-save"),
  list: document.getElementById("prompt-list"),
  search: document.getElementById("prompt-search"),
  btnNew: document.getElementById("btn-new"),
  btnCopy: document.getElementById("btn-copy"),
};

// Função que verifica se o elemento possui conteúdo e adiciona/remove classe CSS conforme necessário
function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0; // Só saber se tem texto ou não (se for maior que 0)
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
    elements.sidebar.classList.add("open");
  });

  // Fecha a sidebar ao clicar no botão "btnCollapse"
  elements.btnCollapse.addEventListener("click", () => {
    elements.app.classList.add("sidebar-collapsed");
    elements.sidebar.classList.remove("open");
  });
}

function save() {
  const title = elements.promptTitle.textContent.trim();
  const content = elements.promptContent.innerHTML.trim(); // O inner pega o conteúdo formatado (com negrito, espaços, etc...)
  const hasContent = elements.promptContent.textContent.trim();

  /* Verificação se não está vazio */
  if (!title || !hasContent) {
    alert("Título e conteúdo não podem estar vazios.");
    return;
  }

  if (state.selectedId) {
    // Editando um prompt existente
    const existingPrompt = state.prompts.find((p) => p.id === state.selectedId);

    if (existingPrompt) {
      existingPrompt.title = title || "Sem título";
      existingPrompt.content = content || "Sem conteúdo";
    }
  } else {
    // Criando um novo prompt
    const newPrompt = {
      id: Date.now().toString(36), // usando 36 ele mistura números e letras, mas é questão de gosto. Pode ser vazio
      title,
      content,
    };
    state.prompts.unshift(newPrompt);
    state.selectedId = newPrompt.id;
  }

  renderList(elements.search.value); // Para não precisar recarregar a página ao salvar
  persist(); // sobrepõe o conteúdo
  alert("Prompt salvo com sucesso!");
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts));
  } catch (error) {
    console.log("Erro ao salvar no localStorage:", error);
  }
}

function load() {
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    state.prompts = storage ? JSON.parse(storage) : [];
    state.selectedId = null;
  } catch (error) {
    console.log("Erro ao carregar do localStorage:", error);
  }
}

function createPromptItem(prompt) {
  const tmp = document.createElement("div");
  tmp.innerHTML = prompt.content;
  return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
      <div>
        <p class="prompt-item-title">${prompt.title}</p>
        <p class="prompt-item-description">${tmp.textContent}</p>
      </div>

      <button class="btn-icon" type="button" aria-label="Remover" data-action="remove">
        <img class="icon icon-trash" src="./assets/icons/remove.svg" alt="Remover" />
      </button>
    </li>
  `;
}

function renderList(filterText = "") {
  const filteredPrompts = state.prompts
    .filter((prompt) =>
      prompt.title.toLowerCase().includes(filterText.toLowerCase().trim()),
    )
    .map((p) => createPromptItem(p))
    .join("");

  elements.list.innerHTML = filteredPrompts;
}

function newPrompt() {
  state.selectedId = null;
  elements.promptTitle.textContent = "";
  elements.promptContent.textContent = "";
  updateAllEditableStates();
  elements.promptTitle.focus();
}

function copySelected() {
  try {
    const content = elements.promptContent;

    if (!navigator.clipboard) {
      console.log("Clipboard API não disponível.");
      return;
    }

    navigator.clipboard.writeText(content.innerText);

    alert("Prompt copiado para a área de transferência!");
  } catch (error) {
    console.log("Erro ao copiar o prompt:", error);
  }
}

// Eventos
elements.btnSave.addEventListener("click", save);
elements.btnNew.addEventListener("click", newPrompt);
elements.btnCopy.addEventListener("click", copySelected);

elements.search.addEventListener("input", function (event) {
  renderList(event.target.value);
});

elements.list.addEventListener("click", function (event) {
  const removeBtn = event.target.closest("[data-action='remove']");
  const item = event.target.closest("[data-id]");

  if (!item) return;

  const id = item.getAttribute("data-id");
  state.selectedId = id;

  // Remover prompt.
  if (removeBtn) {
    state.prompts = state.prompts.filter((p) => p.id !== id);
    renderList(elements.search.value);
    persist();
    return;
  }

  if (event.target.closest("[data-action='select']")) {
    const prompt = state.prompts.find((p) => p.id === id);

    if (prompt) {
      elements.promptTitle.textContent = prompt.title;
      elements.promptContent.innerHTML = prompt.content;
      updateAllEditableStates();
    }
  }
});

// Função de inicialização que executa todas as configurações necessárias
function init() {
  load();
  renderList("");
  attachAllEditableHandlers(); // Anexa os event listeners aos elementos editáveis
  updateAllEditableStates(); // Verifica o estado inicial de todos os elementos (antes de qualquer interação)
}

document.addEventListener("DOMContentLoaded", init); // Aguarda o carregamento completo do DOM antes de executar a inicialização
