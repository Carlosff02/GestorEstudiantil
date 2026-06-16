import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UsersService } from '../../service/users.service';
import { ActualizarUsuarioRequest, User } from '../../types/user.type';
import { FormsModule } from '@angular/forms';
import { Check, LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Idioma = 'es' | 'en' | 'pt' | 'fr';
type PerfilAccesibilidad = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'baja_vision' | 'ceguera';

const A11Y_CLASSES: Record<PerfilAccesibilidad, string> = {
  normal:       '',
  protanopia:   'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia:   'a11y-tritanopia',
  baja_vision:  'a11y-baja-vision',
  ceguera:      'a11y-ceguera',
};

const I18N: Record<Idioma, Record<string, string>> = {
  es: {
    profileTitle:    'Configuración del Perfil',
    profileSubtitle: 'Administra tu información personal y preferencias de accesibilidad.',
    formNombres:     'Nombres',
    formApellidos:   'Apellidos',
    formCorreo:      'Correo Electrónico',
    formRol:         'Rol en la Plataforma',
    formIdioma:      'Idioma',
    formAccesibilidad: 'Perfil de Accesibilidad',
    a11yNormal:      'Normal (Estándar)',
    a11yProtanopia:  'Protanopia (Rojo-Verde)',
    a11yDeuteranopia:'Deuteranopia (Verde-Rojo)',
    a11yTritanopia:  'Tritanopia (Azul-Amarillo)',
    a11yBajaVision:  'Baja Visión',
    a11yCeguera:     'Ceguera',
    btnSave:         'Guardar Cambios',
    placeholderNombres:  'Tus nombres',
    placeholderApellidos:'Tus apellidos',
    placeholderCorreo:   'correo@ejemplo.com',
    placeholderRol:      'Ej: Estudiante, Profesor',
    estudiante:      'Estudiante',
    sesionActiva:    'Sesión activa segura',
    version:         'StudySync Platform v2.0',
  },
  en: {
    profileTitle:    'Profile Settings',
    profileSubtitle: 'Manage your personal information and accessibility preferences.',
    formNombres:     'First Name',
    formApellidos:   'Last Name',
    formCorreo:      'Email Address',
    formRol:         'Platform Role',
    formIdioma:      'Language',
    formAccesibilidad: 'Accessibility Profile',
    a11yNormal:      'Normal (Standard)',
    a11yProtanopia:  'Protanopia (Red-Green)',
    a11yDeuteranopia:'Deuteranopia (Green-Red)',
    a11yTritanopia:  'Tritanopia (Blue-Yellow)',
    a11yBajaVision:  'Low Vision',
    a11yCeguera:     'Blindness',
    btnSave:         'Save Changes',
    placeholderNombres:  'Your first name',
    placeholderApellidos:'Your last name',
    placeholderCorreo:   'email@example.com',
    placeholderRol:      'E.g.: Student, Teacher',
    estudiante:      'Student',
    sesionActiva:    'Secure active session',
    version:         'StudySync Platform v2.0',
  },
  pt: {
    profileTitle:    'Configurações do Perfil',
    profileSubtitle: 'Gerencie suas informações pessoais e preferências de acessibilidade.',
    formNombres:     'Nome',
    formApellidos:   'Sobrenome',
    formCorreo:      'E-mail',
    formRol:         'Função na Plataforma',
    formIdioma:      'Idioma',
    formAccesibilidade: 'Perfil de Acessibilidade',
    a11yNormal:      'Normal (Padrão)',
    a11yProtanopia:  'Protanopia (Vermelho-Verde)',
    a11yDeuteranopia:'Deuteranopia (Verde-Vermelho)',
    a11yTritanopia:  'Tritanopia (Azul-Amarelo)',
    a11yBajaVision:  'Baixa Visão',
    a11yCeguera:     'Cegueira',
    btnSave:         'Salvar Alterações',
    placeholderNombres:  'Seu nome',
    placeholderApellidos:'Seu sobrenome',
    placeholderCorreo:   'email@exemplo.com',
    placeholderRol:      'Ex: Estudante, Professor',
    estudiante:      'Estudante',
    sesionActiva:    'Sessão ativa segura',
    version:         'StudySync Platform v2.0',
  },
  fr: {
    profileTitle:    'Paramètres du Profil',
    profileSubtitle: 'Gérez vos informations personnelles et préférences d\'accessibilité.',
    formNombres:     'Prénom',
    formApellidos:   'Nom',
    formCorreo:      'Adresse e-mail',
    formRol:         'Rôle sur la Plateforme',
    formIdioma:      'Langue',
    formAccesibilidade: 'Profil d\'Accessibilité',
    a11yNormal:      'Normal (Standard)',
    a11yProtanopia:  'Protanopie (Rouge-Vert)',
    a11yDeuteranopia:'Deutéranopie (Vert-Rouge)',
    a11yTritanopia:  'Tritanopie (Bleu-Jaune)',
    a11yBajaVision:  'Basse Vision',
    a11yCeguera:     'Cécité',
    btnSave:         'Enregistrer',
    placeholderNombres:  'Votre prénom',
    placeholderApellidos:'Votre nom',
    placeholderCorreo:   'email@exemple.com',
    placeholderRol:      'Ex: Étudiant, Professeur',
    estudiante:      'Étudiant',
    sesionActiva:    'Session active sécurisée',
    version:         'StudySync Platform v2.0',
  },
};

@Component({
  selector: 'app-profile',
  imports: [FormsModule, LucideAngularModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly Check = Check;
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UsersService);

  user = this.authService.userSignal;

  // ─── i18n / a11y ───────────────────────────────────────────────────────────

  private idioma = computed<Idioma>(() => {
    const raw = this.user()?.idioma as Idioma;
    return raw && raw in I18N ? raw : 'es';
  });

  private perfil = computed<PerfilAccesibilidad>(() => {
    const raw = this.user()?.perfilAccesibilidad as PerfilAccesibilidad;
    return raw && raw in A11Y_CLASSES ? raw : 'normal';
  });

  t         = computed(() => I18N[this.idioma()]);
  a11yClass = computed(() => A11Y_CLASSES[this.perfil()]);

  userIdComputed = computed(() => {
    const currentUser = this.user();
    return currentUser ? (currentUser.idUsuario ?? 0) : 0;
  });

  actualUser = this.userService.obtenerUsuarioPorId(this.userIdComputed);

  userToEdit = signal<User>({
    idUsuario: 0,
    idioma: 'es',
    nombres: '',
    apellidos: '',
    perfilAccesibilidad: 'normal',
    correo: '',
    rol: 'estudiante'
  });

  constructor() {
    effect(() => {
      const user = this.actualUser.value();
      if (!user) return;
      this.userToEdit.set({ ...user });
    });
  }

  updateUser() {
    const idUsuario = this.userToEdit().idUsuario;
    if (!idUsuario) return;
    const request: ActualizarUsuarioRequest = {
      nombres: this.userToEdit().nombres,
      apellidos: this.userToEdit().apellidos,
      idioma: this.userToEdit().idioma,
      perfilAccesibilidad: this.userToEdit().perfilAccesibilidad,
      activo: true,
      rol: this.userToEdit().rol
    };
    if (request.nombres === '' || request.apellidos === '') return;
    this.userService.actualizarUsuario(idUsuario, request).subscribe({
      next: (res) => {
        this.actualUser.reload();
        const currentUser = this.user();
        if (currentUser) {
          currentUser.nombres = request.nombres;
          currentUser.apellidos = request.apellidos;
          currentUser.idioma = request.idioma;
          currentUser.perfilAccesibilidad = request.perfilAccesibilidad;
          this.authService.saveUser(currentUser);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
