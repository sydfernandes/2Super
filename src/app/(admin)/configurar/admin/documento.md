# Documentación - Gestión de Usuarios Administradores

## Descripción General

El módulo de gestión de usuarios administradores permite la administración completa (CRUD) de las cuentas de usuarios con privilegios administrativos en la plataforma Super Lista. Esta funcionalidad se encuentra en la ruta `/configurar/acesso` dentro del panel de administración.

## Estructura de Archivos

- `src/app/(admin)/configurar/acesso/page.tsx`: Página principal de gestión de administradores
- `src/app/(admin)/configurar/acesso/[id]/page.tsx`: Página de detalle de un administrador específico

## Modelo de Datos

La gestión de administradores utiliza principalmente las siguientes entidades de la base de datos:

### Usuario

```prisma
model Usuario {
  id                Int              @id @default(autoincrement())
  nombre            String           @db.VarChar(100)
  email             String           @unique @db.VarChar(255)
  telefonoMovil     String?          @db.VarChar(20) @map("telefono_movil")
  autenticacionEmail Boolean         @default(true) @map("autenticacion_email")
  autenticacionSms  Boolean          @default(false) @map("autenticacion_sms")
  fechaNacimiento   DateTime?        @map("fecha_nacimiento") @db.Date
  codigoPostal      String?          @db.VarChar(10) @map("codigo_postal")
  sexoId            Int?             @map("sexo_id")
  fechaRegistro     DateTime         @default(now()) @map("fecha_registro")
  ultimaConexion    DateTime?        @map("ultima_conexion")
  tokenAutenticacion String?         @db.VarChar(255) @map("token_autenticacion")
  activo            Boolean          @default(true)
  bloqueado         Boolean          @default(false)
  hogarId           Int?             @map("hogar_id")
  tipoUsuarioId     Int              @map("tipo_usuario_id")
  
  // Relations
  tipoUsuario       TipoUsuario      @relation(fields: [tipoUsuarioId], references: [id])
  // ... otras relaciones
}
```

### TipoUsuario

```prisma
model TipoUsuario {
  id              Int              @id @default(autoincrement())
  valor           String           @db.VarChar(50) @unique
  descripcion     String           @db.VarChar(100)
  usuarios        Usuario[]

  @@map("tipos_usuario")
}
```

## Funcionalidades Principales

### Página de Gestión de Administradores (`page.tsx`)

Esta página proporciona una interfaz para gestionar a todos los usuarios administradores del sistema:

1. **Listar Administradores**:
   - Tabla con todos los usuarios de tipo administrador
   - Información básica: nombre, email, estado, último acceso
   - Paginación y ordenación de resultados
   - Filtrado por nombre o email

2. **Crear Nuevo Administrador**:
   - Formulario modal para crear un nuevo usuario administrador
   - Validación de campos requeridos (nombre, email)
   - Asignación automática del tipo de usuario "admin"

3. **Acciones Rápidas**:
   - Menú desplegable con acciones para cada administrador
   - Activar/Desactivar cuenta
   - Bloquear/Desbloquear cuenta
   - Eliminar cuenta (con confirmación)
   - Ver detalles del administrador

### Página de Detalle de Administrador (`[id]/page.tsx`)

Esta página permite ver y editar la información detallada de un administrador específico:

1. **Información Personal**:
   - Nombre, email, teléfono y otros datos personales
   - Formulario para editar esta información

2. **Seguridad**:
   - Estado de la cuenta (activo/inactivo)
   - Estado de bloqueo (bloqueado/desbloqueado)
   - Opciones de autenticación (email/SMS)

3. **Actividad**:
   - Registro de acciones realizadas por el administrador
   - Historial de inicios de sesión

4. **Permisos**:
   - Gestión de permisos específicos del administrador
   - Asignación de áreas de responsabilidad

## Operaciones de Base de Datos

### Consultas Principales

1. **Obtener todos los administradores**:
   ```typescript
   const adminTypeId = await prisma.tipoUsuario.findFirst({
     where: { valor: 'admin' },
   });
   
   const adminUsers = await prisma.usuario.findMany({
     where: {
       tipoUsuarioId: adminTypeId?.id,
     },
     include: {
       tipoUsuario: true,
     },
     orderBy: {
       nombre: 'asc',
     },
   });
   ```

2. **Obtener un administrador específico**:
   ```typescript
   const user = await prisma.usuario.findUnique({
     where: {
       id: userId,
     },
     include: {
       tipoUsuario: true,
     },
   });
   ```

3. **Crear un nuevo administrador**:
   ```typescript
   const adminTypeId = await prisma.tipoUsuario.findFirst({
     where: { valor: 'admin' },
   });
   
   const newAdmin = await prisma.usuario.create({
     data: {
       nombre: nombre,
       email: email,
       telefonoMovil: telefono,
       tipoUsuarioId: adminTypeId?.id || 0,
       activo: true,
     },
   });
   ```

4. **Actualizar un administrador existente**:
   ```typescript
   const updatedAdmin = await prisma.usuario.update({
     where: {
       id: userId,
     },
     data: {
       nombre: nombre,
       email: email,
       telefonoMovil: telefono,
       activo: activo,
       bloqueado: bloqueado,
     },
   });
   ```

5. **Eliminar un administrador**:
   ```typescript
   const deletedAdmin = await prisma.usuario.delete({
     where: {
       id: userId,
     },
   });
   ```

## Validaciones

1. **Email único**:
   - No se puede crear un administrador con un email que ya existe en el sistema

2. **Campos requeridos**:
   - Nombre y email son campos obligatorios
   - Se debe asignar el tipo de usuario "admin"

3. **Validación de estado**:
   - No se puede desactivar el último administrador del sistema
   - Se requiere confirmación para eliminar un administrador

## Seguridad

1. **Control de Acceso**:
   - Solo los usuarios con tipo "admin" pueden acceder a estas páginas
   - Se implementa verificación de permisos para operaciones sensibles

2. **Auditoría**:
   - Se registran todas las acciones de creación, modificación y eliminación
   - Se mantiene un historial de cambios de estado

## Interfaz de Usuario

La interfaz de usuario sigue los lineamientos de diseño de la aplicación:

1. **Componentes**:
   - Utiliza componentes de shadcn/ui para mantener consistencia
   - Diseño responsive para funcionar en diferentes dispositivos

2. **Usabilidad**:
   - Confirmaciones para acciones irreversibles
   - Mensajes de retroalimentación para cada operación
   - Diseño intuitivo con agrupación lógica de funciones

## Integración con el Sistema

El módulo de gestión de administradores se integra con:

1. **Sistema de Autenticación**:
   - Verifica permisos administrativos
   - Controla acceso al panel

2. **Registro de Actividad**:
   - Almacena acciones realizadas por los administradores
   - Proporciona trazabilidad de cambios

## Mejoras Futuras

Posibles mejoras para futuras versiones:

1. **Roles Personalizados**:
   - Permitir la creación de roles administrativos personalizados
   - Granularidad en la asignación de permisos

2. **Auditoría Avanzada**:
   - Sistema más detallado de registro de actividades
   - Reportes de actividad administrativa

3. **Autenticación Multi-Factor**:
   - Implementar 2FA para cuentas administrativas
   - Opciones adicionales de seguridad

4. **Gestión de Sesiones**:
   - Cierre forzado de sesiones activas
   - Limitación de sesiones concurrentes 