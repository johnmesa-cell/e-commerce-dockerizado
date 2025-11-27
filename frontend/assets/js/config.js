// Configuración de la API (lo colgamos de window para asegurar que sea global)
window.API_CONFIG = {
    baseURL: '/api',  // Como servimos desde el mismo servidor, usamos ruta relativa
    endpoints: {
        // Auth
        register: '/auth/register',
        login: '/auth/login',
        profile: '/auth/profile',
        
        // Products
        products: '/products',
        productById: (id) => `/products/${id}`,
        productsByCategory: (categoryId) => `/products/category/${categoryId}`,
        
        // Categories
        categories: '/categories',
        categoryById: (id) => `/categories/${id}`,
        
        // Orders
        orders: '/orders',
        orderById: (id) => `/orders/${id}`,
    }
};

// Función helper para hacer peticiones a la API (también global)
window.apiRequest = async function(endpoint, options = {}) {
    const url = `${window.API_CONFIG.baseURL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    // Agregar token si existe
    const token = Storage.get('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        }
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la petición');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
