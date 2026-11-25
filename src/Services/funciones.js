const normalizarTexto = (texto) =>
    texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

export const filtrarProductosPorNombre = (productos, textoBusqueda) => {
    if (!textoBusqueda) return productos;
    const termino = normalizarTexto(textoBusqueda);
    return productos.filter(producto =>
        normalizarTexto(producto.name).includes(termino)
    );
};

export const estaEnCarrito = (itemsCarrito, productoId) => {
    return itemsCarrito.some(item => item.id === productoId);
};
