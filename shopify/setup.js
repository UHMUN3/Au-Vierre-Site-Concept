const signature = `
          :::     :::    :::       :::     ::: ::::::::::: :::::::::: :::::::::  :::::::::  :::::::::: 
       :+: :+:   :+:    :+:       :+:     :+:     :+:     :+:        :+:    :+: :+:    :+: :+:         
     +:+   +:+  +:+    +:+       +:+     +:+     +:+     +:+        +:+    +:+ +:+    +:+ +:+          
   +#++:++#++: +#+    +:+       +#+     +:+     +#+     +#++:++#   +#++:++#:  +#++:++#:  +#++:++#      
  +#+     +#+ +#+    +#+        +#+   +#+      +#+     +#+        +#+    +#+ +#+    +#+ +#+            
 #+#     #+# #+#    #+#         #+#+#+#       #+#     #+#        #+#    #+# #+#    #+# #+#             
###     ###  ########            ###     ########### ########## ###    ### ###    ### ##########       
`;

console.log(`%c${signature}`, 'font-family: monospace; font-weight: bold; color: #ffffff;');

console.group('CREDITS');
console.log('SOUNDS BY 4MULA');
console.log('https://www.instagram.com/prod4mula/');
console.log('');
console.log('DEVELOPED BY AAMUNE');
console.log('https://www.instagram.com/aamune/');
console.groupEnd();

// import directly from a CDN because Shopify has no node_modules
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import gsap from 'https://unpkg.com/gsap@3.12.5/index.js';

// Audio & Preloader Elements
const music = document.getElementById('bg-music');
const soundBtn = document.getElementById('sound-btn');
const preloader = document.getElementById('preloader');
const enterBtn = document.getElementById('enter-btn');
let hasStarted = false;


// --- AJAX CONTACT FORM HANDLER ---
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('submit', (e) => {
        // Use delegation because the form is injected into the modal dynamically
        if (e.target && e.target.id === 'contact-form-ajax') {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            submitBtn.innerText = 'SENDING...'; 
            submitBtn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/javascript' }
            })
            .then(() => {
                // Update the modal content instantly
                const specsBody = document.getElementById('specs-body');
                if (specsBody) {
                    const fields = specsBody.querySelector('#contact-fields');
                    const success = specsBody.querySelector('#contact-success');
                    
                    if (fields) fields.style.display = 'none';
                    if (success) success.style.display = 'block';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                submitBtn.innerText = 'ERROR';
                submitBtn.disabled = false;
                setTimeout(() => { submitBtn.innerText = 'SEND MESSAGE'; }, 3000);
            });
        }
    });
});


// NEW PLAYLIST LOGIC (UPDATED FOR SHOPIFY)
const playlist = window.shopAssets ? [
    window.shopAssets.music1,
    window.shopAssets.music2
] : [
    '/music/background.m4a', 
    '/music/xotour.m4a'
];

let currentTrackIndex = 0;

// Listen for when a song ends
music.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    music.src = playlist[currentTrackIndex];
    music.play().then(() => {
        console.log(`Now playing: ${playlist[currentTrackIndex]}`);
    }).catch(e => console.log("Next track failed:", e));
});

// Function to Start Site (Async Version)
const enterSite = async (e) => {
    if (hasStarted) return;
    hasStarted = true;
    
    // 1. Hide Preloader immediately
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
    if (e && e.cancelable) e.preventDefault();

    // 2. Initialize Audio Context (Mobile fix)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const ctx = new AudioContext();
        ctx.resume().catch(err => console.log("Audio Context issue:", err));
    }

    // 3. Play VIDEO (Priority)
    const video = document.getElementById('logo-video');
    if (video) {
        console.log('Attempting to play video');
        video.muted = true; // Force mute to ensure autoplay works
        video.play().then(() => {
             console.log('Video played!');
        }).catch((error) => {
             console.error('Video play failed:', error);
        });
    }

    // 4. Play AUDIO (Independent of video)
    music.volume = 0.7;
    music.muted = false;
    
    // Do NOT use 'await' here. We use .then/.catch so it runs in parallel.
    music.play().then(() => {
        soundBtn.innerHTML = 'SOUND ON';
    }).catch(error => {
        console.log("Audio play failed (likely file path or browser block):", error);
        soundBtn.innerHTML = 'SOUND OFF';
    });

    if (enterBtn) {
        enterBtn.removeEventListener('click', enterSite);
        enterBtn.removeEventListener('touchstart', enterSite);
    }
};

if (enterBtn) {
    enterBtn.addEventListener('click', enterSite, { passive: false });
    enterBtn.addEventListener('touchstart', enterSite, { passive: false, once: true });
}

soundBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        soundBtn.innerHTML = 'SOUND ON';
    } else {
        music.pause();
        soundBtn.innerHTML = 'SOUND OFF';
    }
});

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader()

// --- USE SHOPIFY ASSETS ---
const gradientUrl = (window.shopAssets && window.shopAssets.gradient) ? window.shopAssets.gradient : './textures/gradients/3.jpg';
const particleUrl = (window.shopAssets && window.shopAssets.texture) ? window.shopAssets.texture : './logos/particle.png';

const gradientTexture = textureLoader.load(gradientUrl);
const particleTexture = textureLoader.load(particleUrl);
gradientTexture.magFilter = THREE.NearestFilter

// Material color
const materialColor = '#000000'

// Material
const material = new THREE.MeshToonMaterial({
    color: materialColor, 
    gradientMap: gradientTexture
})

/** * Particles */
const particlesCount = 700
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = 2 - Math.random() * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    sizeAttenuation: true,
    size: 1.5, 
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.NormalBlending
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(1, 1, 0)
scene.add(directionLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY;
const policyControls = document.getElementById('policyControls');
const lookbookSection = document.querySelector('.lookbook-section');

window.addEventListener('scroll', () => {
    scrollY = window.scrollY; // Keep for Three.js animation

    if (lookbookSection) {
        const sectionTop = lookbookSection.offsetTop;
        if (scrollY + window.innerHeight > sectionTop) {
            policyControls.classList.add('visible');
        } else {
            policyControls.classList.remove('visible');
        }
    }
});

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = -scrollY / sizes.height * 4

    const parallaxX = cursor.x
    const parallaxY = -cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Scroll Reveal Logic
 */
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150; 

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();