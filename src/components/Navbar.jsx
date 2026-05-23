/**
 * Top navigation bar with logo, AI status indicator, dark mode toggle, and mobile menu button.
 */
const Navbar = ({ darkMode, setDarkMode, onToggleSidebar }) => {
  return (
    <nav className="glass-strong sticky top-0 z-50 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            id="sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-200/50 dark:hover:bg-surface-800/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-tight">VoiceBot AI</h1>
              <p className="text-[9px] font-semibold text-surface-400 dark:text-surface-500 tracking-widest uppercase">
                Hindi • Telugu
              </p>
            </div>
          </div>
        </div>

        {/* Right: Status + Dark mode toggle */}
        <div className="flex items-center gap-2">
          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">AI Online</span>
          </div>

          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-surface-200/50 dark:hover:bg-surface-800/50 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-surface-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
