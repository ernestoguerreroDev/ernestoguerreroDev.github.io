// Esperar a que el contenido cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navegación por pestañas (Tabs)
    const buttons = document.querySelectorAll('.nav-btn');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            // Quitar clase activa de todos los botones y contenidos
            buttons.forEach(btn => btn.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));

            // Agregar clase activa al seleccionado
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. Efecto de scroll suave para enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    console.log("Portafolio de Ernesto Guerrero cargado correctamente.");
});
