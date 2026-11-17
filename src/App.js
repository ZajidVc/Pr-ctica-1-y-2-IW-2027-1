import { Cart } from './Models/Cart.js';
import { filtrarProductosPorNombre } from './funciones.js';

// Instanciamos nuestro carrito
const myCart = new Cart();

console.log("--- Estado Inicial del Carrito ---", myCart.getItems());
const Productos = [
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
];

// Elementos DOM
const catalogoContainer = document.getElementById('catalogoContainer');
const badgeCarrito = document.getElementById('cart-badge');
const mensajeNoEncontrado = document.getElementById('noEncontrado');
const inputBusqueda = document.getElementById('inputBusqueda');

// Elementos MOD para Modal
const abrirCarrito = document.getElementById('abrirCarritoBtn') || document.getElementById('open-cart-btn');
const modalCarrito = document.getElementById('modalCarrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const itemsCarritoContainer = document.getElementById('itemsenCarrito');
const totalElementosCar = document.getElementById('totalCarrito');
const vaciarCarritoBtn = document.getElementById('vaciarCarrito');

const actualizarContadorDOM = () => {
    if(badgeCarrito){
        const totalItems = myCart.getItems().reduce((acc, item) => acc + item.quantity, 0);
        badgeCarrito.textContent = totalItems;
    }
};

// Renderizado del modal con controles de cantidad y eliminación
const renderizarModalCarrito = () => {
    if (!itemsCarritoContainer) return;
    const items = myCart.getItems();
        
    if (items.length === 0) {
        itemsCarritoContainer.innerHTML = '<p class="carrito-vacio">El carrito está vacío 👾</p>';
    } else {
        itemsCarritoContainer.innerHTML = items.map(item => `
            <div class="item-carrito-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.1);">
                <span style="font-weight: 600; flex: 2;">${item.name}</span>
                <div class="controles-cantidad" style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center;">
                    <button class="btn-restar" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-sumar" data-id="${item.id}" style="padding: 2px 8px; cursor: pointer;">+</button>
                </div>
                <span style="flex: 1; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn-eliminar-item" data-id="${item.id}" style="background: transparent; border: none; cursor: pointer; font-size: 1.1rem; margin-left: 8px;" title="Eliminar ítem">🗑️</button>
            </div>
        `).join('');
    }

    if (totalElementosCar) {
        totalElementosCar.textContent = `$${myCart.getTotal().toFixed(2)}`;
    }
};

//  Botones dentro del modal (Sumar, Restar, Eliminar)
if (itemsCarritoContainer) {
    itemsCarritoContainer.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        if (!id) return;

        const item = myCart.getItems().find(i => i.id === id);
        if (!item) return;

        if (e.target.classList.contains('btn-sumar')) {
            myCart.updateQuantity(id, item.quantity + 1);
        } else if (e.target.classList.contains('btn-restar')) {
            myCart.updateQuantity(id, item.quantity - 1);
        } else if (e.target.classList.contains('btn-eliminar-item')) {
            myCart.removeItem(id);
        }

        renderizarModalCarrito();
        actualizarContadorDOM();
        renderizarProductos(Productos); // Sincroniza el estado visual de las tarjetas en el catálogo
    });
}

const renderizarProductos = (listaProductos) => {
    if(!catalogoContainer) return;

    if(!listaProductos || listaProductos.length === 0){
        catalogoContainer.innerHTML = '';
        if(mensajeNoEncontrado) mensajeNoEncontrado.style.display = 'block';
        return;
    }
    if(mensajeNoEncontrado) mensajeNoEncontrado.style.display = 'none';
    
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

if(inputBusqueda) {
    inputBusqueda.addEventListener('input', (e) => {
        const productosFiltrados = filtrarProductosPorNombre(Productos, e.target.value);
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

if (cerrarCarrito && modalCarrito) {
    cerrarCarrito.addEventListener('click', () => {
        modalCarrito.style.display = 'none';
    });
}

// Abrir el Modal
renderizarProductos(Productos);
actualizarContadorDOM();
