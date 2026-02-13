export type Language = 'tr' | 'en' | 'de' | 'es' | 'fr'

export const languageNames: Record<Language, string> = {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
}

export interface TranslationStrings {
    // ─── Sidebar ───
    sidebar_newChat: string
    sidebar_search: string
    sidebar_settings: string
    sidebar_chats: string

    // ─── Common ───
    common_cancel: string

    // ─── Header ───
    header_share: string
    header_switchToDark: string
    header_switchToLight: string

    // ─── ChatArea (welcome) ───
    chat_hey: string
    chat_whatCanIHelp: string

    // ─── ChatInput ───
    chatInput_placeholder: string
    chatInput_online: string
    chatInput_research: string
    chatInput_tools: string

    // ─── QuickActions ───
    quick_learn: string
    quick_build: string
    quick_getAdvice: string
    quick_generateImage: string
    quick_research: string
    quick_learn_prompt: string
    quick_build_prompt: string
    quick_getAdvice_prompt: string
    quick_generateImage_prompt: string
    quick_research_prompt: string

    // ─── MessageBubble ───
    msg_thoughtFor: string
    msg_seconds: string

    // ─── Settings ───
    settings_title: string
    settings_tab_general: string
    settings_tab_general_desc: string
    settings_tab_profile: string
    settings_tab_profile_desc: string
    settings_tab_appearance: string
    settings_tab_appearance_desc: string
    settings_tab_privacy: string
    settings_tab_privacy_desc: string
    settings_tab_api: string
    settings_tab_api_desc: string

    // Settings > General
    settings_language: string
    settings_language_desc: string
    settings_defaultModel: string
    settings_defaultModel_desc: string
    settings_sendWithEnter: string
    settings_sendWithEnter_desc: string
    settings_region: string
    settings_region_desc: string
    settings_region_europe: string
    settings_region_us: string
    settings_region_asia: string

    // Settings > Profile
    settings_profilePhoto: string
    settings_profilePhoto_desc: string
    settings_upload: string
    settings_displayName: string
    settings_displayName_desc: string
    settings_email: string
    settings_email_desc: string
    settings_dangerZone: string
    settings_signOut: string
    settings_deleteAccount: string

    // Settings > Appearance
    settings_theme: string
    settings_theme_desc: string
    settings_theme_light: string
    settings_theme_dark: string
    settings_theme_system: string
    settings_fontSize: string
    settings_fontSize_desc: string
    settings_fontSize_small: string
    settings_fontSize_medium: string
    settings_fontSize_large: string
    settings_wideChat: string
    settings_wideChat_desc: string

    // Settings > Privacy
    settings_chatHistory: string
    settings_chatHistory_desc: string
    // Settings > Export
    settings_exportData: string
    settings_usageTitle: string

    // Placeholder pages
    page_search: string

    // ─── Auth ───
    auth_welcome: string
    auth_signIn: string
    auth_signUp: string
    auth_noAccount: string
    auth_hasAccount: string
    auth_forgotPassword: string
    auth_emailAddress: string
    auth_username: string
    auth_password: string
    auth_confirmPassword: string
    auth_rememberMe: string
    auth_or: string
    auth_signInWithGoogle: string
    auth_verifyEmail: string
    auth_resetPassword: string
    auth_backToLogin: string
    auth_verifyInstruction: string
    auth_verifyCode: string
    auth_resendCode: string
}

