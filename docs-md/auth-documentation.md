# Documentación del Sistema de Autenticación

Este documento detalla los procesos de autenticación, tablas relacionadas y flujos de seguridad en Super Lista.

## Tablas Relacionadas con Autenticación

### Usuario (Autenticación)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único del usuario |
| email | String @unique @db.VarChar(255) | Correo electrónico (identificador principal para login) |
| telefonoMovil | String? @db.VarChar(20) | Teléfono móvil para autenticación SMS (opcional) |
| autenticacionEmail | Boolean @default(true) | Indica si el usuario utiliza autenticación por email |
| autenticacionSms | Boolean @default(false) | Indica si el usuario utiliza autenticación por SMS |
| tokenAutenticacion | String? @db.VarChar(255) | Token actual de autenticación (JWT u otro) |
| activo | Boolean @default(true) | Indica si la cuenta está activa |
| bloqueado | Boolean @default(false) | Indica si la cuenta está bloqueada |
| tipoUsuarioId | Int | ID del tipo de usuario (niveles de acceso) |

**Relaciones de seguridad**:
- tipoUsuario (TipoUsuario) - Define el rol y permisos del usuario

## Tipos de Autenticación

Super Lista implementa múltiples métodos de autenticación:

### Autenticación por Email

Principal método de autenticación que sigue estos pasos:
1. El usuario ingresa su dirección de email
2. El sistema genera un link "magic link" con token único
3. El usuario recibe y hace clic en el link enviado por email
4. El sistema verifica el token y autentica al usuario
5. Se genera un token JWT para la sesión

### Autenticación por SMS (Opcional)

Método alternativo para usuarios que lo habilitan:
1. El usuario ingresa su número de teléfono móvil
2. El sistema genera un código OTP de un solo uso
3. El usuario recibe el código por SMS e ingresa en la app
4. El sistema verifica el código y autentica al usuario
5. Se genera un token JWT para la sesión

## Gestión de Sesiones

El sistema maneja sesiones mediante:
- Tokens JWT almacenados en el campo `tokenAutenticacion`
- Cookies seguras para persistencia entre sesiones
- Duración configurable de la sesión

## Control de Acceso

### Modelo de Permisos

El acceso a funcionalidades se controla mediante la relación con la tabla `TipoUsuario`:

| Tipo de Usuario | Nivel de Acceso |
|-----------------|-----------------|
| Usuario Estándar | Acceso a funcionalidades básicas de listas, productos y recetas |
| Usuario Premium | Acceso a funcionalidades avanzadas (análisis, plantillas) |
| Administrador | Acceso completo al panel administrativo y gestión del sistema |

### Rutas Protegidas

Las rutas se protegen según el tipo de usuario:
- Rutas públicas: `src/app/(portal)/`
- Rutas de autenticación: `src/app/(auth)/`
- Rutas de usuario registrado: `src/app/(app)/`
- Rutas administrativas: `src/app/(admin)/`

## Flujos de Seguridad

### Registro de Usuario

1. El usuario proporciona email y datos básicos
2. Validación de datos y formato de email
3. Verificación de unicidad del email
4. Creación del registro en `usuarios`
5. Envío de email de verificación

### Recuperación de Contraseña

Al utilizar autenticación sin contraseña (passwordless), el proceso de recuperación es similar al login:
1. El usuario solicita acceso con su email
2. Se envía un nuevo magic link/token
3. El usuario accede y establece una nueva sesión

### Bloqueo de Cuentas

La aplicación implementa medidas de seguridad:
- Bloqueo de cuenta tras múltiples intentos fallidos
- Campo `bloqueado` en la tabla `Usuario` para restringir acceso
- Proceso de desbloqueo mediante verificación de identidad

## Consideraciones de Seguridad

- Todos los tokens se generan con entropía suficiente
- Información sensible nunca se almacena en texto plano
- Implementación de protección CSRF en formularios
- Restricción de intentos de autenticación para prevenir ataques de fuerza bruta
- Headers HTTP de seguridad en respuestas

## Integración con el Frontend

- Formularios de autenticación implementados con React Hook Form
- Validación en cliente y servidor
- Feedback inmediato de errores de autenticación
- Redirección inteligente según el estado de autenticación 