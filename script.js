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

// ==================== FORMULARIO PRIVADO (ASESORÍAS) ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const phone = document.getElementById('contactPhone')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();

        if (!name || !email) {
            alert('Por favor completa tu nombre y correo electrónico.');
            return;
        }

        let alertMsg = `📋 Nueva consulta privada:\n\n`;
        alertMsg += `Nombre: ${name}\n`;
        alertMsg += `Correo: ${email}\n`;
        if (phone) alertMsg += `Teléfono/WhatsApp: ${phone}\n`;
        if (message) alertMsg += `Mensaje: ${message}\n`;
        alertMsg += `\n✅ Revisa estos datos y contacta al interesado.`;

        alert(alertMsg);
        console.log('Consulta privada:', { name, email, phone, message });
        contactForm.reset();
    });
}

// ==================== COMENTARIOS PÚBLICOS (localStorage) ====================
let comments = [];

function loadComments() {
    const stored = localStorage.getItem('eg_public_comments');
    if (stored) {
        try {
            comments = JSON.parse(stored);
        } catch(e) { comments = []; }
    } else {
        // Comentarios de ejemplo para mostrar que funciona
        comments = [
            {
                name: "María Rodríguez",
                phone: "+58 412-1234567",
                comment: "Excelente curso, muy práctico. Aprendí mucho sobre Python aplicado a producción.",
                date: new Date().toLocaleString()
            },
            {
                name: "Carlos Méndez",
                phone: "+58 424-7654321",
                comment: "¿Tienen material para aprender sobre simulación de yacimientos? Me interesaría.",
                date: new Date().toLocaleString()
            }
        ];
        saveComments();
    }
    renderComments();
}

function saveComments() {
    localStorage.setItem('eg_public_comments', JSON.stringify(comments));
}

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="empty-comments">No hay comentarios aún. ¡Sé el primero en dejar tu opinión!</div>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-card">
            <div class="comment-header">
                <span class="comment-name">${escapeHtml(comment.name)}</span>
                ${comment.phone ? `<span class="comment-phone"><i class="fas fa-phone-alt"></i> ${escapeHtml(comment.phone)}</span>` : ''}
                <span class="comment-date">${escapeHtml(comment.date)}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.comment)}</div>
        </div>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

function addComment(name, phone, comment) {
    if (!name || !comment) {
        alert('Por favor ingresa tu nombre y el comentario.');
        return false;
    }
    const newComment = {
        name: name.trim(),
        phone: phone ? phone.trim() : '',
        comment: comment.trim(),
        date: new Date().toLocaleString()
    };
    comments.unshift(newComment); // Los más nuevos arriba
    saveComments();
    renderComments();
    return true;
}

// Evento para publicar comentario
const submitCommentBtn = document.getElementById('submitCommentBtn');
if (submitCommentBtn) {
    submitCommentBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('publicName');
        const phoneInput = document.getElementById('publicPhone');
        const commentInput = document.getElementById('publicComment');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const comment = commentInput ? commentInput.value.trim() : '';

        if (addComment(name, phone, comment)) {
            if (nameInput) nameInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (commentInput) commentInput.value = '';
            alert('¡Comentario publicado! Aparecerá en la lista.');
        }
    });
}

// Cargar comentarios al inicio
loadComments();
