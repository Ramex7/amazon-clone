const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

// Load products
fetch("script/data.json")
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(allProducts);
  });

function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  if (products.length === 0) {
    productGrid.innerHTML = "<h2>No products found</h2>";
    return;
  }

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <img src="${product.image}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button onclick="goToProduct(${product.id})">
        View Product
      </button>
    `;

    productGrid.appendChild(div);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(query)
  );

  renderProducts(filteredProducts);
});

searchInput.addEventListener("search", () => {
  renderProducts(allProducts);
});
