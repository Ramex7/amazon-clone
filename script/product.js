const productDetails = document.getElementById("productDetails");
const cartCount = document.getElementById("cartCount");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// Load products
fetch("script/data.json")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);

    if (!product) {
      productDetails.innerHTML = "<h2>Product not found</h2>";
      return;
    }

    renderProduct(product);
  });

// Render product
function renderProduct(product) {
  productDetails.innerHTML = `
    <img src="${product.image}" alt="${product.title}" />

    <div class="product-info">
      <h2>${product.title}</h2>
      <p><strong>$${product.price}</strong></p>
      <p>${product.description}</p>
      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `;
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

updateCartCount();