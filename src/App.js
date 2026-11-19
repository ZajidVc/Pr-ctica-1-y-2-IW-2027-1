import { Cart } from './Models/Cart.js';
import{filtrarProductosPorNombre} from './Services/funciones.js';

// Instanciamos nuestro carrito
const myCart = new Cart();

console.log("--- Estado Inicial del Carrito ---", myCart.getItems());
const Productos=
[
    {id: 1, name: "Audífonos inalambricos", price: 500.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ16TLMxXAa9o0H4QvyWEKeDShsFWy1MryBVt4tv25H7g&s=10"},
    {id: 2, name: "Teclado Gamer", price: 500.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMVuUmuFkhbef-M_xSEn6AZoh4oG5W8tl8XkhcPTEHA&s=10"},
    {id: 3, name: "Laptop Gamer", price: 5800.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS21uvhLwmhuhBMln0p0wZgCHYn7KkLkgVHHqY5BvTePQ&s=10"},
    {id: 4, name: "Monitor", price: 1300.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5r43saIDgBxUo3C4g6IER9M70bPGHiaiBHLZPcIXJ0g&s=10"},
    {id: 5, name: "Control Gamer", price: 800.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk7tf1jkJvmjCxYzexhoDlN2pIazUtwoAgh5PjJsmnDg&s=10"},
    {id: 6, name: "Mouse Gamer", price: 300.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9rN8NExEyopgEGiqpMPwXscS_74MVGmzt3MP7Up4zA&s=10"},
    {id: 7, name: "Pc Gamer", price: 9800.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD0AilhX5Ft574cSaGKIeT2ctzL7Pz-kafyg65fQM_VA&s=10"},
    {id: 8, name: "RAMS", price: 300.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbZ4oXRsO7fiTp5qYVYVvgVf3vkn_2Y8NJ94946IhOVA&s=10"},
    {id: 9, name: "Disco Duro", price: 2300.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqLTKvl7KjVzvYucupBQEWrSPWH4qN6Qb_q_--HHNPaQ&s"},
    {id: 10,name: "Grafica", price: 300.00, imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXQnAmEogKIq3j1mkxqPd7kDFEc510rd_5BN6omLn7w&s=10"},  
]
//Elementos DOM
const catalogoContainer = document.getElementById('catalogoContainer');
const badgeCarrito = document.getElementById('cart-badge');
const mensajeNoEncontrado = document.getElementById('noEncontrado');
const inputBusqueda=document.getElementById('inputBusqueda');
//ELEMENTOS MOD para Modal
const abrirCarrito=document.getElementById('abrirCarritoBtn');
const modalCarrito=document.getElementById('modalCarrito');
const cerrarCarrito=document.getElementById('cerrarCarrito');
const itemsCarritoContainer=document.getElementById('itemsenCarrito');
const totalElementosCar=document.getElementById('totalCarrito');
const vaciarCarritoBtn=document.getElementById('vaciarCarrito');
const volverCatalogoBtn = document.getElementById('volverCatalogo');

const actualizarContadorDOM=() =>{
    if(badgeCarrito){
        const totalItems= myCart.getItems().reduce((acc, item)=> acc + item.quantity, 0);
        badgeCarrito.textContent=totalItems;
    }
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

        // Refresca el catálogo (respetando la búsqueda activa), el contador y el modal
        const actualizarVistaCompleta = () => {
            const textoActual = inputBusqueda ? inputBusqueda.value : '';
            renderizarProductos(filtrarProductosPorNombre(Productos, textoActual));
            actualizarContadorDOM();
            renderizarModalCarrito();
        };

        // Aumentar cantidad (+)
        itemsCarritoContainer.querySelectorAll('.btn-aumentar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const item = myCart.getItems().find(i => i.id === id);
                if (item) {
                    myCart.updateQuantity(id, item.quantity + 1);
                    actualizarVistaCompleta();
                }
            });
        });

        // Disminuir cantidad (−)
        itemsCarritoContainer.querySelectorAll('.btn-disminuir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const item = myCart.getItems().find(i => i.id === id);
                if (item) {
                    myCart.updateQuantity(id, item.quantity - 1);
                    actualizarVistaCompleta();
                }
            });
        });

        // Eliminar producto por completo (🗑️)
        itemsCarritoContainer.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                myCart.removeItem(id);
                actualizarVistaCompleta();
            });
        });
    }

    if (totalElementosCar) {
        totalElementosCar.textContent = `$${myCart.getTotal().toFixed(2)}`;
    }
};
// --- Lógica de Finalizar Compra y Sección Checkout ---
const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');
const alertaCarrito = document.getElementById('alertaCarrito');
const seccionCheckout = document.getElementById('seccionCheckout');
const volverDesdeCheckout = document.getElementById('volverDesdeCheckout');
const listaResumenCheckout = document.getElementById('listaResumenCheckout');
const totalCheckout = document.getElementById('totalCheckout');
const formCheckout = document.getElementById('formCheckout');
const mensajeCompraExitosa = document.getElementById('mensajeCompraExitosa');
const detalleCompraExitosa = document.getElementById('detalleCompraExitosa');
const seguirComprandoBtn = document.getElementById('seguirComprandoBtn');
const regresarAlCatalogo = () => {
    if (seccionCheckout) seccionCheckout.style.display = 'none';
    if (catalogoContainer) catalogoContainer.style.display = '';
    if (formCheckout) formCheckout.style.display = 'flex';
    if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'none';
};

