/**
 * =====================================================
 * ALMACENAMIENTO MULTIPLATAFORMA
 * =====================================================
 *
 * Este módulo proporciona una abstracción de almacenamiento
 * que funciona tanto en web (localStorage) como en nativo
 * (@capacitor/preferences).
 *
 * ¿POR QUÉ NO USAR localStorage DIRECTAMENTE EN MÓVIL?
 * En iOS, localStorage dentro de un WebView puede ser purgado
 * por el sistema operativo cuando hay presión de memoria.
 * @capacitor/preferences almacena datos en UserDefaults (iOS)
 * y SharedPreferences (Android), que son persistentes y seguros.
 *
 * Este módulo implementa la interfaz estándar de Storage que
 * Supabase Auth espera, permitiendo usarlo como storage backend.
 */

import { Preferences } from '@capacitor/preferences';
import { isNative } from './platform';

/**
 * Implementación de almacenamiento para plataformas nativas.
 * Usa @capacitor/preferences internamente, que persiste datos
 * en el almacenamiento seguro del SO (UserDefaults / SharedPreferences).
 *
 * Implementa la misma interfaz que localStorage para que sea
 * compatible con cualquier librería que espere un Storage estándar
 * (como Supabase Auth).
 */
class CapacitorStorage {
  /**
   * Obtiene un valor del almacenamiento nativo.
   * Es async porque @capacitor/preferences es asíncrono,
   * pero Supabase Auth soporta storage async desde v2.
   */
  async getItem(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }

  /**
   * Guarda un valor en el almacenamiento nativo.
   * Los datos persisten incluso si el SO libera memoria del WebView.
   */
  async setItem(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  /**
   * Elimina un valor del almacenamiento nativo.
   * Se usa durante el logout para limpiar la sesión.
   */
  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}

/**
 * Devuelve el backend de almacenamiento correcto según la plataforma:
 * - En nativo: CapacitorStorage (persistente, seguro)
 * - En web: window.localStorage (estándar del navegador)
 *
 * Se usa principalmente en la configuración del cliente Supabase
 * para persistir tokens de autenticación de forma fiable.
 */
export const getStorage = (): CapacitorStorage | Storage => {
  if (isNative()) {
    return new CapacitorStorage();
  }
  // En web, devolvemos localStorage directamente
  return window.localStorage;
};
