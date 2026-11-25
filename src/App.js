import { Cart } from './Models/Cart.js';
import { filtrarProductosPorNombre, estaEnCarrito } from './Services/funciones.js';

const myCart = new Cart();

const Productos = [
    { id: 1, name: "Audífonos inalambricos", price: 500.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ16TLMxXAa9o0H4QvyWEKeDShsFWy1MryBVt4tv25H7g&s=10" },
    { id: 2, name: "Teclado Gamer", price: 500.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMVuUmuFkhbef-M_xSEn6AZoh4oG5W8tl8XkhcPTEHA&s=10" },
    { id: 3, name: "Laptop Gamer", price: 5800.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21uvhLwmhuhBMln0p0wZgCHYn7KkLkgVHHqY5BvTePQ&s=10" },
    { id: 4, name: "Monitor", price: 1300.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5r43saIDgBxUo3C4g6IER9M70bPGHiaiBHLZPcIXJ0g&s=10" },
    { id: 5, name: "Control Gamer", price: 800.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk7tf1jkJvmjCxYzexhoDlN2pIazUtwoAgh5PjJsmnDg&s=10" },
    { id: 6, name: "Mouse Gamer", price: 300.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9rN8NExEyopgEGiqpMPwXscS_74MVGmzt3MP7Up4zA&s=10" },
    { id: 7, name: "Pc Gamer", price: 9800.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD0AilhX5Ft574cSaGKIeT2ctzL7Pz-kafyg65fQM_VA&s=10" },
    { id: 8, name: "RAMS", price: 300.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbZ4oXRsO7fiTp5qYVYVvgVf3vkn_2Y8NJ94946IhOVA&s=10" },
    { id: 9, name: "Disco Duro", price: 2300.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqLTKvl7KjVzvYucupBQEWrSPWH4qN6Qb_q_--HHNPaQ&s" },
    { id: 10, name: "Grafica", price: 300.00, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXQnAmEogKIq3j1mkxqPd7kDFEc510rd_5BN6omLn7w&s=10" },
];

// Elementos DOM - Catálogo y tema
const selectorModo = document.getElementById('selector-modo');
const catalogoContainer = document.getElementById('catalogoContainer');
const badgeCarrito = document.getElementById('cart-badge');
const mensajeNoEncontrado = document.getElementById('noEncontrado');
const inputBusqueda = document.getElementById('inputBusqueda');

// Elementos DOM - Modal
const abrirCarrito = document.getElementById('abrirCarritoBtn');
const modalCarrito = document.getElementById('modalCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const itemsCarritoContainer = document.getElementById('itemsenCarrito');
const totalElementosCar = document.getElementById('totalCarrito');
const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
const volverCatalogoBtn = document.getElementById('volverCatalogo');
const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
const alertaCarrito = document.getElementById('alertaCarrito');

// Elementos DOM - Checkout
const seccionCheckout = document.getElementById('seccionCheckout');
const volverDesdeCheckout = document.getElementById('volverDesdeCheckout');
const listaResumenCheckout = document.getElementById('listaResumenCheckout');
const totalCheckout = document.getElementById('totalCheckout');
const formCheckout = document.getElementById('formCheckout');
const mensajeCompraExitosa = document.getElementById('mensajeCompraExitosa');
const detalleCompraExitosa = document.getElementById('detalleCompraExitosa');
const seguirComprandoBtn = document.getElementById('seguirComprandoBtn');

// --- Modo Oscuro sincronizado con localStorage ---
const aplicarTema = (tema) => {
    if (tema === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', tema);
    if (selectorModo) selectorModo.checked = tema === 'dark';
};

aplicarTema(localStorage.getItem('theme') || 'light');

if (selectorModo) {
    selectorModo.addEventListener('change', (e) => {
        aplicarTema(e.target.checked ? 'dark' : 'light');
    });
}

// --- Helpers de estado y vistas ---
const estaEnCheckout = () => seccionCheckout && seccionCheckout.style.display === 'flex';

const cerrarModalCarrito = () => {
    if (modalCarrito) modalCarrito.style.display = 'none';
};

const actualizarContadorDOM = () => {
    if (badgeCarrito) {
        const totalItems = myCart.getItems().reduce((acc, item) => acc + item.quantity, 0);
        badgeCarrito.textContent = totalItems;
    }
};

const renderizarResumenCheckout = () => {
    const items = myCart.getItems();
    if (listaResumenCheckout) {
        listaResumenCheckout.innerHTML = items.map(item => `
            <div class="item-resumen">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    if (totalCheckout) {
        totalCheckout.textContent = `$${myCart.getTotal().toFixed(2)}`;
    }
};

const renderizarProductos = (listaProductos) => {
    if (!catalogoContainer) return;

    if (!listaProductos || listaProductos.length === 0) {
        catalogoContainer.innerHTML = '';
        if (mensajeNoEncontrado && !estaEnCheckout()) {
            mensajeNoEncontrado.style.display = 'block';
        }
        return;
    }

    if (mensajeNoEncontrado) mensajeNoEncontrado.style.display = 'none';
    const itemsEnCarrito = myCart.getItems();

    catalogoContainer.innerHTML = listaProductos.map(producto => {
        const agregado = estaEnCarrito(itemsEnCarrito, producto.id);
        return `
            <article class="tarjeta ${agregado ? 'en-carrito' : ''}" data-id="${producto.id}" data-nombre="${producto.name.toLowerCase()}">
                <div class="contenedor-img">
                    <img src="${producto.imagen}" alt="${producto.name}" class="imagen-producto">
                </div>
                <div class="info-producto">
                    <span class="nombre">${producto.name}</span>
                    <span class="precio">$${producto.price.toFixed(2)}</span>
                    <button type="button" class="btn-carrito" data-id="${producto.id}">
                        ${agregado ? '✔ En el carrito' : '🛒 Agregar al carrito'}
                    </button>
                </div>
            </article>
        `;
    }).join('');
};

const renderizarCatalogoActual = () => {
    const textoActual = inputBusqueda ? inputBusqueda.value : '';
    renderizarProductos(filtrarProductosPorNombre(Productos, textoActual));
};

const renderizarModalCarrito = () => {
    if (!itemsCarritoContainer) return;
    const items = myCart.getItems();

    if (items.length === 0) {
        itemsCarritoContainer.innerHTML = '<p class="carrito-vacio">El carrito está vacío 👾</p>';
    } else {
        itemsCarritoContainer.innerHTML = items.map(item => `
            <div class="item-carrito-row">
                <div class="info-item-carrito">
                    <span class="nombre-item-carrito">${item.name}</span>
                    <span class="subtotal-item-carrito">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="controles-item-carrito">
                    <button type="button" class="btn-cant btn-disminuir" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
                    <span class="cantidad-item">${item.quantity}</span>
                    <button type="button" class="btn-cant btn-aumentar" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                    <button type="button" class="btn-eliminar-item" data-id="${item.id}" aria-label="Eliminar producto">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    if (totalElementosCar) {
        totalElementosCar.textContent = `$${myCart.getTotal().toFixed(2)}`;
    }
};

const regresarAlCatalogo = () => {
    if (seccionCheckout) seccionCheckout.style.display = 'none';
    if (catalogoContainer) catalogoContainer.style.display = '';
    if (formCheckout) formCheckout.style.display = 'flex';
    if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'none';
    if (inputBusqueda) inputBusqueda.disabled = false;
    renderizarCatalogoActual();
};

const actualizarVistaCompleta = () => {
    actualizarContadorDOM();
    renderizarModalCarrito();
    renderizarCatalogoActual();

    // Si el usuario editó el carrito mientras estaba en checkout, mantenerlo sincronizado
    if (estaEnCheckout() && formCheckout && formCheckout.style.display !== 'none') {
        if (myCart.getItems().length === 0) {
            regresarAlCatalogo();
        } else {
            renderizarResumenCheckout();
        }
    }
};

// --- Delegación de eventos en el Catálogo ---
if (catalogoContainer) {
    catalogoContainer.addEventListener('click', (e) => {
        const boton = e.target.closest('.btn-carrito');
        if (!boton) return;

        const idProducto = Number(boton.dataset.id);
        const tarjeta = boton.closest('.tarjeta');
        const productoSeleccionado = Productos.find(p => p.id === idProducto);
        if (!productoSeleccionado) return;

        if (!estaEnCarrito(myCart.getItems(), idProducto)) {
            myCart.addItem(productoSeleccionado);
            boton.textContent = '✔ En el carrito';
            if (tarjeta) tarjeta.classList.add('en-carrito');
        } else {
            myCart.removeItem(idProducto);
            boton.textContent = '🛒 Agregar al carrito';
            if (tarjeta) tarjeta.classList.remove('en-carrito');
        }

        actualizarContadorDOM();
        renderizarModalCarrito();
    });
}

// --- Delegación de eventos en el Modal del Carrito ---
if (itemsCarritoContainer) {
    itemsCarritoContainer.addEventListener('click', (e) => {
        const btnAumentar = e.target.closest('.btn-aumentar');
        const btnDisminuir = e.target.closest('.btn-disminuir');
        const btnEliminar = e.target.closest('.btn-eliminar-item');

        if (btnAumentar) {
            const id = Number(btnAumentar.dataset.id);
            const item = myCart.getItems().find(i => i.id === id);
            if (item) {
                myCart.updateQuantity(id, item.quantity + 1);
                actualizarVistaCompleta();
            }
        } else if (btnDisminuir) {
            const id = Number(btnDisminuir.dataset.id);
            const item = myCart.getItems().find(i => i.id === id);
            if (item) {
                myCart.updateQuantity(id, item.quantity - 1);
                actualizarVistaCompleta();
            }
        } else if (btnEliminar) {
            const id = Number(btnEliminar.dataset.id);
            myCart.removeItem(id);
            actualizarVistaCompleta();
        }
    });
}

// --- Eventos de apertura y cierre del Modal (unificados) ---
if (abrirCarrito && modalCarrito) {
    abrirCarrito.addEventListener('click', () => {
        if (alertaCarrito) alertaCarrito.textContent = '';
        renderizarModalCarrito();
        modalCarrito.style.display = 'flex';
    });
}

if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', cerrarModalCarrito);
}

if (volverCatalogoBtn) {
    volverCatalogoBtn.addEventListener('click', cerrarModalCarrito);
}

if (modalCarrito) {
    modalCarrito.addEventListener('click', (e) => {
        if (e.target === modalCarrito) cerrarModalCarrito();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalCarrito && modalCarrito.style.display === 'flex') {
        cerrarModalCarrito();
    }
});

if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', () => {
        myCart.clear();
        actualizarVistaCompleta();
    });
}

// --- Búsqueda ---
if (inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
        if (estaEnCheckout()) return;
        renderizarCatalogoActual();
    });
}

// --- Flujo de Checkout ---
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', () => {
        const items = myCart.getItems();

        if (items.length === 0) {
            if (alertaCarrito) {
                alertaCarrito.textContent = '⚠️ El carrito está vacío. Agrega al menos un producto para continuar.';
            }
            return;
        }

        if (alertaCarrito) alertaCarrito.textContent = '';
        cerrarModalCarrito();

        if (catalogoContainer) catalogoContainer.style.display = 'none';
        if (mensajeNoEncontrado) mensajeNoEncontrado.style.display = 'none';
        if (inputBusqueda) inputBusqueda.disabled = true;

        renderizarResumenCheckout();

        if (formCheckout) formCheckout.style.display = 'flex';
        if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'none';
        if (seccionCheckout) {
            seccionCheckout.style.display = 'flex';
            seccionCheckout.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (volverDesdeCheckout) {
    volverDesdeCheckout.addEventListener('click', regresarAlCatalogo);
}

if (seguirComprandoBtn) {
    seguirComprandoBtn.addEventListener('click', regresarAlCatalogo);
}

if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();
        if (myCart.getItems().length === 0) return;

        const nombre = document.getElementById('checkoutNombre').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const totalPagado = myCart.getTotal().toFixed(2);

        if (detalleCompraExitosa) {
            detalleCompraExitosa.textContent = `Gracias por tu compra, ${nombre}. Enviaremos el comprobante por $${totalPagado} a ${email}.`;
        }

        myCart.clear();
        if (inputBusqueda) inputBusqueda.value = '';
        actualizarContadorDOM();
        renderizarModalCarrito();

        formCheckout.reset();
        formCheckout.style.display = 'none';
        if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'flex';
    });
}

// Renderizado inicial
renderizarCatalogoActual();
actualizarContadorDOM();