const tr: TranslationStrings = {
    // ─── Sidebar ───
    sidebar_newChat: 'Yeni Sohbet',
    sidebar_search: 'Ara',
    sidebar_settings: 'Ayarlar',
    sidebar_chats: 'Sohbetler',
    common_cancel: 'Vazgeç',

    // ─── Header ───
    header_share: 'Paylaş',
    header_switchToDark: 'Karanlık moda geç',
    header_switchToLight: 'Aydınlık moda geç',

    // ─── ChatArea ───
    chat_hey: 'Merhaba',
    chat_whatCanIHelp: 'Bugün sana nasıl yardımcı olabilirim?',

    // ─── ChatInput ───
    chatInput_placeholder: 'Bir şey sor',
    chatInput_online: 'Çevrimiçi',
    chatInput_research: 'Araştır',
    chatInput_tools: 'Araçlar',

    // ─── QuickActions ───
    quick_learn: 'Öğren',
    quick_build: 'Oluştur',
    quick_getAdvice: 'Tavsiye al',
    quick_generateImage: 'Görsel oluştur',
    quick_research: 'Araştır',
    quick_learn_prompt: 'Bana kuantum bilgisayarlar hakkında basit ve anlasilir bir sekilde bilgi ver.',
    quick_build_prompt: 'Benim icin yaratici ve ilham verici kisa bir siir yaz.',
    quick_getAdvice_prompt: 'Gunluk hayatimda uretkenligimi artirmak icin 5 pratik tavsiye ver.',
    quick_generateImage_prompt: 'Hayali bir manzarayi detayli bir sekilde tarif et: gokyuzunde iki gunes, mor ormanlar ve kristal nehirler olsun.',
    quick_research_prompt: 'Yapay zekanin tarihini ve gelecekteki potansiyelini ozetle.',

    // ─── MessageBubble ───
    msg_thoughtFor: 'saniye düşündü',
    msg_seconds: 'saniye',

    // ─── Settings ───
    settings_title: 'Ayarlar',
    settings_tab_general: 'Genel',
    settings_tab_general_desc: 'Dil, bölge ve varsayılan model',
    settings_tab_profile: 'Profil',
    settings_tab_profile_desc: 'Adınız, e-postanız ve avatarınız',
    settings_tab_appearance: 'Görünüm',
    settings_tab_appearance_desc: 'Tema, yazı boyutu ve düzen',
    settings_tab_privacy: 'Gizlilik ve Güvenlik',
    settings_tab_privacy_desc: 'Sohbet geçmişi tercihleri',
    settings_tab_api: 'API Anahtarları',
    settings_tab_api_desc: 'API anahtarlarınızı ve entegrasyonlarınızı yönetin',

    // General
    settings_language: 'Dil',
    settings_language_desc: 'Tercih ettiğiniz dili seçin',
    settings_defaultModel: 'Varsayılan Model',
    settings_defaultModel_desc: 'Yeni konuşmalar için AI modelini seçin',
    settings_sendWithEnter: 'Enter ile Gönder',
    settings_sendWithEnter_desc: 'Mesaj göndermek için Enter, yeni satır için Shift+Enter',
    settings_region: 'Bölge',
    settings_region_desc: 'Yerelleştirilmiş içerik ve uyumluluk için kullanılır',
    settings_region_europe: 'Avrupa',
    settings_region_us: 'Amerika Birleşik Devletleri',
    settings_region_asia: 'Asya Pasifik',

    // Profile
    settings_profilePhoto: 'Profil Fotoğrafı',
    settings_profilePhoto_desc: 'JPG, PNG veya GIF. Maks 2MB.',
    settings_upload: 'Yükle',
    settings_displayName: 'Görünen Ad',
    settings_displayName_desc: 'Konuşmalarda böyle görüneceksiniz',
    settings_email: 'E-posta',
    settings_email_desc: 'Hesap e-posta adresiniz',
    settings_dangerZone: 'Tehlikeli Bölge',
    settings_signOut: 'Çıkış Yap',
    settings_deleteAccount: 'Hesabı Sil',

    // Appearance
    settings_theme: 'Tema',
    settings_theme_desc: 'CrudLLM\'un sizin için nasıl görüneceğini seçin',
    settings_theme_light: 'Açık',
    settings_theme_dark: 'Koyu',
    settings_theme_system: 'Sistem',
    settings_fontSize: 'Yazı Boyutu',
    settings_fontSize_desc: 'Arayüz genelindeki metin boyutunu ayarlayın',
    settings_fontSize_small: 'Küçük',
    settings_fontSize_medium: 'Orta',
    settings_fontSize_large: 'Büyük',
    settings_wideChat: 'Geniş Sohbet Düzeni',
    settings_wideChat_desc: 'Konuşmalar için ekranın tam genişliğini kullanın',

    // Privacy
    settings_chatHistory: 'Sohbet Geçmişi',
    settings_chatHistory_desc: 'Gelecekte başvurmak için konuşmalarınızı kaydedin',
    // Export
    settings_exportData: 'Tüm Verileri Dışa Aktar',
    settings_usageTitle: 'Bu Ayki Kullanım',

    // Placeholder pages
    page_search: 'Arama',

    // ─── Auth ───
    auth_welcome: 'Hoş Geldiniz',
    auth_signIn: 'Giriş Yap',
    auth_signUp: 'Kayıt Ol',
    auth_noAccount: 'Hesabınız yok mu?',
    auth_hasAccount: 'Zaten hesabınız var mı?',
    auth_forgotPassword: 'Şifremi Unuttum',
    auth_emailAddress: 'E-posta Adresi',
    auth_username: 'Kullanıcı veya E-posta Adresi',
    auth_password: 'Şifre',
    auth_confirmPassword: 'Şifreyi Onayla',
    auth_rememberMe: 'Beni Hatırla',
    auth_or: 'VEYA',
    auth_signInWithGoogle: 'Google ile Giriş Yap',
    auth_verifyEmail: 'E-postayı Doğrula',
    auth_resetPassword: 'Şifreyi Sıfırla',
    auth_backToLogin: 'Giriş Sayfasına Dön',
    auth_verifyInstruction: 'Lütfen e-postanıza gönderdiğimiz kodu girin.',
    auth_verifyCode: 'Doğrulama Kodu',
    auth_resendCode: 'Kodu Tekrar Gönder',
}

