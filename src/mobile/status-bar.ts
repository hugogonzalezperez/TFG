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

  // Style.Dark = Iconos blancos (para fondo oscuro de la app)
  await StatusBar.setStyle({ style: Style.Dark });

  if (isAndroid()) {
    // En Android podemos controlar el color de fondo directamente
    await StatusBar.setBackgroundColor({ color: '#09090B' });
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
