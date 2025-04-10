import { prisma } from '../src/lib/db'

async function main() {
  // Example seed data for reference tables
  // UnidadesMedida (units of measure)
  const unidadesMedidaData = [
    { valor: 'unidad', descripcion: 'Unidad' },
    { valor: 'kg', descripcion: 'Kilogramo' },
    { valor: 'g', descripcion: 'Gramo' },
    { valor: 'l', descripcion: 'Litro' },
    { valor: 'ml', descripcion: 'Mililitro' }
  ]

  // Using createMany with skipDuplicates as a workaround
  await prisma.unidadesMedida.createMany({
    data: unidadesMedidaData,
    skipDuplicates: true, // Skip records that conflict with unique constraints
  })

  // TiposUsuario (user types)
  const tiposUsuarioData = [
    { valor: 'regular', descripcion: 'Usuario regular' },
    { valor: 'admin', descripcion: 'Administrador del sistema' },
    { valor: 'moderador', descripcion: 'Moderador de contenido' },
    { valor: 'comercial', descripcion: 'Usuario comercial' }
  ]

  await prisma.tipoUsuario.createMany({
    data: tiposUsuarioData,
    skipDuplicates: true,
  })

  // SexoGenero (gender)
  const sexoGeneroData = [
    { valor: 'masculino', descripcion: 'Masculino' },
    { valor: 'femenino', descripcion: 'Femenino' },
    { valor: 'no-binario', descripcion: 'No binario' },
    { valor: 'otro', descripcion: 'Otro' },
    { valor: 'prefiero-no-decir', descripcion: 'Prefiero no decir' }
  ]

  await prisma.sexoGenero.createMany({
    data: sexoGeneroData,
    skipDuplicates: true,
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 