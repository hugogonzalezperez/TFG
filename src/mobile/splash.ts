/**
 * =====================================================
 * SPLASH SCREEN (PANTALLA DE CARGA)
 * =====================================================
 *
 * Controla la pantalla de carga nativa que se muestra
 * mientras la app se inicializa.
 *
 * En capacitor.config.ts configuramos launchAutoHide: false,
 * lo que significa que la splash screen permanece visible
 * hasta que nosotros la ocultemos manualmente.
 *
 * Esto es importante porque React necesita tiempo para:
 * 1. Cargar el bundle JavaScript
 * 2. Hidratar el DOM
 * 3. Verificar la sesión de Supabase
 *
 * Solo cuando todo esté listo (AuthProvider inicializado),
 * ocultamos la splash para una transición limpia.
 */

import { SplashScreen } from '@capacitor/splash-screen';
import { isNative } from './platform';

/**
 * Oculta la splash screen con una animación de fade-out.
 *
 * Debe llamarse DESPUÉS de que la app esté completamente
 * inicializada (auth verificada, datos cargados, etc.).
 *
 * La duración del fade es de 300ms para una transición suave
 * entre la splash y el contenido de la app.
 *
 * Ubicación recomendada: En el useEffect de App.tsx,
 * cuando `initialized` (del AuthProvider) sea true.
 */
export const hideSplash = async (): Promise<void> => {
  if (!isNative()) return;

  await SplashScreen.hide({
    // Duración del fade-out en milisegundos
    fadeOutDuration: 300,
  });
};

/**
 * Muestra la splash screen de nuevo.
 * Uso poco común, pero útil si necesitas recargar la app
 * o mostrar una pantalla de "actualizando" entre versiones.
 */
export const showSplash = async (): Promise<void> => {
  if (!isNative()) return;

  await SplashScreen.show({
    autoHide: false, // La ocultaremos manualmente cuando estemos listos
  });
};
