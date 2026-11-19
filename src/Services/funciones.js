export const filtrarProductosPorNombre = (productos, textoBusqueda) => {
    if (!textoBusqueda) return productos;
    const termino = textoBusqueda.toLowerCase().trim();
    return productos.filter(producto => 
        producto.name.toLowerCase().includes(termino)
    );
};
export const estaEnCarrito=(itemsCarrito, productoId)=>
    {
        return itemsCarrito.some(item=> item.id === productoId);
    };
    
