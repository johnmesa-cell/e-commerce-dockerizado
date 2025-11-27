USE ecommerce;

-- Insertar usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, email, password, role) VALUES
('Administrador', 'admin@musicstore.com', '$2b$10$X5xKQCJJ5QkGZJ5QkGZJ5u8vYwQYwQYwQYwQYwQYwQYwQYwQYwQYw', 'admin'),
('John Mesa', 'john.mesa@utp.edu.co', '$2b$10$X5xKQCJJ5QkGZJ5QkGZJ5u8vYwQYwQYwQYwQYwQYwQYwQYwQYwQYw', 'cliente');

-- Insertar categorías de instrumentos musicales
INSERT INTO categorias (nombre, descripcion) VALUES
('Guitarras', 'Guitarras acústicas, eléctricas y bajos'),
('Teclados y Pianos', 'Pianos digitales, sintetizadores y teclados MIDI'),
('Batería y Percusión', 'Baterías acústicas, electrónicas y instrumentos de percusión'),
('Vientos', 'Instrumentos de viento madera y metal'),
('Cuerdas', 'Violines, violas, violonchelos y contrabajos'),
('Accesorios', 'Cables, soportes, fundas y pedales'),
('Audio Profesional', 'Interfaces de audio, micrófonos y monitores de estudio'),
('DJ y Producción', 'Controladoras, mezcladores y equipos para DJ');

-- Insertar productos de instrumentos musicales
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen_url) VALUES
-- Guitarras
('Guitarra Acústica Yamaha F310', 'Guitarra acústica para principiantes, tapa de abeto', 450000, 25, 1, 'assets/images/Guitarra acustica yamaha 3.png'),
('Guitarra Eléctrica Fender Stratocaster', 'Guitarra eléctrica clásica con 3 pastillas single coil', 3200000, 10, 1, 'assets/images/Guitarra Eléctrica Fender Stratocaster.png'),
('Bajo Eléctrico Ibanez SR300E', 'Bajo de 4 cuerdas con electrónica activa', 1850000, 15, 1, 'assets/images/Bajo Eléctrico Ibanez SR300E.png'),
('Guitarra Electroacústica Taylor 214ce', 'Guitarra electroacústica con cutaway y previo ES2', 4500000, 8, 1, 'assets/images/Guitarra Electroacústica Taylor 214ce.png'),
('Guitarra Clásica Alhambra 1C', 'Guitarra española con tapa de cedro macizo', 980000, 20, 1, 'assets/images/Guitarra Clásica Alhambra 1C.png'),

-- Teclados y Pianos
('Piano Digital Yamaha P-45', 'Piano digital de 88 teclas con acción de martillo', 1950000, 12, 2, 'assets/images/Piano Digital Yamaha P-45.png'),
('Teclado Casio CT-S300', 'Teclado portátil de 61 teclas con 400 tonos', 520000, 30, 2, 'assets/images/Teclado Casio CT-S300.png'),
('Sintetizador Korg Minilogue XD', 'Sintetizador analógico polifónico de 4 voces', 3800000, 6, 2, 'assets/images/Sintetizador Korg Minilogue XD.png'),
('Piano Digital Roland FP-30X', 'Piano portátil con altavoces integrados y Bluetooth', 2650000, 10, 2, 'assets/images/Piano Digital Roland FP-30X.png'),

-- Batería y Percusión
('Batería Acústica Pearl Export', 'Kit completo de 5 piezas con herrajes', 3500000, 5, 3, 'assets/images/Batería Acústica Pearl Export.png'),
('Batería Electrónica Alesis Nitro Mesh', 'Batería digital con pads de malla y módulo de sonido', 2100000, 8, 3, 'assets/images/Batería Electrónica Alesis Nitro Mesh.png'),
('Cajón Peruano LP Aspire', 'Cajón flamenco con cuerdas ajustables', 380000, 35, 3, 'assets/images/Cajón Peruano LP Aspire.png'),
('Congas LP Matador', 'Par de congas de fibra de vidrio 10" y 11"', 1650000, 12, 3, 'assets/images/Congas LP Matador.png'),

