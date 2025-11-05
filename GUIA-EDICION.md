# 📝 GUÍA DE EDICIÓN - ComandaYa Landing Page

Esta guía te muestra exactamente dónde y cómo editar textos e imágenes en tu landing page.

---

## 🖼️ CÓMO CAMBIAR IMÁGENES

### Opción 1: Reemplazar archivos (MÁS FÁCIL)
Simplemente reemplaza las imágenes existentes con tus nuevas imágenes, manteniendo el MISMO nombre:

- `logo.jpg` → Tu nuevo logo
- `screenshot_home.png` → Nueva captura del home
- `screenshot_orden.png` → Nueva captura de orden
- `screenshot_marketplace.png` → Nueva captura de marketplace

**Importante:** Mantén los mismos nombres de archivo y todo funcionará automáticamente.

### Opción 2: Cambiar referencias en index.html
Si quieres usar nombres diferentes, busca y reemplaza en `index.html`:

#### Logo (aparece 2 veces):
```html
<!-- En el navbar (línea ~27) -->
<img src="logo.jpg" alt="ComandaYa Logo" class="logo-img">

<!-- En el footer (línea ~318) -->
<img src="logo.jpg" alt="ComandaYa">
```

#### Hero Image (imagen principal):
```html
<!-- Línea ~83 aproximadamente -->
<img src="screenshot_home.png" alt="ComandaYa App" class="app-screenshot">
```

#### Imágenes en la sección de características:
```html
<!-- Primera característica (línea ~163) -->
<img src="screenshot_orden.png" alt="Toma de pedidos">

<!-- Segunda característica (línea ~182) -->
<img src="screenshot_home.png" alt="Control de cocina">

<!-- Tercera característica (línea ~201) -->
<img src="screenshot_marketplace.png" alt="Marketplace">
```

#### Galería (3 imágenes):
```html
<!-- Línea ~263 aproximadamente -->
<img src="screenshot_home.png" alt="Pantalla principal">
<img src="screenshot_orden.png" alt="Nueva orden">
<img src="screenshot_marketplace.png" alt="Marketplace">
```

---

## ✏️ CÓMO CAMBIAR TEXTOS

Aquí te muestro los textos principales y dónde encontrarlos en `index.html`:

### 🎯 HERO SECTION (Sección principal)

**Título principal (línea ~48):**
```html
<h1 class="hero-title">
    Gestiona tu restaurante con <span class="highlight">Inteligencia Artificial</span>
</h1>
```
👉 Cambia "Gestiona tu restaurante con" por lo que quieras

**Subtítulo (línea ~51):**
```html
<p class="hero-subtitle">
    La plataforma todo-en-uno que revoluciona la forma de operar tu restaurante. 
    Toma de pedidos, control de cocina y marketplace inteligente en una sola app.
</p>
```

**Estadísticas (líneas ~60-74):**
```html
<div class="stat">
    <span class="stat-number">3x</span>
    <span class="stat-label">Más rápido</span>
</div>
```
👉 Cambia "3x" y "Más rápido" por tus datos

---

### 🔑 DIFERENCIADORES (Líneas ~95-138)

**Título de sección:**
```html
<h2 class="section-title">¿Por qué ComandaYa?</h2>
```

**Diferenciador 1 - Facilidad (línea ~103):**
```html
<h3>Facilidad de Uso</h3>
<p>Interfaz intuitiva que tu equipo aprende en minutos...</p>
```

**Diferenciador 2 - Marketplace IA (línea ~112 - EL DESTACADO):**
```html
<h3>Marketplace con IA</h3>
<p>Nuestra inteligencia artificial conecta tu restaurante...</p>
```

**Diferenciador 3 - Tiempos (línea ~121):**
```html
<h3>Tiempos en Tiempo Real</h3>
<p>Sistema inteligente que calcula y muestra tiempos...</p>
```

---

### 🎥 VIDEO SECTION (Línea ~145)

```html
<h2 class="section-title">Mira ComandaYa en acción</h2>
<p class="section-subtitle">Descubre cómo funciona en menos de 2 minutos</p>
```

**Para cambiar el video:**
```html
<!-- Línea ~150 - Cambia solo el ID del video -->
<iframe src="https://www.youtube-nocookie.com/embed/TU_VIDEO_ID?rel=0...">
```
👉 Reemplaza `a_PVqAfoIj0` con el ID de tu nuevo video

---

### 📱 CARACTERÍSTICAS DETALLADAS (Líneas ~167-218)