const en: TranslationStrings = {
    // ─── Sidebar ───
    sidebar_newChat: 'New Chat',
    sidebar_search: 'Search',
    sidebar_settings: 'Settings',
    sidebar_chats: 'Chats',

    // ─── Header ───
    header_share: 'Share',
    header_switchToDark: 'Switch to dark mode',
    header_switchToLight: 'Switch to light mode',

    // ─── ChatArea ───
    chat_hey: 'Hey',
    chat_whatCanIHelp: 'What can I help you with today?',

    // ─── ChatInput ───
    chatInput_placeholder: 'Ask anything',
    chatInput_online: 'Online',
    chatInput_research: 'Research',
    chatInput_tools: 'Tools',

    // ─── QuickActions ───
    quick_learn: 'Learn',
    quick_build: 'Build',
    quick_getAdvice: 'Get advice',
    quick_generateImage: 'Generate image',
    quick_research: 'Research',
    quick_learn_prompt: 'Explain quantum computing to me in a simple and understandable way.',
    quick_build_prompt: 'Write a creative and inspiring short poem for me.',
    quick_getAdvice_prompt: 'Give me 5 practical tips to boost my daily productivity.',
    quick_generateImage_prompt: 'Describe an imaginary landscape in detail: two suns in the sky, purple forests, and crystal rivers.',
    quick_research_prompt: 'Summarize the history of artificial intelligence and its future potential.',

    // ─── MessageBubble ───
    msg_thoughtFor: 'Thought for',
    msg_seconds: 'seconds',

    // ─── Settings ───
    settings_title: 'Settings',
    settings_tab_general: 'General',
    settings_tab_general_desc: 'Language, region, and default model',
    settings_tab_profile: 'Profile',
    settings_tab_profile_desc: 'Your name, email, and avatar',
    settings_tab_appearance: 'Appearance',
    settings_tab_appearance_desc: 'Theme, font size, and layout',
    settings_tab_privacy: 'Privacy & Safety',
    settings_tab_privacy_desc: 'Chat history preferences',
    settings_tab_api: 'API Keys',
    settings_tab_api_desc: 'Manage your API keys and integrations',

    // General
    settings_language: 'Language',
    settings_language_desc: 'Choose your preferred language',
    settings_defaultModel: 'Default Model',
    settings_defaultModel_desc: 'Select the AI model for new conversations',
    settings_sendWithEnter: 'Send with Enter',
    settings_sendWithEnter_desc: 'Press Enter to send messages, Shift+Enter for new line',
    settings_region: 'Region',
    settings_region_desc: 'Used for localized content and compliance',
    settings_region_europe: 'Europe',
    settings_region_us: 'United States',
    settings_region_asia: 'Asia Pacific',

    // Profile
    settings_profilePhoto: 'Profile Photo',
    settings_profilePhoto_desc: 'JPG, PNG or GIF. Max 2MB.',
    settings_upload: 'Upload',
    settings_displayName: 'Display Name',
    settings_displayName_desc: 'This is how you\'ll appear in conversations',
    settings_email: 'Email',
    settings_email_desc: 'Your account email address',
    settings_dangerZone: 'Danger Zone',
    settings_signOut: 'Sign Out',
    settings_deleteAccount: 'Delete Account',

    // Appearance
    settings_theme: 'Theme',
    settings_theme_desc: 'Choose how CrudLLM looks for you',
    settings_theme_light: 'Light',
    settings_theme_dark: 'Dark',
    settings_theme_system: 'System',
    settings_fontSize: 'Font Size',
    settings_fontSize_desc: 'Adjust the text size across the interface',
    settings_fontSize_small: 'Small',
    settings_fontSize_medium: 'Medium',
    settings_fontSize_large: 'Large',
    settings_wideChat: 'Wide Chat Layout',
    settings_wideChat_desc: 'Use the full width of the screen for conversations',

    // Privacy
    settings_chatHistory: 'Chat History',
    settings_chatHistory_desc: 'Save your conversations for future reference',
    // Export
    settings_exportData: 'Export All Data',
    settings_usageTitle: 'Usage This Month',

    // Placeholder pages
    page_search: 'Search',

    // ─── Auth ───
    auth_welcome: 'Welcome Back',
    auth_signIn: 'Sign In',
    auth_signUp: 'Sign Up',
    auth_noAccount: 'No Account?',
    auth_hasAccount: 'Already have an account?',
    auth_forgotPassword: 'Forgot Password',
    auth_emailAddress: 'Email Address',
    auth_username: 'Username or Email Address',
    auth_password: 'Password',
    auth_confirmPassword: 'Confirm Password',
    auth_rememberMe: 'Remember Me',
    auth_or: 'OR',
    auth_signInWithGoogle: 'Sign in with Google',
    auth_verifyEmail: 'Verify Email',
    auth_resetPassword: 'Reset Password',
    auth_backToLogin: 'Back to Login',
    auth_verifyInstruction: 'Please enter the code we sent to your email.',
    auth_verifyCode: 'Verification Code',
    auth_resendCode: 'Resend Code',
    common_cancel: 'Cancel',
}

