// Menú móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scroll para los enlaces con offset para el navbar fijo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Resaltar link activo durante el scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-registro)');
const btnRegistro = document.querySelector('.nav-menu a.btn-registro');

function highlightActiveLink() {
    let current = '';
    const scrollY = window.scrollY;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 10;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-link');
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === current) {
            link.classList.add('active-link');
        }
    });

    if (btnRegistro) {
        if (current === 'registro-barbero') {
            btnRegistro.style.background = '#d41e1e';
            btnRegistro.style.transform = 'scale(1.05)';
            btnRegistro.style.boxShadow = '0 0 15px rgba(255, 38, 38, 0.5)';
        } else {
            btnRegistro.style.background = '';
            btnRegistro.style.transform = '';
            btnRegistro.style.boxShadow = '';
        }
    }
}

// Efecto de hover para los links
navLinks.forEach(link => {
    link.addEventListener('mouseenter', function () {
        if (!this.classList.contains('active-link')) {
            this.style.color = 'var(--primary-color)';
        }
    });

    link.addEventListener('mouseleave', function () {
        if (!this.classList.contains('active-link')) {
            this.style.color = '';
        }
    });
});

// ===== ÚNICO FORMULARIO DE REGISTRO - VERSIÓN FORMSUBMIT =====
const barberForm = document.getElementById('barberForm');
if (barberForm) {
    barberForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Crear FormData con los datos del formulario
        const formData = new FormData(this);

        // Asegurar los campos para FormSubmit
        formData.set('_subject', 'Nuevo registro de barbero en BarberApp');
        formData.set('_captcha', 'false');
        formData.set('_template', 'table');
        formData.set('_autoresponse', '¡Gracias por registrarte en BarberApp! Pronto nos pondremos en contacto contigo.');

        try {
            console.log('Enviando formulario a FormSubmit...');

            const response = await fetch('https://formsubmit.co/ajax/barberapp.contact@gmail.com', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Respuesta de FormSubmit:', result);

            if (response.ok && result.success === 'true') {
                showMessage('¡Registro exitoso! Pronto nos pondremos en contacto contigo.', 'success');
                this.reset(); // Limpiar el formulario
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error detallado:', error);
            showMessage('Error al enviar el formulario. Por favor, intenta de nuevo.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Función para mostrar mensajes
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 5000);
    }
}

// Validación en tiempo real del teléfono
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

// Animación al hacer scroll con Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Aplicar animación a elementos
document.querySelectorAll('.step, .benefit-card, .registration-container, .hero-content, .hero-image').forEach(el => {
    if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    }
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Inicializar funciones cuando carga la página
window.addEventListener('load', () => {
    highlightActiveLink();
    
    // Fade-in para el hero
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    if (heroImage) {
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'translateY(0)';
    }
});

// Actualizar highlight en cada scroll
window.addEventListener('scroll', () => {
    highlightActiveLink();
});