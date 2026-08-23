import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LogIn, AlertCircle } from 'lucide-react';

export const AuthPage = ({ onLogin, darkMode, language }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password || (isSignUp && !trimmedName)) {
      setError(language === 'en' ? 'Please fill in all fields' : 'அனைத்து புலங்களையும் நிரப்பவும்');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(language === 'en' ? 'Please enter a valid email address' : 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்');
      return;
    }

    if (password.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters' : 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்');
      return;
    }

    // Get existing users from localStorage
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem('schemease_users') || '{}');
    } catch {
      users = {};
    }

    setIsLoading(true);

    if (isSignUp) {
      // Sign Up
      if (users[trimmedEmail]) {
        setError(language === 'en' ? 'Email already registered. Please sign in.' : 'மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.');
        setIsLoading(false);
        return;
      }

      // Create new user
      users[trimmedEmail] = {
        name: trimmedName,
        password,
        createdAt: new Date().toISOString(),
        profileCompleted: false
      };
      localStorage.setItem('schemease_users', JSON.stringify(users));
      localStorage.setItem('current_user', trimmedEmail);

      onLogin(trimmedEmail, false); // Pass profileCompleted = false
    } else {
      // Sign In
      if (!users[trimmedEmail]) {
        setError(language === 'en' ? 'Email not found. Please sign up.' : 'மின்னஞ்சல் காணப்படவில்லை.');
        setIsLoading(false);
        return;
      }

      if (users[trimmedEmail].password !== password) {
        setError(language === 'en' ? 'Incorrect password' : 'தவறான கடவுச்சொல்');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('current_user', trimmedEmail);
      onLogin(trimmedEmail, users[trimmedEmail].profileCompleted || false);
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center bg-cover bg-center bg-no-repeat ${darkMode ? 'dark' : ''}`} style={{ backgroundImage: "url('/ribbon-building.jpg')" }}>
      <div className="bg-noise"></div>
      <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/40' : 'bg-slate-900/10'} backdrop-blur-[2px]`}></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1 text-white relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/40 via-black/10 to-transparent -z-10 blur-xl"></div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
            SCHEMEASE <span className="text-teal-400">2.0</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-light mb-8 drop-shadow-md">
            {language === 'en' ? 'Government schemes, made easier to find.' : 'அரசு திட்டங்கள், எளிதாக கண்டுபிடிக்க.'}
          </p>

          <ul className="space-y-3 text-slate-50 font-medium">
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              {language === 'en' ? 'Personalized deterministic scheme matching' : 'தனிப்பயனாக்கப்பட்ட திட்ட பொருத்தம்'}
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              {language === 'en' ? 'Complete document checklists' : 'முழுமையான ஆவண சரிபார்ப்பு பட்டியல்'}
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              {language === 'en' ? 'Cross-category AI-enhanced recommendations' : 'AI மேம்படுத்தப்பட்ட பரிந்துரைகள்'}
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-panel-true glass-shimmer p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  !isSignUp
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                {language === 'en' ? 'Sign In' : 'உள்நுழைவு'}
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                  isSignUp
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                {language === 'en' ? 'Sign Up' : 'பதிவு'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1.5">
                    {language === 'en' ? 'Full Name' : 'முழு பெயர்'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:bg-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                    placeholder={language === 'en' ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடவும்'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">
                  {language === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:bg-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                  placeholder={language === 'en' ? 'your.email@example.com' : 'உங்கள்.மின்னஞ்சல்@example.com'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1.5">
                  {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:bg-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                  placeholder={language === 'en' ? 'Minimum 6 characters' : 'குறைந்தது 6 எழுத்துக்கள்'}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 btn-primary-glow rounded-xl font-bold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? (language === 'en' ? 'Please wait...' : 'காத்திருக்கவும்...')
                  : isSignUp
                    ? (language === 'en' ? 'Create Account' : 'கணக்கை உருவாக்கு')
                    : (language === 'en' ? 'Sign In' : 'உள்நுழைவு')
                }
              </button>
            </form>

            <p className="text-xs text-white/60 font-light mt-6 text-center">
              * {language === 'en'
                ? 'Demo environment. Data stored in browser localStorage.'
                : 'டெமோ சூழல். தரவு உலாவி localStorage இல் சேமிக்கப்பட்டுள்ளது.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
