import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LogIn, AlertCircle, Eye, EyeOff, Check, X, Search, Shield, FileText } from 'lucide-react';

export const AuthPage = ({ onLogin, darkMode, language }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation helper
  const validatePassword = (pwd) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(pwd),
    };
    const allValid = Object.values(checks).every(Boolean);
    return { checks, allValid };
  };

  const passwordValidation = isSignUp ? validatePassword(password) : null;

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

    // Stronger validation only for signups
    if (isSignUp) {
      if (!passwordValidation.allValid) {
        setError(language === 'en'
          ? 'Password must meet all requirements'
          : 'கடவுச்சொல் அனைத்து தேவைகளையும் பூர்த்தி செய்ய வேண்டும்');
        return;
      }
      if (password !== confirmPassword) {
        setError(language === 'en' ? 'Passwords do not match' : 'கடவுச்சொற்கள் பொருந்தவில்லை');
        return;
      }
    } else {
      // For login, keep minimal validation (backwards compatibility)
      if (password.length < 1) {
        setError(language === 'en' ? 'Please enter your password' : 'கடவுச்சொல்லை உள்ளிடவும்');
        return;
      }
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
      {/* Very subtle overlay to ensure text readability while keeping background visible */}
      <div className="absolute inset-0 bg-slate-900/10"></div>

      <div className="container mx-auto px-8 py-12 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">

          {/* Left: SchemeEase Content */}
          <motion.div
            className="flex-1 lg:max-w-[560px] text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Brand */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Scheme<span className="text-teal-400">Ease</span>
            </h1>

            {/* Main Headline */}
            <p className="text-xl lg:text-2xl font-semibold mb-3 leading-tight text-shadow-lg">
              {language === 'en'
                ? 'Find government schemes that match your profile.'
                : 'உங்கள் சுயவிவரத்துடன் பொருந்தும் அரசு திட்டங்களைக் கண்டறியவும்.'}
            </p>

            {/* Supporting Text */}
            <p className="text-base text-slate-100/90 font-bold mb-8 leading-relaxed">
              {language === 'en'
                ? 'Personalized eligibility guidance for government welfare schemes.'
                : 'அரசு நலத்திட்டங்களுக்கான தனிப்பயனாக்கப்பட்ட தகுதி வழிகாட்டுதல்.'}
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                  <Search className="w-6 h-6 text-teal-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'en' ? 'Find relevant schemes' : 'பொருத்தமான திட்டங்களைக் கண்டறியவும்'}
                  </h3>
                  <p className="text-sm text-slate-200/80 font-bold leading-relaxed">
                    {language === 'en'
                      ? 'Get schemes that match your profile and situation.'
                      : 'உங்கள் சுயவிவரம் மற்றும் சூழ்நிலைக்கு பொருந்தும் திட்டங்களைப் பெறுங்கள்.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'en' ? 'Understand your eligibility' : 'உங்கள் தகுதியை புரிந்து கொள்ளுங்கள்'}
                  </h3>
                  <p className="text-sm text-slate-200/80 font-bold leading-relaxed">
                    {language === 'en'
                      ? 'Clear guidance on why you may qualify.'
                      : 'நீங்கள் ஏன் தகுதியுடையவர் என்பதற்கான தெளிவான வழிகாட்டுதல்.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'en' ? 'Know what you need' : 'உங்களுக்கு என்ன தேவை என்பதை அறியுங்கள்'}
                  </h3>
                  <p className="text-sm text-slate-200/80 font-bold leading-relaxed">
                    {language === 'en'
                      ? 'View required documents before you apply.'
                      : 'நீங்கள் விண்ணப்பிக்கும் முன் தேவையான ஆவணங்களைப் பார்க்கவும்.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Auth Card */}

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.22 }}
              className="w-full lg:w-auto lg:min-w-[440px] lg:max-w-[480px]"
            >
              <div
                className="rounded-3xl p-8 shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                {!isSignUp ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-1.5">
                      {language === 'en' ? 'Welcome back' : 'மீண்டும் வரவேற்கிறோம்'}
                    </h2>
                    <p className="text-sm text-white/75 font-bold mb-6">
                      {language === 'en' ? 'Sign in to access your SchemeEase account.' : 'உங்கள் SchemeEase கணக்கை அணுக உள்நுழையவும்.'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-1.5">
                      {language === 'en' ? 'Create your account' : 'உங்கள் கணக்கை உருவாக்கவும்'}
                    </h2>
                    <p className="text-sm text-white/75 font-bold mb-6">
                      {language === 'en' ? 'Get started with SchemeEase today.' : 'இன்று SchemeEase உடன் தொடங்குங்கள்.'}
                    </p>
                  </>
                )}

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
                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 placeholder:font-medium focus:bg-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
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
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:bg-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                      placeholder={language === 'en' ? 'your.email@example.com' : 'உங்கள்.மின்னஞ்சல்@example.com'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1.5">
                      {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 placeholder:font-medium focus:bg-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                        placeholder={language === 'en'
                          ? (isSignUp ? 'Create a strong password' : 'Enter your password')
                          : (isSignUp ? 'வலுவான கடவுச்சொல்லை உருவாக்கவும்' : 'கடவுச்சொல்லை உள்ளிடவும்')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {isSignUp && passwordValidation && (
                      <div className="mt-2 space-y-1">
                        {[
                          { key: 'length', labelEn: '8 or more characters', labelTa: '8 அல்லது அதற்கு மேற்பட்ட எழுத்துக்கள்' },
                          { key: 'uppercase', labelEn: 'Uppercase letter (A-Z)', labelTa: 'பெரிய எழுத்து (A-Z)' },
                          { key: 'lowercase', labelEn: 'Lowercase letter (a-z)', labelTa: 'சிறிய எழுத்து (a-z)' },
                          { key: 'number', labelEn: 'Number (0-9)', labelTa: 'எண் (0-9)' },
                          { key: 'special', labelEn: 'Special character (!@#$...)', labelTa: 'சிறப்பு எழுத்து (!@#$...)' },
                        ].map(({ key, labelEn, labelTa }) => {
                          const isValid = passwordValidation.checks[key];
                          return (
                            <div key={key} className={`flex items-center gap-1.5 text-xs ${isValid ? 'text-green-300' : 'text-white/60'}`}>
                              {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                              <span>{language === 'en' ? labelEn : labelTa}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1.5">
                        {language === 'en' ? 'Confirm Password' : 'கடவுச்சொல்லை உறுதிப்படுத்தவும்'}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 placeholder:font-medium focus:bg-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all"
                          placeholder={language === 'en' ? 'Re-enter your password' : 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

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
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? (language === 'en' ? 'Please wait...' : 'காத்திருக்கவும்...')
                      : isSignUp
                        ? (language === 'en' ? 'Create Account' : 'கணக்கை உருவாக்கு')
                        : (language === 'en' ? 'Sign In' : 'உள்நுழைவு')
                    }
                  </button>
                </form>

                {!isSignUp ? (
                  <p className="text-sm text-white/75 font-bold text-center mt-5">
                    {language === 'en' ? "Don't have an account? " : 'கணக்கு இல்லையா? '}
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        setError('');
                      }}
                      className="text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-2"
                    >
                      {language === 'en' ? 'Create account' : 'கணக்கை உருவாக்கு'}
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-white/75 font-bold text-center mt-5">
                    {language === 'en' ? 'Already have an account? ' : 'ஏற்கனவே கணக்கு உள்ளதா? '}
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setError('');
                      }}
                      className="text-teal-300 hover:text-teal-200 font-semibold underline underline-offset-2"
                    >
                      {language === 'en' ? 'Sign in' : 'உள்நுழையவும்'}
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
