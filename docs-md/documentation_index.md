# Índice de Documentación de Super Lista

Este documento cataloga el contenido de cada archivo de documentación del proyecto Super Lista, facilitando la navegación y evitando duplicaciones.

## Documentación Existente

| Archivo | Contenido Principal | Tablas Documentadas | Características Documentadas |
|---------|---------------------|---------------------|------------------------------|
| [`admin-documentation.md`](./admin-documentation.md) | Panel de administración, tablas administrativas y gestión del catálogo | TipoUsuario, Usuario (admin), ValidacionProducto, UnidadesMedida, Etiqueta, MetodoObtencion, SexoGenero, NivelPrivacidad, TipoMascota, ModoLista, Categoria, TipoProducto, Marca, Producto, Supermercado, Precio, HistorialPrecio | Gestión de usuarios, validación de datos, mantenimiento de tablas de referencia, gestión del catálogo, monitoreo de precios |
| [`analytics-documentation.md`](./analytics-documentation.md) | Análisis y seguimiento, integración con PostHog | InteraccionUsuario | Implementación de PostHog, seguimiento de eventos, reportes y análisis, privacidad y consentimiento |
| [`auth-documentation.md`](./auth-documentation.md) | Sistema de autenticación y seguridad | Usuario (autenticación) | Métodos de autenticación, gestión de sesiones, control de acceso, flujos de seguridad, integración con frontend |
| [`shopping-lists-documentation.md`](./shopping-lists-documentation.md) | Funcionalidad de listas de compra | Lista, ElementoLista, ModoLista, NivelPrivacidad | Ciclo de vida de listas, estados, plantillas, gestión de elementos, privacidad y compartición, optimización de compras |
| [`recipes-documentation.md`](./recipes-documentation.md) | Sistema de recetas | Receta, Ingrediente, RestriccionAlimentaria | Estados de recetas, flujo de creación, búsqueda y filtrado, integración con listas de compra, aspectos nutricionales |
| [`unused-files-analysis.md`](./unused-files-analysis.md) | Análisis de archivos no utilizados | N/A | Evaluación de código no utilizado |

## Modelo de Datos por Dominio

### Administración
- **Ubicación**: `admin-documentation.md`
- **Tablas principales**: TipoUsuario, Usuario (admin), ValidacionProducto
- **Funcionalidades**: Gestión de usuarios, validación de datos

### Catálogo de Productos
- **Ubicación**: `admin-documentation.md`
- **Tablas principales**: Categoria, TipoProducto, Marca, Producto
- **Funcionalidades**: Gestión completa del catálogo

### Precios
- **Ubicación**: `admin-documentation.md`
- **Tablas principales**: Precio, HistorialPrecio, Supermercado
- **Funcionalidades**: Seguimiento y análisis de precios

### Analítica
- **Ubicación**: `analytics-documentation.md`
- **Tablas principales**: InteraccionUsuario
- **Funcionalidades**: Seguimiento de comportamiento, análisis de patrones

### Autenticación
- **Ubicación**: `auth-documentation.md`
- **Tablas principales**: Usuario (campos de autenticación)
- **Funcionalidades**: Login, registro, seguridad, gestión de sesiones

### Listas de Compra
- **Ubicación**: `shopping-lists-documentation.md`
- **Tablas principales**: Lista, ElementoLista
- **Funcionalidades**: Gestión de listas, colaboración, seguimiento de compras

### Recetas
- **Ubicación**: `recipes-documentation.md`
- **Tablas principales**: Receta, Ingrediente
- **Funcionalidades**: Gestión de recetas, integración con listas, planificación

### Tablas de Referencia
- **Ubicación**: `admin-documentation.md`
- **Tablas principales**: UnidadesMedida, Etiqueta, MetodoObtencion, SexoGenero, NivelPrivacidad, TipoMascota, ModoLista
- **Funcionalidades**: Gestión de datos maestros

## Verificación de Duplicación

Se ha revisado la documentación para asegurar que no existe duplicación de contenido:

1. Las tablas relacionadas con autenticación se documentan únicamente en `auth-documentation.md`
2. Las tablas y funcionalidades de listas de compra se documentan exclusivamente en `shopping-lists-documentation.md`
3. Las tablas y funcionalidades del sistema de recetas se documentan solo en `recipes-documentation.md`
4. La tabla `InteraccionUsuario` se documenta únicamente en `analytics-documentation.md`
5. Las tablas administrativas y de catálogo se documentan únicamente en `admin-documentation.md`
6. Cada documento se enfoca en su dominio específico sin solaparse con otros

## Documentación Adicional

Documentación que se podría crear en el futuro:

1. **Documentación de hogares**: Sistema de hogares, miembros y mascotas en `households-documentation.md`
2. **Documentación de API**: Documentación técnica de endpoints en `api-documentation.md`
3. **Documentación para desarrolladores**: Guías de desarrollo en `developer-docs/`
4. **Documentación de UI/UX**: Componentes y diseño en `ui-documentation.md`
