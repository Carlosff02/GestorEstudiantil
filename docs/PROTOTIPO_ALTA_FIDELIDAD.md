# Prototipo de Alta Fidelidad - StudySync

## Aplicación de Color, Tipografía y Affordances

### 1. Paleta de Colores

| Token | Color | Hex | Uso |
|-------|-------|-----|-----|
| `primary-500` | Indigo | `#6366f1` | Botones primarios, enlaces, acentos |
| `primary-600` | Indigo oscuro | `#4f46e5` | Hover de botones, headers |
| `primary-700` | Indigo más oscuro | `#4338ca` | Active/pressed de botones |
| `emerald-600` | Verde esmeralda | `#059669` | Botón de éxito/registro |
| `slate-900` | Pizarra oscura | `#0f172a` | Fondos oscuros (sidebar, login) |
| `slate-800` | Pizarra media | `#1e293b` | Texto principal |
| `slate-50` | Pizarra clara | `#f8fafc` | Fondos de input, superficies |
| `surface` | Blanco hueso | `#fafafa` | Fondo de página principal |
| `rose-500` | Rosa | `#f43f5e` | Badge de notificaciones, acciones destructivas |

### 2. Tipografía

- **Familia principal:** Inter (Google Fonts)
- **Escala tipográfica:**
  - `text-xs` → 0.75rem (12px) — etiquetas, metadatos
  - `text-sm` → 0.875rem (14px) — cuerpo secundario
  - `text-base` → 1rem (16px) — cuerpo principal
  - `text-lg` → 1.125rem (18px) — subtítulos
  - `text-xl` → 1.25rem (20px) — títulos de sección
  - `text-2xl` → 1.5rem (24px) — títulos principales
  - `text-3xl` → 1.875rem (30px) — grandes titulares

- **Pesos:** Light(300), Regular(400), Medium(500), Semibold(600), Bold(700), Black(900)

### 3. Affordances Visuales

| Elemento | Affordance | Implementación |
|----------|-----------|----------------|
| Botones primarios | Sombra `shadow-sm`, hover `bg-primary-700`, active `scale(0.98)` | Clases Tailwind + CSS |
| Enlaces de navegación | Hover con cambio de fondo `hover:bg-slate-800`, activo con color violeta | `routerLinkActive` |
| Cards (cursos, proyectos) | `shadow-sm` base, `hover:shadow-md`, borde sutil | Transiciones CSS |
| Inputs | Foco con anillo `focus:ring-2 focus:ring-primary-100`, borde `focus:border-primary-500` | Clases Tailwind |
| Botones de acción (timer) | Hover con cambio a violeta, foco visible con anillo | Transiciones CSS |
| Tareas Kanban | Cursor `grab`, escala en hover `scale-105`, opacidad al arrastrar | Clases CSS |

### 4. Estados de Interacción

| Estado | Botón Primario | Card Curso | Input | Enlace Nav |
|--------|---------------|------------|-------|------------|
| **Default** | `bg-primary-600` | `shadow-sm border` | `bg-slate-50 border` | `text-slate-400` |
| **Hover** | `bg-primary-700` | `shadow-md` | — | `bg-slate-800 text-white` |
| **Focus/Active** | `ring-2 ring-primary-400` | `ring-2` | `ring-2 ring-primary-100` | `ring-2 ring-violet-500` |
| **Pressed** | `scale(0.98)` | — | — | — |
| **Disabled** | `opacity-50 cursor-not-allowed` | — | `bg-slate-100` | — |

### 5. Componentes Visuales Clave

#### Login/Auth Portal
- Fondo degradado oscuro con blur
- Tarjeta centrada con `max-w-28rem`
- Tabs de formulario con indicador de borde inferior activo
- Campos con iconos Lucide a la izquierda

#### Sidebar
- Fondo `slate-900` con borde derecho `slate-700`
- Avatar circular con gradiente violeta
- Enlaces con iconos y texto, activo con fondo `violet-900/40`
- Timer widget en footer con borde sutil

#### Dashboard
- Métricas en grid responsive (1→2→3 columnas)
- Cards de sesiones del día con indicador de hora
- Botón "Ver horario completo" con enlace

#### Kanban Board
- Columnas con cabecera de color (círculo indicador)
- Cards de tareas con hover `shadow-md`
- Botones de movimiento (izquierda/derecha) visibles en hover
- Avatares de miembros superpuestos

### 6. Responsive Design

| Breakpoint | Layout |
|------------|--------|
| **< 640px** | Sidebar oculto (menú hamburguesa), grid 1 columna |
| **640px - 1024px** | Sidebar visible, grid 2 columnas |
| **> 1024px** | Sidebar fijo, grid 3 columnas, Kanban horizontal |