// Limpiar mensaje de alerta al abrir el carrito
if (abrirCarrito && alertaCarrito) {
    abrirCarrito.addEventListener('click', () => {
        alertaCarrito.textContent = '';
    });
}

// Validar carrito al presionar "Finalizar compra"
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', () => {
        const items = myCart.getItems();

        if (items.length === 0) {
            if (alertaCarrito) {
                alertaCarrito.textContent = '⚠️ El carrito está vacío. Agrega al menos un producto para continuar.';
            }
            return;
        }

        // Si tiene productos: cierra el modal, oculta el catálogo y abre la sección del formulario
        if (alertaCarrito) alertaCarrito.textContent = '';
        if (modalCarrito) modalCarrito.style.display = 'none';
        if (catalogoContainer) catalogoContainer.style.display = 'none';
        if (mensajeNoEncontrado) mensajeNoEncontrado.style.display = 'none';

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

        if (formCheckout) formCheckout.style.display = 'flex';
        if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'none';
        if (seccionCheckout) {
            seccionCheckout.style.display = 'flex';
            seccionCheckout.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Volver al catálogo desde la sección del formulario
if (volverDesdeCheckout) {
    volverDesdeCheckout.addEventListener('click', regresarAlCatalogo);
}

if (seguirComprandoBtn) {
    seguirComprandoBtn.addEventListener('click', regresarAlCatalogo);
}

// Procesar envío del formulario de datos personales
if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('checkoutNombre').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const totalPagado = myCart.getTotal().toFixed(2);

        if (detalleCompraExitosa) {
            detalleCompraExitosa.textContent = `Gracias por tu compra, ${nombre}. Enviaremos el comprobante por $${totalPagado} a ${email}.`;
        }

        // Vaciar carrito y actualizar estado visual
        myCart.clear();
        actualizarContadorDOM();
        renderizarProductos(Productos);
        renderizarModalCarrito();

        formCheckout.reset();
        formCheckout.style.display = 'none';
        if (mensajeCompraExitosa) mensajeCompraExitosa.style.display = 'flex';
    });
}
    const renderizarProductos=(listaProductos)=>
    {
        if(!catalogoContainer) return;

        if(!listaProductos || listaProductos.length===0){
            catalogoContainer.innerHTML='';
            if(mensajeNoEncontrado) mensajeNoEncontrado.style.display='block';
            return;
        }
        if(mensajeNoEncontrado) mensajeNoEncontrado.style.display='none';
    const itemsEnCarrito = myCart.getItems();
    catalogoContainer.innerHTML = listaProductos.map(producto => {
        const estaEnCarrito = itemsEnCarrito.some(item => item.id === producto.id);

        return `
            <article class="tarjeta ${estaEnCarrito ? 'en-carrito' : ''}" data-id="${producto.id}" data-nombre="${producto.name.toLowerCase()}">
                <div class="contenedor-img">
                    <img src="${producto.imagen}" alt="${producto.name}" class="imagen-producto">
                </div>
                <div class="info-producto">
                    <span class="nombre">${producto.name}</span>
                    <span class="precio">$${producto.price.toFixed(2)}</span>
                    <button type="button" class="btn-carrito" data-id="${producto.id}">
                        ${estaEnCarrito ? '✔ En el carrito' : '🛒 Agregar al carrito'}
                    </button>
                </div>
            </article>
        `;
    }).join('');

    document.querySelectorAll('.btn-carrito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idProducto = Number(e.target.dataset.id);
            const tarjeta = e.target.closest('.tarjeta');
            const productoSeleccionado = Productos.find(p => p.id === idProducto);

            if (!productoSeleccionado) return;

            const estaAgregado = myCart.getItems().some(item => item.id === idProducto);
            if (!estaAgregado) {
                myCart.addItem(productoSeleccionado);
                e.target.textContent = '✔ En el carrito';
                tarjeta.classList.add('en-carrito');
            } else {
                myCart.removeItem(idProducto);
                e.target.textContent = '🛒 Agregar al carrito';
                tarjeta.classList.remove('en-carrito');
            }

            actualizarContadorDOM();
            renderizarModalCarrito();
        });
    });
};
if (abrirCarrito && modalCarrito) {
    abrirCarrito.addEventListener('click', () => {
        renderizarModalCarrito();
        modalCarrito.style.display = 'flex';
    });
}
if(inputBusqueda)
{
    inputBusqueda.addEventListener('input', (e)=>
    {
        const productosFiltrados=filtrarProductosPorNombre(Productos, e.target.value);
        renderizarProductos(productosFiltrados);
    });
}
if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', () => {
        myCart.clear();
        renderizarProductos(Productos);
        actualizarContadorDOM();
        renderizarModalCarrito();
    });
}
if (abrirCarrito && modalCarrito) {
    abrirCarrito.addEventListener('click', () => {
        renderizarModalCarrito();
        modalCarrito.style.display = 'flex';
    });
}

if (cerrarCarrito && modalCarrito) {
    cerrarCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
    if (volverCatalogoBtn && modalCarrito) {
    volverCatalogoBtn.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
}
}
// Abrir el modal
renderizarProductos(Productos);
actualizarContadorDOM();

