// Quick Navigation
function goToSection(id) {
    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.display = 'none';
    });
    const targetSec = document.getElementById(id);
    targetSec.style.display = 'flex';
    targetSec.classList.add('active');
    if (id === 'battle') initBattle();
    if (id === 'fireworks') startFireworks();
    if (id === 'final') startConfetti();
}

// Section Transition
function nextSection(current, next) {
    const currentSec = document.getElementById(current);
    const nextSec = document.getElementById(next);
    currentSec.classList.remove('active');
    setTimeout(() => {
        currentSec.style.display = 'none';
        nextSec.style.display = 'flex';
        nextSec.classList.add('active');
        if (next === 'battle') initBattle();
        if (next === 'fireworks') startFireworks();
        if (next === 'final') startConfetti();
    }, 1000);
}

// Background Music
document.addEventListener('click', () => {
    const music = document.getElementById('bgMusic');
    music.play().catch(e => console.log('Music error:', e));
}, { once: true });

// Gallery Slider
function initGallerySlider() {
    const galleries = ['ramGallery', 'ravanGallery', 'victoryGallery'];
    galleries.forEach(galId => {
        const gallery = document.getElementById(galId);
        if (gallery) {
            let currentImg = 0;
            const imgs = gallery.querySelectorAll('.gallery-img');
            setInterval(() => {
                imgs.forEach((img, i) => img.style.opacity = i === currentImg ? '1' : '0.5');
                currentImg = (currentImg + 1) % imgs.length;
            }, 3000);
        }
    });
}
initGallerySlider();
// Battle Animation - With Real Arrow & Sparks
function initBattle() {
    const arrow = document.getElementById('arrow');
    const ravan = document.getElementById('ravanBattle');
    const battleText = document.getElementById('battleText');
    const arena = document.querySelector('.battle-arena');
    
    // Start arrow animation
    setTimeout(() => {
        arrow.style.animation = 'shootArrow 2s linear forwards';
        battleText.textContent = 'बाण उड़ रहा है... राम का तीर रावण की ओर!';
        
        // Add sparks trail during shoot
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'spark';
                spark.style.left = `${30 + Math.random() * 40}%`; // Random position along path
                spark.style.top = '50%';
                spark.style.animationDelay = `${i * 0.3}s`;
                arena.appendChild(spark);
                setTimeout(() => spark.remove(), 1000); // Clean up
            }, i * 250);
        }
    }, 500);
    
    // Ravan fall + smoke
    setTimeout(() => {
        ravan.classList.add('ravan-fall');
        battleText.textContent = 'रावण गिर गया! बुराई जल रही है। जय श्री राम! 🪔';
        // Smoke effect
        const smoke = document.createElement('div');
        smoke.style.cssText = 'position: absolute; top: 50%; right: 20%; width: 100px; height: 100px; background: radial-gradient(circle, rgba(128,128,128,0.8), transparent); border-radius: 50%; animation: smokeRise 2s ease-out forwards; z-index: 1; filter: blur(2px);';
        arena.appendChild(smoke);
        setTimeout(() => smoke.remove(), 2000);
    }, 2500);
    
    // Auto next
    setTimeout(() => nextSection('battle', 'fireworks'), 4500);
}
// Enhanced Fireworks (With CSS Particles Overlay)
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let rockets = [];
    let particles = [];
    
    class Rocket {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.vy = -Math.random() * 5 - 5;
            this.color = `hsl(${Math.random() * 60 + 0}, 100%, 50%)`;
            this.exploded = false;
            this.life = 100;
        }
        update() {
            if (!this.exploded) {
                this.y += this.vy;
                if (this.y < canvas.height * 0.3) this.explode();
            } else {
                this.life--;
            }
        }
        draw() {
            if (!this.exploded) {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - 2, this.y - 10, 4, 20);
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(this.x - 1, this.y + i * 5, 2, 3);
                }
            }
        }
        explode() {
            this.exploded = true;
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10; this.color = color; this.life = 80;
            this.decay = Math.random() * 0.02 + 0.01;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.vy += 0.1; this.life -= this.decay;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.life / 80; ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, Math.random() * 3 + 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.1) rockets.push(new Rocket());
        rockets.forEach((r, i) => { r.update(); r.draw(); if (r.life <= 0) rockets.splice(i, 1); });
        particles.forEach((p, i) => { p.update(); p.draw(); if (p.life <= 0) particles.splice(i, 1); });
        requestAnimationFrame(animate);
    }
    animate();
}

// Twinkling Stars (Enhanced - More Stars)
function initStars() {
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let stars = [];
    for (let i = 0; i < 200; i++) { // More stars
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 3, twinkle: Math.random() * 2 });
    }
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            const opacity = Math.sin(Date.now() / 1000 + star.twinkle) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255,255,255,${opacity})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
            // Shooting star occasional
            if (Math.random() < 0.01) ctx.fillRect(star.x, star.y, 20, 1);
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();
}
initStars();

// Confetti
function startConfetti() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    let confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
            vx: Math.random() * 3 - 1.5, vy: Math.random() * 3 + 2,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`, size: Math.random() * 5 + 5, rotation: Math.random() * 360
        });
    }
    function animateConfetti() {
        confetti.forEach(c => {
            c.y += c.vy; c.x += c.vx; c.vy *= 0.99; c.rotation += 5;
            if (c.y > canvas.height) c.y = -c.size;
            ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rotation * Math.PI / 180);
            ctx.fillStyle = c.color; ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size); ctx.restore();
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
}

// Theme Toggle
document.getElementById('toggle').onclick = () => {
    document.body.classList.toggle('light');
};



// Smoke
const smokeStyle = document.createElement('style');
smokeStyle.textContent = `@keyframes smokeRise { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(-100px) scale(2); opacity: 0; } }`;
document.head.appendChild(smokeStyle);

// Resize & Parallax
window.addEventListener('resize', () => {
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    const starsCanvas = document.getElementById('stars-canvas');
    if (fireworksCanvas) { fireworksCanvas.width = window.innerWidth; fireworksCanvas.height = window.innerHeight; }
    if (starsCanvas) { starsCanvas.width = window.innerWidth; starsCanvas.height = window.innerHeight; }
});
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const clouds = document.querySelector('.clouds');
    clouds.style.transform = `translateX(${scrolled * 0.5}px)`;
});
document.addEventListener("click", function () {
    const music = document.getElementById("bgMusic");
    music.muted = false;
    music.play();
  });