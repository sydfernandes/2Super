-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,

    CONSTRAINT "etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodos_obtencion" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "uso_tipico" VARCHAR(100),

    CONSTRAINT "metodos_obtencion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sexo_genero" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "sexo_genero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_privacidad" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "niveles_privacidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_mascota" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipos_mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modos_lista" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "modos_lista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_usuario" (
    "id" SERIAL NOT NULL,
    "valor" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,

    CONSTRAINT "tipos_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(640),
    "categoria_padre_id" INTEGER,
    "imagen_url" VARCHAR(500),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_producto" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(250) NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "imagen_url" VARCHAR(500),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "logo_url" VARCHAR(500),
    "es_marca_blanca" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "marca_id" INTEGER NOT NULL,
    "tipo_producto_id" INTEGER NOT NULL,
    "tamano_cantidad" DECIMAL(65,30) NOT NULL,
    "unidad_medida_id" INTEGER NOT NULL,
    "foto_url" VARCHAR(500),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_desactivado" TIMESTAMP(3),
    "descontinuado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supermercados" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "logo_url" VARCHAR(500),
    "sitio_web" VARCHAR(255),
    "directorio_csv" VARCHAR(255),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ultimo_procesamiento" TIMESTAMP(3),
    "metodo_obtencion_id" INTEGER NOT NULL,
    "frecuencia_actualizacion" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "supermercados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "precios" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "supermercado_id" INTEGER NOT NULL,
    "precio_actual" INTEGER NOT NULL,
    "es_oferta" BOOLEAN NOT NULL DEFAULT false,
    "precio_promocional" INTEGER,
    "fecha_inicio_promocion" TIMESTAMP(3),
    "fecha_fin_promocion" TIMESTAMP(3),
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_obtencion_id" INTEGER NOT NULL,

    CONSTRAINT "precios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_precios" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "supermercado_id" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "es_oferta" BOOLEAN NOT NULL,
    "precio_promocional" INTEGER,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_obtencion_id" INTEGER NOT NULL,

    CONSTRAINT "historial_precios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hogares" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100),
    "usuario_principal_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hogares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefono_movil" VARCHAR(20),
    "autenticacion_email" BOOLEAN NOT NULL DEFAULT true,
    "autenticacion_sms" BOOLEAN NOT NULL DEFAULT false,
    "fecha_nacimiento" DATE,
    "codigo_postal" VARCHAR(10),
    "sexo_id" INTEGER,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_conexion" TIMESTAMP(3),
    "token_autenticacion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "hogar_id" INTEGER,
    "tipo_usuario_id" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miembros_hogar" (
    "id" SERIAL NOT NULL,
    "hogar_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100),
    "sexo_id" INTEGER,
    "fecha_nacimiento" DATE,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "miembros_hogar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restricciones_alimentarias" (
    "miembro_id" INTEGER NOT NULL,
    "restriccion" VARCHAR(100) NOT NULL,

    CONSTRAINT "restricciones_alimentarias_pkey" PRIMARY KEY ("miembro_id","restriccion")
);

