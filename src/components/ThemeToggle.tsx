import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <span
        className={`theme-toggle-dot ${isDark ? 'theme-toggle-dot--dark' : 'theme-toggle-dot--light'}`}
      />
      {isDark ? 'Dark' : 'Light'}
    </button>
  )
}
