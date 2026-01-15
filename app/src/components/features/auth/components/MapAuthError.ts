const mapAuthError = (message: string) => {
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos';
  }

  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta con ese email';
  }

  return 'Error de autenticación';
};
