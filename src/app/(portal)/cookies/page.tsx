import Link from "next/link"

export default function CookiesPage() {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <p className="lead mb-6">
          Esta Política de Cookies explica qué son las cookies y cómo las utilizamos en Super Lista. Debes leer esta política para entender qué son las cookies, cómo las usamos, los tipos de cookies que utilizamos, la información que recopilamos usando cookies y cómo se utiliza esa información, y cómo controlar tus preferencias de cookies.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas un sitio web. Las cookies se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">¿Cómo utilizamos las cookies?</h2>
        <p>
          En Super Lista utilizamos cookies por varias razones, detalladas a continuación. Desafortunadamente, en la mayoría de los casos no existen opciones estándar de la industria para deshabilitar las cookies sin deshabilitar por completo la funcionalidad y características que agregan a este sitio. Se recomienda que dejes activadas todas las cookies si no estás seguro de si las necesitas o no, en caso de que se utilicen para proporcionar un servicio que utilizas.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Tipos de cookies que utilizamos</h2>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Cookies Esenciales</h3>
        <p>
          Estas cookies son necesarias para el funcionamiento básico de nuestro sitio web y no pueden ser desactivadas en nuestros sistemas. Normalmente solo se configuran en respuesta a acciones realizadas por ti que equivalen a una solicitud de servicios, como establecer tus preferencias de privacidad, iniciar sesión o completar formularios. Puedes configurar tu navegador para bloquear o alertarte sobre estas cookies, pero algunas partes del sitio no funcionarán correctamente.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Cookies de Rendimiento</h3>
        <p>
          Estas cookies nos permiten contar visitas y fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares y ver cómo se mueven los visitantes por el sitio. Toda la información que recogen estas cookies es agregada y, por tanto, anónima. Si no permites estas cookies, no sabremos cuándo has visitado nuestro sitio.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Cookies de Funcionalidad</h3>
        <p>
          Estas cookies permiten que el sitio proporcione una funcionalidad y personalización mejoradas. Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios hemos añadido a nuestras páginas. Si no permites estas cookies, es posible que algunos o todos estos servicios no funcionen correctamente.
        </p>
        
        <h3 className="text-lg font-medium mt-6 mb-3">Cookies de Publicidad</h3>
        <p>
          Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. Pueden ser utilizadas por esas empresas para construir un perfil de tus intereses y mostrarte anuncios relevantes en otros sitios. No almacenan directamente información personal, sino que se basan en la identificación única de tu navegador y dispositivo de internet. Si no permites estas cookies, experimentarás publicidad menos dirigida.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">¿Cómo puedes gestionar las cookies?</h2>
        <p>
          Puedes configurar tu navegador para que no acepte cookies, y la página web mencionada anteriormente te explica cómo eliminar las cookies de tu navegador. Sin embargo, en algunos casos, algunas funcionalidades de nuestro sitio web pueden no funcionar correctamente como resultado.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Cookies de terceros</h2>
        <p>
          En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. La siguiente sección detalla qué cookies de terceros podrías encontrar a través de este sitio.
        </p>
        <ul className="list-disc pl-6 mt-4 mb-6">
          <li className="mb-2">Este sitio utiliza Google Analytics, una de las soluciones de análisis más extendidas y fiables en la web, para ayudarnos a entender cómo utilizas el sitio y las formas en que podemos mejorar tu experiencia. Estas cookies pueden rastrear cosas como el tiempo que pasas en el sitio y las páginas que visitas, para que podamos seguir produciendo contenido atractivo.</li>
          <li className="mb-2">De vez en cuando probamos nuevas funciones y hacemos cambios sutiles en la apariencia del sitio. Cuando todavía estamos probando nuevas funciones, estas cookies pueden usarse para asegurarnos de que recibas una experiencia consistente mientras estás en el sitio, mientras entendemos qué optimizaciones aprecian más nuestros usuarios.</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Más información</h2>
        <p>
          Esperamos que esto haya aclarado las cosas para ti y, como se mencionó anteriormente, si hay algo que no estás seguro de si necesitas o no, generalmente es más seguro dejar las cookies habilitadas en caso de que interactúen con una de las funciones que utilizas en nuestro sitio.
        </p>
        <p>
          Sin embargo, si todavía estás buscando más información, puedes contactarnos a través de uno de nuestros métodos de contacto preferidos.
        </p>
      </div>
      
      <div className="mt-10 pt-6 border-t">
        <Link href="/" className="text-primary hover:underline">
          Volver a la página principal
        </Link>
      </div>
    </div>
  )
} 