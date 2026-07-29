/**
 * =====================================================
 * BARRA DE ESTADO NATIVA
 * =====================================================
 *
 * Controla la barra de estado del sistema (la franja superior
 * que muestra hora, batería, señal, etc.).
 *
 * En iOS, la barra de estado puede tener texto claro u oscuro.
 * En Android, además se puede cambiar el color de fondo.
 *
 * En web estas funciones son no-op (no hacen nada).
 */

import { StatusBar, Style } from '@capacitor/status-bar';
import { isNative, isAndroid } from './platform';

/**
 * Configura la barra de estado con iconos claros (para fondos oscuros).
 * Se llama típicamente al iniciar la app si usa tema oscuro.
 *
 * - iOS: Cambia los iconos/texto a blanco
 * - Android: Cambia los iconos a blanco + fondo oscuro
 */
export const setDarkStatusBar = async (): Promise<void> => {
  if (!isNative()) return;
  // Interior pages: overlay=false so status bar sits above content normally
  await StatusBar.setOverlaysWebView({ overlay: false });
  await StatusBar.setStyle({ style: Style.Dark }); // dark icons for light header
  if (isAndroid()) {
    await StatusBar.setBackgroundColor({ color: '#ffffff' }); // matches card header bg
  }
};

/**
 * Configura la barra de estado con iconos oscuros (para fondos claros).
 * Se usaría si el usuario cambia a tema claro.
 */
export const setLightStatusBar = async (): Promise<void> => {
  if (!isNative()) return;

  // Style.Light = Iconos negros (para fondo claro de la app)
  await StatusBar.setStyle({ style: Style.Light });

  if (isAndroid()) {
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
  }
};

/**
 * Barra de estado oscura (iconos blancos) con fondo que se integra con el hero.
 * Usar cuando el contenido detrás del status bar es oscuro (hero, mapas oscuros).
 */
export const setHeroStatusBar = async (): Promise<void> => {
  if (!isNative()) return;
  // Overlay=true: WebView extends behind status bar → hero fills edge-to-edge
  // env(safe-area-inset-top) returns real status-bar height for padding
  await StatusBar.setOverlaysWebView({ overlay: true });
  await StatusBar.setStyle({ style: Style.Light }); // white icons on dark hero
};

/**
 * Muestra la barra de estado (si estaba oculta).
 * Útil al volver de una vista fullscreen (ej: mapa expandido).
 */
export const showStatusBar = async (): Promise<void> => {
  if (!isNative()) return;
  await StatusBar.show();
};

/**
 * Oculta la barra de estado para contenido fullscreen.
 * Útil para la vista de mapa o galerías de fotos.
 */
export const hideStatusBar = async (): Promise<void> => {
  if (!isNative()) return;
  await StatusBar.hide();
};
