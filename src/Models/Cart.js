import { StorageService } from './Services/StorageService.js';  /*Este formato es necesario para indicar la ruta donde se encuentra el objetivo*/
const STORAGE_KEY = 'SHOPPING_CART'; /*COnstante para referirnos al carrito*/
export class Cart {
  constructor() {
    // Cargamos el carrito inicial desde localStorage o inicializamos un arreglo vacío
    this.items = StorageService.get(STORAGE_KEY) || [];
  }
  // Método privado para sincronizar con localStorage
  _persist() {    /* TODO elemento privado tiene que iniciar con un "_" Se da por hecho que es privado*/
    StorageService.save(STORAGE_KEY, this.items);
  }
  // 1. Agregar un producto o incrementar su cantidad si ya existe
  addItem(product) 
  {
    // Usamos .find() para buscar si el producto ya está en el arreglo
    const existingItem = this.items.find(item => item.id === product.id);
    if (existingItem) {
      // Usamos .map() para retornar un *nuevo* arreglo actualizando la cantidad del producto encontrado
      this.items = this.items.map(item => 
        item.id === product.id    /* Funcion FLECHA*/
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      // Si no existe, agregamos el nuevo producto asegurando una cantidad inicial
      const newItem = { ...product, quantity: product.quantity || 1 };
      this.items = [...this.items, newItem]; // Usamos spread operator en vez de push()
    }
    this._persist();
    return this.getItems();
  }
  // 2. Eliminar un producto del carrito
  removeItem(productId) {
    // Usamos .filter() para crear un nuevo arreglo excluyendo el ID que queremos borrar
    this.items = this.items.filter(item => item.id !== productId);
    this._persist();
    return this.getItems();
  }
  // 3. Actualizar la cantidad de un producto específico
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, delegamos en removeItem
      return this.removeItem(productId);
    }
    // Usamos .map() para actualizar la cantidad del item seleccionado
    this.items = this.items.map(item =>
      item.id === productId ? { ...item, quantity: quantity } : item
    );
    this._persist();
    return this.getItems();
  }
  // 4. Obtener todos los elementos del carrito
  getItems() {
    return this.items;
  }
  // 5. Calcular el costo total de la compra
  getTotal() {
    // Usamos .reduce() para acumular el precio total (precio * cantidad de cada item)
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  // 6. Vaciar completamente el carrito
  clear() {
    this.items = [];
    this._persist();
    return this.getItems();
  }
}
