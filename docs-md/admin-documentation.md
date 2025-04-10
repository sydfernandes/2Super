# Documentación del Panel Administrativo

Este documento detalla las tablas, características y funcionalidades relacionadas con la administración de Super Lista.

## Tablas Relacionadas con Administración

### TipoUsuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del tipo de usuario |
| valor | String @db.VarChar(50) @unique | Valor único que representa el tipo (ej. "admin", "user") |
| descripcion | String @db.VarChar(100) | Descripción del tipo de usuario |

**Relaciones**:
- usuarios (Usuario[]) - Relación con los usuarios de este tipo

### Usuario (Administradores)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del usuario |
| nombre | String @db.VarChar(100) | Nombre del usuario |
| email | String @unique @db.VarChar(255) | Correo electrónico único del usuario |
| telefonoMovil | String? @db.VarChar(20) | Número de teléfono móvil (opcional) |
| autenticacionEmail | Boolean @default(true) | Indica si el usuario utiliza autenticación por email |
| autenticacionSms | Boolean @default(false) | Indica si el usuario utiliza autenticación por SMS |
| fechaNacimiento | DateTime? @db.Date | Fecha de nacimiento (opcional) |
| codigoPostal | String? @db.VarChar(10) | Código postal del usuario (opcional) |
| sexoId | Int? | Referencia al sexo/género del usuario (opcional) |
| fechaRegistro | DateTime @default(now()) | Fecha de registro del usuario |
| ultimaConexion | DateTime? | Última fecha de conexión del usuario (opcional) |
| tokenAutenticacion | String? @db.VarChar(255) | Token de autenticación (opcional) |
| activo | Boolean @default(true) | Indica si la cuenta está activa |
| bloqueado | Boolean @default(false) | Indica si la cuenta está bloqueada |
| hogarId | Int? | ID del hogar al que pertenece el usuario (opcional) |
| tipoUsuarioId | Int | ID del tipo de usuario (determina si es admin) |

**Relaciones administrativas**:
- tipoUsuario (TipoUsuario) - Tipo de usuario
- validacionesRealizadas (ValidacionProducto[]) - Validaciones realizadas por el admin

### ValidacionProducto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la validación |
| productoId | Int | ID del producto que se está validando |
| errorDescripcion | String | Descripción del error encontrado |
| estado | String @default("Pendiente") @db.VarChar(20) | Estado de la validación ("Pendiente", etc.) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación de la validación |
| fechaResolucion | DateTime? | Fecha de resolución de la validación (opcional) |
| adminId | Int? | ID del administrador que resolvió la validación (opcional) |

**Relaciones**:
- producto (Producto) - Producto relacionado con la validación
- admin (Usuario?) - Administrador que procesó la validación

## Tablas de Referencia Administradas

### UnidadesMedida

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la unidad de medida |
| valor | String @db.VarChar(20) @unique | Valor único que representa la unidad (ej. "kg", "l") |
| descripcion | String @db.VarChar(100) | Descripción de la unidad de medida |

**Relaciones**:
- productos (Producto[]) - Productos que utilizan esta unidad
- ingredientes (Ingrediente[]) - Ingredientes que utilizan esta unidad

### Etiqueta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la etiqueta |
| valor | String @db.VarChar(20) @unique | Valor único que representa la etiqueta |
| descripcion | String @db.VarChar(100) | Descripción de la etiqueta |

**Relaciones**:
- productos (Producto[]) - Productos con esta etiqueta

### MetodoObtencion

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del método |
| valor | String @db.VarChar(20) @unique | Valor único que representa el método |
| descripcion | String @db.VarChar(100) | Descripción del método |
| usoTipico | String? @db.VarChar(100) | Uso típico del método (opcional) |

**Relaciones**:
- supermercados (Supermercado[]) - Supermercados que utilizan este método
- precios (Precio[]) - Precios obtenidos con este método
- historialPrecios (HistorialPrecio[]) - Registros históricos con este método

### SexoGenero

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| valor | String @db.VarChar(20) @unique | Valor único que representa el sexo/género |
| descripcion | String @db.VarChar(50) | Descripción del sexo/género |

