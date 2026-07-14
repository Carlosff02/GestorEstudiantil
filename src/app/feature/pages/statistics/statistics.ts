import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LucideAngularModule,
  type LucideIconData,
  BookOpen,
  Clock,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  CalendarDays,
  ListTodo,
  Award,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
} from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { CoursesService } from '../../service/courses.service';
import { ProyectoService } from '../../service/proyecto.service';
import { PreferenciasService } from '../../../core/service/preferencias.service';
import { TareaProyectoResponse } from '../../types/project.type';
import { apiUrl } from '../../../environment/environmet';

type Idioma = 'es' | 'en' | 'pt' | 'fr';

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    titulo: 'Estadísticas',
    subtitulo: 'Resumen completo de tu actividad académica',
    promedioGeneral: 'Promedio General',
    creditos: 'Créditos',
    creditosPorCurso: 'Créditos por Curso',
    horasEstudio: 'Horas de Estudio',
    tareasCompletadas: 'Completadas',
    tareasPendientes: 'Pendientes',
    distribucionTareas: 'Distribución de Tareas',
    sesionesPorDia: 'Sesiones por Día de la Semana',
    evolucion: 'Evolución del Estudio',
    semanaPasada: 'vs. semana pasada',
    sinDatos: 'Sin datos disponibles',
    hrs: 'hrs',
    min: 'min',
    creditoObtenido: 'obtenidos',
    noData: 'Sin datos aún',
    cursos: 'Cursos',
    sesiones: 'sesiones',
    total: 'Total',
    creditosLabel: 'Créditos',
  },
  en: {
    titulo: 'Statistics',
    subtitulo: 'Complete overview of your academic activity',
    promedioGeneral: 'Average Grade',
    creditos: 'Credits',
    creditosPorCurso: 'Credits per Course',
    horasEstudio: 'Study Hours',
    tareasCompletadas: 'Completed',
    tareasPendientes: 'Pending',
    distribucionTareas: 'Task Distribution',
    sesionesPorDia: 'Sessions per Weekday',
    evolucion: 'Study Evolution',
    semanaPasada: 'vs. last week',
    sinDatos: 'No data available',
    hrs: 'hrs',
    min: 'min',
    creditoObtenido: 'earned',
    noData: 'No data yet',
    cursos: 'Courses',
    sesiones: 'sessions',
    total: 'Total',
    creditosLabel: 'Credits',
  },
  pt: {
    titulo: 'Estatísticas',
    subtitulo: 'Resumo completo da sua atividade acadêmica',
    promedioGeneral: 'Média Geral',
    creditos: 'Créditos',
    creditosPorCurso: 'Créditos por Curso',
    horasEstudio: 'Horas de Estudo',
    tareasCompletadas: 'Concluídas',
    tareasPendientes: 'Pendentes',
    distribucionTareas: 'Distribuição de Tarefas',
    sesionesPorDia: 'Sessões por Dia da Semana',
    evolucion: 'Evolução do Estudo',
    semanaPasada: 'vs. semana passada',
    sinDatos: 'Sem dados disponíveis',
    hrs: 'h',
    min: 'min',
    creditoObtenido: 'obtidos',
    noData: 'Sem dados ainda',
    cursos: 'Cursos',
    sesiones: 'sessões',
    total: 'Total',
    creditosLabel: 'Créditos',
  },
  fr: {
    titulo: 'Statistiques',
    subtitulo: "Aperçu complet de votre activité académique",
    promedioGeneral: 'Moyenne Générale',
    creditos: 'Crédits',
    creditosPorCurso: 'Crédits par Cours',
    horasEstudio: "Heures d'Étude",
    tareasCompletadas: 'Terminées',
    tareasPendientes: 'En attente',
    distribucionTareas: 'Répartition des Tâches',
    sesionesPorDia: 'Séances par Jour',
    evolucion: "Évolution de l'Étude",
    semanaPasada: 'vs. semaine dernière',
    sinDatos: 'Aucune donnée',
    hrs: 'h',
    min: 'min',
    creditoObtenido: 'obtenus',
    noData: 'Pas de données',
    cursos: 'Cours',
    sesiones: 'séances',
    total: 'Total',
    creditosLabel: 'Crédits',
  },
};

