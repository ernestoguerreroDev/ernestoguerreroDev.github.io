// ==================== FECHA ACTUAL ====================
function setCurrentDate() {
    const dateSpan = document.getElementById('currentDateSpan');
    if (!dateSpan) return;

    try {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let fechaStr = now.toLocaleDateString('es-ES', options);
        fechaStr = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
        dateSpan.textContent = fechaStr;
    } catch (e) {
        console.warn('Error formateando fecha:', e);
        dateSpan.textContent = 'Fecha no disponible';
    }
}

setCurrentDate();
setInterval(setCurrentDate, 86400000);

// ==================== CONTADOR DE VISITAS con emoji ====================
async function updateVisitCounter() {
    const containerSpan = document.getElementById('visitCounterDisplay');
    if (!containerSpan) return;

    const emoji = '👤 ';
    const namespace = 'egsolutions_blog_pet';
    const key = 'visits_total_v4';
    const url = `https://api.countapi.xyz/hit/${namespace}/${key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data && typeof data.value === 'number') {
            containerSpan.innerHTML = `${emoji}Visitante N°: ${data.value.toLocaleString()}`;
            return;
        }
        throw new Error('Respuesta inválida');
    } catch (err) {
        console.warn('CountAPI falló, usando localStorage', err);
        let visits = localStorage.getItem('eg_visits_fallback_v4');
        if (visits === null) {
            visits = 1;
        } else {
            visits = parseInt(visits, 10) + 1;
        }
        localStorage.setItem('eg_visits_fallback_v4', visits);
        containerSpan.innerHTML = `${emoji}Visitante N°: ${visits.toLocaleString()}`;
    }
}

updateVisitCounter();

// ==================== NAVEGACIÓN POR TABS ====================
const tabs = document.querySelectorAll('.nav-btn');
const sections = {
    inicio: document.getElementById('inicio'),
    cursos: document.getElementById('cursos'),
    herramientas: document.getElementById('herramientas'),
    'contenido-curso': document.getElementById('contenido-curso'),
    contacto: document.getElementById('contacto')
};

function activateTab(tabId) {
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    if (sections[tabId]) sections[tabId].classList.add('active');

    tabs.forEach(btn => {
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

tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId && sections[tabId]) {
            activateTab(tabId);
            const containerTop = document.querySelector('.container').offsetTop;
            window.scrollTo({ top: Math.max(0, containerTop - 20), behavior: 'smooth' });
        }
    });
});

const hash = window.location.hash.slice(1);
let savedTab = localStorage.getItem('activeTab');
let initialTab = 'inicio';
if (hash && sections[hash]) {
    initialTab = hash;
} else if (savedTab && sections[savedTab]) {
    initialTab = savedTab;
}
activateTab(initialTab);

window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.slice(1);
    if (newHash && sections[newHash]) {
        activateTab(newHash);
        const containerTop = document.querySelector('.container').offsetTop;
        window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
    }
});

if (window.location.hash) {
    setTimeout(() => {
        const containerTop = document.querySelector('.container').offsetTop;
        if (window.scrollY < 50) {
            window.scrollTo({ top: containerTop - 20, behavior: 'smooth' });
        }
    }, 100);
}

// ==================== BOTONES CTA ====================
const ctaCursos = document.getElementById('ctaCursos');
const ctaAsesoria = document.getElementById('ctaAsesoria');
const ctaContactoCurso = document.getElementById('ctaContactoCurso');
const ctaDemo = document.getElementById('ctaDemo');

if (ctaCursos) ctaCursos.addEventListener('click', (e) => { e.preventDefault(); activateTab('cursos'); });
if (ctaAsesoria) ctaAsesoria.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });
if (ctaContactoCurso) ctaContactoCurso.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });
if (ctaDemo) ctaDemo.addEventListener('click', (e) => { e.preventDefault(); activateTab('contacto'); });

// ==================== SCROLL TOP ====================
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

// ==================== FORMULARIO SIMPLIFICADO ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();

        if (!name || !email) {
            alert('Por favor completa tu nombre y correo electrónico.');
            return;
        }

        // Simulación de envío: mostramos un mensaje de agradecimiento
        alert(`¡Gracias ${name}! Hemos recibido tu mensaje. Te contactaré a la brevedad al correo ${email}.`);
        contactForm.reset();
    });
}
