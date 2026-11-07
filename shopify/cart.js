document.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORS ---
  const cartIcon = document.getElementById('cartIcon');
  const cartPanel = document.getElementById('cartPanel');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartContainer = document.getElementById('cartContainer'); 
  const checkoutBtn = document.querySelector('.cart-checkout'); 

  const shopSection = document.querySelector('.shop-section');
  const addButtons = document.querySelectorAll('.add-btn');

  let cart = [];

  // --- REDIRECT HANDLER ---
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open_cart') === 'true') {
      setTimeout(() => { openCart(); }, 500);
      window.history.replaceState({}, document.title, "/");
  }

  // --- SCROLL LOGIC ---
  function checkScroll() {
    if (!shopSection || !cartContainer) return;
    const sectionTop = shopSection.offsetTop;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollY + (windowHeight / 1.5) > sectionTop) {
      cartContainer.classList.add('visible');
    } else {
      cartContainer.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // --- CART FUNCTIONS ---
  function openCart() {
    cartPanel.classList.add('open');
    cartContainer.classList.add('active');
  }

  function closeCart() {
    cartPanel.classList.remove('open');
    cartContainer.classList.remove('active');
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    if (cart.length === 0) {
      cartEmptyMsg.style.display = 'block';
    } else {
      cartEmptyMsg.style.display = 'none';
      cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
          <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;"></div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-controls">
                <span class="cart-item-meta">Size: ${item.size}</span>
                <div class="qty-selector">
                    <button class="qty-btn decrease" data-index="${index}">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn increase" data-index="${index}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-index="${index}">REMOVE</button>
          </div>`;
        cartItemsContainer.appendChild(itemEl);
      });
    }
    cartTotalEl.innerText = '$' + totalPrice.toFixed(2) + ' USD';

   // Disclaimer logic
  // Checks if disclaimer already exists to avoid duplicating on every render
  let disclaimer = document.getElementById('cart-disclaimer');
  if (!disclaimer) {
      disclaimer = document.createElement('div');
      disclaimer.id = 'cart-disclaimer';
      disclaimer.style.cssText = "font-size: 11px; color: #999; margin-top: -15px; margin-bottom: 20px; text-transform: none; font-family: 'Helvetica Neue', sans-serif;";
      disclaimer.innerText = "Taxes included. Discounts and shipping calculated at checkout.";
      cartTotalEl.parentElement.after(disclaimer);
  }
    cartCountEl.innerText = totalCount;
    if(totalCount > 0) cartContainer.classList.add('visible'); 
  }

  function addToCart(btn) {
    const card = btn.closest('.product-card');
    const name = card.querySelector('.product-name').innerText;
    const price = parseFloat(card.querySelector('.product-price').innerText.replace('$', ''));
    const image = card.querySelector('.product-img').src;
    
    const sizeBtn = card.querySelector('.size-btn.selected');
    const size = sizeBtn ? sizeBtn.innerText : 'OS'; 
    const id = sizeBtn ? sizeBtn.getAttribute('data-id') : card.querySelector('.size-btn').getAttribute('data-id');

    if (!id) { alert("Error: Product ID missing."); return; }

    const existingItem = cart.find(item => item.id === id); 
    if (existingItem) { existingItem.quantity += 1; } 
    else { cart.push({ id, name, price, image, size, quantity: 1 }); }

    renderCart();
    openCart();
  }

  async function handleCheckout() {
    if (cart.length === 0) return;
    checkoutBtn.innerText = 'PROCESSING...'; 
    const items = cart.map(item => ({ id: Number(item.id), quantity: item.quantity }));

    try {
        await fetch('/cart/clear.js', { method: 'POST' });
        const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: items })
        });
        const data = await response.json();
        if (response.ok) { window.location.href = '/checkout'; } 
        else { throw new Error(data.description || 'Cart rejected'); }
    } catch (err) {
        console.error(err);
        checkoutBtn.innerText = 'ERROR';
        setTimeout(() => { checkoutBtn.innerText = 'CHECKOUT'; }, 3000);
    }
  }

  // --- EVENT LISTENERS ---
  if(cartIcon) cartIcon.addEventListener('click', () => { cartPanel.classList.contains('open') ? closeCart() : openCart(); });
  addButtons.forEach(btn => btn.addEventListener('click', (e) => addToCart(e.target)));
  
  const sizeButtons = document.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => btn.addEventListener('click', (e) => {
      e.target.closest('.product-card').querySelectorAll('.size-btn').forEach(s => s.classList.remove('selected'));
      e.target.classList.add('selected');
  }));

  cartItemsContainer.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    if (e.target.classList.contains('cart-item-remove')) { cart.splice(index, 1); renderCart(); }
    if (e.target.classList.contains('increase')) { cart[index].quantity += 1; renderCart(); }
    if (e.target.classList.contains('decrease')) { 
        if (cart[index].quantity > 1) cart[index].quantity -= 1; 
        else cart.splice(index, 1);
        renderCart(); 
    }
  });

  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

});