document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    const sections = {
        inicio: document.getElementById('inicio'),
        cursos: document.getElementById('cursos'),
        herramientas: document.getElementById('herramientas'),
        'contenido-curso': document.getElementById('contenido-curso'),
        contacto: document.getElementById('contacto')
    };

    // Scroll top button logic
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function activateTab(tabId) {
        // hide all sections
        Object.values(sections).forEach(section => {
            if (section) section.classList.remove('active');
        });
        if (sections[tabId]) sections[tabId].classList.add('active');

        // update active class on buttons
        buttons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.classList.remove('active');
            }
        });

        localStorage.setItem('activeTab', tabId);
        history.replaceState(null, '', `#${tabId}`);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId && sections[tabId]) {
                activateTab(tabId);
                // Smooth scroll to main content after tab change
                const containerTop = document.querySelector('.container').offsetTop;
                window.scrollTo({ top: Math.max(0, containerTop - 20), behavior: 'smooth' });
            }
        });
    });

    // handle initial tab: hash > localStorage > default 'inicio'
    const hash = window.location.hash.slice(1);
    let savedTab = localStorage.getItem('activeTab');
    let initialTab = 'inicio';
    if (hash && sections[hash]) {
        initialTab = hash;
    } else if (savedTab && sections[savedTab]) {
        initialTab = savedTab;
    }
    activateTab(initialTab);

    // hash change listener
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.slice(1);
        if (newHash && sections[newHash]) {
            activateTab(newHash);
            const containerTop = document.querySelector('.container').offsetTop;
            window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
        }
    });

    // if there's an initial hash, ensure view is correctly positioned
    if (window.location.hash) {
        setTimeout(() => {
            const containerTop = document.querySelector('.container').offsetTop;
            if (window.scrollY < 50) {
                window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
            }
        }, 100);
    }
});