**Característica 1 - Toma de Pedidos:**
```html
<h3>Toma de Pedidos Inteligente</h3>
<p>Captura pedidos de forma rápida y precisa...</p>
<ul class="feature-list">
    <li>✓ Búsqueda rápida de platillos</li>
    <li>✓ Categorización intuitiva</li>
    <!-- Puedes agregar o quitar items -->
</ul>
```

**Característica 2 - Control de Cocina:**
```html
<h3>Control Total de tu Cocina</h3>
<p>Visualiza todas las órdenes activas...</p>
```

**Característica 3 - Marketplace:**
```html
<h3>Marketplace Inteligente</h3>
<p>Encuentra proveedores cercanos, compara precios...</p>
```

---

### ✨ BENEFICIOS (Líneas ~228-265)

```html
<div class="benefit-card">
    <div class="benefit-icon">📊</div>
    <h4>Reduce costos</h4>
    <p>Ahorra hasta un 30% en compras gracias al marketplace comparador</p>
</div>
```

👉 Cambia el emoji, título y descripción de cada beneficio

**Iconos disponibles (cópialos y pega):**
📊 💰 ⚡ ❌ 😊 📈 🔒 🎯 💡 🚀 ⏱️ 📱 🏆 ✅

---

### 💬 TESTIMONIOS (Líneas ~283-318)

```html
<div class="testimonial-card">
    <div class="stars">★★★★★</div>
    <p class="testimonial-text">"ComandaYa transformó completamente nuestro restaurante..."</p>
    <div class="testimonial-author">
        <strong>María González</strong>
        <span>Restaurante El Sabor</span>
    </div>
</div>
```

👉 Cambia nombre, restaurante y texto del testimonio

---

### 📞 CALL TO ACTION FINAL (Línea ~327)

```html
<h2>¿Listo para revolucionar tu restaurante?</h2>
<p>Únete a los restaurantes más exitosos de Guatemala</p>
```

---

### 🦶 FOOTER (Líneas ~350-420)

**Información de contacto (línea ~373):**
```html
<li>📧 info@comandaya.com</li>
<li>📱 +502 1234-5678</li>
<li>📍 Guatemala, Guatemala</li>
```

**Redes sociales (línea ~391):**
```html
<div class="social-links">
    <a href="#" aria-label="Facebook">FB</a>
    <a href="#" aria-label="Instagram">IG</a>
    <a href="#" aria-label="Twitter">TW</a>
</div>
```
👉 Cambia "#" por tus URLs de redes sociales

---

## 🎨 CAMBIAR COLORES

Edita el archivo `styles.css` en las primeras líneas:

```css
:root {
    --primary-yellow: #FFC107;     /* 👈 Amarillo principal */
    --dark-yellow: #FFB300;        /* 👈 Amarillo oscuro */
    --black: #1a1a1a;              /* 👈 Negro */
    --dark-gray: #2d2d2d;          /* 👈 Gris oscuro */
    --light-gray: #f5f5f5;         /* 👈 Gris claro */
}
```

---

## 🔍 TIPS PARA BUSCAR EN EL CÓDIGO

### Si usas Visual Studio Code, Sublime, o cualquier editor:
- Presiona `Ctrl + F` (Windows) o `Cmd + F` (Mac)
- Escribe el texto que quieres cambiar
- Te llevará directo a esa línea

### Si usas Notepad++:
- `Ctrl + F` → Buscar
- `Ctrl + H` → Reemplazar (útil para cambiar algo en múltiples lugares)

---

## 📋 CHECKLIST DE PERSONALIZACIÓN

Usa esta lista para no olvidar nada:

- [ ] Logo en navbar y footer
- [ ] Título principal (Hero)
- [ ] Subtítulo y descripción
- [ ] Estadísticas (3x, 100%, 50+)
- [ ] Tres diferenciadores clave
- [ ] Video de YouTube (ID)
- [ ] Características detalladas (3 secciones)
- [ ] Beneficios (6 tarjetas)
- [ ] Imágenes de galería
- [ ] Testimonios (3 clientes)
- [ ] Información de contacto
- [ ] Links de redes sociales
- [ ] Email y teléfono en footer

---

## 🆘 ¿NECESITAS AYUDA?

Si algo no te sale o quieres que te ayude a cambiar algo específico, solo dime:
- ¿Qué texto quieres cambiar?
- ¿Qué imagen quieres poner?
- Te muestro exactamente dónde y cómo

---

**¡Listo! Con esta guía puedes personalizar todo sin problemas. 🚀**
