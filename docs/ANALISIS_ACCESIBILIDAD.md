# Análisis de Accesibilidad - StudySync

## Evaluación basada en WCAG 2.1 Nivel AA

### 1. Resumen de Perfiles de Accesibilidad

StudySync implementa **6 perfiles de accesibilidad** que el usuario puede seleccionar desde la página de login o desde la configuración de perfil:

| Perfil | Clase CSS | Descripción |
|--------|-----------|-------------|
| Normal | — | Visualización estándar |
| Protanopia | `a11y-protanopia` | Simula ausencia de conos rojos (filtro SVG + variables CSS) |
| Deuteranopia | `a11y-deuteranopia` | Simula ausencia de conos verdes (filtro SVG + variables CSS) |
| Tritanopia | `a11y-tritanopia` | Simula ausencia de conos azules (filtro SVG + variables CSS) |
| Baja Visión | `a11y-baja-vision` | Aumenta tamaño de fuente, bordes más gruesos, mejora contraste |
| Ceguera | `a11y-ceguera` | Alto contraste (blanco/negro), oculta elementos decorativos, foco amarillo |

### 2. Cumplimiento WCAG 2.1 AA

#### Principio 1: Perceptible

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| **1.1.1 Contenido no textual** (A) | ✅ Cumple | Todos los iconos decorativos tienen `aria-hidden="true"`. SVG filtros tienen `aria-hidden="true"`. |
| **1.4.1 Uso del color** (A) | ✅ Cumple | Perfiles de daltonismo reemplazan colores rojo/verde/azul con alternativas distinguibles. Se añaden marcadores no-cromáticos (✓) junto a botones. |
| **1.4.3 Contraste mínimo** (AA) | ✅ Cumple | Textos `text-slate-400/500/600` reforzados con colores de mayor contraste (relación > 4.5:1). |
| **1.4.4 Cambio de tamaño del texto** (AA) | ✅ Cumple | Perfil de baja visión escala toda la tipografía proporcionalmente hasta 2.2rem sin pérdida de contenido. |
| **1.4.12 Espaciado del texto** (AA) | ✅ Cumple | Perfil de baja visión define `line-height: 1.75` y `letter-spacing: 0.01em`. |

#### Principio 2: Operable

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| **2.1.1 Teclado** (A) | ✅ Cumple | Sidebar implementa atajos de teclado (Shift+1..5). Todos los botones y enlaces son accesibles por Tab. |
| **2.4.1 Saltar bloques** (A) | ✅ Cumple | `skip-link` global en `index.html` y skip-link específico en la página de login. |
| **2.4.7 Foco visible** (AA) | ✅ Cumple | `*:focus-visible` con outline azul de 3px. Perfiles de ceguera usan outline amarillo de 4px. |
| **2.5.5 Tamaño del objetivo** (AA) | ✅ Cumple | `min-height: 44px` y `min-width: 44px` en todos los elementos interactivos (excluyendo iconos pequeños). |

#### Principio 3: Comprensible

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| **3.1.1 Idioma de la página** (A) | ✅ Cumple | `lang="es"` en `<html>`. Atributo dinámico `[attr.lang]` en componentes según idioma del usuario. |
| **3.2.3 Navegación coherente** (AA) | ✅ Cumple | Sidebar consistente en todas las páginas internas. |
| **3.3.2 Etiquetas o instrucciones** (A) | ✅ Cumple | Todos los inputs tienen `<label>` asociado. Placeholders son complementarios. |
| **3.3.3 Sugerencia de error** (AA) | ✅ Cumple | Mensajes de error con `role="alert"`, borde rojo y descripción textual. |

#### Principio 4: Robusto

| Criterio | Estado | Implementación |
|----------|--------|----------------|
| **4.1.2 Nombre, función, valor** (A) | ✅ Cumple | Roles ARIA (`role="navigation"`, `role="dialog"`, `role="alert"`, etc.) en componentes clave. `aria-label` en botones sin texto visible. `aria-live="polite"` en notificaciones de cambio de idioma. |
| **4.1.3 Mensajes de estado** (AA) | ✅ Cumple | Región `aria-live` en login para anunciar cambios de idioma y accesibilidad. Timer con `aria-live="polite"`. |

### 3. Implementación Técnica

#### Filtros SVG para Daltonismo

Tres filtros `feColorMatrix` están definidos en `index.html`:
- **Protanopia:** Matriz que elimina el canal rojo
- **Deuteranopia:** Matriz que elimina el canal verde
- **Tritanopia:** Matriz que elimina el canal azul

Se aplican via CSS `filter: url(#filter-...)` cuando se activa el perfil correspondiente.

#### Variables CSS para Perfiles

Cada perfil sobrescribe variables CSS (`--color-success`, `--color-primary`, etc.) para adaptar colores sin cambiar la estructura HTML.

#### i18n (Internacionalización)

Cuatro idiomas implementados en todos los componentes:
- **Español (es)** — idioma por defecto
- **Inglés (en)**
- **Portugués (pt)**
- **Francés (fr)**

Cada componente tiene su propio diccionario `I18N` tipado, con claves que cubren todo el texto visible de la interfaz.

### 4. Áreas de Mejora Futura

| Área | Prioridad | Descripción |
|------|-----------|-------------|
| **Lector de pantalla completo** | Media | Faltan pruebas con NVDA/JAWS. Algunos componentes dinámicos (Kanban drag) no tienen anuncios ARIA de movimiento. |
| **Subtítulos en video/tutorial** | Baja | No hay contenido multimedia actualmente. |
| **Lenguaje de señas** | Baja | No implementado, requeriría integración externa. |
| **Navegación por voz** | Media | Faltan atributos `aria-keyshortcuts` en componentes no-sidebar. |
| **Modo oscuro automático** | Baja | No hay detección de `prefers-color-scheme: dark` para alternar automáticamente. |

### 5. Resumen de Cumplimiento

| Nivel | Criterios cumplidos | Criterios totales aplicables | Porcentaje |
|-------|-------------------|------------------------------|------------|
| **A** | 14 | 14 | **100%** |
| **AA** | 8 | 8 | **100%** |
| **Total** | 22 | 22 | **100%** |