**Relaciones**:
- usuarios (Usuario[]) - Usuarios con este sexo/género
- miembrosHogar (MiembroHogar[]) - Miembros de hogar con este sexo/género

### NivelPrivacidad

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| valor | String @db.VarChar(20) @unique | Valor único que representa el nivel de privacidad |
| descripcion | String @db.VarChar(50) | Descripción del nivel de privacidad |

**Relaciones**:
- listas (Lista[]) - Listas con este nivel de privacidad

### TipoMascota

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| valor | String @db.VarChar(20) @unique | Valor único que representa el tipo de mascota |
| descripcion | String @db.VarChar(50) | Descripción del tipo de mascota |

**Relaciones**:
- mascotas (Mascota[]) - Mascotas de este tipo

### ModoLista

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| valor | String @db.VarChar(20) @unique | Valor único que representa el modo de lista |
| descripcion | String @db.VarChar(50) | Descripción del modo de lista |

**Relaciones**:
- listas (Lista[]) - Listas con este modo
- preferenciasUsuario (PreferenciasUsuario[]) - Preferencias de usuario con este modo

## Catálogo de Productos

### Categoria

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| nombre | String @db.VarChar(100) | Nombre de la categoría |
| descripcion | String? @db.VarChar(640) | Descripción de la categoría (opcional) |
| categoriaPadreId | Int? | ID de la categoría padre (opcional) |
| imagenUrl | String? @db.VarChar(500) | URL de la imagen (opcional) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación |
| fechaActualizacion | DateTime @default(now()) | Fecha de última actualización |
| activo | Boolean @default(true) | Indica si la categoría está activa |

**Relaciones**:
- categoriaPadre (Categoria?) - Categoría padre
- subcategorias (Categoria[]) - Subcategorías
- tiposProducto (TipoProducto[]) - Tipos de producto en esta categoría
- usuariosInteresados (Usuario[]) - Usuarios interesados en esta categoría

### TipoProducto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| nombre | String @db.VarChar(250) | Nombre del tipo de producto |
| categoriaId | Int | ID de la categoría a la que pertenece |
| imagenUrl | String? @db.VarChar(500) | URL de la imagen (opcional) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación |
| fechaActualizacion | DateTime @default(now()) | Fecha de última actualización |
| activo | Boolean @default(true) | Indica si el tipo de producto está activo |

**Relaciones**:
- categoria (Categoria) - Categoría a la que pertenece
- productos (Producto[]) - Productos de este tipo
- ingredientes (Ingrediente[]) - Ingredientes de este tipo
- interaccionesUsuario (InteraccionUsuario[]) - Interacciones de usuarios con este tipo

### Marca

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| nombre | String @db.VarChar(100) | Nombre de la marca |
| logoUrl | String? @db.VarChar(500) | URL del logo (opcional) |
| esMarcaBlanca | Boolean @default(false) | Indica si es una marca blanca |
| fechaCreacion | DateTime @default(now()) | Fecha de creación |
| activo | Boolean @default(true) | Indica si la marca está activa |

**Relaciones**:
- productos (Producto[]) - Productos de esta marca
- usuariosPreferidos (Usuario[]) - Usuarios que prefieren esta marca
- usuariosEvitados (Usuario[]) - Usuarios que evitan esta marca

### Producto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| nombre | String @db.VarChar(200) | Nombre del producto |
| marcaId | Int | ID de la marca |
| tipoProductoId | Int | ID del tipo de producto |
| tamanoCantidad | Decimal | Tamaño o cantidad del producto |
| unidadMedidaId | Int | ID de la unidad de medida |
| fotoUrl | String? @db.VarChar(500) | URL de la foto (opcional) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación |
| fechaActualizacion | DateTime @default(now()) | Fecha de última actualización |
| fechaDesactivado | DateTime? | Fecha de desactivación (opcional) |
| descontinuado | Boolean @default(false) | Indica si el producto está descontinuado |

