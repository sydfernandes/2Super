import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <p className="lead mb-6">
          En Super Lista, accesible desde super-lista.es, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de información que se recopilan y registran por Super Lista y cómo la utilizamos.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Información que recopilamos</h2>
        <p>
          Cuando te registras en nuestro sitio, como parte del proceso, recopilamos la información personal que nos proporcionas, como tu nombre y dirección de correo electrónico.
        </p>
        <p>
          Tu información personal será utilizada solo para los motivos específicos indicados anteriormente, a menos que obtengamos tu consentimiento para usarla por otras razones.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Archivos de registro</h2>
        <p>
          Super Lista sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto como parte de los servicios de análisis. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida, y posiblemente el número de clics. Estos no están vinculados a ninguna información que sea personalmente identificable. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Cookies y web beacons</h2>
        <p>
          Como cualquier otro sitio web, Super Lista utiliza 'cookies'. Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes y las páginas del sitio web que el visitante accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web en función del tipo de navegador de los visitantes y otra información.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Políticas de privacidad de socios publicitarios</h2>
        <p>
          Puedes consultar esta lista para encontrar la Política de Privacidad de cada uno de los socios publicitarios de Super Lista.
        </p>
        <p>
          Los servidores de anuncios o redes publicitarias de terceros utilizan tecnologías como cookies, JavaScript o Web Beacons que se utilizan en sus respectivos anuncios y enlaces que aparecen en Super Lista, que se envían directamente al navegador de los usuarios. Reciben automáticamente tu dirección IP cuando esto ocurre. Estas tecnologías se utilizan para medir la efectividad de sus campañas publicitarias y/o para personalizar el contenido publicitario que ves en los sitios web que visitas.
        </p>
        <p>
          Ten en cuenta que Super Lista no tiene acceso ni control sobre estas cookies que utilizan anunciantes de terceros.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Políticas de privacidad de terceros</h2>
        <p>
          La Política de Privacidad de Super Lista no se aplica a otros anunciantes o sitios web. Por lo tanto, te aconsejamos que consultes las respectivas Políticas de Privacidad de estos servidores de anuncios de terceros para obtener información más detallada. Puede incluir sus prácticas e instrucciones sobre cómo excluirse de ciertas opciones.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Información de menores</h2>
        <p>
          Otra parte de nuestra prioridad es añadir protección para los niños mientras usan Internet. Animamos a los padres y tutores a observar, participar y/o monitorear y guiar su actividad en línea.
        </p>
        <p>
          Super Lista no recopila a sabiendas ninguna información de identificación personal de niños menores de 13 años. Si crees que tu hijo proporcionó este tipo de información en nuestro sitio web, te recomendamos encarecidamente que te pongas en contacto con nosotros de inmediato y haremos nuestros mejores esfuerzos para eliminar prontamente dicha información de nuestros registros.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Consentimiento</h2>
        <p>
          Al utilizar nuestro sitio web, aceptas nuestra Política de Privacidad y estás de acuerdo con sus términos.
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