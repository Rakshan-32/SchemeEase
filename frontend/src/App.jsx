import React, { useState, useEffect, useRef } from 'react';
import { useMatch, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthPage } from './Auth';
import ProfileSetup from './ProfileSetup';
import { normalizeProfile } from './profileNormalization';
import { Dashboard } from './sections';
import SchemePublicView from './SchemePublicView';
import { extractProfile, fetchScheme } from './data';
import { motion } from 'framer-motion';
import { Search, Loader2, Moon, Sun, Globe, X } from 'lucide-react';

// One-time migration: rewrite stale scheme IDs in every localStorage collection
// that stores IDs, so favourites / recently-viewed / compare / tracker remain
// intact after the dataset clean-up.
const SCHEME_ID_MAP = {
  'neem-coated-urea':  'e-nam',
  'mid-day-meal-scheme': 'girls-secondary-education',
  'lic-housing-finance': 'clss-pmay',
  // pmay (generic) removed; map to the richer urban entry so saved references
  // still resolve to a valid scheme rather than silently disappearing.
  'pmay': 'pradhan-mantri-awas-yojana-urban',
};

function migrateSchemeIds() {
  const DONE_KEY = 'scheme_id_migration_v1';
  if (localStorage.getItem(DONE_KEY)) return;

  const migrateId = (id) => SCHEME_ID_MAP[id] ?? id;

  // saved_schemes — plain array of ID strings
  try {
    const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
    localStorage.setItem('saved_schemes', JSON.stringify(saved.map(migrateId)));
  } catch { /* corrupted — leave as-is */ }

  // recently_viewed — plain array of ID strings
  try {
    const rv = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    localStorage.setItem('recently_viewed', JSON.stringify(rv.map(migrateId)));
  } catch { /* corrupted — leave as-is */ }

  // compare_list_{user} and application_tracker_{user} — keyed per user
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (key.startsWith('compare_list_')) {
      try {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const migrated = list.map((item) =>
          item && item.scheme_id ? { ...item, scheme_id: migrateId(item.scheme_id) } : item
        );
        localStorage.setItem(key, JSON.stringify(migrated));
      } catch { /* corrupted — leave as-is */ }
    }

    if (key.startsWith('application_tracker_')) {
      try {
        const apps = JSON.parse(localStorage.getItem(key) || '[]');
        const migrated = apps.map((app) =>
          app && app.schemeId ? { ...app, schemeId: migrateId(app.schemeId) } : app
        );
        localStorage.setItem(key, JSON.stringify(migrated));
      } catch { /* corrupted — leave as-is */ }
    }
  }

  localStorage.setItem(DONE_KEY, '1');
}

// Run migration synchronously before first render so React state initialised
// from localStorage (saved_schemes etc.) already sees the new IDs.
migrateSchemeIds();

