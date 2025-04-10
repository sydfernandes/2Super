import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Deshabilitar caché - SOLO PARA DESARROLLO
  staticPageGenerationTimeout: 1000, // Limitar el tiempo de generación de páginas estáticas
  onDemandEntries: {
    // tiempo de vida de la página en caché (en ms)
    // página se desecha después de 5 segundos (muy bajo valor)
    maxInactiveAge: 5 * 1000,
    // máximo de páginas en caché
    pagesBufferLength: 2,
  },
  
  // Opciones para imágenes
  images: {
    minimumCacheTTL: 0, // No cachear imágenes en el servidor
  },
  
  // Configuración de cabeceras HTTP para deshabilitar caché del navegador
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
