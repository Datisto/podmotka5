const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const login = (password: string): boolean => {
  const correctPassword = 'admin123';

  if (password === correctPassword) {
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    return true;
  }

  return false;
};

export const logout = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const checkAdminSession = (): boolean => {
  const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);

  if (!sessionStr) {
    return false;
  }

  try {
    const session = JSON.parse(sessionStr);
    const now = Date.now();

    if (now - session.timestamp > SESSION_DURATION) {
      logout();
      return false;
    }

    return session.authenticated === true;
  } catch {
    logout();
    return false;
  }
};
