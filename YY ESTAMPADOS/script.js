document.addEventListener('DOMContentLoaded', () => {
    // Menú responsive
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Función para cargar datos desde JSON
    fetch('/datos.json')
        .then(response => response.json())
        .then(data => {
            cargarProductos(data.productos || []);
            cargarOfertas(data.ofertas || []);
            cargarGaleria(data.galeria || []);
        })
        .catch(err => console.error('Error cargando datos:', err));

    function cargarProductos(productos) {
        const contenedor = document.getElementById('contenedor-productos');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        // Ordenar por el campo 'orden'
        productos.sort((a, b) => (a.orden || 0) - (b.orden || 0));

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center;">Cargando productos...</p>';
            return;
        }

        productos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            if (prod.imagen) {
                card.innerHTML += `<img src="${prod.imagen}" alt="${prod.nombre}">`;
            } else {
                card.innerHTML += `<i class="fas fa-box-open"></i>`;
            }
            card.innerHTML += `<h3>${prod.nombre}</h3><p>${prod.descripcion}</p>`;
            contenedor.appendChild(card);
        });
    }

    function cargarOfertas(ofertas) {
        const contenedor = document.getElementById('contenedor-ofertas');
        if (!contenedor) return;
        contenedor.innerHTML = '';

        const ofertasActivas = ofertas.filter(o => o.activa);
        if (ofertasActivas.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center;">No hay ofertas activas en este momento. ¡Vuelve pronto!</p>';
            return;
        }

        ofertasActivas.forEach(oferta => {
            const card = document.createElement('div');
            card.className = 'oferta-card';
            card.innerHTML = `
                <h3>${oferta.titulo}</h3>
                <p>${oferta.descripcion}</p>
                <p><span class="precio-anterior">${oferta.precio_anterior || ''}</span> <span class="precio-actual">${oferta.precio_actual}</span></p>
                <a href="https://wa.me/584243451351?text=Hola%20YY%20Estampados,%20quiero%20aprovechar%20la%20oferta%20de%20${encodeURIComponent(oferta.titulo)}" class="btn-oferta" target="_blank">
                    <i class="fab fa-whatsapp"></i> Aprovechar ahora
                </a>
            `;
            contenedor.appendChild(card);
        });
    }

    function cargarGaleria(galeria) {
        const contenedorGal = document.getElementById('contenedor-galeria');
        const contenedorFiltros = document.getElementById('filtros-galeria');
        if (!contenedorGal || !contenedorFiltros) return;

        contenedorGal.innerHTML = '';
        contenedorFiltros.innerHTML = '';

        if (galeria.length === 0) {
            contenedorGal.innerHTML = '<p style="text-align:center;">Galería vacía. Sube tus primeros trabajos desde el panel de administración.</p>';
            return;
        }

        const categorias = [...new Set(galeria.map(item => item.categoria))];

        const btnTodos = document.createElement('button');
        btnTodos.className = 'filtro-btn active';
        btnTodos.textContent = 'Todos';
        btnTodos.dataset.filtro = 'todos';
        contenedorFiltros.appendChild(btnTodos);

        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filtro-btn';
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            btn.dataset.filtro = cat;
            contenedorFiltros.appendChild(btn);
        });

        function mostrarImagenes(filtro) {
            contenedorGal.innerHTML = '';
            const filtradas = filtro === 'todos' ? galeria : galeria.filter(item => item.categoria === filtro);
            if (filtradas.length === 0) {
                contenedorGal.innerHTML = '<p style="text-align:center;">No hay imágenes en esta categoría.</p>';
                return;
            }
            filtradas.forEach(item => {
                const div = document.createElement('div');
                div.className = 'galeria-item';
                div.innerHTML = `<img src="${item.imagen}" alt="${item.alt || 'Trabajo real'}">`;
                div.addEventListener('click', () => {
                    document.getElementById('lightbox').style.display = 'flex';
                    document.getElementById('lightbox-img').src = item.imagen;
                });
                contenedorGal.appendChild(div);
            });
        }

        contenedorFiltros.addEventListener('click', (e) => {
            if (e.target.classList.contains('filtro-btn')) {
                document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                mostrarImagenes(e.target.dataset.filtro);
            }
        });

        mostrarImagenes('todos');

        // Lightbox
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === this || e.target.className === 'cerrar-lightbox') {
                    this.style.display = 'none';
                }
            });
        }
    }
});