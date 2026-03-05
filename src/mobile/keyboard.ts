/**
 * =====================================================
 * GESTIÓN DEL TECLADO VIRTUAL
 * =====================================================
 *
 * En móvil, el teclado virtual cubre una parte significativa
 * de la pantalla. Este módulo permite:
 *
 * 1. Escuchar cuándo el teclado aparece/desaparece
 * 2. Ocultar el teclado programáticamente
 * 3. Obtener la altura del teclado para ajustar layouts
 *
 * El comportamiento de resize del viewport se configura en
 * capacitor.config.ts (Keyboard.resize = 'body').
 */

import { Keyboard } from '@capacitor/keyboard';
import { isNative } from './platform';

/**
 * Tipo del callback que se ejecuta cuando el teclado cambia.
 * keyboardHeight será > 0 cuando el teclado es visible, 0 cuando no.
 */
type KeyboardCallback = (keyboardHeight: number) => void;

/**
 * Registra listeners para los eventos del teclado virtual.
 * Devuelve una función de limpieza para desregistrar los listeners.
 *
 * Uso típico en un componente React:
 *
 *   useEffect(() => {
 *     const cleanup = onKeyboardChange((height) => {
 *       setKeyboardHeight(height);
 *     });
 *     return cleanup; // Limpieza al desmontar
 *   }, []);
 *
 * @param callback - Se ejecuta con la altura en píxeles del teclado
 * @returns Función para limpiar los listeners
 */
export const onKeyboardChange = (callback: KeyboardCallback): (() => void) => {
  if (!isNative()) {
    // En web, devolvemos una función vacía de cleanup
    return () => { };
  }

  // Listener para cuando el teclado aparece
  // keyboardHeight permite ajustar el padding inferior del contenido
  const showListener = Keyboard.addListener('keyboardWillShow', (info) => {
    callback(info.keyboardHeight);
  });

  // Listener para cuando el teclado se oculta
  const hideListener = Keyboard.addListener('keyboardWillHide', () => {
    callback(0);
  });

  // Devolver función de limpieza que elimina ambos listeners
  return () => {
    showListener.then(l => l.remove());
    hideListener.then(l => l.remove());
  };
};

/**
 * Oculta el teclado virtual programáticamente.
 * Útil en formularios al pulsar "Buscar" o "Enviar".
 */
export const hideKeyboard = async (): Promise<void> => {
  if (!isNative()) return;
  await Keyboard.hide();
};
