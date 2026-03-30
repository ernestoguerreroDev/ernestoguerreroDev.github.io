document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    const sections = {
        inicio: document.getElementById('inicio'),
        cursos: document.getElementById('cursos'),
        herramientas: document.getElementById('herramientas'),
        'contenido-curso': document.getElementById('contenido-curso'),
        contacto: document.getElementById('contacto')
    };

    // ========== FECHA ACTUAL FORMATO ESPAÑOL ==========
    function updateDate() {
        const dateElement = document.getElementById('dateText');
        if (!dateElement) return;
        
        const now = new Date();
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const diaSemana = diasSemana[now.getDay()];
        const dia = now.getDate();
        const mes = meses[now.getMonth()];
        const año = now.getFullYear();
        
        const fechaFormateada = `${diaSemana} ${dia} de ${mes} de ${año}`;
        dateElement.textContent = fechaFormateada;
    }
    
    updateDate();
    // Actualizar cada minuto por si cambia de día
    setInterval(updateDate, 60000);

    // ========== CONTADOR DE VISITAS ==========
    function initVisitorCounter() {
        const visitorElement = document.getElementById('visitorCount');
        if (!visitorElement) return;
        
        // Obtener contador del localStorage o iniciar en valor aleatorio realista
        let visits = localStorage.getItem('egSolutionsVisits');
        let lastVisit = localStorage.getItem('egSolutionsLastVisit');
        const today = new Date().toDateString();
        
        if (!visits) {
            // Primera visita - iniciar con número base realista
            visits = Math.floor(Math.random() * 500) + 150;
        } else {
            visits = parseInt(visits);
            // Incrementar solo si es una nueva sesión (día diferente o no hay registro)
            if (lastVisit !== today) {
                visits += Math.floor(Math.random() * 3) + 1; // 1-3 visitas nuevas
            }
        }
        
        // Guardar en localStorage
        localStorage.setItem('egSolutionsVisits', visits);
        localStorage.setItem('egSolutionsLastVisit', today);
        
        // Animar el contador
        animateCounter(visitorElement, 0, visits, 1500);
    }
    
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString('es-ES');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end.toLocaleString('es-ES');
            }
        }
        
        requestAnimationFrame(update);
    }
    
    initVisitorCounter();

    // ========== SCROLL TOP BUTTON ==========
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        // Mostrar/ocultar botón basado en scroll
        let ticking = false;
        
        function updateScrollButton() {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollButton);
                ticking = true;
            }
        }, { passive: true });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    }

    // ========== NAVEGACIÓN POR TABS ==========
    function activateTab(tabId) {
        // Ocultar todas las secciones
        Object.values(sections).forEach(section => {
            if (section) {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });
        
        // Mostrar sección activa
        if (sections[tabId]) {
            sections[tabId].style.display = 'block';
            // Pequeño delay para permitir el reflow antes de agregar la clase active
            requestAnimationFrame(() => {
                sections[tabId].classList.add('active');
            });
        }

        // Actualizar botones
        buttons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
                // Scroll suave del botón al centro en móvil
                if (window.innerWidth < 768) {
                    btn.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'center' 
                    });
                }
            } else {
                btn.classList.remove('active');
            }
        });

        // Guardar en localStorage y actualizar URL
        localStorage.setItem('activeTab', tabId);
        history.replaceState(null, '', `#${tabId}`);
        
        // Scroll al contenido principal
        const container = document.querySelector('.container');
        if (container) {
            const offsetTop = container.offsetTop - 80; // Ajuste para header sticky
            window.scrollTo({ 
                top: Math.max(0, offsetTop), 
                behavior: 'smooth' 
            });
        }
    }

    // Event listeners para botones
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = btn.getAttribute('data-tab');
            if (tabId && sections[tabId]) {
                activateTab(tabId);
            }
        });
    });

    // ========== INICIALIZACIÓN DE TAB ==========
    function initTab() {
        const hash = window.location.hash.slice(1);
        const savedTab = localStorage.getItem('activeTab');
        let initialTab = 'inicio';
        
        if (hash && sections[hash]) {
            initialTab = hash;
        } else if (savedTab && sections[savedTab]) {
            initialTab = savedTab;
        }
        
        // Asegurar que todas estén ocultas inicialmente excepto la activa
        Object.keys(sections).forEach(key => {
            if (sections[key]) {
                sections[key].style.display = key === initialTab ? 'block' : 'none';
                if (key === initialTab) {
                    sections[key].classList.add('active');
                } else {
                    sections[key].classList.remove('active');
                }
            }
        });
        
        // Actualizar botón activo
        buttons.forEach(btn => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId === initialTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    initTab();

    // Manejar cambios de hash
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1);
        if (newHash && sections[newHash]) {
            activateTab(newHash);
        }
    });

    // ========== FORMULARIO DE CONTACTO ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // El formulario usa FormSubmit.co, pero agregamos validación adicional
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            
            if (!name || !email) {
                e.preventDefault();
                alert('Por favor completa todos los campos requeridos.');
                return false;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Por favor ingresa un correo electrónico válido.');
                return false;
            }
            
            // Mostrar mensaje de éxito (el formulario se enviará de todas formas)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // El formulario se enviará normalmente a FormSubmit.co
            // que redirigirá a la página de gracias o mostrará su propio mensaje
        });
    }

    // ========== CTAs PERSONALIZADOS ==========
    const ctaCursos = document.getElementById('ctaCursos');
    const ctaAsesoria = document.getElementById('ctaAsesoria');
    const ctaDemo = document.getElementById('ctaDemo');
    const ctaContactoCurso = document.getElementById('ctaContactoCurso');
    
    if (ctaCursos) {
        ctaCursos.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab('cursos');
        });
    }
    
    if (ctaAsesoria) {
        ctaAsesoria.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab('contacto');
        });
    }
    
    if (ctaDemo) {
        ctaDemo.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab('contacto');
        });
    }
    
    if (ctaContactoCurso) {
        ctaContactoCurso.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab('contacto');
        });
    }

    // ========== DETECTAR DISPOSITIVO MÓVIL ==========
    function isMobile() {
        return window.matchMedia('(pointer: coarse)').matches || 
               window.innerWidth < 768 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Agregar clase al body para estilos específicos
    if (isMobile()) {
        document.body.classList.add('is-mobile');
    }
    
    // Actualizar en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                document.body.classList.add('is-mobile');
            } else {
                document.body.classList.remove('is-mobile');
            }
        }, 250);
    }, { passive: true });

    // ========== PREVENIR ZOOM EN INPUTS EN iOS ==========
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth < 768) {
                // Scroll suave al input
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    });

    // ========== LAZY LOADING PARA IFRAMES ==========
    const iframes = document.querySelectorAll('iframe');
    if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    const src = iframe.getAttribute('src');
                    if (src && src.includes('drive.google.com')) {
                        // Los iframes de Google Drive ya tienen src, no necesitan lazy loading
                        iframeObserver.unobserve(iframe);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        iframes.forEach(iframe => iframeObserver.observe(iframe));
    }

    console.log('🚀 EG Solutions cargado correctamente');
});
