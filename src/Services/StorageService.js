
export const StorageService = {  /*Se deberá de importar esta parte en donde queramos guardar los datos */
  /**/
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error al guardar en localStorage:", error);
    }
  },
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error al leer de localStorage:", error);
      return null;
    }
  }
};
