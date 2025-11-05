# ComandaYa Landing Page

Landing page profesional para ComandaYa - Sistema de gestión de restaurantes con IA.

## 📁 Archivos incluidos

- `index.html` - Página principal
- `styles.css` - Estilos y diseño responsive
- `script.js` - Funcionalidades interactivas
- `logo.jpg` - Logo de ComandaYa
- `screenshot_home.png` - Captura de pantalla del home
- `screenshot_orden.png` - Captura de toma de pedidos
- `screenshot_marketplace.png` - Captura del marketplace

## 🚀 Cómo desplegar en GitHub Pages

### Opción 1: Usando la interfaz web de GitHub

1. **Crea un nuevo repositorio en GitHub**
   - Ve a https://github.com/new
   - Nombre sugerido: `comandaya-landing`
   - Puede ser público o privado

2. **Sube los archivos**
   - Haz clic en "Add file" > "Upload files"
   - Arrastra todos los archivos de esta carpeta
   - Haz commit de los cambios

3. **Activa GitHub Pages**
   - Ve a Settings > Pages
   - En "Source", selecciona "main" branch
   - Haz clic en "Save"
   - Tu sitio estará disponible en: `https://tu-usuario.github.io/comandaya-landing`

### Opción 2: Usando Git desde la terminal

```bash
# 1. Inicializa el repositorio
git init

# 2. Agrega todos los archivos
git add .

# 3. Haz el primer commit
git commit -m "Initial commit: ComandaYa landing page"

# 4. Conecta con tu repositorio en GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/comandaya-landing.git

# 5. Sube los archivos
git push -u origin main

# 6. Luego activa GitHub Pages desde Settings > Pages
```

## 🌐 Configurar dominio personalizado (comandaya.com)

1. **En tu proveedor de dominio** (donde compraste comandaya.com):
   - Agrega un registro CNAME que apunte a: `tu-usuario.github.io`
   - O agrega registros A que apunten a las IPs de GitHub:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

2. **En GitHub Pages**:
   - Ve a Settings > Pages > Custom domain
   - Ingresa: `comandaya.com` o `www.comandaya.com`
   - Habilita "Enforce HTTPS"

## ✏️ Personalización

### Cambiar textos
Edita el archivo `index.html` y busca las secciones que quieras modificar.

### Cambiar colores
Edita `styles.css` en la sección de variables CSS (`:root`):
```css
:root {
    --primary-yellow: #FFC107;
    --dark-yellow: #FFB300;
    --black: #1a1a1a;
    /* ... otros colores ... */
}
```

### Cambiar imágenes
Reemplaza los archivos de imagen manteniendo los mismos nombres, o actualiza las referencias en `index.html`.

### Cambiar video de YouTube
En `index.html`, busca la línea del iframe y cambia el ID del video:
```html
<iframe src="https://www.youtube-nocookie.com/embed/TU_VIDEO_ID?rel=0&modestbranding=1&playsinline=1" ...>
```

**⚠️ Solución de problemas con el video:**

Si el video de YouTube no se muestra correctamente (Error 153 u otros), verifica:

1. **Configuración del video en YouTube Studio:**
   - Ve a YouTube Studio → Tu video
   - Configuración → Opciones avanzadas
   - ✅ "Permitir inserción" debe estar activado
   - ✅ El video NO debe estar marcado como "Hecho para niños" (esto bloquea embeddings)
   - ✅ Verifica que no tenga restricciones de edad

2. **Privacidad del video:**
   - El video debe ser "Público" o "No listado"
   - "Privado" NO permite embeddings

3. **Restricciones de contenido:**
   - Si tiene música con copyright, algunos videos no se pueden embeber
   - Verifica en YouTube Studio si hay reclamaciones de derechos de autor

4. **Alternativa temporal:**
   Si el problema persiste, hay un botón de respaldo que abre el video directamente en YouTube.

### Configurar botón de descarga
Edita `script.js` en la sección de CTA buttons y actualiza con el link de tu app:
```javascript
window.location.href = 'https://play.google.com/store/apps/details?id=tu.app.id';
```

## 📱 Características de la landing page

✅ **Diseño responsive** - Se adapta a móviles, tablets y desktop
✅ **Optimizada para SEO** - Meta tags y estructura semántica
✅ **Animaciones suaves** - Efectos de scroll y hover
✅ **Video integrado** - YouTube embed responsive
✅ **Navegación fija** - Navbar que se esconde al hacer scroll
✅ **Secciones clave**:
   - Hero con estadísticas
   - Tres diferenciadores principales
   - Video demo
   - Características detalladas
   - Beneficios
   - Galería de screenshots
   - Testimonios
   - CTA (Call to Action)
   - Footer completo

## 🎨 Paleta de colores

- Amarillo principal: `#FFC107`
- Amarillo oscuro: `#FFB300`
- Negro: `#1a1a1a`
- Gris oscuro: `#2d2d2d`
- Gris claro: `#f5f5f5`
- Blanco: `#ffffff`

## 📊 Métricas y Analytics

Para agregar Google Analytics:

1. Obtén tu código de seguimiento de Google Analytics
2. Agrega este código antes del cierre de `</head>` en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛠️ Soporte

Si necesitas hacer cambios o tienes preguntas, los archivos están bien documentados y organizados.

### Estructura de carpetas recomendada para futuro:
```
comandaya-landing/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── images/
│   │   ├── logo.jpg
│   │   ├── screenshots/
│   │   └── icons/
│   └── videos/
├── README.md
└── .gitignore
```

## 📝 Licencia

© 2024 ComandaYa. Todos los derechos reservados.

---

**¡Tu landing page está lista para impresionar! 🚀**
