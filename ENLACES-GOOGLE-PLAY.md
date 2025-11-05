# 🔗 Enlaces a Google Play - Referencia Rápida

Tu link de Google Play ya está configurado en toda la landing page:
**https://play.google.com/store/apps/details?id=com.aplicacion.orderapp**

## 📍 Ubicaciones de los enlaces (por si necesitas cambiarlos)

### 1. Botón del Navbar (superior derecho)
**Archivo:** `index.html`  
**Línea:** ~29
```html
<a href="https://play.google.com/store/apps/details?id=com.aplicacion.orderapp" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="cta-button">Descargar App</a>
```

### 2. Hero Section - Botón "Descargar Ahora"
**Archivo:** `index.html`  
**Línea:** ~56
```html
<a href="https://play.google.com/store/apps/details?id=com.aplicacion.orderapp" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="btn-primary">Descargar Ahora</a>
```

### 3. Hero Section - Botón "Ver Demo"
**Archivo:** `index.html`  
**Línea:** ~57
```html
<a href="#video" class="btn-secondary">Ver Demo</a>
```
👉 Este va a la sección de video (no a Google Play)

### 4. CTA Final - Botón "Descargar Gratis"
**Archivo:** `index.html`  
**Línea:** ~332
```html
<a href="https://play.google.com/store/apps/details?id=com.aplicacion.orderapp" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="btn-primary-large">Descargar Gratis</a>
```

## 🎯 Cómo cambiar el link en el futuro

### Opción 1: Buscar y Reemplazar (RÁPIDO)
1. Abre `index.html` en tu editor
2. Presiona `Ctrl + H` (Windows) o `Cmd + H` (Mac)
3. **Buscar:** `https://play.google.com/store/apps/details?id=com.aplicacion.orderapp`
4. **Reemplazar con:** tu nuevo link
5. Clic en "Reemplazar todo"
6. ¡Listo! Se cambiará en todos los lugares a la vez

### Opción 2: Manual
1. Abre `index.html`
2. Busca con `Ctrl + F`: `play.google.com`
3. Te mostrará cada ubicación
4. Cambia el link uno por uno

## 📱 Qué significa cada parte del enlace

```
<a href="ENLACE" target="_blank" rel="noopener noreferrer" class="ESTILO">TEXTO</a>
```

- **href=** → El enlace (tu Google Play)
- **target="_blank"** → Abre en nueva pestaña
- **rel="noopener noreferrer"** → Seguridad (siempre déjalo)
- **class=** → El estilo del botón (no lo cambies)
- **TEXTO** → Lo que dice el botón (puedes cambiarlo)

## ✏️ Cambiar el texto de los botones

Si quieres que diga otra cosa en lugar de "Descargar Ahora":

```html
<!-- Antes -->
<a href="..." class="btn-primary">Descargar Ahora</a>

<!-- Después (ejemplo) -->
<a href="..." class="btn-primary">Obtener ComandaYa</a>
<a href="..." class="btn-primary">Instalar Gratis</a>
<a href="..." class="btn-primary">Pruébalo Ya</a>
```

## 🚀 Otros enlaces útiles

### Agregar botón de App Store (iOS)
Si en el futuro tienes app para iPhone, agrega esto junto al botón de Android:

```html
<a href="https://apps.apple.com/tu-app-id" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="btn-primary">
   Descargar en iOS
</a>
```

### Link directo al APK
Si quieres ofrecer descarga directa del APK:

```html
<a href="tu-servidor.com/comandaya.apk" 
   download 
   class="btn-secondary">
   Descargar APK
</a>
```

## ⚠️ IMPORTANTE

**NO elimines estas partes del enlace:**
- `target="_blank"` → Abre en nueva ventana
- `rel="noopener noreferrer"` → Protección de seguridad

**SÍ puedes cambiar:**
- El URL (href)
- El texto del botón
- La clase (para cambiar el color: btn-primary, btn-secondary, etc.)

## 🎨 Cambiar el color de un botón específico

Si quieres que un botón se vea diferente:

**Negro con texto blanco:**
```html
class="btn-primary"
```

**Blanco con borde:**
```html
class="btn-secondary"
```

**Amarillo (grande):**
```html
class="btn-primary-large"
```

---

**¿Necesitas cambiar algo más?** Solo dime y te ayudo. 😊