@Component({
  selector: 'app-statistics',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics {
  private readonly courseService = inject(CoursesService);
  private readonly authService = inject(AuthService);
  private readonly prefs = inject(PreferenciasService);
  private readonly proyectoService = inject(ProyectoService);
  private httpClient = inject(HttpClient);

  readonly BookOpenIcon: LucideIconData = BookOpen;
  readonly ClockIcon: LucideIconData = Clock;
  readonly BriefcaseIcon: LucideIconData = Briefcase;
  readonly CheckCircle2Icon: LucideIconData = CheckCircle2;
  readonly TrendingUpIcon: LucideIconData = TrendingUp;
  readonly TargetIcon: LucideIconData = Target;
  readonly ZapIcon: LucideIconData = Zap;
  readonly CalendarDaysIcon: LucideIconData = CalendarDays;
  readonly ListTodoIcon: LucideIconData = ListTodo;
  readonly AwardIcon: LucideIconData = Award;
  readonly TrendingDownIcon: LucideIconData = TrendingDown;
  readonly BarChart3Icon: LucideIconData = BarChart3;
  readonly PieChartIcon: LucideIconData = PieChart;
  readonly CalendarIcon: LucideIconData = Calendar;

  user = this.authService.userSignal;

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  courses = this.courseService.obtenerCursosPorUsuario(this.userIdComputed);
  proyectos = this.proyectoService.obtenerPorUsuarioId(this.userIdComputed);

  allTareas = signal<TareaProyectoResponse[]>([]);

  constructor() {
    effect(() => {
      const projs = this.proyectos.value();
      if (!projs || projs.length === 0) {
        this.allTareas.set([]);
        return;
      }
      Promise.all(
        projs.map(p =>
          firstValueFrom(this.httpClient.get<TareaProyectoResponse[]>(`${apiUrl}/tareas/${p.idProyecto}`))
        )
      ).then(results => this.allTareas.set(results.flat()));
    });

    const raw = this.loadUsageData();
    this.usageData.set(raw);
  }

  private loadUsageData(): Record<string, number> {
    try {
      const raw = localStorage.getItem('usage_data');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  private usageData = signal<Record<string, number>>({});

  private idioma = computed<Idioma>(() => {
    const uiIdioma = this.prefs.idioma();
    if (uiIdioma in I18N) return uiIdioma;
    const cuentaIdioma = this.user()?.idioma as Idioma;
    return cuentaIdioma && cuentaIdioma in I18N ? cuentaIdioma : 'es';
  });

  t = computed(() => I18N[this.idioma()]);

  // ─── 4 METRIC CARDS ───────────────────────────

  totalCursos = computed(() => this.courses.value()?.length ?? 0);

  promedioGeneral = computed(() => {
    const cursos = this.courses.value() ?? [];
    if (cursos.length === 0) return { valor: 0, pct: 0, delta: 0 };
    const mockGrades: Record<string, number> = {
      'CALCULO': 15, 'FISICA': 17, 'PROGRAMACION': 18, 'BASE DE DATOS': 16,
      'INGLES': 19, 'ESTRUCTURAS': 14, 'ALGEBRA': 13, 'QUIMICA': 15,
    };
    let sum = 0;
    cursos.forEach(c => {
      const key = Object.keys(mockGrades).find(k => c.nombre.toUpperCase().includes(k));
      sum += key ? mockGrades[key] : 15;
    });
    const avg = Math.round((sum / cursos.length / 20) * 100);
    return { valor: avg, pct: avg, delta: 0 };
  });

  totalCreditos = computed(() => {
    return this.courses.value()?.reduce((sum, c) => sum + (c.creditos ?? 0), 0) ?? 0;
  });

  tareasCompletadasCount = computed(() => {
    return this.allTareas().filter(t => t.estado === 'completado').length;
  });

  tareasPendientesCount = computed(() => {
    return this.allTareas().filter(t => t.estado !== 'completado').length;
  });

  horasEstudio = computed(() => {
    const data = this.usageData();
    const totalMin = Object.values(data).reduce((s, v) => s + v, 0);
    return Math.round((totalMin / 60) * 10) / 10;
  });

  horasDelta = computed(() => {
    const data = this.usageData();
    const now = new Date();
    const entries = Object.entries(data).map(([d, m]) => ({ date: new Date(d), mins: m }));
    const last7 = entries.filter(e => {
      const diff = (now.getTime() - e.date.getTime()) / 86400000;
      return diff >= 0 && diff < 7;
    }).reduce((s, e) => s + e.mins, 0);
    const prev7 = entries.filter(e => {
      const diff = (now.getTime() - e.date.getTime()) / 86400000;
      return diff >= 7 && diff < 14;
    }).reduce((s, e) => s + e.mins, 0);
    const pct = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : 0;
    return { last7, prev7, pct };
  });

  // ─── LINE CHART — Evolución del Estudio (usage_data) ───

  evolucionData = computed(() => {
    const data = this.usageData();
    const days: { dia: string; minutos: number }[] = [];
    const labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      days.push({ dia: labels[date.getDay()], minutos: Math.round(data[key] ?? 0) });
    }
    return days;
  });

  evolucionChart = computed(() => {
    const datos = this.evolucionData();
    const rawMax = Math.max(...datos.map(d => d.minutos), 0);
    const maxM = Math.max(Math.ceil(rawMax / 30) * 30, 60);
    const w = 700; const padL = 38; const padR = 20; const padB = 28; const padT = 10;
    const chartW = w - padL - padR; const chartH = 180 - padT - padB;
    return {
      maxM,
      points: datos.map((d, i) => {
        const x = padL + (i / (datos.length - 1)) * chartW;
        const y = padT + chartH - (d.minutos / maxM) * chartH;
        return { x, y, h: d.minutos, l: d.dia };
      }),
      baseY: padT + chartH,
    };
  });

  // ─── HORIZONTAL BARS — Créditos por Curso (real) ───

  creditosBars = computed(() => {
    const cursos = this.courses.value() ?? [];
    if (cursos.length === 0) return null;
    const maxCred = Math.max(...cursos.map(c => c.creditos ?? 0), 1);
    const svgW = 700;
    const padL = 150;
    const padR = 60;
    const padT = 10;
    const padB = 10;
    const chartW = svgW - padL - padR;
    const rowH = 34;
    const totalH = padT + padB + cursos.length * rowH;

    return {
      svgW, totalH, chartW,
      items: cursos.map(c => {
        const cred = c.creditos ?? 0;
        return {
          nombre: c.nombre,
          creditos: cred,
          w: Math.max((cred / maxCred) * chartW, 0),
          color: c.color || '#6366f1',
        };
      }),
    };
  });

  // ─── DONUT — Distribución de Tareas (real) ───

  tareasDonut = computed(() => {
    const completed = this.tareasCompletadasCount();
    const pending = this.tareasPendientesCount();
    const total = completed + pending;
    if (total === 0) return null;

    const r = 36;
    const circ = 2 * Math.PI * r;
    const t = this.t();

    const rawSegments = [
      { label: t['tareasCompletadas'], value: completed, pct: completed / total, color: '#10b981' },
      { label: t['tareasPendientes'], value: pending, pct: pending / total, color: '#f43f5e' },
    ];

    let offset = 0;
    const segments = rawSegments.map(s => {
      const dashLen = s.pct * circ;
      const seg = { ...s, dashArray: `${dashLen} ${circ - dashLen}`, dashOffset: -offset };
      offset += dashLen;
      return seg;
    });

    return { segments, total, r, circ, cx: 60, cy: 60 };
  });

  // ─── BAR CHART — Sesiones por Día de la Semana (real) ───

  sesionesPorDia = computed(() => {
    const cursos = this.courses.value() ?? [];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayLabels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

    cursos.forEach(c => {
      (c.sesiones ?? []).forEach(s => {
        if (s.horaInicio) {
          const d = new Date(s.horaInicio);
          dayCounts[d.getDay()]++;
        }
      });
    });

    const maxCount = Math.max(...dayCounts, 1);

    const svgW = 280;
    const svgH = 160;
    const padL = 5;
    const padR = 5;
    const padT = 5;
    const padB = 22;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;
    const gap = 3;
    const barW = (chartW - gap * 6) / 7;

    return {
      bars: dayCounts.map((count, i) => ({
        label: dayLabels[i],
        count,
        h: Math.max((count / maxCount) * chartH, 0),
        x: padL + i * (barW + gap),
      })),
      svgW, svgH, chartH, barW, maxCount,
    };
  });

  // ─── Sparklines ───────────────────────────────

  private randomSpark(): number[] {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 14 + 6));
  }
  sparkPromedio = this.randomSpark();
  sparkCreditos = this.randomSpark();
  sparkHoras = this.randomSpark();
  sparkTareas = this.randomSpark();
}
