import * as THREE from 'three'
import gsap from 'gsap'



const signature = `
          :::     :::    :::       :::     ::: ::::::::::: :::::::::: :::::::::  :::::::::  :::::::::: 
       :+: :+:   :+:    :+:       :+:     :+:     :+:     :+:        :+:    :+: :+:    :+: :+:         
     +:+   +:+  +:+    +:+       +:+     +:+     +:+     +:+        +:+    +:+ +:+    +:+ +:+          
   +#++:++#++: +#+    +:+       +#+     +:+     +#+     +#++:++#   +#++:++#:  +#++:++#:  +#++:++#      
  +#+     +#+ +#+    +#+        +#+   +#+      +#+     +#+        +#+    +#+ +#+    +#+ +#+            
 #+#     #+# #+#    #+#         #+#+#+#       #+#     #+#        #+#    #+# #+#    #+# #+#             
###     ###  ########            ###     ########### ########## ###    ### ###    ### ##########       
`;

console.log(`%c${signature}`, 'font-family: monospace; font-weight: bold; color: #000000;');


console.group('CREDITS');
console.log('Sounds by 4MULA');
console.log('https://www.instagram.com/prod4mula/');
console.log('');
console.log('Dev by AAMUNE');
console.log('https://www.instagram.com/aamune/');
console.groupEnd();


// 1. PRELOADER LOGIC
// We wait for the window to load, then hide the preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // A small timeout ensures the site is fully rendered before fading
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
        }, 900);
    }
})






// Audio Elements
const music = document.getElementById('bg-music');
const soundBtn = document.getElementById('sound-btn');
let hasStarted = false;

// 1. Function to try playing audio
const startAudio = () => {
    // If already playing, stop listening
    if (hasStarted) return;

    music.play().then(() => {
        // Audio is playing
        hasStarted = true;
        soundBtn.innerHTML = 'SOUND ON';

        // Remove listeners to avoid spam the play command
        window.removeEventListener('scroll', startAudio);
        window.removeEventListener('wheel', startAudio);
        window.removeEventListener('touchmove', startAudio);
        window.removeEventListener('click', startAudio);

    }).catch(error => {
        // Browser denied it (usually due to lack of interaction)
        console.log("Audio waiting for interaction...");
    });
};

//Add listeners for EVERY type of movement
//Cast a wide net: scroll, mouse wheel, touch screen drag, or click
window.addEventListener('scroll', startAudio);
window.addEventListener('wheel', startAudio);
window.addEventListener('touchmove', startAudio); // For mobile
window.addEventListener('click', startAudio); // Backup

//Manual Toggle Button Logic
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
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')
const particleTexture = textureLoader.load('./logos/particle.png')
gradientTexture.magFilter = THREE.NearestFilter

// Material color
const materialColor = '#ffffff'

// Material
const material = new THREE.MeshToonMaterial({
    color: materialColor, // Using our fixed color
    gradientMap: gradientTexture
})

// Meshes (The geometric placeholder shapes)
const objectsDistance = 4
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

mesh2.position.x = -2
mesh3.position.x = 1.75

const sectionMeshes = [mesh2, mesh3]


/** * Particles
 */
const particlesCount = 800
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length * 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: materialColor, // Fixed: Uses the variable we defined above
    sizeAttenuation: true,
    size: 1, // You can adjust this if the stars are too big/small
    map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)





/**
 * NEW: Logo Particles (The AV Gunner)
 */
// 1. Load the Logo Texture (Make sure to use the PNG version!)
const logoTexture = textureLoader.load('./logos/android-chrome-512x512 (i).png')

// 2. Create Geometry for Logos
const logoCount = 40 // Fewer particles so it doesn't look messy
const logoPositions = new Float32Array(logoCount * 3)

for (let i = 0; i < logoCount; i++) {
    logoPositions[i * 3 + 0] = (Math.random() - 0.5) * 12 // X axis spread
    // Spread them along the entire scrollable height
    logoPositions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length * 3
    logoPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 // Z axis depth
}

const logoGeometry = new THREE.BufferGeometry()
logoGeometry.setAttribute('position', new THREE.BufferAttribute(logoPositions, 3))

// 3. Create Material (Bigger size for logos)
const logoMaterial = new THREE.PointsMaterial({
    color: 'black',
    sizeAttenuation: true,
    size: 2, // Much bigger than the dust (adjust this to fit your taste)
    map: logoTexture,
    transparent: true,
    alphaMap: logoTexture, // Ensures the background is see-through
    depthWrite: false,
    blending: THREE.NormalBlending // Normal blending keeps the black logo visible
})

// 4. Add to Scene
const logoParticles = new THREE.Points(logoGeometry, logoMaterial)
scene.add(logoParticles)

























/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 3)
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
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
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
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {
        currentSection = newSection
        // Only rotate if the mesh exists
        if (sectionMeshes[currentSection]) {
            gsap.to(
                sectionMeshes[currentSection].rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+= 0.5'
                }
            )
        }
    }
})

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
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x
    const parallaxY = -cursor.y
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 2
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Scroll Reveal Logic
 */
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150; // Triggers when element is 150px into view

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Run once on load to show elements that are already visible at the top
revealOnScroll();