/**
 * =====================================================
 * DETECCIÓN DE PLATAFORMA
 * =====================================================
 *
 * Este módulo centraliza la detección de la plataforma
 * donde se ejecuta la app. Permite que el resto del código
 * tome decisiones condicionales (ej: mostrar/ocultar componentes
 * web-only como Vercel Analytics).
 *
 * IMPORTANTE: Capacitor.isNativePlatform() devuelve true SOLO
 * cuando la app corre dentro del contenedor nativo (iOS/Android),
 * nunca en el navegador web, ni siquiera en móvil.
 */

import { Capacitor } from '@capacitor/core';
import { Device, type DeviceInfo } from '@capacitor/device';

// ─── Detección básica de plataforma ───────────────────────

/**
 * Devuelve true si la app está corriendo dentro de un
 * contenedor nativo (iOS o Android), NO en un navegador.
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Devuelve la plataforma actual: 'ios', 'android' o 'web'.
 * Útil para aplicar estilos o lógica específica por SO.
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Devuelve true solo si estamos en iOS nativo.
 * Útil para ajustes de safe area, gestos de swipe-back, etc.
 */
export const isIOS = (): boolean => {
  return getPlatform() === 'ios';
};

/**
 * Devuelve true solo si estamos en Android nativo.
 * Útil para ajustes de navigation bar, botón back, etc.
 */
export const isAndroid = (): boolean => {
  return getPlatform() === 'android';
};

// ─── Información del dispositivo ──────────────────────────

/**
 * Obtiene información detallada del dispositivo (modelo, SO, etc.).
 * Solo disponible en plataformas nativas; en web devuelve info limitada.
 *
 * @returns DeviceInfo con campos como:
 *   - model: "iPhone 15 Pro"
 *   - platform: "ios"
 *   - operatingSystem: "ios"
 *   - osVersion: "17.4"
 *   - isVirtual: false (true si es simulador/emulador)
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  return await Device.getInfo();
};
