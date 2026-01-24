// Get DOM elements
const modal = document.getElementById("zoom-modal");
const modalImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

// State to track which group of images we are currently viewing
let currentGallery = [];
let currentIndex = 0;

// Helper: Function to open the modal with a specific list of images
function openModal(index, imageList) {
    currentGallery = imageList; // Update the "active" list
    currentIndex = index;
    modal.style.display = "flex";
    updateImage();
}

// Helper: Update the image source based on current index
function updateImage() {
    // Check if source is a string (URL) or an Image Element
    const source = currentGallery[currentIndex];
    // If it's an <img> tag, get .src. If it's just a string, use it directly.
    modalImg.src = source.src ? source.src : source;
}

// 1. SETUP LOOKBOOK CLICKS
// Select only lookbook images
const lookbookImages = Array.from(document.querySelectorAll('.look-item img'));

lookbookImages.forEach((img, index) => {
    img.addEventListener('click', function () {
        // When clicking lookbook, the gallery is ALL lookbook images
        openModal(index, lookbookImages);
    });
});

// 2. SETUP PRODUCT CLICKS
// Select product containers to find their specific images
const productCards = document.querySelectorAll('.product-image-container');

productCards.forEach((card) => {
    const mainImg = card.querySelector('.product-img');
    // Find the hidden images inside THIS specific card
    const hiddenImgs = Array.from(card.querySelectorAll('.hidden-gallery img'));

    // Combine main image + hidden images into one specific list for this product
    const productGallery = [mainImg, ...hiddenImgs];

    // Add click event to the MAIN image
    mainImg.addEventListener('click', function () {
        // When clicking a product, the gallery is ONLY this product's images
        openModal(0, productGallery);
    });
});


// 3. NAVIGATION (Next/Prev)
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex++;
    if (currentIndex >= currentGallery.length) {
        currentIndex = 0; // Loop back to start
    }
    updateImage();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentGallery.length - 1; // Loop to end
    }
    updateImage();
});

// 4. CLOSING LOGIC
closeBtn.onclick = function () {
    modal.style.display = "none";
}

modal.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Keyboard Navigation
document.addEventListener('keydown', function (e) {
    if (modal.style.display === "flex") {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "Escape") modal.style.display = "none";
    }
});