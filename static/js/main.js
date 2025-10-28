//
// Archivo: main.js - Lógica de Interactividad y Animaciones de Entrada
//

// === Requisitos Técnicos con 'this' ===

/**
 * Función para cambiar el color de fondo de un elemento (onmouseover/onmouseout).
 * Se usa en la tarjeta de Skills.
 * @param {HTMLElement} elemento - El elemento que disparó el evento (this).
 * @param {string} color - El color de fondo a aplicar.
 */
function cambiarFondo(elemento, color) {
    elemento.style.backgroundColor = color;
    elemento.style.transition = 'background-color 0.3s ease';
}

/**
 * Muestra una alerta simple al hacer clic en un enlace del portafolio (onclick).
 * @param {HTMLElement} enlace - El enlace que fue clicado (this).
 */
function alertaClick(enlace) {
    const nombreProyecto = enlace.closest('.card-body').querySelector('h5').innerText;
    alert('Accediendo al repositorio de GitHub para: ' + nombreProyecto);
}

/**
 * Valida un campo de texto al perder el foco (onchange).
 * @param {HTMLInputElement} input - El campo de entrada que cambió (this).
 */
function validarCampo(input) {
    if (input.id === 'campo-email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(input.value)) {
            input.style.border = '2px solid #FF8800'; // Borde de acento
            console.error('Email no válido');
        } else {
            input.style.border = '1px solid #ced4da';
        }
    }
}

/**
 * Simula la remoción de un elemento del DOM usando 'this' (Requisito 7).
 * @param {HTMLElement} boton - El botón que fue clicado (this).
 */
function removerTarjetaEjemplo(boton) {
    if (confirm("DEMO JS: ¿Deseas remover esta tarjeta para ver la manipulación del DOM?")) {
        const tarjetaCol = boton.closest('.col');
        if (tarjetaCol) {
            tarjetaCol.classList.add('animate__animated', 'animate__zoomOut');

            tarjetaCol.addEventListener('animationend', () => {
                tarjetaCol.remove();
            });
        }
    }
}


// === Detección de Scroll (Animaciones y Navbar) ===
document.addEventListener("DOMContentLoaded", function () {
    // 1. Efecto Sticky/Transparente en el Navbar (ya es oscuro por defecto, pero se mantiene la lógica)
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('barra-navegacion');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
        } else {
            navbar.style.backgroundColor = 'var(--color-texto)'; // Opaco al inicio
        }
    });

    // 2. Animaciones de entrada (similar a la lógica anterior)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate__animated').forEach(el => {
        // Excluir el Hero que anima al cargar
        if (!el.classList.contains('animate__fadeInLeft')) {
            el.classList.remove('animate__animated');
            observer.observe(el);
        }
    });
});