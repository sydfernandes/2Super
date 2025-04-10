# Documentación de Análisis y Seguimiento

Este documento detalla la implementación de las funcionalidades de análisis y seguimiento en Super Lista.

## PostHog Analytics

Super Lista utiliza PostHog como plataforma de análisis de comportamiento del usuario.

### Implementación

La implementación se realiza a través de un componente específico:

```typescript
// src/services/posthog.tsx
'use client';

import Script from 'next/script';
import React from 'react';

export const PostHogScript: React.FC = () => {
  return (
    <Script id="posthog-script" strategy="afterInteractive">
      {`
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('phc_NHRg2tiTMsgPO2eoFhXj54xQZ7g9oLIxcOdQjnw2nbV', {
            api_host: 'https://eu.i.posthog.com',
            person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        })
      `}
    </Script>
  );
};
```

Este componente se integra en el layout raíz de la aplicación (`src/app/layout.tsx`) para estar disponible globalmente.

### Configuración

- **API Key**: `phc_NHRg2tiTMsgPO2eoFhXj54xQZ7g9oLIxcOdQjnw2nbV`
- **Host**: `https://eu.i.posthog.com` (instancia europea)
- **Perfiles de persona**: `identified_only` (solo para usuarios identificados)

### Características de PostHog Utilizadas

- **Seguimiento de eventos**: Captación automática de pageviews y navegación
- **Identificación de usuarios**: Seguimiento de usuarios identificados
- **Funnel Analysis**: Análisis de conversión en flujos clave
- **Session Recording**: Posibilidad de activar grabación de sesiones

## Interacciones de Usuario (Base de Datos)

Además de PostHog, Super Lista realiza seguimiento interno en la base de datos mediante la tabla `InteraccionUsuario`.

### Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int @id @default(autoincrement()) | Identificador único de la interacción |
| usuarioId | Int | ID del usuario que realizó la interacción |
| tipoEvento | String @db.VarChar(50) | Tipo de evento/interacción registrada |
| productoId | Int? | ID del producto involucrado (opcional) |
| tipoProductoId | Int? | ID del tipo de producto involucrado (opcional) |
| listaId | Int? | ID de la lista involucrada (opcional) |
| detalles | Json? | Detalles adicionales en formato JSON (opcional) |
| fecha | DateTime @default(now()) | Fecha y hora de la interacción |

**Relaciones**:
- usuario (Usuario) - Usuario que realizó la interacción
- producto (Producto?) - Producto relacionado con la interacción (si aplica)
- tipoProducto (TipoProducto?) - Tipo de producto relacionado (si aplica)
- lista (Lista?) - Lista relacionada con la interacción (si aplica)

### Tipos de Eventos Registrados

Los eventos son almacenados en el campo `tipoEvento` y pueden incluir:
- Visualización de productos
- Adición de productos a listas
- Creación de listas
- Búsquedas
- Interacciones con el sistema

### Reportes y Análisis

Los datos recopilados a través de PostHog y la tabla de interacciones permiten:
- Análisis de comportamiento de usuario
- Seguimiento de conversiones
- Identificación de productos populares
- Optimización de la experiencia de usuario
- Detección de tendencias de compra

## Integración en el Panel Administrativo

La sección de análisis en el panel administrativo permite visualizar:
- Métricas clave de uso
- Estadísticas de interacción
- Productos más populares
- Patrones de compra
- Actividad de usuarios

## Privacidad y Consentimiento

La implementación respeta la privacidad del usuario mediante:
- Componente de Consentimiento de Cookies (`<CookieConsent />`)
- Opción de exclusión voluntaria del seguimiento
- Cumplimiento con RGPD mediante `person_profiles: 'identified_only'`

## Estructura del Proyecto

Las funcionalidades de análisis se estructuran en:
- `src/services/posthog.tsx`: Componente de integración con PostHog
- `src/services/index.ts`: Exportación de servicios de análisis
- Integración en `src/app/layout.tsx` para seguimiento global 