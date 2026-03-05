/**
 * =====================================================
 * MOBILE — BARREL EXPORTS
 * =====================================================
 *
 * Punto de entrada único para toda la funcionalidad móvil.
 * Importa desde aquí en lugar de archivos individuales:
 *
 *   import { isNative, hideSplash, impact } from '@/mobile';
 *
 * Todos los módulos exportados son "safe" para usar en web:
 * las funciones nativas son no-op cuando no hay un contenedor
 * Capacitor, así que NO necesitas hacer checks manuales de
 * plataforma en cada componente.
 */

// Detección de plataforma
export { isNative, getPlatform, isIOS, isAndroid, getDeviceInfo } from './platform';

// Almacenamiento multiplataforma (localStorage en web, Preferences en nativo)
export { getStorage } from './storage';

// Feedback háptico (vibración)
export { impact, notify as hapticNotify, selectionFeedback } from './haptics';

// Control de la barra de estado del sistema
export { setDarkStatusBar, setLightStatusBar, showStatusBar, hideStatusBar } from './status-bar';

// Gestión del teclado virtual
export { onKeyboardChange, hideKeyboard } from './keyboard';

// Splash screen (pantalla de carga nativa)
export { hideSplash, showSplash } from './splash';