const de: TranslationStrings = {
    sidebar_newChat: 'Neuer Chat',
    sidebar_search: 'Suche',
    sidebar_settings: 'Einstellungen',
    sidebar_chats: 'Chats',
    header_share: 'Teilen',
    header_switchToDark: 'Zum Dunkelmodus wechseln',
    header_switchToLight: 'Zum Hellmodus wechseln',
    chat_hey: 'Hallo',
    chat_whatCanIHelp: 'Wie kann ich dir heute helfen?',
    chatInput_placeholder: 'Frag mich etwas',
    chatInput_online: 'Online',
    chatInput_research: 'Recherche',
    chatInput_tools: 'Werkzeuge',
    quick_learn: 'Lernen',
    quick_build: 'Erstellen',
    quick_getAdvice: 'Rat holen',
    quick_generateImage: 'Bild erstellen',
    quick_research: 'Recherche',
    quick_learn_prompt: 'Erklaere mir Quantencomputer auf einfache und verstaendliche Weise.',
    quick_build_prompt: 'Schreibe ein kreatives und inspirierendes kurzes Gedicht fuer mich.',
    quick_getAdvice_prompt: 'Gib mir 5 praktische Tipps, um meine taegliche Produktivitaet zu steigern.',
    quick_generateImage_prompt: 'Beschreibe eine imaginaere Landschaft im Detail: zwei Sonnen am Himmel, lila Waelder und Kristallflüsse.',
    quick_research_prompt: 'Fasse die Geschichte der kuenstlichen Intelligenz und ihr zukuenftiges Potenzial zusammen.',
    msg_thoughtFor: 'hat',
    msg_seconds: 'Sekunden nachgedacht',
    settings_title: 'Einstellungen',
    settings_tab_general: 'Allgemein',
    settings_tab_general_desc: 'Sprache, Region und Standardmodell',
    settings_tab_profile: 'Profil',
    settings_tab_profile_desc: 'Ihr Name, E-Mail und Avatar',
    settings_tab_appearance: 'Erscheinungsbild',
    settings_tab_appearance_desc: 'Thema, Schriftgröße und Layout',
    settings_tab_privacy: 'Datenschutz & Sicherheit',
    settings_tab_privacy_desc: 'Chatverlauf-Einstellungen',
    settings_tab_api: 'API-Schlüssel',
    settings_tab_api_desc: 'API-Schlüssel und Integrationen verwalten',
    settings_language: 'Sprache',
    settings_language_desc: 'Wählen Sie Ihre bevorzugte Sprache',
    settings_defaultModel: 'Standardmodell',
    settings_defaultModel_desc: 'KI-Modell für neue Gespräche auswählen',
    settings_sendWithEnter: 'Mit Enter senden',
    settings_sendWithEnter_desc: 'Enter zum Senden, Shift+Enter für neue Zeile',
    settings_region: 'Region',
    settings_region_desc: 'Für lokalisierte Inhalte und Compliance',
    settings_region_europe: 'Europa',
    settings_region_us: 'Vereinigte Staaten',
    settings_region_asia: 'Asien-Pazifik',
    settings_profilePhoto: 'Profilfoto',
    settings_profilePhoto_desc: 'JPG, PNG oder GIF. Max 2MB.',
    settings_upload: 'Hochladen',
    settings_displayName: 'Anzeigename',
    settings_displayName_desc: 'So werden Sie in Gesprächen angezeigt',
    settings_email: 'E-Mail',
    settings_email_desc: 'Ihre Konto-E-Mail-Adresse',
    settings_dangerZone: 'Gefahrenzone',
    settings_signOut: 'Abmelden',
    settings_deleteAccount: 'Konto löschen',
    settings_theme: 'Thema',
    settings_theme_desc: 'Wählen Sie das Aussehen von CrudLLM',
    settings_theme_light: 'Hell',
    settings_theme_dark: 'Dunkel',
    settings_theme_system: 'System',
    settings_fontSize: 'Schriftgröße',
    settings_fontSize_desc: 'Textgröße in der Oberfläche anpassen',
    settings_fontSize_small: 'Klein',
    settings_fontSize_medium: 'Mittel',
    settings_fontSize_large: 'Groß',
    settings_wideChat: 'Breites Chat-Layout',
    settings_wideChat_desc: 'Volle Bildschirmbreite für Gespräche nutzen',
    settings_chatHistory: 'Chatverlauf',
    settings_chatHistory_desc: 'Gespräche für spätere Referenz speichern',
    settings_exportData: 'Alle Daten exportieren',
    settings_usageTitle: 'Nutzung diesen Monat',
    page_search: 'Suche',

    // ─── Auth ───
    auth_welcome: 'Willkommen zurück',
    auth_signIn: 'Anmelden',
    auth_signUp: 'Registrieren',
    auth_noAccount: 'Kein Konto?',
    auth_hasAccount: 'Bereits ein Konto?',
    auth_forgotPassword: 'Passwort vergessen',
    auth_emailAddress: 'E-Mail-Adresse',
    auth_username: 'Benutzername oder E-Mail',
    auth_password: 'Passwort',
    auth_confirmPassword: 'Passwort bestätigen',
    auth_rememberMe: 'Angemeldet bleiben',
    auth_or: 'ODER',
    auth_signInWithGoogle: 'Mit Google anmelden',
    auth_verifyEmail: 'E-Mail bestätigen',
    auth_resetPassword: 'Passwort zurücksetzen',
    auth_backToLogin: 'Zurück zum Login',
    auth_verifyInstruction: 'Bitte geben Sie den Code ein, den wir an Ihre E-Mail gesendet haben.',
    auth_verifyCode: 'Bestätigungscode',
    auth_resendCode: 'Code erneut senden',
    common_cancel: 'Abbrechen',
}

