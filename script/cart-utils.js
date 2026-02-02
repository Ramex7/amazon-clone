// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add to cart
function addToCart(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart(cart);
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  const cart = getCart();
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

// Run on page load
updateCartCount();