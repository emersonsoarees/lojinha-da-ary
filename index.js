const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJr2IjRKMAQiushlY2UIiSnuz2vT2KRWF7MhyksxbX7ivlaDjJKqiu6gBOhbHm7UIo_IsLZ1Q2uGi7/pub?gid=0&single=true&output=csv";

let allProducts = [];
let currentCategory = "Todos";
let shuffledProducts = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadProducts() {
  Papa.parse(sheetURL, {
    download: true,
    header: true,
    complete: function (results) {
      allProducts = results.data.filter(p => p.name);


      const featured = allProducts.filter(p => p.featured === "TRUE");
      const normal = allProducts.filter(p => p.featured !== "TRUE");


      shuffledProducts = [
        ...shuffle(featured),
        ...shuffle(normal)
      ];

      renderCategories();
      renderProducts();
    }
  });
}

function renderProducts() {
  const container = document.getElementById("products");
  const search = document.getElementById("search").value.toLowerCase();

  let filtered = shuffledProducts.filter(p =>
    (currentCategory === "Todos" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(search)
  );

  container.innerHTML = filtered.map(p => {
    let links = [];

    try {
      links = JSON.parse(p.links || "[]");
    } catch (e) { }

    return `
  <div class="bg-white p-4 rounded-3xl shadow-sm border flex flex-col h-full">

    <div class="relative">
      <img src="${p.image}" class="product-image mb-3"/>

      ${p.featured === "TRUE" ? `
        <span class="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
          ⭐ Recomendo
        </span>
      ` : ""}
    </div>

    <h2 class="font-semibold text-lg">${p.name}</h2>
    <p class="text-sm text-gray-500 mb-2">${p.description}</p>

    <div class="mt-auto space-y-2">
      ${links.map(l => `
        <a href="${l.url}" target="_blank"
          class="btn-store ${l.name.toLowerCase()}">
          🛒 Ir para ${l.name}
        </a>
      `).join("")}
    </div>

  </div>
`;
  }).join("");
}

loadProducts();

function renderCategories() {
  const container = document.getElementById("categories");

  const categories = [
    "Todos",
    ...new Set(allProducts.map(p => p.category))
  ];

  container.innerHTML = categories.map(cat => `
    <button onclick="filterCategory('${cat}')"
      class="px-4 py-2 rounded-full border ${currentCategory === cat ? 'category-active' : 'bg-white'
    }">
      ${cat}
    </button>
  `).join("");
}

function filterCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderProducts();
}

document.getElementById("search").addEventListener("input", renderProducts);

document.getElementById("year").textContent = new Date().getFullYear();