const es: TranslationStrings = {
    sidebar_newChat: 'Nuevo Chat',
    sidebar_search: 'Buscar',
    sidebar_settings: 'Configuración',
    sidebar_chats: 'Chats',
    header_share: 'Compartir',
    header_switchToDark: 'Cambiar a modo oscuro',
    header_switchToLight: 'Cambiar a modo claro',
    chat_hey: 'Hola',
    chat_whatCanIHelp: '¿En qué puedo ayudarte hoy?',
    chatInput_placeholder: 'Pregunta lo que quieras',
    chatInput_online: 'En línea',
    chatInput_research: 'Investigar',
    chatInput_tools: 'Herramientas',
    quick_learn: 'Aprender',
    quick_build: 'Crear',
    quick_getAdvice: 'Pedir consejo',
    quick_generateImage: 'Generar imagen',
    quick_research: 'Investigar',
    quick_learn_prompt: 'Explicame la computacion cuantica de forma simple y comprensible.',
    quick_build_prompt: 'Escribe un poema corto creativo e inspirador para mi.',
    quick_getAdvice_prompt: 'Dame 5 consejos practicos para aumentar mi productividad diaria.',
    quick_generateImage_prompt: 'Describe un paisaje imaginario en detalle: dos soles en el cielo, bosques morados y rios de cristal.',
    quick_research_prompt: 'Resume la historia de la inteligencia artificial y su potencial futuro.',
    msg_thoughtFor: 'Pensó durante',
    msg_seconds: 'segundos',
    settings_title: 'Configuración',
    settings_tab_general: 'General',
    settings_tab_general_desc: 'Idioma, región y modelo predeterminado',
    settings_tab_profile: 'Perfil',
    settings_tab_profile_desc: 'Tu nombre, correo y avatar',
    settings_tab_appearance: 'Apariencia',
    settings_tab_appearance_desc: 'Tema, tamaño de fuente y diseño',
    settings_tab_privacy: 'Privacidad y Seguridad',
    settings_tab_privacy_desc: 'Preferencias del historial de chat',
    settings_tab_api: 'Claves API',
    settings_tab_api_desc: 'Administra tus claves API e integraciones',
    settings_language: 'Idioma',
    settings_language_desc: 'Elige tu idioma preferido',
    settings_defaultModel: 'Modelo Predeterminado',
    settings_defaultModel_desc: 'Selecciona el modelo de IA para nuevas conversaciones',
    settings_sendWithEnter: 'Enviar con Enter',
    settings_sendWithEnter_desc: 'Enter para enviar, Shift+Enter para nueva línea',
    settings_region: 'Región',
    settings_region_desc: 'Para contenido localizado y cumplimiento',
    settings_region_europe: 'Europa',
    settings_region_us: 'Estados Unidos',
    settings_region_asia: 'Asia Pacífico',
    settings_profilePhoto: 'Foto de Perfil',
    settings_profilePhoto_desc: 'JPG, PNG o GIF. Máx 2MB.',
    settings_upload: 'Subir',
    settings_displayName: 'Nombre para Mostrar',
    settings_displayName_desc: 'Así aparecerás en las conversaciones',
    settings_email: 'Correo electrónico',
    settings_email_desc: 'Dirección de correo de tu cuenta',
    settings_dangerZone: 'Zona de Peligro',
    settings_signOut: 'Cerrar Sesión',
    settings_deleteAccount: 'Eliminar Cuenta',
    settings_theme: 'Tema',
    settings_theme_desc: 'Elige cómo se ve CrudLLM para ti',
    settings_theme_light: 'Claro',
    settings_theme_dark: 'Oscuro',
    settings_theme_system: 'Sistema',
    settings_fontSize: 'Tamaño de Fuente',
    settings_fontSize_desc: 'Ajusta el tamaño del texto en la interfaz',
    settings_fontSize_small: 'Pequeño',
    settings_fontSize_medium: 'Mediano',
    settings_fontSize_large: 'Grande',
    settings_wideChat: 'Diseño de Chat Ancho',
    settings_wideChat_desc: 'Usa todo el ancho de pantalla para conversaciones',
    settings_chatHistory: 'Historial de Chat',
    settings_chatHistory_desc: 'Guarda tus conversaciones para referencia futura',
    settings_exportData: 'Exportar Todos los Datos',
    settings_usageTitle: 'Uso Este Mes',
    page_search: 'Buscar',

    // ─── Auth ───
    auth_welcome: 'Bienvenido de nuevo',
    auth_signIn: 'Iniciar sesión',
    auth_signUp: 'Registrarse',
    auth_noAccount: '¿No tienes cuenta?',
    auth_hasAccount: '¿Ya tienes una cuenta?',
    auth_forgotPassword: 'Olvidé mi contraseña',
    auth_emailAddress: 'Dirección de correo',
    auth_username: 'Usuario o correo electrónico',
    auth_password: 'Contraseña',
    auth_confirmPassword: 'Confirmar contraseña',
    auth_rememberMe: 'Recordarme',
    auth_or: 'O',
    auth_signInWithGoogle: 'Iniciar sesión con Google',
    auth_verifyEmail: 'Verificar correo',
    auth_resetPassword: 'Restablecer contraseña',
    auth_backToLogin: 'Volver al inicio',
    auth_verifyInstruction: 'Por favor, introduce el código que enviamos a tu correo.',
    auth_verifyCode: 'Código de verificación',
    auth_resendCode: 'Reenviar código',
    common_cancel: 'Cancelar',
}

