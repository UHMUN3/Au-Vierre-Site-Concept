// Get DOM elements
const modal = document.getElementById("zoom-modal");
const modalImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

// Select ALL zoomable images (Lookbook + Products)
// We convert the NodeList to a proper Array so we can find index numbers
const images = Array.from(document.querySelectorAll('.look-item img, .product-img'));

let currentIndex = 0;

// 1. Function to open modal at specific index
function openModal(index) {
    currentIndex = index;
    modal.style.display = "flex";
    modalImg.src = images[currentIndex].src;
}

// 2. Add click event to every image on the site
images.forEach((img, index) => {
    img.addEventListener('click', function () {
        openModal(index);
    });
});

// 3. Next Image Logic
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the modal from closing when clicking arrow
    currentIndex++;

    // If we are at the end, loop back to the start (0)
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    modalImg.src = images[currentIndex].src;
});

// 4. Previous Image Logic
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex--;

    // If we are at the start, loop to the end
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }
    modalImg.src = images[currentIndex].src;
});

// 5. Close Logic
closeBtn.onclick = function () {
    modal.style.display = "none";
}

modal.onclick = function (event) {
    // Only close if clicking the background (not the image or arrows)
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// 6. Keyboard Navigation (Arrow Keys)
document.addEventListener('keydown', function (e) {
    if (modal.style.display === "flex") {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "Escape") modal.style.display = "none";
    }
});