-- CreateTable
CREATE TABLE "mascotas" (
    "id" SERIAL NOT NULL,
    "hogar_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100),
    "tipo_mascota_id" INTEGER NOT NULL,
    "raza" VARCHAR(100),
    "fecha_nacimiento" DATE,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mascotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias_usuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "modo_lista_preferido_id" INTEGER,
    "notificaciones_ofertas" BOOLEAN NOT NULL DEFAULT true,
    "notificaciones_listas" BOOLEAN NOT NULL DEFAULT true,
    "notificaciones_recomendaciones" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "preferencias_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "usuario_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modo_lista_id" INTEGER NOT NULL,
    "en_edicion" BOOLEAN NOT NULL DEFAULT true,
    "en_compra" BOOLEAN NOT NULL DEFAULT false,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "archivada" BOOLEAN NOT NULL DEFAULT false,
    "url_compartir" VARCHAR(255),
    "es_publica" BOOLEAN NOT NULL DEFAULT false,
    "es_plantilla" BOOLEAN NOT NULL DEFAULT false,
    "lista_plantilla_id" INTEGER,
    "privacidad_id" INTEGER NOT NULL,

    CONSTRAINT "listas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elementos_lista" (
    "id" SERIAL NOT NULL,
    "lista_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "comprado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_adicion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_compra" TIMESTAMP(3),
    "posicion" INTEGER,

    CONSTRAINT "elementos_lista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recetas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "instrucciones" TEXT,
    "tiempo_preparacion" INTEGER,
    "dificultad" VARCHAR(20),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Draft',
    "usuario_id" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "id" SERIAL NOT NULL,
    "receta_id" INTEGER NOT NULL,
    "tipo_producto_id" INTEGER NOT NULL,
    "cantidad" DECIMAL(65,30) NOT NULL,
    "unidad_medida_id" INTEGER NOT NULL,

    CONSTRAINT "ingredientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacciones_usuario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo_evento" VARCHAR(50) NOT NULL,
    "producto_id" INTEGER,
    "tipo_producto_id" INTEGER,
    "lista_id" INTEGER,
    "detalles" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interacciones_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validaciones_productos" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "error_descripcion" TEXT NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_resolucion" TIMESTAMP(3),
    "admin_id" INTEGER,

    CONSTRAINT "validaciones_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductoEtiquetas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductoEtiquetas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioCategoriasInteres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioCategoriasInteres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioMarcasPreferidas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioMarcasPreferidas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioMarcasEvitadas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioMarcasEvitadas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioProductosInteres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioProductosInteres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UsuarioSupermercadosFavoritos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsuarioSupermercadosFavoritos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_valor_key" ON "unidades_medida"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_valor_key" ON "etiquetas"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_obtencion_valor_key" ON "metodos_obtencion"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "sexo_genero_valor_key" ON "sexo_genero"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "niveles_privacidad_valor_key" ON "niveles_privacidad"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_mascota_valor_key" ON "tipos_mascota"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "modos_lista_valor_key" ON "modos_lista"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_usuario_valor_key" ON "tipos_usuario"("valor");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_usuario_usuario_id_key" ON "preferencias_usuario"("usuario_id");

-- CreateIndex
CREATE INDEX "_ProductoEtiquetas_B_index" ON "_ProductoEtiquetas"("B");

-- CreateIndex
CREATE INDEX "_UsuarioCategoriasInteres_B_index" ON "_UsuarioCategoriasInteres"("B");

-- CreateIndex
CREATE INDEX "_UsuarioMarcasPreferidas_B_index" ON "_UsuarioMarcasPreferidas"("B");

-- CreateIndex
CREATE INDEX "_UsuarioMarcasEvitadas_B_index" ON "_UsuarioMarcasEvitadas"("B");

-- CreateIndex
CREATE INDEX "_UsuarioProductosInteres_B_index" ON "_UsuarioProductosInteres"("B");

-- CreateIndex
CREATE INDEX "_UsuarioSupermercadosFavoritos_B_index" ON "_UsuarioSupermercadosFavoritos"("B");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_producto" ADD CONSTRAINT "tipos_producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_tipo_producto_id_fkey" FOREIGN KEY ("tipo_producto_id") REFERENCES "tipos_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supermercados" ADD CONSTRAINT "supermercados_metodo_obtencion_id_fkey" FOREIGN KEY ("metodo_obtencion_id") REFERENCES "metodos_obtencion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios" ADD CONSTRAINT "precios_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios" ADD CONSTRAINT "precios_supermercado_id_fkey" FOREIGN KEY ("supermercado_id") REFERENCES "supermercados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios" ADD CONSTRAINT "precios_metodo_obtencion_id_fkey" FOREIGN KEY ("metodo_obtencion_id") REFERENCES "metodos_obtencion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_precios" ADD CONSTRAINT "historial_precios_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_precios" ADD CONSTRAINT "historial_precios_supermercado_id_fkey" FOREIGN KEY ("supermercado_id") REFERENCES "supermercados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_precios" ADD CONSTRAINT "historial_precios_metodo_obtencion_id_fkey" FOREIGN KEY ("metodo_obtencion_id") REFERENCES "metodos_obtencion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hogares" ADD CONSTRAINT "hogares_usuario_principal_id_fkey" FOREIGN KEY ("usuario_principal_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_sexo_id_fkey" FOREIGN KEY ("sexo_id") REFERENCES "sexo_genero"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "hogares"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tipo_usuario_id_fkey" FOREIGN KEY ("tipo_usuario_id") REFERENCES "tipos_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembros_hogar" ADD CONSTRAINT "miembros_hogar_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "hogares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miembros_hogar" ADD CONSTRAINT "miembros_hogar_sexo_id_fkey" FOREIGN KEY ("sexo_id") REFERENCES "sexo_genero"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restricciones_alimentarias" ADD CONSTRAINT "restricciones_alimentarias_miembro_id_fkey" FOREIGN KEY ("miembro_id") REFERENCES "miembros_hogar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "hogares"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_tipo_mascota_id_fkey" FOREIGN KEY ("tipo_mascota_id") REFERENCES "tipos_mascota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencias_usuario" ADD CONSTRAINT "preferencias_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencias_usuario" ADD CONSTRAINT "preferencias_usuario_modo_lista_preferido_id_fkey" FOREIGN KEY ("modo_lista_preferido_id") REFERENCES "modos_lista"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_modo_lista_id_fkey" FOREIGN KEY ("modo_lista_id") REFERENCES "modos_lista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_lista_plantilla_id_fkey" FOREIGN KEY ("lista_plantilla_id") REFERENCES "listas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas" ADD CONSTRAINT "listas_privacidad_id_fkey" FOREIGN KEY ("privacidad_id") REFERENCES "niveles_privacidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elementos_lista" ADD CONSTRAINT "elementos_lista_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elementos_lista" ADD CONSTRAINT "elementos_lista_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientes" ADD CONSTRAINT "ingredientes_receta_id_fkey" FOREIGN KEY ("receta_id") REFERENCES "recetas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientes" ADD CONSTRAINT "ingredientes_tipo_producto_id_fkey" FOREIGN KEY ("tipo_producto_id") REFERENCES "tipos_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredientes" ADD CONSTRAINT "ingredientes_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacciones_usuario" ADD CONSTRAINT "interacciones_usuario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacciones_usuario" ADD CONSTRAINT "interacciones_usuario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacciones_usuario" ADD CONSTRAINT "interacciones_usuario_tipo_producto_id_fkey" FOREIGN KEY ("tipo_producto_id") REFERENCES "tipos_producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacciones_usuario" ADD CONSTRAINT "interacciones_usuario_lista_id_fkey" FOREIGN KEY ("lista_id") REFERENCES "listas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validaciones_productos" ADD CONSTRAINT "validaciones_productos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validaciones_productos" ADD CONSTRAINT "validaciones_productos_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoEtiquetas" ADD CONSTRAINT "_ProductoEtiquetas_A_fkey" FOREIGN KEY ("A") REFERENCES "etiquetas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductoEtiquetas" ADD CONSTRAINT "_ProductoEtiquetas_B_fkey" FOREIGN KEY ("B") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCategoriasInteres" ADD CONSTRAINT "_UsuarioCategoriasInteres_A_fkey" FOREIGN KEY ("A") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioCategoriasInteres" ADD CONSTRAINT "_UsuarioCategoriasInteres_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMarcasPreferidas" ADD CONSTRAINT "_UsuarioMarcasPreferidas_A_fkey" FOREIGN KEY ("A") REFERENCES "marcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMarcasPreferidas" ADD CONSTRAINT "_UsuarioMarcasPreferidas_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMarcasEvitadas" ADD CONSTRAINT "_UsuarioMarcasEvitadas_A_fkey" FOREIGN KEY ("A") REFERENCES "marcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioMarcasEvitadas" ADD CONSTRAINT "_UsuarioMarcasEvitadas_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioProductosInteres" ADD CONSTRAINT "_UsuarioProductosInteres_A_fkey" FOREIGN KEY ("A") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioProductosInteres" ADD CONSTRAINT "_UsuarioProductosInteres_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioSupermercadosFavoritos" ADD CONSTRAINT "_UsuarioSupermercadosFavoritos_A_fkey" FOREIGN KEY ("A") REFERENCES "supermercados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsuarioSupermercadosFavoritos" ADD CONSTRAINT "_UsuarioSupermercadosFavoritos_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
