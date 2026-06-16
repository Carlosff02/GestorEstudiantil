# Guías de Estilo - StudySync

## Documentación de Botones, Iconos y Estados

### 1. Botones

#### Botón Primario
```html
<button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all
             focus:outline-none focus:ring-2 focus:ring-primary-400">
  Acción Principal
</button>
```
- **Background:** `#4f46e5` (primary-600)
- **Hover:** `#4338ca` (primary-700)
- **Active:** `scale(0.98)`
- **Focus:** `ring-2 ring-primary-400`
- **Disabled:** `opacity-50 cursor-not-allowed`
- **Border radius:** `0.75rem` (rounded-xl)
- **Padding:** 16px horizontal, 10px vertical

#### Botón Secundario / Outline
```html
<button class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors
             text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300">
  Cancelar
</button>
```
- **Border:** `1px solid #e2e8f0`
- **Hover:** `bg-slate-50`
- **Focus:** `ring-2 ring-slate-300`

#### Botón de Éxito (Registro)
```html
<button class="btn btn--success">
  <span>Crear Cuenta</span>
</button>
```
- **Background:** `#059669` (emerald-600)
- **Hover:** `#047857` (emerald-700)
- **Box shadow:** `0 4px 14px rgba(5, 150, 105, 0.30)`

#### Botón Destructivo (Eliminar)
```html
<button class="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors
             focus:outline-none focus:ring-2 focus:ring-rose-300">
  Eliminar
</button>
```
- **Text:** `#e11d48` (rose-600)
- **Hover background:** `#fff1f2` (rose-50)
- **Focus ring:** `ring-2 ring-rose-300`

#### Botón de Navegación (Sidebar)
```html
<a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400
          hover:bg-slate-800 hover:text-slate-100 transition-colors
          focus:outline-none focus:ring-2 focus:ring-violet-500">
```
- **Default:** text `#94a3b8` (slate-400)
- **Hover:** background `#1e293b` (slate-800), text white
- **Active:** background `#2e1f5e`, text `#a78bfa`

### 2. Estados de Botones

| Estado | Primario | Outline | Éxito | Destructivo |
|--------|----------|---------|-------|-------------|
| **Default** | `bg-primary-600 text-white shadow-sm` | `bg-white border text-slate-600` | `bg-emerald-600 text-white shadow-sm` | `text-rose-600` |
| **Hover** | `bg-primary-700` | `bg-slate-50` | `bg-emerald-700` | `bg-rose-50 text-rose-700` |
| **Focus** | `ring-2 ring-primary-400` | `ring-2 ring-slate-300` | `ring-2 ring-emerald-300` | `ring-2 ring-rose-300` |
| **Disabled** | `opacity-50 cursor-not-allowed` | `opacity-50` | `opacity-50` | `opacity-50` |

### 3. Iconos

- **Librería:** Lucide Icons (versión Angular: `lucide-angular`)
- **Tamaños estándar:**
  - Iconos en botones pequeños: 14-16px (`w-3.5 h-3.5`)
  - Iconos en enlaces de navegación: 20px (`w-5 h-5`)
  - Iconos decorativos: 24px (`w-6 h-6`)
  - Iconos de métricas: 20px (`w-5 h-5`)
- **Atributo obligatorio:** `aria-hidden="true"` para todos los iconos decorativos
- **Iconos usados en la app:**

| Icono | Componente | Ubicación |
|-------|-----------|-----------|
| `Layers` | StudySync | Logo sidebar, login header |
| `LayoutDashboard` | Dashboard | Navegación sidebar |
| `BookOpen` | Mis Cursos | Navegación sidebar |
| `Calendar` | Horario | Navegación sidebar + Kanban |
| `Briefcase` | Mis Proyectos | Navegación sidebar |
| `User` | Perfil | Sidebar + formularios |
| `Bell` | Notificaciones | Header principal |
| `Plus` | Añadir | Botones de creación |
| `Trash2` | Eliminar | Acciones destructivas |
| `ChevronLeft/Right` | Navegación | Movimiento Kanban |
| `ArrowLeft` | Volver | Cabeceras de detalle |
| `FileText` | Apuntes | Cards de curso |
| `Copy` / `Download` | Acciones | Editor de apuntes |

### 4. Estados (Hover, Activo, Error)

#### Estados de Input

| Estado | Estilo |
|--------|--------|
| **Default** | `bg-slate-50 border border-slate-200 rounded-xl` |
| **Focus** | `bg-white border-primary-500 ring-2 ring-primary-100` |
| **Error** | `border-red-300 ring-2 ring-red-100` |
| **Disabled** | `bg-slate-100 text-slate-400 cursor-not-allowed` |
| **Placeholder** | Color `#94a3b8` |

#### Estados de Card

| Estado | Curso/Proyecto Card |
|--------|-------------------|
| **Default** | `bg-white border border-slate-100 shadow-sm` |
| **Hover** | `shadow-md` |
| **Selected** | `border-primary-200 bg-primary-50 shadow-sm` |

#### Estados de Kanban Task Card

| Estado | Estilo |
|--------|--------|
| **Default** | `bg-white border border-slate-100 shadow-sm` |
| **Hover** | `border-slate-200 shadow-md` |
| **Dragging** | `opacity-50` |
| **Delete button** | `opacity-0 group-hover:opacity-100` |

### 5. Mensajes de Error

```html
<div class="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3" role="alert">
  <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true">...</svg>
  <div>
    <p class="text-sm font-semibold text-red-700">Título del Error</p>
    <p class="text-xs text-red-500 mt-1">Descripción del error.</p>
  </div>
</div>
```

- **Background:** `bg-red-50`
- **Border:** `border-red-200`
- **Icon:** `text-red-500`
- **Title:** `text-red-700 font-semibold`
- **Description:** `text-red-500`

### 6. Modales y Diálogos

```html
<div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
     role="dialog" aria-modal="true" [attr.aria-labelledby]="'modal-title'">
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-slate-100">
      <h3 id="modal-title">Título</h3>
      <button (click)="close()" aria-label="Cerrar">✕</button>
    </div>
    <!-- Content -->
    <div class="p-6">...</div>
    <!-- Footer -->
    <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
      <button class="...">Cancelar</button>
      <button class="...">Confirmar</button>
    </div>
  </div>
</div>
```

- **Overlay:** `bg-slate-900/60 backdrop-blur-sm`
- **Card:** `bg-white rounded-2xl shadow-xl`
- **Max width:** `max-w-lg` (32rem) o `max-w-md` (28rem)
- **Header border:** `border-b border-slate-100`
- **Footer background:** `bg-slate-50`
