import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className={`toggle-icons ${theme}`}>
        <HiSun className="icon sun" />
        <HiMoon className="icon moon" />
      </div>
    </button>
  );
}
