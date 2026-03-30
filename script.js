document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración de la fecha actual dinámica
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        // Formatear en español (ej: "lunes, 30 de marzo de 2026")
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = today.toLocaleDateString('es-ES', options);
        
        // Limpiar las comas si aparecen y poner la primera letra en mayúscula
        formattedDate = formattedDate.replace(',', '');
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        
        dateElement.textContent = formattedDate;
    }

    // 2. Lógica de Navegación por Pestañas (Tabs)
    const buttons = document.querySelectorAll('.nav-btn');
    const sections = {
        inicio: document.getElementById('inicio'),
        cursos: document.getElementById('cursos'),
        herramientas: document.getElementById('herramientas'),
        'contenido-curso': document.getElementById('contenido-curso'),
        contacto: document.getElementById('contacto')
    };

    function activateTab(tabId) {
        // Ocultar todas las secciones
        Object.values(sections).forEach(section => {
            if (section) section.classList.remove('active');
        });
        
        // Mostrar la activa
        if (sections[tabId]) sections[tabId].classList.add('active');

        // Actualizar botones
        buttons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
                // Auto-scroll del menú horizontal en móviles para que el botón se vea
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.classList.remove('active');
            }
        });

        localStorage.setItem('activeTab', tabId);
        history.replaceState(null, '', `#${tabId}`);
    }

    // Escuchar clicks en la navegación
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId && sections[tabId]) {
                activateTab(tabId);
                // Hacer scroll suave hacia arriba al cambiar de pestaña
                const containerTop = document.querySelector('.container').offsetTop;
                window.scrollTo({ top: Math.max(0, containerTop - 80), behavior: 'smooth' });
            }
        });
    });

    // Manejar pestaña inicial al cargar
    const hash = window.location.hash.slice(1);
    let savedTab = localStorage.getItem('activeTab');
    let initialTab = 'inicio';
    
    if (hash && sections[hash]) {
        initialTab = hash;
    } else if (savedTab && sections[savedTab]) {
        initialTab = savedTab;
    }
    activateTab(initialTab);

    // Escuchar cambios de hash en la URL
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1);
        if (newHash && sections[newHash]) {
            activateTab(newHash);
        }
    });

    // 3. Botón flotante para subir (Scroll Top)
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
