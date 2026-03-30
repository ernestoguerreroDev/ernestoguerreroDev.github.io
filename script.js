// ==================== FECHA ACTUAL ====================
function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fechaStr = now.toLocaleDateString('es-ES', options);
    fechaStr = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
    const dateSpan = document.getElementById('currentDateSpan');
    if (dateSpan) dateSpan.textContent = fechaStr;
}
setCurrentDate();

// ==================== CONTADOR DE VISITAS (CountAPI + fallback) ====================
async function updateVisitCounter() {
    const containerSpan = document.getElementById('visitCounterDisplay');
    if (!containerSpan) return;
    const namespace = 'egsolutions_blog_pet';
    const key = 'visits_total_v2';
    const url = `https://api.countapi.xyz/hit/${namespace}/${key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && typeof data.value === 'number') {
            containerSpan.innerText = `Visitante N°: ${data.value.toLocaleString()}`;
        } else throw new Error('Fallback');
    } catch (err) {
        let visits = localStorage.getItem('eg_visits_fallback');
        if (visits === null) visits = 1;
        else visits = parseInt(visits) + 1;
        localStorage.setItem('eg_visits_fallback', visits);
        containerSpan.innerText = `Visitante N°: ${visits.toLocaleString()}`;
    }
}
updateVisitCounter();

// ==================== NAVEGACIÓN POR TABS (pestañas) ====================
const tabs = document.querySelectorAll('.nav-btn');
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
    if (sections[tabId]) sections[tabId].classList.add('active');

    // Actualizar clase activa en botones
    tabs.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
            // Scroll suave horizontal si es necesario en móviles
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            btn.classList.remove('active');
        }
    });

    localStorage.setItem('activeTab', tabId);
    history.replaceState(null, '', `#${tabId}`);
}

tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId && sections[tabId]) {
            activateTab(tabId);
            // Scroll suave al contenido principal después del cambio
            const containerTop = document.querySelector('.container').offsetTop;
            window.scrollTo({ top: Math.max(0, containerTop - 20), behavior: 'smooth' });
        }
    });
});

// Determinar tab inicial: hash > localStorage > 'inicio'
const hash = window.location.hash.slice(1);
let savedTab = localStorage.getItem('activeTab');
let initialTab = 'inicio';
if (hash && sections[hash]) {
    initialTab = hash;
} else if (savedTab && sections[savedTab]) {
    initialTab = savedTab;
}
activateTab(initialTab);

// Escuchar cambios en el hash (para enlaces externos)
window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.slice(1);
    if (newHash && sections[newHash]) {
        activateTab(newHash);
        const containerTop = document.querySelector('.container').offsetTop;
        window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
    }
});

// Ajustar posición si hay hash al cargar
if (window.location.hash) {
    setTimeout(() => {
        const containerTop = document.querySelector('.container').offsetTop;
        if (window.scrollY < 50) {
            window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
        }
    }, 100);
}

// ==================== BOTONES DE ACCIÓN (CTA) ====================
const ctaCursos = document.getElementById('ctaCursos');
const ctaAsesoria = document.getElementById('ctaAsesoria');
const ctaContactoCurso = document.getElementById('ctaContactoCurso');
const ctaDemo = document.getElementById('ctaDemo');

if (ctaCursos) ctaCursos.addEventListener('click', (e) => { e.preventDefault(); activateTab('cursos'); });
if (ctaAsesoria) ctaAsesoria.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });
if (ctaContactoCurso) ctaContactoCurso.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });
if (ctaDemo) ctaDemo.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });

// ==================== BOTÓN VOLVER ARRIBA (SCROLL TOP) ====================
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== PREVENIR ENVÍO DEL FORMULARIO (demo) ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Gracias por tu mensaje. Te contactaré a la brevedad.');
        contactForm.reset();
    });
}
