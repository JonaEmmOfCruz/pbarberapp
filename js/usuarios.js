// ============================================
// JAVASCRIPT MEJORADO PARA ACCESIBILIDAD
// ============================================

(function () {
    // Menú hamburguesa accesible
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        function toggleMenu() {
            const isExpanded = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.setAttribute('aria-label', !isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');

            // Manejar foco para accesibilidad
            if (!isExpanded) {
                setTimeout(() => {
                    const firstLink = navMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }, 100);
            } else {
                hamburger.focus();
            }
        }

        hamburger.addEventListener('click', toggleMenu);

        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
                }
            });
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
                hamburger.focus();
            }
        });
    }

    // Scroll Reveal con Intersection Observer (mejor rendimiento)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Navegación suave mejorada para accesibilidad
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Actualizar URL sin recargar (mejora la experiencia)
                history.pushState(null, null, targetId);

                // Mover foco al elemento para accesibilidad
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    targetElement.removeAttribute('tabindex');
                }, 100);
            }
        });
    });

    // Detectar enlaces activos en el menú según scroll - MEJORADO
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset para compensar el navbar fijo
        
        let currentSection = '';
        
        // Encontrar la sección actual basada en la posición del scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = sectionId;
            }
        });
        
        // Si no se encuentra ninguna sección (por ejemplo, al inicio), activar "Inicio"
        if (!currentSection && window.scrollY < 100) {
            currentSection = 'inicio';
        }
        
        // Actualizar la clase active-link en los enlaces del menú
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active-link');
            } else {
                item.classList.remove('active-link');
            }
        });
    }

    // Escuchar eventos de scroll y al cargar la página
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    updateActiveLink();

    // Mejorar accesibilidad: añadir skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#inicio';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.background = '#FF2626';
    skipLink.style.color = 'white';
    skipLink.style.padding = '8px 16px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '1001';
    skipLink.style.borderRadius = '0 0 8px 0';
    skipLink.style.transition = 'top 0.2s';
    skipLink.style.fontSize = '14px';
    skipLink.style.fontWeight = '500';

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Mejorar accesibilidad para el badge de estado
    const badge = document.querySelector('.badge-status');
    if (badge) {
        badge.setAttribute('aria-live', 'polite');
    }
    
    // Pequeña mejora: al hacer clic en un enlace, actualizar el enlace activo inmediatamente
    navItems.forEach(link => {
        link.addEventListener('click', function() {
            const targetId = this.getAttribute('href').substring(1);
            navItems.forEach(item => item.classList.remove('active-link'));
            this.classList.add('active-link');
        });
    });
})();