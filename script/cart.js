document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cartItemsDiv = document.getElementById("cartItems");
  const totalPriceEl = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const modal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");
  const cartCountEl = document.getElementById("cartCount");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const ctx = confettiCanvas.getContext("2d");

  // Load cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = []; // <-- store fetched products here

// Fetch products once
fetch("script/data.json")
  .then(res => res.json())
  .then(data => {
    products = data;       // save products globally
    renderCart();
  });


//render cart
 function renderCart() {
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<h2>Your cart is empty</h2>";
    totalPriceEl.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;

    total += product.price * cartItem.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-image">
        <img src="${product.image}" alt="${product.title}" />
      </div>

      <div class="cart-item-details">
        <h3 class="cart-item-title">${product.title}</h3>
        <p class="cart-item-price">$${product.price}</p>

        <div class="cart-item-quantity">
          <button onclick="changeQty(${product.id}, -1)">-</button>
          <span>${cartItem.qty}</span>
          <button onclick="changeQty(${product.id}, 1)">+</button>
        </div>

        <button class="cart-item-remove" onclick="removeItem(${product.id})">
          Remove
        </button>
      </div>

      <div class="cart-item-total">
        <strong>$${(product.price * cartItem.qty).toFixed(2)}</strong>
      </div>
    `;

    cartItemsDiv.appendChild(div);
  });

  totalPriceEl.textContent = total.toFixed(2);
}

  // Quantity and remove functions
  window.changeQty = function(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(p => p.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // <-- use latest products
  if (cartCountEl) cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
};

window.removeItem = function(id) {
  cart = cart.filter(p => p.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // <-- use latest products
  if (cartCountEl) cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
};

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(JSON.parse(localStorage.getItem("cartProducts")) || []);
    if (cartCountEl) {
      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
  }

  // Checkout button listener
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Show modal
  modal.style.display = "flex";
  modal.classList.add("show");

  // Start confetti
  launchConfetti();

  // Clear cart immediately
  cart = [];
  localStorage.removeItem("cart");
  if (cartCountEl) cartCountEl.textContent = "0";

  // Auto-close modal after 3 seconds
  setTimeout(() => {
    modal.classList.remove("show");
    stopConfetti();

    // Redirect to home
    window.location.href = "index.html";
  }, 3000);
});

  // Close modal
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  stopConfetti();
  window.location.href = "index.html";
});

  // Confetti logic
  let confettiActive = false;
  const confettiParticles = [];

  function launchConfetti() {
    confettiActive = true;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    for (let i = 0; i < 150; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 20 + 10,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05
      });
    }

    requestAnimationFrame(updateConfetti);
  }

  function updateConfetti() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    requestAnimationFrame(updateConfetti);
  }

  function stopConfetti() {
    confettiActive = false;
    confettiParticles.length = 0;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
});