-- Vientos
('Saxofón Alto Yamaha YAS-280', 'Saxofón alto para estudiantes con estuche', 4200000, 7, 4, 'assets/images/Saxofón Alto Yamaha YAS-280.png'),
('Flauta Traversa Yamaha YFL-222', 'Flauta de plata alemana para principiantes', 1450000, 15, 4, 'assets/images/Flauta Traversa Yamaha YFL-222.png'),
('Trompeta Bach TR300H2', 'Trompeta Bb con campana de latón lacado', 2300000, 10, 4, 'assets/images/Trompeta Bach TR300H2.png'),
('Clarinete Buffet E11', 'Clarinete profesional en Bb con sistema Boehm', 3900000, 6, 4, 'assets/images/Clarinete Buffet E11.png'),

-- Cuerdas
('Violín Stentor Student I 4/4', 'Violín completo para estudiantes con arco y estuche', 850000, 18, 5, 'assets/images/Violin.png'),
('Violonchelo Cremona SC-175 4/4', 'Violonchelo de estudio con tapa de abeto', 2800000, 5, 5, 'assets/images/Violonchelo.webp'),
('Ukelele Kala KA-15S Soprano', 'Ukelele soprano de caoba con funda', 280000, 40, 5, 'assets/images/ukulele.webp'),

-- Accesorios
('Cable Instrumento Monster Cable 6m', 'Cable profesional para guitarra y bajo', 85000, 60, 6, 'assets/images/Cable profesional.webp'),
('Pedal Overdrive Boss OD-3', 'Pedal de overdrive para guitarra', 420000, 25, 6, 'assets/images/Pedal de overdrive para guitarra.webp'),
('Soporte para Guitarra Hercules GS414B', 'Soporte universal con bloqueo automático', 95000, 45, 6, 'assets/images/Soporte universal.jpg'),
('Afinador Cromático Boss TU-3', 'Afinador de pedal con display LED', 380000, 30, 6, 'assets/images/Afinador de pedal con display LED.webp'),
('Cuerdas Guitarra Eléctrica Ernie Ball 10-46', 'Set de cuerdas calibre regular', 35000, 120, 6, 'assets/images/Set de cuerdas calibre regular.jpg'),

-- Audio Profesional
('Interfaz de Audio Focusrite Scarlett 2i2', 'Interfaz USB de 2 entradas con previos de calidad', 650000, 22, 7, 'assets/images/Interfaz USB de 2 entradas con previos de calidad.webp'),
('Micrófono Shure SM57', 'Micrófono dinámico para instrumentos y voces', 480000, 35, 7, 'assets/images/Micrófono dinámico para instrumentos y voces.jpg'),
('Monitores de Estudio KRK Rokit 5 G4 (Par)', 'Monitores activos de 5 pulgadas', 1850000, 15, 7, 'assets/images/Monitores activos de 5 pulgadas.jpg'),
('Micrófono Condensador Audio-Technica AT2020', 'Micrófono de condensador cardioide XLR', 520000, 28, 7, 'assets/images/Hipercentro-Electronico-micrófono-profesional-para-instrumentos-de-alta-fidelidad-de-sonido-y-calidad-SHURE-PGA81XLR-1.webp'),

-- DJ y Producción
('Controladora DJ Pioneer DDJ-400', 'Controladora de 2 canales para rekordbox', 1450000, 12, 8, 'assets/images/Controladora de 2 canales.jpg'),
('Mezclador DJ Behringer DJX750', 'Mezclador profesional de 5 canales', 980000, 10, 8, 'assets/images/Mezclador profesional de 5 canales.webp'),
('Controlador MIDI Akai MPK Mini', 'Teclado controlador MIDI compacto de 25 teclas', 380000, 25, 8, 'assets/images/Pioneer-DJ-DDJ-800-2-Channel-Controller-for-rekordbox-dj-3.webp');

-- Insertar un pedido de ejemplo
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(2, 1070000, 'entregado');

-- Insertar detalle del pedido
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 450000, 450000),
(1, 7, 1, 520000, 520000),
(1, 25, 2, 50000, 100000);

-- Insertar reseñas de ejemplo
INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario) VALUES
(1, 2, 5, 'Excelente guitarra para principiantes, muy buena calidad y sonido'),
(7, 2, 5, 'Teclado perfecto para empezar a aprender, buena relación calidad-precio'),
(28, 2, 4, 'Interfaz de audio con excelente calidad, muy fácil de configurar');
