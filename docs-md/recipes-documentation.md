# Documentación del Sistema de Recetas

Este documento detalla el sistema de recetas en Super Lista, incluyendo tablas relacionadas, funcionalidades y flujos de trabajo.

## Tablas Relacionadas con Recetas

### Receta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la receta |
| nombre | String @db.VarChar(100) | Nombre de la receta |
| descripcion | String? | Descripción general de la receta (opcional) |
| instrucciones | String? | Pasos para preparar la receta (opcional) |
| tiempoPreparacion | Int? | Tiempo estimado de preparación en minutos (opcional) |
| dificultad | String? @db.VarChar(20) | Nivel de dificultad de la receta (opcional) |
| estado | String @default("Draft") @db.VarChar(20) | Estado de la receta ("Draft", "Published", etc.) |
| usuarioId | Int? | ID del usuario creador (opcional) |
| fechaCreacion | DateTime @default(now()) | Fecha de creación de la receta |
| fechaActualizacion | DateTime @default(now()) | Fecha de última actualización |

**Relaciones**:
- usuario (Usuario?) - Usuario creador de la receta
- ingredientes (Ingrediente[]) - Ingredientes necesarios para la receta

### Ingrediente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del ingrediente |
| recetaId | Int | ID de la receta a la que pertenece |
| tipoProductoId | Int | ID del tipo de producto (no específico de marca) |
| cantidad | Decimal | Cantidad necesaria del ingrediente |
| unidadMedidaId | Int | ID de la unidad de medida |

**Relaciones**:
- receta (Receta) - Receta a la que pertenece el ingrediente
- tipoProducto (TipoProducto) - Tipo genérico de producto
- unidadMedida (UnidadesMedida) - Unidad de medida del ingrediente

## Estados de Recetas

El sistema gestiona las recetas a través de varios estados:

| Estado | Descripción |
|--------|-------------|
| Draft | Receta en borrador, no visible públicamente |
| Published | Receta publicada, visible para todos los usuarios |
| Private | Receta privada, solo visible para el creador |
| Archived | Receta archivada, no aparece en búsquedas regulares |

## Flujo de Creación de Recetas

1. **Inicio**
   - Creación de receta con datos básicos (nombre, descripción)
   - Estado inicial "Draft"

2. **Definición de Ingredientes**
   - Adición de ingredientes con cantidades y unidades
   - Vinculación a tipos de producto genéricos (no a marcas específicas)

3. **Instrucciones**
   - Detalle de pasos de preparación
   - Opción de incluir tiempos por paso

4. **Metadatos**
   - Asignación de tiempo total, dificultad
   - Categorización por tipo de plato, dieta, etc.

5. **Publicación**
   - Cambio de estado a "Published" para compartir
   - Opción de mantener como "Private"

## Funcionalidades del Sistema de Recetas

### Búsqueda y Filtrado

- Búsqueda por nombre, ingredientes o características
- Filtros por tiempo de preparación, dificultad
- Filtros por disponibilidad de ingredientes en hogar

### Escalado de Recetas

- Ajuste automático de cantidades según número de porciones
- Conversión inteligente entre unidades de medida
- Cálculo proporcional de ingredientes

### Planificación de Comidas

- Agrupación de recetas en planes semanales
- Calendario de comidas programadas
- Automatización de listas de compra basadas en planes

## Integración con Listas de Compra

### Conversión Automática

El sistema permite convertir recetas en listas de compra mediante:
1. Selección de receta(s)
2. Especificación de número de porciones
3. Análisis de ingredientes disponibles vs. necesarios
4. Generación automática de lista con productos faltantes
5. Agrupación inteligente de productos similares

### Sustitución Inteligente

- Sugerencia de alternativas para ingredientes no disponibles
- Recomendación de productos específicos basados en preferencias
- Adaptación a restricciones alimentarias del hogar

## Recomendaciones Personalizadas

El sistema sugiere recetas basadas en:
- Historial de recetas favoritas
- Productos disponibles en el hogar
- Restricciones alimentarias registradas
- Preferencias de marcas y tipos de productos

## Aspectos Nutricionales

- Cálculo aproximado de valores nutricionales por porción
- Etiquetado de recetas según perfil nutricional
- Adaptación a dietas especiales (vegetariana, sin gluten, etc.)

## Funcionalidades Sociales

- Compartir recetas con otros usuarios
- Valoración y comentarios en recetas públicas
- Guardado de recetas favoritas
- Colecciones personalizadas de recetas

## Tablas Relacionadas Indirectamente

### RestriccionAlimentaria

Afecta a la recomendación de recetas según restricciones registradas en:
- Perfiles de miembros del hogar
- Preferencias generales del usuario 