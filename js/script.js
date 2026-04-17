// ============================================
// ANIMACIONES SUAVES MINIMALISTAS
// ============================================

console.log("Script de index");

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. SCROLL REVEAL (Funciona hacia arriba y abajo) =====
    const revealElements = document.querySelectorAll(
        '.step, .benefit-card, .stat-item, .hero-content, .hero-image, ' +
        '.registration-container, .download-content, .section-title, ' +
        '.section-subtitle, .benefits-image'
    );
    
    // Configuración del observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        revealObserver.observe(el);
    });
    
    // ===== 2. ANIMACIÓN SECUENCIAL PARA STEPS =====
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.add(`delay-${(index % 5) + 1}`);
    });
    
    // ===== 3. ANIMACIÓN SECUENCIAL PARA BENEFIT-CARDS =====
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.classList.add(`delay-${(index % 5) + 1}`);
    });
    
    // ===== 4. CONTADOR DE NÚMEROS EN ESTADÍSTICAS =====
    const statNumbers = document.querySelectorAll('.stat-item h3');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateNumber(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        numberObserver.observe(stat);
    });
    
    function animateNumber(element) {
        const originalText = element.innerText;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        let finalValue = parseFloat(originalText.replace('+', '').replace('%', ''));
        
        if (isNaN(finalValue)) return;
        
        let current = 0;
        const duration = 1500;
        const increment = finalValue / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            let result = displayValue.toString();
            
            if (hasPlus) result += '+';
            if (hasPercent) result += '%';
            
            element.innerText = result;
        }, 16);
    }
    
    // ===== 5. ANIMACIÓN PARA EL MENÚ MÓVIL =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const navLinks = document.querySelectorAll('.nav-menu li');
            if (navMenu.classList.contains('active')) {
                navLinks.forEach((link, index) => {
                    link.style.animation = `slideInLeft 0.3s ease forwards ${index * 0.05}s`;
                });
            } else {
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // ===== 6. SMOOTH SCROLL CON OFFSET PARA NAVBAR FIJO =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // ===== 7. RESALTAR LINK ACTIVO DURANTE EL SCROLL =====
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
            const href = link.getAttribute('href').replace('#', '');
            if (href === current) {
                link.classList.add('active-link');
            }
        });
        
        if (btnRegistro && current === 'registro-barbero') {
            btnRegistro.style.background = '#d41e1e';
            btnRegistro.style.transform = 'scale(1.05)';
            btnRegistro.style.boxShadow = '0 0 15px rgba(255, 38, 38, 0.5)';
        } else if (btnRegistro) {
            btnRegistro.style.background = '';
            btnRegistro.style.transform = '';
            btnRegistro.style.boxShadow = '';
        }
    }
    
    window.addEventListener('scroll', highlightActiveLink);
    window.addEventListener('load', highlightActiveLink);
    
    // ===== 8. EFECTO DE PARALLAX SUAVE EN HERO =====
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.03}px)`;
            }
        });
    }
    
    // ===== 9. ANIMACIÓN PARA ÍCONOS AL HOVER =====
    const icons = document.querySelectorAll('.step-icon i, .benefit-card i, .feature-item i');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.2s ease';
        });
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // ===== 10. ANIMACIÓN PARA EL FORMULARIO =====
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateX(4px)';
        });
        input.addEventListener('blur', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // ===== 11. INICIALIZAR ANIMACIONES VISIBLES AL CARGAR =====
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        const heroImg = document.querySelector('.hero-image');
        
        if (heroContent && !heroContent.classList.contains('revealed')) {
            heroContent.classList.add('revealed');
        }
        if (heroImg && !heroImg.classList.contains('revealed')) {
            heroImg.classList.add('revealed');
        }
    }, 100);
});

// ===== 12. FORMULARIO CONECTADO A MONGODB (VERCEL API) =====
const barberForm = document.getElementById('barberForm');
if (barberForm) {
    barberForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Convertir los datos del formulario a un Objeto JSON
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            // Apuntamos a la API que subiremos a Vercel
            const apiUrl = 'https://barberapp-api-eight.vercel.app/api/registrar';
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Importante para que el backend lo lea como JSON
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('¡Registro exitoso! Ya estás en nuestra base de datos.', 'success');
                this.reset();
            } else {
                // Muestra el error exacto que envía la API (ej: "El correo ya existe")
                showMessage('Error: ' + (result.error || 'No se pudo registrar'), 'error');
            }

        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión con el servidor. Por favor, intenta de nuevo.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 5000);
    }
}