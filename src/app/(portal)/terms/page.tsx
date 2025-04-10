import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Términos de Servicio</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Términos</h2>
        <p>
          Al acceder al sitio web en <Link href="/">super-lista.es</Link>, aceptas cumplir con estos términos de servicio, todas las leyes y regulaciones aplicables, y estás de acuerdo con que eres responsable del cumplimiento de las leyes locales aplicables.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Licencia de uso</h2>
        <p>
          Se concede permiso para utilizar temporalmente el software Super Lista solo para uso personal, no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia no puedes:
        </p>
        <ul className="list-disc pl-6 my-4">
          <li>Modificar o copiar los materiales</li>
          <li>Usar los materiales para cualquier propósito comercial</li>
          <li>Intentar descompilar o aplicar ingeniería inversa al software</li>
          <li>Transferir los materiales a otra persona o "duplicar" los materiales en cualquier otro servidor</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">3. Descargo de responsabilidad</h2>
        <p>
          Los materiales en Super Lista se proporcionan "tal cual". No ofrecemos garantías, expresas o implícitas, y por la presente rechazamos y negamos todas las demás garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular, o no infracción de propiedad intelectual u otra violación de derechos.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitaciones</h2>
        <p>
          En ningún caso Super Lista o sus proveedores serán responsables por daños (incluyendo, sin limitación, daños por pérdida de datos o beneficio, o debido a la interrupción del negocio) que surjan del uso o la imposibilidad de usar los materiales en Super Lista, incluso si Super Lista o un representante autorizado de Super Lista ha sido notificado oralmente o por escrito de la posibilidad de tales daños.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">5. Precisión de los materiales</h2>
        <p>
          Los materiales que aparecen en Super Lista podrían incluir errores técnicos, tipográficos o fotográficos. No garantizamos que cualquiera de los materiales en su sitio web sea preciso, completo o actual. Podemos realizar cambios a los materiales contenidos en su sitio web en cualquier momento sin previo aviso.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">6. Enlaces</h2>
        <p>
          Super Lista no ha revisado todos los sitios enlazados a su sitio web y no es responsable de los contenidos de tales sitios enlazados. La inclusión de cualquier enlace no implica aprobación por parte de Super Lista del sitio. El uso de cualquier sitio web enlazado es bajo el propio riesgo del usuario.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">7. Modificaciones</h2>
        <p>
          Super Lista puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.
        </p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">8. Ley aplicable</h2>
        <p>
          Estos términos y condiciones se rigen y se interpretan de acuerdo con las leyes de España y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en esa ubicación.
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