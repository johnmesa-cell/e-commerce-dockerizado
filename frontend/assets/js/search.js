// Funcionalidad de búsqueda global
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('buscarInput');
  
  if (searchInput) {
    // Al presionar Enter, redirigir a tienda con el término de búsqueda
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = this.value.trim();
        if (searchTerm) {
          window.location.href = `tienda.html?search=${encodeURIComponent(searchTerm)}`;
        }
      }
    });
    
    // Opcionalmente, agregar un botón de búsqueda
    searchInput.addEventListener('focus', function() {
      this.placeholder = 'Presiona Enter para buscar...';
    });
    
    searchInput.addEventListener('blur', function() {
      this.placeholder = 'Buscar productos, marcas, instrumentos...';
    });
  }
});
