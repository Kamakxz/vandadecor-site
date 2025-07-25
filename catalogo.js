let produtos = [];
let categoriasAtivas = new Set();
let buscaTexto = "";

const container = document.getElementById("container");
const buscaInput = document.getElementById("buscaInput");

// Função para criar slug automático do nome
function criarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Função para montar o card HTML do produto
function criarCardProduto(produto) {
  const slug = criarSlug(produto.nome);
  return `
    <div class="col-6 col-sm-4 col-md-3 col-lg-2">
      <div class="product-card h-100">
        <img src="${produto.imagem}" alt="${produto.nome}" class="product-img" />
        <div class="product-info">
          <h6 class="mb-1">${produto.nome}</h6>
          <p class="text-muted mb-2">${produto.categoria}</p>
          <a href="produto.html?slug=${slug}" class="btn btn-sm btn-outline-danger">Detalhes</a>
        </div>
      </div>
    </div>
  `;
}


// Renderiza os produtos na tela
function renderizarProdutos(produtosParaExibir) {
  container.innerHTML = produtosParaExibir.map(criarCardProduto).join("");
}

// Filtro por categorias
function filtrarCategoria(botao, categoria) {
  if (!categoria) {
    categoriasAtivas.clear();
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    renderizarProdutos(filtrarProdutos());
    return;
  }

  if (categoriasAtivas.has(categoria)) {
    categoriasAtivas.delete(categoria);
    botao.classList.remove("active");
  } else {
    categoriasAtivas.add(categoria);
    botao.classList.add("active");
  }

  renderizarProdutos(filtrarProdutos());
}

function filtrarProdutos() {
  return produtos.filter(produto => {
    const categoriasProduto = produto.categoria
      ? produto.categoria.split(",").map(c => c.trim().toLowerCase())
      : [];

    const temCategoriaSelecionada =
      categoriasAtivas.size === 0 ||
      categoriasProduto.some(cat => categoriasAtivas.has(cat));

    const nomeIncluiBusca =
      produto.nome.toLowerCase().includes(buscaTexto);

    return temCategoriaSelecionada && nomeIncluiBusca;
  });
}

// Filtro de busca em tempo real
function filtrarPorBusca() {
  buscaTexto = buscaInput.value.toLowerCase();
  renderizarProdutos(filtrarProdutos());
}

// Carregar JSON
async function carregarProdutos() {
  try {
    const res = await fetch("produtos.json");
    if (!res.ok) throw new Error("Erro ao carregar produtos.json");
    const dados = await res.json();

    // Convertendo o objeto para array
    produtos = Object.values(dados).map(item => ({
      nome: item.nome,
      imagem: item.imagens[0],
      categoria: item.categoria
    }));

    renderizarProdutos(produtos);
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p class='text-danger text-center'>Erro ao carregar produtos.</p>";
  }
}

// Inicialização
carregarProdutos();