function App() {
  const schemeMatch = useMatch('/schemes/:schemeId');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authState, setAuthState] = useState('loading'); // 'loading', 'auth', 'setup', 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  // Search State - now managed via URL query parameter
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [deepLinkNotFound, setDeepLinkNotFound] = useState(false);

  // Sync search input with URL query parameter
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        let users = {};
        try { users = JSON.parse(localStorage.getItem('schemease_users') || '{}'); } catch { /* corrupted — treat as no users */ }
        if (users[savedUser]) {
          setCurrentUser(savedUser);

          // Load user's profile
          const savedProfile = localStorage.getItem(`profile_${savedUser}`);
          if (savedProfile) {
            let parsedProfile = {};
            try {
              parsedProfile = JSON.parse(savedProfile);
              // Normalize profile to handle schema changes
              parsedProfile = normalizeProfile(parsedProfile);
              // Save normalized version back
              localStorage.setItem(`profile_${savedUser}`, JSON.stringify(parsedProfile));
              localStorage.setItem('user_profile', JSON.stringify(parsedProfile));
            } catch {
              /* corrupted profile — start fresh */
            }
            setProfile(parsedProfile);

            // If profile is completed, go to dashboard
            if (users[savedUser].profileCompleted) {
              setAuthState('dashboard');
            } else {
              setAuthState('setup');
            }
          } else {
            setAuthState('setup');
          }
        } else {
          setAuthState('auth');
        }
      } else {
        setAuthState('auth');
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (email, profileCompleted) => {
    setCurrentUser(email);
    if (profileCompleted) {
      // Load existing profile
      const savedProfile = localStorage.getItem(`profile_${email}`);
      if (savedProfile) {
        try {
          let parsedProfile = JSON.parse(savedProfile);
          // Normalize profile to handle schema changes
          parsedProfile = normalizeProfile(parsedProfile);
          setProfile(parsedProfile);
          // Save normalized version back
          localStorage.setItem(`profile_${email}`, JSON.stringify(parsedProfile));
          localStorage.setItem('user_profile', JSON.stringify(parsedProfile));
        } catch (e) {
          console.error('Failed to load profile:', e);
          setProfile({});
        }
      }
      setAuthState('dashboard');
    } else {
      setAuthState('setup');
    }
  };

  const handleProfileComplete = (completedProfile) => {
    setProfile(completedProfile);
    setAuthState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setCurrentUser(null);
    setProfile({});
    setAuthState('auth');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ta' : 'en');

  // Determine current page context
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return 'dashboard';
    if (path.startsWith('/schemes/') && schemeMatch) return 'scheme-detail';
    return 'dashboard'; // Default to dashboard for authenticated state
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    if (!trimmedQuery) return;

    const currentPage = getCurrentPage();

    // Set query parameter based on context
    if (currentPage === 'dashboard') {
      // Stay on Dashboard, update query parameter
      setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
    } else {
      // For other pages, we'll handle this in Dashboard/AllSchemes routing
      // For now, set the query parameter (Dashboard will handle display)
      setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    if (currentUser) {
      localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile));
    }
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
  };

  // For authenticated deep-links, verify the scheme ID actually exists
  useEffect(() => {
    if (!schemeMatch || authState !== 'dashboard') return;
    const { schemeId } = schemeMatch.params;
    fetchScheme(schemeId).then(s => { if (!s) setDeepLinkNotFound(true); });
  }, [schemeMatch?.params?.schemeId, authState]);

  // Deep-link: /schemes/:schemeId
  if (schemeMatch) {
    const { schemeId } = schemeMatch.params;

    if (authState === 'loading') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-400 border-t-transparent"></div>
        </div>
      );
    }

    // Authenticated: render dashboard with that scheme's modal pre-opened
    if (authState === 'dashboard') {
      if (deepLinkNotFound) {
        return (
          <div className={`min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {language === 'en' ? 'Scheme not found.' : 'திட்டம் கண்டுபிடிக்கப்படவில்லை.'}
            </p>
            <button
              onClick={() => { setDeepLinkNotFound(false); navigate('/'); }}
              className="text-primary dark:text-teal-400 underline text-sm"
            >
              {language === 'en' ? '← Back to All Schemes' : '← அனைத்து திட்டங்களுக்கு திரும்பு'}
            </button>
          </div>
        );
      }
      return (
        <div className={`relative ${darkMode ? 'dark' : ''}`}>
          {/* Government Emblem Watermark - Authenticated Pages Only */}
          <div
            className="tn-emblem-watermark"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '450px',
              maxWidth: '40vw',
              height: '450px',
              backgroundImage: 'url(/tn-emblem-watermark.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: darkMode ? 0.10 : 0.08,
              zIndex: 0,
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
          <Dashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            darkMode={darkMode}
            language={language}
            initialSchemeId={schemeId}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
          />
        </div>
      );
    }

    // Not authenticated (or setup-pending): read-only public view with sign-in CTA
    return (
      <SchemePublicView
        schemeId={schemeId}
        darkMode={darkMode}
        language={language}
        onLoginClick={() => navigate('/')}
      />
    );
  }

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-400 border-t-transparent"></div>
      </div>
    );
  }

  // Auth screen
  if (authState === 'auth') {
    return <AuthPage onLogin={handleLogin} darkMode={darkMode} language={language} />;
  }

  // Profile Setup
  if (authState === 'setup') {
    return (
      <ProfileSetup
        onComplete={handleProfileComplete}
        darkMode={darkMode}
        language={language}
        initialProfile={profile}
      />
    );
  }

  // Dashboard
  return (
    <div className={`relative app-background min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Government Emblem Watermark - Authenticated Pages Only */}
      <div
        className="tn-emblem-watermark"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '450px',
          maxWidth: '40vw',
          height: '450px',
          backgroundImage: 'url(/tn-emblem-watermark.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: darkMode ? 0.10 : 0.08,
          zIndex: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Refined Sticky Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0e192d]/90 backdrop-blur-xl shadow-nav-light dark:shadow-sm border-b border-[#dde4ee] dark:border-white/[0.06] py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-8 max-w-[1600px] flex items-center justify-between gap-6">
          {/* Stronger Brand Logo */}
          <div className="text-[24px] font-bold tracking-tight flex-shrink-0">
            <span className="text-[#172033] dark:text-slate-100">Scheme</span>
            <span className="text-[#0f766e] dark:text-teal-400">Ease</span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex-1 transition-all duration-300 max-w-2xl mx-auto ${isScrolled ? 'md:max-w-md ml-8' : 'md:max-w-2xl'}`}
          >
            <div className="relative group">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={language === 'en' ? 'Search schemes by keyword: MSME, student, farmer, scholarship...' : 'திட்டங்களைத் தேடுங்கள்: MSME, மாணவர், விவசாயி, உதவித்தொகை...'}
                className="w-full bg-white dark:bg-[#18273e] text-[#172033] dark:text-slate-100 border border-[#d8e0ea] dark:border-white/[0.08] focus:border-[#0f766e] dark:focus:border-primary focus:ring-2 focus:ring-[#0f766e]/20 dark:focus:ring-primary/20 rounded-xl py-2.5 px-4 pl-11 pr-10 outline-none transition-all placeholder:text-[#7a8799] dark:placeholder:text-slate-500"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#7a8799] dark:text-slate-500 group-focus-within:text-[#0f766e] dark:group-focus-within:text-primary transition-colors" />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.1] text-[#7a8799] dark:text-slate-500 hover:text-[#172033] dark:hover:text-slate-300 transition-colors"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-[#526078] dark:text-slate-300 transition-colors"
              title={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 inline" />
              <span className="ml-1.5 text-xs font-semibold">{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-[#526078] dark:text-slate-300 transition-colors"
              title={language === 'en' ? 'Toggle Dark Mode' : 'இருண்ட பயன்முறையை மாற்றவும்'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 text-sm font-semibold text-[#526078] dark:text-slate-300 hover:text-[#0f766e] dark:hover:text-teal-400 transition-colors"
            >
              {language === 'en' ? 'Sign Out' : 'வெளியேறு'}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Dashboard Application */}
      <Dashboard
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        darkMode={darkMode}
        language={language}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}

export default App;
