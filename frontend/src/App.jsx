import React, { useState, useEffect, useRef } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { AuthPage } from './Auth';
import ProfileSetup from './ProfileSetup';
import { Dashboard } from './sections';
import SchemePublicView from './SchemePublicView';
import { extractProfile, fetchScheme } from './data';
import { motion } from 'framer-motion';
import { Search, Loader2, Mic, MicOff, Moon, Sun, Globe } from 'lucide-react';

function App() {
  const schemeMatch = useMatch('/schemes/:schemeId');
  const navigate = useNavigate();
  const [authState, setAuthState] = useState('loading'); // 'loading', 'auth', 'setup', 'dashboard'
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  // Natural Language Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const voiceSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  const [deepLinkNotFound, setDeepLinkNotFound] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        const users = JSON.parse(localStorage.getItem('schemease_users') || '{}');
        if (users[savedUser]) {
          setCurrentUser(savedUser);

          // Load user's profile
          const savedProfile = localStorage.getItem(`profile_${savedUser}`);
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setProfile(parsedProfile);
            localStorage.setItem('user_profile', savedProfile);

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
        setProfile(JSON.parse(savedProfile));
        localStorage.setItem('user_profile', savedProfile);
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const extracted = await extractProfile(searchQuery);
    if (extracted && extracted.profile) {
      const updatedProfile = { ...profile, ...extracted.profile };
      setProfile(updatedProfile);

      // Save to localStorage
      if (currentUser) {
        localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile));
      }
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    }
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleVoiceSearch = () => {
    if (!voiceSupported) return; // button is hidden when unsupported

    // Stop if already listening
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    setVoiceError('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;

    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      // Auto-submit: kick off profile extraction with the captured transcript
      setIsSearching(true);
      extractProfile(transcript).then((extracted) => {
        if (extracted && extracted.profile) {
          const updatedProfile = { ...profile, ...extracted.profile };
          setProfile(updatedProfile);
          if (currentUser) {
            localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile));
          }
          localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
        }
        setIsSearching(false);
        setSearchQuery('');
      }).catch(() => setIsSearching(false));
    };

    recognition.onerror = (event) => {
      const msgs = {
        'not-allowed': language === 'en' ? 'Microphone access denied. Please allow it in your browser settings.' : 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.',
        'network':     language === 'en' ? 'Network error during voice recognition.' : 'குரல் அங்கீகாரத்தில் நெட்வொர்க் பிழை.',
        'no-speech':   language === 'en' ? 'No speech detected. Please try again.' : 'பேச்சு கண்டறியப்படவில்லை.',
      };
      setVoiceError(msgs[event.error] || (language === 'en' ? `Voice error: ${event.error}` : `பிழை: ${event.error}`));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
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
          <Dashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            darkMode={darkMode}
            language={language}
            initialSchemeId={schemeId}
          />
        </div>
      );
    }

    // Not authenticated: read-only public view with sign-in CTA
    return (
      <SchemePublicView
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
    <div className={`relative ${darkMode ? 'dark' : ''}`}>
      {/* Sticky Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="text-xl font-extrabold tracking-tight text-primary dark:text-teal-400">
            SCHEMEASE
          </div>

          {/* Persistent Search Bar transforming on scroll */}
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex-1 transition-all duration-500 max-w-2xl mx-auto ${isScrolled ? 'md:max-w-md ml-8' : 'md:max-w-2xl'}`}
          >
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVoiceError(''); }}
                placeholder={isListening
                  ? (language === 'en' ? 'Listening…' : 'கேட்கிறது…')
                  : (language === 'en' ? 'E.g. I am a 30 year old SC farmer...' : 'எ.கா. நான் 30 வயது SC விவசாயி...')}
                className={`w-full bg-slate-100/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-sm border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full py-3 px-6 pl-12 pr-12 shadow-inner outline-none transition-all ${isListening ? 'ring-2 ring-red-400/50 border-red-300' : ''}`}
                disabled={isSearching || isListening}
              />
              {isSearching ? (
                <Loader2 className="absolute left-4 top-3.5 w-5 h-5 text-primary animate-spin" />
              ) : (
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              )}
              {voiceSupported ? (
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  disabled={isSearching}
                  className={`absolute right-4 top-3 p-1 rounded-full transition-all disabled:opacity-40 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
                  title={isListening
                    ? (language === 'en' ? 'Stop listening' : 'நிறுத்து')
                    : (language === 'en' ? 'Voice search' : 'குரல் தேடல்')}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              ) : (
                <span
                  className="absolute right-4 top-3 p-1 text-slate-300 dark:text-slate-600 cursor-default"
                  title={language === 'en' ? 'Voice search not supported in this browser. Try Chrome or Edge.' : 'இந்த உலாவியில் குரல் தேடல் ஆதரிக்கப்படவில்லை.'}
                >
                  <MicOff className="w-5 h-5" />
                </span>
              )}
            </div>
            {voiceError && (
              <p className="absolute top-full mt-1 left-4 text-xs text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 shadow-md border border-red-200 dark:border-red-700 z-10">
                {voiceError}
              </p>
            )}
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-xs font-semibold">{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleLogout} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-teal-400 transition-colors">
              {language === 'en' ? 'Sign Out' : 'வெளியேறு'}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Main Dashboard Application */}
      <Dashboard profile={profile} onUpdateProfile={handleUpdateProfile} darkMode={darkMode} language={language} />
    </div>
  );
}

export default App;
