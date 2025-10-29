//
// Archivo: main.js - Lógica de Interactividad y Animaciones con Anime.js
//

// === Funciones Requeridas con 'this' ===
function cambiarFondo(elemento, color) {
    anime({ targets: elemento, backgroundColor: color, duration: 300, easing: 'easeOutQuad' });
}

function alertaClick(enlace) {
    const nombreProyecto = enlace.closest('.card-body').querySelector('h5').innerText;
    alert('Accediendo al repositorio de GitHub para: ' + nombreProyecto);
}

function validarCampo(input) {
    if (input.id === 'campo-email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        input.style.border = regexEmail.test(input.value) ? '1px solid #555' : '2px solid #FF8800';
    }
}

function removerTarjetaEjemplo(boton) {
    if (confirm("DEMO JS: ¿Deseas remover esta tarjeta de ejemplo?")) {
        const tarjetaCol = boton.closest('.col');
        if (tarjetaCol) {
            anime({
                targets: tarjetaCol,
                opacity: 0,
                scale: 0.8,
                duration: 500,
                easing: 'easeOutQuad',
                complete: () => tarjetaCol.remove()
            });
        }
    }
}


// === Animaciones con Anime.js y Detección de Scroll ===

// --- Nueva Animación: Efecto Máquina de Escribir (Tipo Terminal) ---
function typeWriterEffect(targetId, text) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerText = ''; // Limpiar el contenido inicial

    const animation = anime.timeline({
        easing: 'linear',
        delay: 500,
        complete: function() {
             // Opcional: hacer que el cursor parpadee infinitamente
             anime({ targets: '.cursor', opacity: [1, 0], duration: 500, easing: 'easeInOutQuad', loop: true });
        }
    });

    animation.add({
        targets: target,
        innerHTML: function() {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                // Simula la escritura letra por letra
                result += text.substring(0, i + 1);
            }
            return result;
        },
        duration: text.length * 70, // Velocidad de escritura
        update: function(anim) {
            // Actualiza el innerHTML para simular la escritura
            const currentText = text.substring(0, Math.floor(text.length * (anim.progress / 100)));
            target.innerText = currentText;
        }
    });
}

