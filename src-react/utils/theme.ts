export type ThemeMode = 'light' | 'dark';

export const applyThemeToDocument = (theme: ThemeMode) => {
  const isDark = theme === 'dark';

  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');

  if (isDark) {
    document.body.classList.add('dark-theme');
    return;
  }

  document.body.classList.remove('dark-theme');
};
