-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Position to start replication or point-in-time recovery from
--

-- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000003', MASTER_LOG_POS=1117;

--
-- Current Database: `ecommerce`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ecommerce`;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `fecha_agregado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Guitarras','Guitarras acÃºsticas, elÃ©ctricas y bajos',1,'2025-12-02 00:31:55'),(2,'Teclados y Pianos','Pianos digitales, sintetizadores y teclados MIDI',1,'2025-12-02 00:31:55'),(3,'BaterÃ­a y PercusiÃ³n','BaterÃ­as acÃºsticas, electrÃ³nicas y instrumentos de percusiÃ³n',1,'2025-12-02 00:31:55'),(4,'Vientos','Instrumentos de viento madera y metal',1,'2025-12-02 00:31:55'),(5,'Cuerdas','Violines, violas, violonchelos y contrabajos',1,'2025-12-02 00:31:55'),(6,'Accesorios','Cables, soportes, fundas y pedales',1,'2025-12-02 00:31:55'),(7,'Audio Profesional','Interfaces de audio, micrÃ³fonos y monitores de estudio',1,'2025-12-02 00:31:55'),(8,'DJ y ProducciÃ³n','Controladoras, mezcladores y equipos para DJ',1,'2025-12-02 00:31:55');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pedido` (`pedido_id`),
  KEY `idx_producto` (`producto_id`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,1,1,450000.00,450000.00),(2,1,7,1,520000.00,520000.00),(3,1,25,2,50000.00,100000.00);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','procesando','enviado','entregado','cancelado') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `fecha_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha` (`fecha_pedido`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,2,1070000.00,'entregado','2025-12-02 00:31:56','2025-12-02 00:31:56');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `categoria_id` int DEFAULT NULL,
  `imagen_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_categoria` (`categoria_id`),
  KEY `idx_precio` (`precio`),
  KEY `idx_activo` (`activo`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Guitarra AcÃºstica Yamaha F310','Guitarra acÃºstica para principiantes, tapa de abeto',450000.00,25,1,'assets/images/Guitarra acustica yamaha 3.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(2,'Guitarra ElÃ©ctrica Fender Stratocaster','Guitarra elÃ©ctrica clÃ¡sica con 3 pastillas single coil',3200000.00,10,1,'assets/images/Guitarra ElÃ©ctrica Fender Stratocaster.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(3,'Bajo ElÃ©ctrico Ibanez SR300E','Bajo de 4 cuerdas con electrÃ³nica activa',1850000.00,15,1,'assets/images/Bajo ElÃ©ctrico Ibanez SR300E.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(4,'Guitarra ElectroacÃºstica Taylor 214ce','Guitarra electroacÃºstica con cutaway y previo ES2',4500000.00,8,1,'assets/images/Guitarra ElectroacÃºstica Taylor 214ce.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(5,'Guitarra ClÃ¡sica Alhambra 1C','Guitarra espaÃ±ola con tapa de cedro macizo',980000.00,20,1,'assets/images/Guitarra ClÃ¡sica Alhambra 1C.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(6,'Piano Digital Yamaha P-45','Piano digital de 88 teclas con acciÃ³n de martillo',1950000.00,12,2,'assets/images/Piano Digital Yamaha P-45.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(7,'Teclado Casio CT-S300','Teclado portÃ¡til de 61 teclas con 400 tonos',520000.00,30,2,'assets/images/Teclado Casio CT-S300.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(8,'Sintetizador Korg Minilogue XD','Sintetizador analÃ³gico polifÃ³nico de 4 voces',3800000.00,6,2,'assets/images/Sintetizador Korg Minilogue XD.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(9,'Piano Digital Roland FP-30X','Piano portÃ¡til con altavoces integrados y Bluetooth',2650000.00,10,2,'assets/images/Piano Digital Roland FP-30X.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(10,'BaterÃ­a AcÃºstica Pearl Export','Kit completo de 5 piezas con herrajes',3500000.00,5,3,'assets/images/BaterÃ­a AcÃºstica Pearl Export.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(11,'BaterÃ­a ElectrÃ³nica Alesis Nitro Mesh','BaterÃ­a digital con pads de malla y mÃ³dulo de sonido',2100000.00,8,3,'assets/images/BaterÃ­a ElectrÃ³nica Alesis Nitro Mesh.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(12,'CajÃ³n Peruano LP Aspire','CajÃ³n flamenco con cuerdas ajustables',380000.00,35,3,'assets/images/CajÃ³n Peruano LP Aspire.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(13,'Congas LP Matador','Par de congas de fibra de vidrio 10\" y 11\"',1650000.00,12,3,'assets/images/Congas LP Matador.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(14,'SaxofÃ³n Alto Yamaha YAS-280','SaxofÃ³n alto para estudiantes con estuche',4200000.00,7,4,'assets/images/SaxofÃ³n Alto Yamaha YAS-280.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(15,'Flauta Traversa Yamaha YFL-222','Flauta de plata alemana para principiantes',1450000.00,15,4,'assets/images/Flauta Traversa Yamaha YFL-222.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(16,'Trompeta Bach TR300H2','Trompeta Bb con campana de latÃ³n lacado',2300000.00,10,4,'assets/images/Trompeta Bach TR300H2.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(17,'Clarinete Buffet E11','Clarinete profesional en Bb con sistema Boehm',3900000.00,6,4,'assets/images/Clarinete Buffet E11.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(18,'ViolÃ­n Stentor Student I 4/4','ViolÃ­n completo para estudiantes con arco y estuche',850000.00,18,5,'assets/images/Violin.png',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(19,'Violonchelo Cremona SC-175 4/4','Violonchelo de estudio con tapa de abeto',2800000.00,5,5,'assets/images/Violonchelo.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(20,'Ukelele Kala KA-15S Soprano','Ukelele soprano de caoba con funda',280000.00,40,5,'assets/images/ukulele.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(21,'Cable Instrumento Monster Cable 6m','Cable profesional para guitarra y bajo',85000.00,60,6,'assets/images/Cable profesional.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(22,'Pedal Overdrive Boss OD-3','Pedal de overdrive para guitarra',420000.00,25,6,'assets/images/Pedal de overdrive para guitarra.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(23,'Soporte para Guitarra Hercules GS414B','Soporte universal con bloqueo automÃ¡tico',95000.00,45,6,'assets/images/Soporte universal.jpg',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(24,'Afinador CromÃ¡tico Boss TU-3','Afinador de pedal con display LED',380000.00,30,6,'assets/images/Afinador de pedal con display LED.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(25,'Cuerdas Guitarra ElÃ©ctrica Ernie Ball 10-46','Set de cuerdas calibre regular',35000.00,120,6,'assets/images/Set de cuerdas calibre regular.jpg',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(26,'Interfaz de Audio Focusrite Scarlett 2i2','Interfaz USB de 2 entradas con previos de calidad',650000.00,22,7,'assets/images/Interfaz USB de 2 entradas con previos de calidad.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(27,'MicrÃ³fono Shure SM57','MicrÃ³fono dinÃ¡mico para instrumentos y voces',480000.00,35,7,'assets/images/MicrÃ³fono dinÃ¡mico para instrumentos y voces.jpg',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(28,'Monitores de Estudio KRK Rokit 5 G4 (Par)','Monitores activos de 5 pulgadas',1850000.00,15,7,'assets/images/Monitores activos de 5 pulgadas.jpg',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(29,'MicrÃ³fono Condensador Audio-Technica AT2020','MicrÃ³fono de condensador cardioide XLR',520000.00,28,7,'assets/images/Hipercentro-Electronico-micrÃ³fono-profesional-para-instrumentos-de-alta-fidelidad-de-sonido-y-calidad-SHURE-PGA81XLR-1.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(30,'Controladora DJ Pioneer DDJ-400','Controladora de 2 canales para rekordbox',1450000.00,12,8,'assets/images/Controladora de 2 canales.jpg',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(31,'Mezclador DJ Behringer DJX750','Mezclador profesional de 5 canales',980000.00,10,8,'assets/images/Mezclador profesional de 5 canales.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56'),(32,'Controlador MIDI Akai MPK Mini','Teclado controlador MIDI compacto de 25 teclas',380000.00,25,8,'assets/images/Pioneer-DJ-DDJ-800-2-Channel-Controller-for-rekordbox-dj-3.webp',1,'2025-12-02 00:31:56','2025-12-02 00:31:56');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `calificacion` int NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `fecha_resena` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_producto` (`producto_id`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resenas_chk_1` CHECK ((`calificacion` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (1,1,2,5,'Excelente guitarra para principiantes, muy buena calidad y sonido','2025-12-02 00:31:56'),(2,7,2,5,'Teclado perfecto para empezar a aprender, buena relaciÃ³n calidad-precio','2025-12-02 00:31:56'),(3,28,2,4,'Interfaz de audio con excelente calidad, muy fÃ¡cil de configurar','2025-12-02 00:31:56');
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_rep`
--

DROP TABLE IF EXISTS `test_rep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_rep` (
  `id` int NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_rep`
--

LOCK TABLES `test_rep` WRITE;
/*!40000 ALTER TABLE `test_rep` DISABLE KEYS */;
INSERT INTO `test_rep` VALUES (1,'ok');
/*!40000 ALTER TABLE `test_rep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `role` enum('cliente','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'cliente',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@musicstore.com','$2b$10$X5xKQCJJ5QkGZJ5QkGZJ5u8vYwQYwQYwQYwQYwQYwQYwQYwQYwQYw',NULL,NULL,'admin','2025-12-02 00:31:55',1),(2,'John Mesa','john.mesa@utp.edu.co','$2b$10$X5xKQCJJ5QkGZJ5QkGZJ5u8vYwQYwQYwQYwQYwQYwQYwQYwQYwQYw',NULL,NULL,'cliente','2025-12-02 00:31:55',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02  0:51:13