// --- Nueva Animación: Contador Numérico (Visualización de Métrica) ---
function animateCounter(targetElement) {
    const targetValue = parseInt(targetElement.getAttribute('data-target'));
    const counterDisplay = targetElement.querySelector('#counter-metric');

    if (targetElement.dataset.animated) return; // Evitar reanimación
    targetElement.dataset.animated = 'true';

    // Anime.js anima la propiedad 'value' de un objeto, no del DOM directamente
    const animation = anime({
        targets: { value: 0 },
        value: targetValue,
        duration: 2000,
        easing: 'easeOutQuint',
        round: 1, // Redondear al número entero más cercano
        update: function(anim) {
            counterDisplay.innerText = anim.animatables[0].target.value;
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {

    // 1. Efecto de Máquina de Escribir en el Hero
    typeWriterEffect('titulo-typing', 'DESARROLLANDO SOLUCIONES WEB ÚNICAS.');
    
    // 2. Efecto de la Navbar al hacer scroll (mismo código)
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('barra-navegacion');
        if (window.scrollY > 50) {
            if (navbar.style.backgroundColor !== 'rgba(26, 26, 26, 0.95)') {
                anime({ targets: navbar, backgroundColor: 'rgba(26, 26, 26, 0.95)', duration: 300, easing: 'easeOutQuad' });
            }
        } else {
            if (navbar.style.backgroundColor !== 'var(--color-texto)') {
                anime({ targets: navbar, backgroundColor: 'var(--color-texto)', duration: 300, easing: 'easeOutQuad' });
            }
        }
    });

    // 3. Animación de elementos al entrar en la vista (Scroll Intersection Observer)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    function animateProfileSection(target) {
        // Título: animación letra por letra (Staggered Text)
        if (target.hasAttribute('data-animar-palabras') && !target.dataset.animado) {
            const texto = target.innerText;
            target.innerHTML = texto.replace(/\S/g, "<span class='letter' style='opacity:0; display:inline-block;'>$&</span>");
            
            anime({ targets: target.querySelectorAll('.letter'), translateY: [20, 0], opacity: [0, 1], duration: 500, delay: anime.stagger(20) });
            target.dataset.animado = 'true';
            return;
        }

        // Foto: Zoom Dramático y Transición a Color
        if (target.classList.contains('animar-zoom-target') && !target.dataset.animadoZoom) {
            target.dataset.animadoZoom = 'true';
            
            anime.timeline({ easing: 'easeOutQuart' })
            .add({ targets: target, opacity: [0, 1], scale: [0.5, 1], duration: 900 }) 
            .add({ targets: target, filter: 'grayscale(0%) contrast(1.0)', duration: 1500, delay: 200 }, '-=300'); 
            
            return;
        }
        
        // El resto de elementos del perfil con fade-up
        if (target.closest('#sobre-mi') && target.classList.contains('animar-elemento')) {
            let delay = 0;
            const delayClass = Array.from(target.classList).find(cls => cls.startsWith('animar-delay-'));
            if (delayClass) {
                delay = parseInt(delayClass.split('-')[2]) * 150 + 400; 
            }
            
            anime({ targets: target, translateY: [20, 0], opacity: [0, 1], scale: [0.98, 1], duration: 800, easing: 'easeOutQuad', delay: delay });
            return;
        }
    }


    const animarEnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                if (target.closest('#sobre-mi')) {
                    animateProfileSection(target);
                } else {
                    // Lógica General para OTRAS Secciones (Experiencia, etc.)
                    anime({ targets: target, translateY: [20, 0], opacity: [0, 1], scale: [0.98, 1], duration: 800, easing: 'easeOutQuad', delay: 0 });
                }
                
                // Activar contador al entrar en vista
                if (target.classList.contains('contador-animado')) {
                    animateCounter(target);
                }

                // Efectos de hover para tarjetas y módulos
                if (target.classList.contains('modulo-habilidad-dark') || target.classList.contains('proyecto-tarjeta-clean')) {
                     target.addEventListener('mouseenter', function() {
                        anime({ targets: this, scale: 1.03, boxShadow: '0px 10px 25px rgba(0,0,0,0.2)', duration: 200, easing: 'easeOutQuad' });
                    });
                    target.addEventListener('mouseleave', function() {
                        anime({ targets: this, scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)', duration: 200, easing: 'easeOutQuad' });
                    });
                }

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos para animar
    document.querySelectorAll('.animar-elemento, .animar-modulo, .animar-tarjeta, .animar-zoom-target, .contador-animado').forEach(el => {
        animarEnScrollObserver.observe(el);
    });

    // === Animación de Partículas Interactivas en el Hero (Canvas API) ===
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    const connectionDistance = 150;
    let mouse = { x: null, y: null, radius: connectionDistance * 1.5 };

    function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); 

    class Particle {
        constructor(x, y, radius, color, velocity) {
            this.x = x; this.y = y; this.radius = radius; this.color = color;
            this.velocity = { x: velocity.x, y: velocity.y }; this.baseRadius = radius;
        }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) { this.velocity.x = -this.velocity.x; }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) { this.velocity.y = -this.velocity.y; }
            this.x += this.velocity.x; this.y += this.velocity.y; this.draw();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            let radius = Math.random() * 3 + 1;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let velocityX = (Math.random() - 0.5) * 0.8;
            let velocityY = (Math.random() - 0.5) * 0.8;
            let color = 'rgba(255, 136, 0, ' + (Math.random() * 0.5 + 0.2) + ')';
            particles.push(new Particle(x, y, radius, color, { x: velocityX, y: velocityY }));
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = Math.sqrt( Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2) );
                if (distance < connectionDistance) {
                    ctx.strokeStyle = `rgba(255, 136, 0, ${1 - (distance / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
                }
            }
        }
    }

    function connectToMouse() {
        if (mouse.x && mouse.y) {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                let distance = Math.sqrt( Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2) );
                if (distance < mouse.radius) {
                    ctx.strokeStyle = `rgba(255, 136, 0, ${0.8 - (distance / mouse.radius)})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        connectParticles();
        connectToMouse();
        particles.forEach(p => p.update());
    }

    initParticles();
    animateParticles();

    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.x - canvas.getBoundingClientRect().left;
        mouse.y = e.y - canvas.getBoundingClientRect().top;
    });

    canvas.addEventListener('mouseleave', function() { mouse.x = null; mouse.y = null; });
    
    // Interacción al click
    canvas.addEventListener('click', function(e) {
        const clickX = e.x - canvas.getBoundingClientRect().left;
        const clickY = e.y - canvas.getBoundingClientRect().top;

        particles.forEach(p => {
            const distance = Math.sqrt( Math.pow(p.x - clickX, 2) + Math.pow(p.y - clickY, 2) );
            if (distance < 50) {
                anime({
                    targets: p,
                    radius: [p.radius * 2, p.baseRadius],
                    duration: 300,
                    easing: 'easeOutQuad',
                    update: function() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        connectParticles();
                        connectToMouse();
                        particles.forEach(pt => pt.draw());
                    }
                });
            }
        });
    });
});