**Relaciones**:
- marca (Marca) - Marca del producto
- tipoProducto (TipoProducto) - Tipo de producto
- unidadMedida (UnidadesMedida) - Unidad de medida
- etiquetas (Etiqueta[]) - Etiquetas asociadas
- precios (Precio[]) - Precios actuales
- historialPrecios (HistorialPrecio[]) - Historial de precios
- usuariosInteresados (Usuario[]) - Usuarios interesados
- elementosLista (ElementoLista[]) - Elementos de lista que incluyen este producto
- validaciones (ValidacionProducto[]) - Validaciones de este producto
- interaccionesUsuario (InteraccionUsuario[]) - Interacciones de usuarios con este producto

### Supermercado

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| nombre | String @db.VarChar(100) | Nombre del supermercado |
| logoUrl | String? @db.VarChar(500) | URL del logo (opcional) |
| sitioWeb | String? @db.VarChar(255) | URL del sitio web (opcional) |
| directorioCsv | String? @db.VarChar(255) | Directorio de archivos CSV (opcional) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación |
| fechaUltimoProcesamiento | DateTime? | Fecha del último procesamiento de datos (opcional) |
| metodoObtencionId | Int | ID del método de obtención de datos |
| frecuenciaActualizacion | String? @db.VarChar(50) | Frecuencia de actualización (opcional) |
| activo | Boolean @default(true) | Indica si el supermercado está activo |

**Relaciones**:
- metodoObtencion (MetodoObtencion) - Método de obtención de datos
- precios (Precio[]) - Precios en este supermercado
- historialPrecios (HistorialPrecio[]) - Historial de precios
- usuariosFavoritos (Usuario[]) - Usuarios que lo tienen como favorito

## Gestión de Precios

### Precio

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| productoId | Int | ID del producto |
| supermercadoId | Int | ID del supermercado |
| precioActual | Int | Precio actual |
| esOferta | Boolean @default(false) | Indica si es precio de oferta |
| precioPromocional | Int? | Precio promocional (opcional) |
| fechaInicioPromocion | DateTime? | Fecha de inicio de promoción (opcional) |
| fechaFinPromocion | DateTime? | Fecha de fin de promoción (opcional) |
| fechaActualizacion | DateTime @default(now()) | Fecha de actualización |
| metodoObtencionId | Int | ID del método de obtención |

**Relaciones**:
- producto (Producto) - Producto relacionado
- supermercado (Supermercado) - Supermercado relacionado
- metodoObtencion (MetodoObtencion) - Método de obtención

### HistorialPrecio

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único |
| productoId | Int | ID del producto |
| supermercadoId | Int | ID del supermercado |
| precio | Int | Precio histórico |
| esOferta | Boolean | Indica si era precio de oferta |
| precioPromocional | Int? | Precio promocional histórico (opcional) |
| fechaRegistro | DateTime @default(now()) | Fecha del registro histórico |
| metodoObtencionId | Int | ID del método de obtención |

**Relaciones**:
- producto (Producto) - Producto relacionado
- supermercado (Supermercado) - Supermercado relacionado
- metodoObtencion (MetodoObtencion) - Método de obtención

## Funcionalidades Administrativas

### Gestión de Usuarios
- Creación y gestión de cuentas de administrador
- Bloqueo/desbloqueo de usuarios
- Asignación de roles (a través de TipoUsuario)

### Validación de Datos
- Revisión y corrección de productos mediante ValidacionProducto
- Sistema de aprobación de contenido

### Mantenimiento de Tablas de Referencia
- Administración de todas las tablas de referencia (UnidadesMedida, Etiqueta, etc.)
- Actualización de valores y descripciones

### Gestión del Catálogo
- Administración completa de productos, categorías, tipos y marcas
- Control de ciclo de vida de productos (activación/desactivación)

### Monitoreo de Precios
- Configuración de métodos de obtención de precios
- Seguimiento de historial y cambios de precios
- Supervisión de datos de ofertas

## Rutas Administrativas

Las páginas administrativas se encuentran en:
```
src/app/(admin)/
```

Siguiendo la convención establecida para la estructura del proyecto. 