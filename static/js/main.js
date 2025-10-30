//
// Archivo: main.js - Lógica de Interactividad y Animaciones con Anime.js
//

// === Funciones Requeridas con 'this' ===
function cambiarFondo(elemento, color) {
    // Función de interactividad para los módulos de SKILLS (usada en onmouseover)
    anime({ targets: elemento, backgroundColor: color, duration: 300, easing: 'easeOutQuad' });
}

function alertaClick(enlace) {
    const nombreProyecto = enlace.closest('.card-body').querySelector('h5').innerText;
    alert('Accediendo al repositorio de: ' + nombreProyecto);
}

function validarCampo(input) {
    // Función de validación de email en tiempo real
    if (input.id === 'campo-email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Solo para feedback visual inmediato, la validación final la hace Bootstrap
        input.style.border = regexEmail.test(input.value) ? '1px solid var(--color-texto-claro)' : '2px solid var(--color-acento)'; 
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

// === Animaciones y Lógica Principal ===

/**
 * Aplica el efecto de máquina de escribir al título del hero.
 */
function typeWriterEffect(targetId, text) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.innerText = '';

    const animation = anime.timeline({
        easing: 'linear',
        delay: 500,
        complete: function() {
             anime({ targets: '.cursor', opacity: [1, 0], duration: 500, easing: 'easeInOutQuad', loop: true });
        }
    });

    animation.add({
        targets: target,
        innerHTML: function() {
            return text;
        },
        duration: text.length * 70,
        update: function(anim) {
            const currentText = text.substring(0, Math.floor(text.length * (anim.progress / 100)));
            target.innerText = currentText;
        }
    });
}

/**
 * Anima el contador numérico en la sección de Skills.
 */
function animateCounter(targetElement) {
    const targetValue = parseInt(targetElement.getAttribute('data-target'));
    const counterDisplay = targetElement.querySelector('#counter-metric');

    if (targetElement.dataset.animated) return;
    targetElement.dataset.animated = 'true';

    anime({
        targets: { value: 0 },
        value: targetValue,
        duration: 2000,
        easing: 'easeOutQuint',
        round: 1, 
        update: function(anim) {
            counterDisplay.innerText = anim.animatables[0].target.value;
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {

    // **********************************************
    // 1. INICIALIZACIÓN DEL HERO ANIMADO (MÁQUINA DE ESCRIBIR)
    // **********************************************
    typeWriterEffect('titulo-typing', 'DESARROLLANDO SOLUCIONES WEB ÚNICAS.');
    
    // 2. Efecto de la Navbar al hacer scroll 
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

    // 3. Animación de elementos al entrar en la vista (Intersection Observer)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    function animateElement(target) {
        if (target.hasAttribute('data-animar-palabras') && !target.dataset.animado) {
            const texto = target.innerText;
            target.innerHTML = texto.replace(/\S/g, "<span class='letter' style='opacity:0; display:inline-block;'>$&</span>");
            
            anime({ targets: target.querySelectorAll('.letter'), translateY: [20, 0], opacity: [0, 1], duration: 500, delay: anime.stagger(20) });
            target.dataset.animado = 'true';
            return;
        }

        if (target.classList.contains('animar-zoom-target') && !target.dataset.animadoZoom) {
            target.dataset.animadoZoom = 'true';
            
            anime.timeline({ easing: 'easeOutQuart' })
            .add({ targets: target, opacity: [0, 1], scale: [0.5, 1], duration: 900 }) 
            .add({ targets: target, filter: 'grayscale(0%) contrast(1.0)', duration: 1500, delay: 200 }, '-=300'); 
            
            return;
        }
        
        let delay = 0;
        const delayClass = Array.from(target.classList).find(cls => cls.startsWith('animar-delay-'));
        if (delayClass) {
            delay = parseInt(delayClass.split('-')[2]) * 150 + 100;
        }
        
        anime({ targets: target, translateY: [20, 0], opacity: [0, 1], scale: [0.98, 1], duration: 800, easing: 'easeOutQuad', delay: delay });
    }


    const animarEnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                animateElement(target);
                
                if (target.classList.contains('contador-animado') && !target.dataset.animated) {
                    animateCounter(target);
                }

                if (target.classList.contains('modulo-habilidad-dark') || target.classList.contains('proyecto-tarjeta-clean')) {
                     target.addEventListener('mouseenter', function() {
                        anime({ targets: this, scale: 1.03, boxShadow: '0px 10px 25px rgba(0,0,0,0.2)', duration: 200, easing: 'easeOutQuad' });
                    });
                    target.addEventListener('mouseleave', function() {
                        anime({ targets: this, scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)', duration: 200, easing: 'easeOutQuad' });
                    });
                }

                if (!target.classList.contains('animar-zoom-target') && !target.classList.contains('contador-animado')) {
                     observer.unobserve(target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animar-elemento, .animar-modulo, .animar-tarjeta, .animar-zoom-target, .contador-animado, .timeline-item, .timeline-item-dark').forEach(el => {
        animarEnScrollObserver.observe(el);
    });

    // 4. Animación de Partículas Interactivas en el Hero (Canvas API)
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
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
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    }


    // *********************************************************
    // 5. LÓGICA DE ENVÍO DE FORMULARIO ASÍNCRONO (AJAX/FORMSPREE)
    // *********************************************************
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('formStatusMessage');
    const submitButton = document.getElementById('submitButton');
    
    // ATENCIÓN: DEBES REEMPLAZAR ESTA URL con el endpoint que Formspree te proporciona 
    // (Ej: 'https://formspree.io/f/xyzkdln')
    const formspreeEndpoint = 'https://formspree.io/f/xwpwqezg'; 

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            
            // 1. Validar con Bootstrap
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            
            // 2. Deshabilitar botón y preparar datos
            submitButton.disabled = true;
            statusMessage.innerHTML = '<span class="text-info">Enviando mensaje...</span>';
            const data = new FormData(form);

            try {
                // 3. Enviar a Formspree usando fetch
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // 4. Procesar respuesta
                if (response.ok) {
                    statusMessage.innerHTML = '<span class="text-success">✅ ¡Mensaje enviado con éxito! Gracias por contactarme.</span>';
                    form.reset(); // Limpia los campos
                    form.classList.remove('was-validated');
                } else {
                    const errorData = await response.json();
                    if (errorData.errors) {
                         statusMessage.innerHTML = `<span class="text-danger">❌ Error de envío: ${errorData.errors.map(e => e.message).join(', ')}</span>`;
                    } else {
                         statusMessage.innerHTML = '<span class="text-danger">❌ Hubo un problema al enviar el mensaje. Inténtalo más tarde.</span>';
                    }
                }
            } catch (error) {
                statusMessage.innerHTML = '<span class="text-danger">❌ Error de conexión. Verifica tu red.</span>';
            } finally {
                submitButton.disabled = false; // Habilitar botón de nuevo
            }
        });
        
        // Inicialización de la validación visual de Bootstrap
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }
});