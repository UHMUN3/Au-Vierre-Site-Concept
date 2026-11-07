// ==========================================
// IMAGE LIGHTBOX 
// ==========================================

const modal = document.getElementById("zoom-modal");
const modalImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentGallery = [];
let currentIndex = 0;

function openModal(index, imageList) {
    currentGallery = imageList; 
    currentIndex = index;
    modal.style.display = "flex";
    updateImage();
}

function updateImage() {
    const source = currentGallery[currentIndex];
    modalImg.src = source.src ? source.src : source;
}

// Lookbook Logic
const lookbookImages = Array.from(document.querySelectorAll('.look-item img'));
lookbookImages.forEach((img, index) => {
    img.addEventListener('click', function () {
        openModal(index, lookbookImages);
    });
});

// Product Image Logic
const productCards = document.querySelectorAll('.product-image-container');
productCards.forEach((card) => {
    const mainImg = card.querySelector('.product-img');
    const hiddenImgs = Array.from(card.querySelectorAll('.hidden-gallery img'));
    const productGallery = [mainImg, ...hiddenImgs];

    mainImg.addEventListener('click', function () {
        openModal(0, productGallery);
    });
});

// Navigation
if(nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex++;
        if (currentIndex >= currentGallery.length) currentIndex = 0;
        updateImage();
    });
}

if(prevBtn) {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex--;
        if (currentIndex < 0) currentIndex = currentGallery.length - 1;
        updateImage();
    });
}

if(closeBtn) {
    closeBtn.onclick = function () { modal.style.display = "none"; }
}
if(modal) {
    modal.onclick = function (event) {
        if (event.target === modal) modal.style.display = "none";
    }
}

// Keyboard Nav
document.addEventListener('keydown', function (e) {
    if (modal && modal.style.display === "flex") {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "Escape") modal.style.display = "none";
    }
});


// ==========================================
// NEW SPECS / SIZING MODAL LOGIC
// ==========================================

const specsModal = document.getElementById('specs-modal');
const specsBody = document.getElementById('specs-body');
const specsClose = document.querySelector('.specs-close');
const specsTriggers = document.querySelectorAll('.specs-trigger');

function openSpecs(content) {
  if(!specsModal) return;
  specsBody.innerHTML = content;
  specsModal.style.display = 'flex'; // Ensure flex first
  // Small timeout to allow transition to work
  setTimeout(() => {
      specsModal.classList.add('active');
  }, 10);
}

function closeSpecs() {
  if(!specsModal) return;
  specsModal.classList.remove('active');
  // Wait for fade out to finish before hiding display
  setTimeout(() => {
      specsModal.style.display = 'none';
  }, 300);
}

// Add click event to every "SPECS" text trigger
specsTriggers.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Find the hidden content inside the SAME product card
    const card = e.target.closest('.product-info'); // Use .product-info to be safe
    const content = card.querySelector('.specs-content').innerHTML;
    openSpecs(content);
  });
});

// Close Button
if(specsClose) {
    specsClose.addEventListener('click', closeSpecs);
}

// Close if clicking outside the white box
if(specsModal) {
    window.addEventListener('click', (e) => {
        if (e.target === specsModal) closeSpecs();
    });
}

// Policy Triggers
const policyTriggers = document.querySelectorAll('.policy-trigger');

policyTriggers.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const content = document.getElementById(`${type}-content`).innerHTML;
    openSpecs(content); // Reusing your existing modal logic
  });
});