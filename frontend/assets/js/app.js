// var, let, const
// "cadenas", 'cadenas', `cadenas ${variable}`
// boleanos: true, false
// 2, 2.1, -2, 2.5
// null, undefined, NaN
// nombre_funcion()=>{}, function()
// new Set, new Map, Array [], Object {}, [...new Set(valores_repetidos)],
// ciclos for, while, for...of, for...in
// if, else if, else, switch
// try, catch, finally
// find, filter, map, reduce

const productosContainer = document.querySelector("#productos-container");
const inputBuscar = document.querySelector("#buscarInput");
let productos = [];
let productosFiltrados = [];

function mostrarProductos(lista) {
  productosContainer.innerHTML = "";
  if (lista.length === 0) {
    productosContainer.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
  lista.forEach((prod, idx) => {
    // incluimos data-index para poder identificar el producto al hacer clic
    const imgSrc = encodeURI(prod.imagen || prod.imagen_url || 'assets/images/placeholder.svg');
    
    // CAMBIO: Convertir precio a número antes de usar toFixed
    const precio = parseFloat(prod.precio) || 0;
    
    // NUEVO: Formato de precio consistente para el carrito
    const precioFormateado = `$${precio.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // NUEVO: Preparar objeto de producto para el carrito
    const productData = {
      id: prod.id || prod.producto_id || idx, // Usar ID del producto o índice como fallback
      nombre: prod.nombre,
      precio: precioFormateado,
      imagen: imgSrc,
      descripcion: prod.descripcion,
      quantity: 1
    };
    
    // NUEVO: Escapar comillas en el JSON para evitar errores
    const productDataJSON = JSON.stringify(productData).replace(/"/g, '&quot;').replace(/'/g, "\\'");
    
    const prodHTML = `
      <article class="producto-card" data-index="${idx}" data-product-id="${productData.id}">
        <img src="${imgSrc}" alt="${prod.nombre}" />
        <h3>${prod.nombre}</h3>
        <p>${prod.descripcion}</p>
        <p class="precio"><b>Precio:</b> ${precioFormateado}</p>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${productData.id}, ${productDataJSON}); return false;" title="Agregar al carrito">
          🛒 Agregar al Carrito
        </button>
      </article>`;
    productosContainer.insertAdjacentHTML("beforeend", prodHTML);
  });

  // Añadir listeners para abrir modal con información relevante del producto
  productosContainer.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // No abrir modal si se hizo clic en el botón de agregar al carrito
      if (e.target.classList.contains('add-to-cart-btn')) {
        return;
      }
      const index = parseInt(card.dataset.index, 10);
      showProductDetail(index, lista);
    });
  });
}

// Cargar datos desde la API del backend
function cargarDatos() {
  const dataEnStorage = sessionStorage.getItem("listado_productos");
  if (dataEnStorage) {
    const parsed = JSON.parse(dataEnStorage);
    productos = parsed;
    productosFiltrados = productos;
    mostrarProductos(productos);
    console.log("Datos cargados desde sessionStorage");
    return Promise.resolve();
  }
  
  // Consultar la API del backend para obtener productos desde la base de datos
  return window.apiRequest('/products')
    .then(response => {
      // CAMBIO: Extraer el array de productos del objeto de respuesta
      const data = response.data || response; // response.data contiene el array de productos
      
      productos = data;
      productosFiltrados = data;
      mostrarProductos(data);
      sessionStorage.setItem("listado_productos", JSON.stringify(data));
      console.log("Datos cargados desde la base de datos (API)");
    })
    .catch(err => {
      console.error("Error al cargar productos desde la API:", err);
      // Fallback opcional: si falla la API, cargar desde JSON local
      return fetch("assets/json/data.json")
        .then(res => res.json())
        .then(data => {
          productos = data;
          productosFiltrados = data;
          mostrarProductos(data);
          console.log("Datos cargados desde archivo JSON (fallback)");
        });
    });
}


// Filtrar productos por búsqueda y categoría
function filtrarProductos() {
  const texto = inputBuscar.value.toLowerCase();
  const catSeleccionada = document.querySelector(".category.selected")?.dataset.category || "all";
  
  productosFiltrados = productos.filter(prod => {
    const categoriaProd = prod.categoria_nombre || prod.categoria || '';
    
    // Comparación exacta con la categoría de la base de datos
    const coincideCategoria = catSeleccionada === "all" || categoriaProd === catSeleccionada;
    
    const coincideTexto = texto === "" || 
                          prod.nombre.toLowerCase().includes(texto) || 
                          (prod.descripcion || '').toLowerCase().includes(texto);
    
    return coincideCategoria && coincideTexto;
  });
  
  mostrarProductos(productosFiltrados);
}


document.addEventListener("DOMContentLoaded", () => {
  // Aseguramos que cargarDatos devuelva una promesa para realizar acciones una vez cargados los productos
  Promise.resolve(cargarDatos()).then(() => {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    const searchParam = params.get('search');
    
    // ========================================
    // NUEVA FUNCIONALIDAD: Capturar búsqueda desde URL
    // ========================================
    if (searchParam) {
      inputBuscar.value = decodeURIComponent(searchParam);
      console.log(`Búsqueda desde URL: ${searchParam}`);
    }
    
    // Selección de categoría desde query string (si existe)
    if (catParam) {
      const catElem = Array.from(document.querySelectorAll('.category')).find(c => c.dataset.category === catParam);
      if (catElem) {
        document.querySelectorAll('.category').forEach(c => c.classList.remove('selected'));
        catElem.classList.add('selected');
        document.querySelectorAll('.category').forEach(c => c.setAttribute('aria-pressed', 'false'));
        catElem.setAttribute('aria-pressed', 'true');
      }
    } else {
      // Si no hay categoría en URL, seleccionar la primera por defecto
      if (!document.querySelector('.category.selected')) {
        const first = document.querySelector('.category[data-category]');
        if (first) {
          first.classList.add('selected');
          first.setAttribute('aria-pressed', 'true');
        }
      }
    }
    
    // Aplicar filtro inicial (incluye búsqueda y categoría)
    filtrarProductos();
    
    // Si hay parámetro product en la URL, abrir detalle correspondiente
    const productParam = params.get('product');
    if (productParam) {
      const decoded = decodeURIComponent(productParam);
      const idx = productos.findIndex(p => p.nombre === decoded);
      if (idx >= 0) {
        const listadoActual = productosFiltrados.length ? productosFiltrados : productos;
        const idxEnListado = listadoActual.findIndex(p => p.nombre === decoded);
        if (idxEnListado >= 0) showProductDetail(idxEnListado, listadoActual);
        else showProductDetail(idx, productos);
      }
    }

    // ========================================
    // Event Listeners
    // ========================================
    
    // Búsqueda en tiempo real mientras escribes
    inputBuscar.addEventListener("input", () => {
      filtrarProductos();
      // Actualizar URL con el término de búsqueda
      const newParams = new URLSearchParams(window.location.search);
      if (inputBuscar.value.trim()) {
        newParams.set('search', inputBuscar.value.trim());
      } else {
        newParams.delete('search');
      }
      history.replaceState(null, '', `${location.pathname}?${newParams.toString()}`);
    });
    
    // Búsqueda al presionar Enter (mantener por compatibilidad)
    inputBuscar.addEventListener("keypress", (e) => {
      if (e.key === 'Enter') {
        filtrarProductos();
      }
    });

    // Listeners para las categorías
    document.querySelectorAll(".category").forEach(cat => {
      // permitir activación por click o por teclado (enter)
      cat.addEventListener("click", (e) => {
        if (e && e.preventDefault) e.preventDefault();
        document.querySelectorAll(".category").forEach(c => { 
          c.classList.remove("selected"); 
          c.setAttribute('aria-pressed', 'false'); 
        });
        cat.classList.add("selected");
        cat.setAttribute('aria-pressed', 'true');
        filtrarProductos();
        
        // actualizamos la query string para compartir enlace de categoría sin recargar
        const newParams = new URLSearchParams(window.location.search);
        newParams.set('category', cat.dataset.category);
        newParams.delete('product');
        history.replaceState(null, '', `${location.pathname}?${newParams.toString()}`);
      });
      
      // permitir interacción por teclado
      cat.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cat.click();
        }
      });
    });
  });
});

// ========================================
// Modal: mostrar y cerrar
// ========================================
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');

function showProductDetail(index, lista) {
  const prod = lista[index];
  if (!prod) return;
  
  const imgSrc = encodeURI(prod.imagen || prod.imagen_url || 'assets/images/placeholder.svg');
  
  // CAMBIO: Convertir precio a número
  const precio = parseFloat(prod.precio) || 0;
  
  document.getElementById('modal-img').src = imgSrc;
  document.getElementById('modal-img').alt = prod.nombre;
  document.getElementById('modal-title').textContent = prod.nombre;
  document.getElementById('modal-desc').textContent = prod.descripcion;
  document.getElementById('modal-price').textContent = `$ ${precio.toFixed(2)}`;
  
  const catEl = document.getElementById('modal-category');
  if (catEl) catEl.querySelector('span').textContent = prod.categoria || prod.categoria_nombre || 'Sin categoría';
  
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  
  // Actualizar URL para que pueda compartirse el producto
  const params = new URLSearchParams(window.location.search);
  params.set('product', prod.nombre);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  
  // eliminar product de query string al cerrar
  const params = new URLSearchParams(window.location.search);
  params.delete('product');
  history.replaceState(null, '', `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

