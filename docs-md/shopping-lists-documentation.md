# Documentación de Listas de Compra

Este documento detalla la funcionalidad principal de listas de compra en Super Lista, incluyendo tablas relacionadas, flujos de trabajo y características.

## Tablas Relacionadas con Listas de Compra

### Lista

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la lista |
| nombre | String @db.VarChar(100) | Nombre de la lista de compra |
| usuarioId | Int? | ID del usuario propietario (opcional, para listas anónimas) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación de la lista |
| fechaModificacion | DateTime @default(now()) | Fecha de última modificación |
| modoListaId | Int | ID del modo de visualización/uso de la lista |
| enEdicion | Boolean @default(true) | Indica si la lista está en fase de edición |
| enCompra | Boolean @default(false) | Indica si la lista está en fase de compra activa |
| completada | Boolean @default(false) | Indica si la lista ha sido completada/finalizada |
| archivada | Boolean @default(false) | Indica si la lista está archivada |
| urlCompartir | String? @db.VarChar(255) | URL única para compartir la lista |
| esPublica | Boolean @default(false) | Indica si la lista es pública |
| esPlantilla | Boolean @default(false) | Indica si la lista es una plantilla reutilizable |
| listaPlantillaId | Int? | ID de la lista plantilla (si fue creada desde plantilla) |
| privacidadId | Int | ID del nivel de privacidad de la lista |

**Relaciones**:
- usuario (Usuario?) - Usuario propietario de la lista
- modoLista (ModoLista) - Modo de visualización/uso
- listaPlantilla (Lista?) - Lista plantilla origen
- listasDerivadas (Lista[]) - Listas creadas desde esta plantilla
- privacidad (NivelPrivacidad) - Nivel de privacidad
- elementos (ElementoLista[]) - Elementos/productos incluidos
- interaccionesUsuario (InteraccionUsuario[]) - Interacciones de usuarios

### ElementoLista

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del elemento |
| listaId | Int | ID de la lista a la que pertenece |
| productoId | Int | ID del producto añadido a la lista |
| cantidad | Decimal @default(1) | Cantidad del producto |
| comprado | Boolean @default(false) | Indica si el producto ya ha sido comprado |
| fechaAdicion | DateTime @default(now()) | Fecha de adición a la lista |
| fechaCompra | DateTime? | Fecha en que se marcó como comprado (opcional) |
| posicion | Int? | Posición ordenada en la lista (opcional) |

**Relaciones**:
- lista (Lista) - Lista a la que pertenece el elemento
- producto (Producto) - Producto relacionado

### ModoLista

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del modo |
| valor | String @db.VarChar(20) @unique | Valor único (ej. "compacto", "detallado") |
| descripcion | String @db.VarChar(50) | Descripción del modo de lista |

**Relaciones**:
- listas (Lista[]) - Listas que utilizan este modo
- preferenciasUsuario (PreferenciasUsuario[]) - Preferencias de usuarios

### NivelPrivacidad

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del nivel |
| valor | String @db.VarChar(20) @unique | Valor único (ej. "privado", "compartido", "público") |
| descripcion | String @db.VarChar(50) | Descripción del nivel de privacidad |

**Relaciones**:
- listas (Lista[]) - Listas con este nivel de privacidad

## Ciclo de Vida de una Lista

### Estados de Lista

1. **Creación**
   - Lista nueva con `enEdicion = true`
   - Puede ser creada desde cero o desde una plantilla (`listaPlantillaId`)

2. **Edición**
   - Estado por defecto para agregar/quitar productos
   - Elementos pueden ordenarse (`posicion`)
   - Modificaciones actualizan `fechaModificacion`

3. **Modo Compra**
   - Al activar compra, cambia a `enCompra = true`
   - Permite marcar elementos como comprados
   - Interfaz optimizada para uso durante compras

4. **Completada**
   - Lista finalizada con `completada = true`
   - Registro histórico de productos comprados
   - Datos valiosos para recomendaciones futuras

5. **Archivada**
   - Almacenamiento a largo plazo con `archivada = true`
   - Mantiene accesible para consultas históricas
   - No aparece en listas activas

### Plantillas

Las listas pueden ser:
- Marcadas como plantilla con `esPlantilla = true`
- Reutilizadas para crear nuevas listas (relacionadas mediante `listaPlantillaId`)
- Actualizadas para reflejar cambios en todas las listas derivadas

## Funcionalidades de Listas

### Gestión de Elementos

- Agregar productos desde catálogo
- Establecer cantidades personalizadas
- Ordenar elementos (manual o automático)
- Marcar elementos como comprados
- Historial de elementos frecuentes

### Privacidad y Compartición

Niveles de privacidad implementados:
- **Privado**: Solo visible para el creador
- **Compartido**: Accesible mediante URL específica (`urlCompartir`)
- **Público**: Visible para todos los usuarios 
- **Colaborativo**: Editable por múltiples usuarios

### Optimización de Compras

- Agrupación por categorías de productos
- Sugerencias basadas en historial
- Cálculo de totales aproximados
- Recordatorios de productos frecuentes olvidados

## Recurrencia y Automatización

- Creación automatizada de listas recurrentes
- Sugerencia de productos basada en frecuencia de compra
- Recordatorios personalizados según patrones de compra

## Integración con Otras Funcionalidades

- Conexión con recetas para crear listas automáticas
- Recomendaciones de supermercados según precios
- Optimización de rutas de compra
- Estadísticas y análisis de gastos 