const fr: TranslationStrings = {
    sidebar_newChat: 'Nouveau Chat',
    sidebar_search: 'Recherche',
    sidebar_settings: 'Paramètres',
    sidebar_chats: 'Conversations',
    common_cancel: 'Annuler',
    header_share: 'Partager',
    header_switchToDark: 'Passer en mode sombre',
    header_switchToLight: 'Passer en mode clair',
    chat_hey: 'Salut',
    chat_whatCanIHelp: 'Comment puis-je vous aider aujourd\'hui ?',
    chatInput_placeholder: 'Posez une question',
    chatInput_online: 'En ligne',
    chatInput_research: 'Recherche',
    chatInput_tools: 'Outils',
    quick_learn: 'Apprendre',
    quick_build: 'Creer',
    quick_getAdvice: 'Conseil',
    quick_generateImage: 'Generer une image',
    quick_research: 'Recherche',
    quick_learn_prompt: 'Explique-moi l\'informatique quantique de maniere simple et comprehensible.',
    quick_build_prompt: 'Ecris un court poeme creatif et inspirant pour moi.',
    quick_getAdvice_prompt: 'Donne-moi 5 conseils pratiques pour ameliorer ma productivite quotidienne.',
    quick_generateImage_prompt: 'Decris un paysage imaginaire en detail : deux soleils dans le ciel, des forets violettes et des rivieres de cristal.',
    quick_research_prompt: 'Resume l\'histoire de l\'intelligence artificielle et son potentiel futur.',
    msg_thoughtFor: 'A réfléchi pendant',
    msg_seconds: 'secondes',
    settings_title: 'Paramètres',
    settings_tab_general: 'Général',
    settings_tab_general_desc: 'Langue, région et modèle par défaut',
    settings_tab_profile: 'Profil',
    settings_tab_profile_desc: 'Votre nom, e-mail et avatar',
    settings_tab_appearance: 'Apparence',
    settings_tab_appearance_desc: 'Thème, taille de police et disposition',
    settings_tab_privacy: 'Confidentialité et Sécurité',
    settings_tab_privacy_desc: 'Préférences de l\'historique de chat',
    settings_tab_api: 'Clés API',
    settings_tab_api_desc: 'Gérez vos clés API et intégrations',
    settings_language: 'Langue',
    settings_language_desc: 'Choisissez votre langue préférée',
    settings_defaultModel: 'Modèle par Défaut',
    settings_defaultModel_desc: 'Sélectionnez le modèle IA pour les nouvelles conversations',
    settings_sendWithEnter: 'Envoyer avec Entrée',
    settings_sendWithEnter_desc: 'Entrée pour envoyer, Shift+Entrée pour nouvelle ligne',
    settings_region: 'Région',
    settings_region_desc: 'Utilisé pour le contenu localisé et la conformité',
    settings_region_europe: 'Europe',
    settings_region_us: 'États-Unis',
    settings_region_asia: 'Asie-Pacifique',
    settings_profilePhoto: 'Photo de Profil',
    settings_profilePhoto_desc: 'JPG, PNG ou GIF. Max 2 Mo.',
    settings_upload: 'Télécharger',
    settings_displayName: 'Nom d\'affichage',
    settings_displayName_desc: 'C\'est ainsi que vous apparaîtrez dans les conversations',
    settings_email: 'E-mail',
    settings_email_desc: 'Adresse e-mail de votre compte',
    settings_dangerZone: 'Zone de Danger',
    settings_signOut: 'Déconnexion',
    settings_deleteAccount: 'Supprimer le Compte',
    settings_theme: 'Thème',
    settings_theme_desc: 'Choisissez l\'apparence de CrudLLM',
    settings_theme_light: 'Clair',
    settings_theme_dark: 'Sombre',
    settings_theme_system: 'Système',
    settings_fontSize: 'Taille de Police',
    settings_fontSize_desc: 'Ajustez la taille du texte dans l\'interface',
    settings_fontSize_small: 'Petit',
    settings_fontSize_medium: 'Moyen',
    settings_fontSize_large: 'Grand',
    settings_wideChat: 'Disposition Large du Chat',
    settings_wideChat_desc: 'Utiliser toute la largeur de l\'écran pour les conversations',
    settings_chatHistory: 'Historique du Chat',
    settings_chatHistory_desc: 'Sauvegardez vos conversations pour référence future',
    settings_exportData: 'Exporter Toutes les Données',
    settings_usageTitle: 'Utilisation ce Mois',
    page_search: 'Recherche',

    // ─── Auth ───
    auth_welcome: 'Bienvenue',
    auth_signIn: 'Se connecter',
    auth_signUp: 'S\'inscrire',
    auth_noAccount: 'Pas de compte ?',
    auth_hasAccount: 'Vous avez déjà un compte ?',
    auth_forgotPassword: 'Mot de passe oublié',
    auth_emailAddress: 'Adresse e-mail',
    auth_username: 'Utilisateur ou e-mail',
    auth_password: 'Mot de passe',
    auth_confirmPassword: 'Confirmer le mot de passe',
    auth_rememberMe: 'Se souvenir de moi',
    auth_or: 'OU',
    auth_signInWithGoogle: 'Se connecter avec Google',
    auth_verifyEmail: 'Vérifier l\'e-mail',
    auth_resetPassword: 'Réinitialiser le mot de passe',
    auth_backToLogin: 'Retour à la connexion',
    auth_verifyInstruction: 'Veuillez saisir le code envoyé à votre e-mail.',
    auth_verifyCode: 'Code de vérification',
    auth_resendCode: 'Renvoyer le code',
}

export const translations: Record<Language, TranslationStrings> = {
    tr,
    en,
    de,
    es,
    fr,
}
