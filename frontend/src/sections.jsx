import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile, sendContactMessage } from './data';
import { GlassCard, GlassPanel, SchemeCard } from './components';
import MissingInfoModal from './MissingInfoModal';
import SchemeDetailModal from './SchemeDetailModal';
import AllSchemes from './AllSchemes';
import ProfileForm from './ProfileForm';
import ProfilePage from './ProfilePage';
// Profile completion percentage removed per product requirement
import { getEligibilityLabel } from './eligibilityLabels';
import { getLocalizedScheme, getLocalizedSchemeName } from './schemeLocalization';
import { searchSchemes } from './schemeSearch';
import { Search, UserCircle, Save, SlidersHorizontal, Bell, FileCheck, HelpCircle, Mail, GitCompare, Share2, ChevronDown, CheckCircle, Clock, X, List, ExternalLink, AlertCircle, AlertTriangle, Trash2, ShieldCheck, Info, Bookmark, Eye, Target, CheckCircle2, Star } from 'lucide-react';

export const Landing = ({ onLogin, darkMode, language }) => {
  return (
    <div className={`min-h-screen relative flex items-center bg-cover bg-center bg-no-repeat ${darkMode ? 'dark' : ''}`} style={{ backgroundImage: "url('/ribbon-building.jpg')" }}>
      {/* Noise Texture Overlay */}
      <div className="bg-noise"></div>

      {/* Very subtle localized backing - minimal darkening */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/12 via-slate-900/4 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          className="flex-1 text-white relative max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6" style={{
            color: 'rgba(255, 255, 255, 0.98)',
            textShadow: '0 2px 6px rgba(0,0,0,0.35)'
          }}>
            <span>SCHEME</span>
            <span className="text-teal-400">EASE</span>
          </h1>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-[32px] font-extrabold leading-tight mb-4" style={{
            color: 'rgba(255, 255, 255, 0.98)',
            textShadow: '0 2px 6px rgba(0,0,0,0.35)'
          }}>
            {language === 'en'
              ? 'Find government schemes that match your profile.'
              : 'உங்கள் சுயவிவரத்துடன் பொருந்தும் அரசு திட்டங்களைக் கண்டறியவும்.'}
          </h2>

          {/* Supporting Text - INCREASED READABILITY */}
          <p className="text-[17px] md:text-[18px] font-bold mb-8 leading-relaxed" style={{
            color: 'rgba(255, 255, 255, 0.96)',
            textShadow: '0 1px 3px rgba(0,0,0,0.45)'
          }}>
            {language === 'en'
              ? 'Personalized eligibility guidance for government welfare schemes.'
              : 'அரசு நல திட்டங்களுக்கான தனிப்பயனாக்கப்பட்ட தகுதி வழிகாட்டுதல்.'}
          </p>

          {/* Feature List with Icons */}
          <div className="space-y-5">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-400/30 backdrop-blur-sm flex-shrink-0">
                <Search className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold mb-1" style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.40)'
                }}>
                  {language === 'en' ? 'Find relevant schemes' : 'பொருத்தமான திட்டங்களைக் கண்டறியவும்'}
                </h3>
                <p className="text-[17px] md:text-[18px] font-bold leading-relaxed" style={{
                  color: 'rgba(255, 255, 255, 0.96)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.45)'
                }}>
                  {language === 'en'
                    ? 'Get schemes that match your profile and situation.'
                    : 'உங்கள் சுயவிவரம் மற்றும் சூழ்நிலைக்கு பொருந்தும் திட்டங்களைப் பெறுங்கள்.'}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-400/30 backdrop-blur-sm flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold mb-1" style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.40)'
                }}>
                  {language === 'en' ? 'Understand your eligibility' : 'உங்கள் தகுதியைப் புரிந்து கொள்ளுங்கள்'}
                </h3>
                <p className="text-[17px] md:text-[18px] font-bold leading-relaxed" style={{
                  color: 'rgba(255, 255, 255, 0.96)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.45)'
                }}>
                  {language === 'en'
                    ? 'Clear guidance on why you may qualify.'
                    : 'நீங்கள் ஏன் தகுதி பெறலாம் என்பது பற்றிய தெளிவான வழிகாட்டுதல்.'}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-400/30 backdrop-blur-sm flex-shrink-0">
                <FileCheck className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold mb-1" style={{
                  color: 'rgba(255, 255, 255, 0.98)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.40)'
                }}>
                  {language === 'en' ? 'Know what you need' : 'உங்களுக்கு என்ன தேவை என்பதை அறியுங்கள்'}
                </h3>
                <p className="text-[17px] md:text-[18px] font-bold leading-relaxed" style={{
                  color: 'rgba(255, 255, 255, 0.96)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.45)'
                }}>
                  {language === 'en'
                    ? 'View required documents before you apply.'
                    : 'நீங்கள் விண்ணப்பிப்பதற்கு முன் தேவையான ஆவணங்களைப் பார்க்கவும்.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Enhanced glass panel */}
          <div className="p-8 rounded-2xl" style={{
            background: 'rgba(30, 41, 59, 0.32)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)'
          }}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{
              color: 'rgba(255, 255, 255, 0.98)',
              textShadow: '0 1px 3px rgba(0,0,0,0.30)'
            }}>
              {language === 'en' ? 'Welcome Back' : 'மீண்டும் வரவேற்கிறோம்'}
            </h2>
            <p className="text-base md:text-[17px] font-bold mb-8 leading-relaxed" style={{
              color: 'rgba(255, 255, 255, 0.92)'
            }}>
              {language === 'en'
                ? 'Sign in to access your SchemeEase account.'
                : 'உங்கள் SchemeEase கணக்கை அணுக உள்நுழையவும்.'}
            </p>

            <button
              onClick={onLogin}
              className="w-full py-3.5 px-4 btn-primary-glow rounded-xl font-bold text-[17px] mb-5"
            >
              {language === 'en' ? 'Sign In to Dashboard' : 'டாஷ்போர்டில் உள்நுழைக'}
            </button>
            <p className="text-sm font-medium" style={{
              color: 'rgba(255, 255, 255, 0.75)'
            }}>
              {language === 'en'
                ? '* This is a demonstration environment. Profile data is stored securely in your browser\'s local storage.'
                : '* இது ஒரு செயல்விளக்க சூழல். உங்கள் சுயவிவர தரவு உங்கள் உலாவியின் உள்ளமைவில் பாதுகாப்பாக சேமிக்கப்படுகிறது.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const safeParseLS = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { localStorage.removeItem(key); return fallback; }
};

export const Dashboard = ({ profile, onUpdateProfile, darkMode, language, initialSchemeId, searchQuery = '', onClearSearch }) => {
  const [schemes, setSchemes] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState(() => safeParseLS('saved_schemes', []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => safeParseLS('recently_viewed', []));
  const compareKey = `compare_list_${(localStorage.getItem('current_user') || 'guest').toLowerCase()}`;
  const [compareList, setCompareList] = useState(() => safeParseLS(compareKey, []).slice(0, 3));
  const [notifications, setNotifications] = useState(() => safeParseLS('notifications', []));
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [missingInfoModal, setMissingInfoModal] = useState({ isOpen: false, schemeData: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, schemeData: null });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem('saved_schemes', JSON.stringify(savedSchemes));
  }, [savedSchemes]);

  useEffect(() => {
    localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(compareKey, JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    if (Object.keys(profile).length > 0) {
      fetchSchemes();
    }
  }, [profile]);

  // Open detail modal when deep-linked to a specific scheme
  useEffect(() => {
    if (!initialSchemeId || !schemes.length) return;
    const match = schemes.find(s => s.scheme.id === initialSchemeId);
    if (match) setDetailModal({ isOpen: true, schemeData: match });
  }, [initialSchemeId, schemes]);

  const fetchSchemes = async () => {
    setLoading(true);
    setFetchError(false);
    const data = await analyzeProfile(profile);
    if (data && data.results) {
      setSchemes(data.results);
      if (data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length > 0) {
        addNotification(`Found ${data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length} eligible schemes for you!`);
      }
    } else {
      setFetchError(true);
    }
    setLoading(false);
  };

  const toggleSave = (id) => {
    setSavedSchemes(prev => {
      const newSaved = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      if (!prev.includes(id)) {
        addNotification(language === 'en' ? 'Scheme saved successfully!' : 'திட்டம் வெற்றிகரமாக சேமிக்கப்பட்டது!');
      }
      return newSaved;
    });
  };

  const addToCompare = (schemeData) => {
    if (compareList.length >= 3) {
      alert(language === 'en'
        ? 'You can compare up to 3 schemes at a time'
        : 'ஒரே நேரத்தில் அதிகபட்சம் 3 திட்டங்களை ஒப்பிடலாம்');
      return;
    }
    if (!compareList.find(s => s.scheme_id === schemeData.scheme_id)) {
      setCompareList([...compareList, schemeData]);
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(s => s.scheme_id !== id));
  };

  const addToRecentlyViewed = (schemeId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== schemeId);
      return [schemeId, ...filtered].slice(0, 10);
    });
  };

  const addNotification = (message) => {
    const newNotif = { id: Date.now(), message, time: new Date().toLocaleString(), read: false };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    if (activeTab === 'notifications') markAllNotificationsRead();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'profile') setIsEditingProfile(false);
  }, [activeTab]);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleProvideMissingInfo = (schemeData) => {
    setMissingInfoModal({ isOpen: true, schemeData });
  };

  const handleViewDetails = (schemeData) => {
    setDetailModal({ isOpen: true, schemeData });
    addToRecentlyViewed(schemeData.scheme_id);
  };

  const handleMissingInfoSubmit = async (updatedProfile) => {
    // Update the profile
    onUpdateProfile(updatedProfile);

    // Re-run eligibility evaluation
    setLoading(true);
    const data = await analyzeProfile(updatedProfile);
    if (data && data.results) {
      setSchemes(data.results);
      addNotification(language === 'en'
        ? `Eligibility updated! Found ${data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length} eligible schemes.`
        : `தகுதி புதுப்பிக்கப்பட்டது! ${data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length} தகுதியான திட்டங்கள் கண்டறியப்பட்டன.`
      );
    }
    setLoading(false);
  };

  // Separate schemes by eligibility status
  const fullyEligibleSchemes = schemes.filter(s => s.eligibility_status === 'ELIGIBLE');
  const needsMoreInfoSchemes = schemes.filter(s => s.eligibility_status === 'NEEDS_MORE_INFO');

  // Filtering
  const filteredEligible = filterCategory === 'all'
    ? fullyEligibleSchemes
    : fullyEligibleSchemes.filter(s => s.scheme.category === filterCategory);

  const filteredNeedsInfo = filterCategory === 'all'
    ? needsMoreInfoSchemes
    : needsMoreInfoSchemes.filter(s => s.scheme.category === filterCategory);

  // Sorting
  const sortedEligible = [...filteredEligible].sort((a, b) => {
    if (sortBy === 'relevance') return b.relevance_score - a.relevance_score;
    if (sortBy === 'category') return a.scheme.category.localeCompare(b.scheme.category);
    if (sortBy === 'department') return a.scheme.department.localeCompare(b.scheme.department);
    return 0;
  });

  const sortedNeedsInfo = [...filteredNeedsInfo].sort((a, b) => {
    if (sortBy === 'relevance') return b.relevance_score - a.relevance_score;
    if (sortBy === 'category') return a.scheme.category.localeCompare(b.scheme.category);
    if (sortBy === 'department') return a.scheme.department.localeCompare(b.scheme.department);
    return 0;
  });

  // Apply search if active
  let displaySchemes = {
    bestMatches: [],
    otherEligible: [],
    needsInfo: [],
  };

  if (searchQuery && searchQuery.trim()) {
    // Search mode: search across all schemes regardless of eligibility
    const searchResults = searchSchemes(schemes, searchQuery, language, { includeEligibility: true });

    // Separate search results by eligibility for display
    const eligible = searchResults.filter(s => s.eligibility_status === 'ELIGIBLE');
    const needsInfo = searchResults.filter(s => s.eligibility_status === 'NEEDS_MORE_INFO');
    const notEligible = searchResults.filter(s => s.eligibility_status === 'NOT_ELIGIBLE');

    displaySchemes = {
      searchActive: true,
      searchQuery: searchQuery,
      eligible,
      needsInfo,
      notEligible,
      totalResults: searchResults.length,
    };
  } else {
    // Normal mode: show filtered/sorted eligible schemes
    const bestMatches = sortedEligible.slice(0, Math.min(5, Math.ceil(sortedEligible.length * 0.3)));
    const otherEligible = sortedEligible.slice(bestMatches.length);

    displaySchemes = {
      searchActive: false,
      bestMatches,
      otherEligible,
      needsInfo: sortedNeedsInfo,
    };
  }

  const eligibleSchemes = schemes.filter(s => s.eligibility_status === 'ELIGIBLE' || s.eligibility_status === 'NEEDS_MORE_INFO');
  const categories = ['all', ...new Set(schemes.map(s => s.scheme.category))];
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen relative pt-20 transition-colors duration-300 ${compareList.length > 0 ? 'pb-32' : 'pb-12'}`}>
      {/* Missing Info Modal */}
      <MissingInfoModal
        isOpen={missingInfoModal.isOpen}
        onClose={() => setMissingInfoModal({ isOpen: false, schemeData: null })}
        schemeName={missingInfoModal.schemeData?.scheme?.name || ''}
        missingFields={missingInfoModal.schemeData?.missing_information || []}
        currentProfile={profile}
        onSubmit={handleMissingInfoSubmit}
        darkMode={darkMode}
        language={language}
      />

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, schemeData: null })}
        schemeData={detailModal.schemeData}
        saved={detailModal.schemeData ? savedSchemes.includes(detailModal.schemeData.scheme_id) : false}
        onSave={toggleSave}
        onCompare={addToCompare}
        onProvideMissingInfo={handleProvideMissingInfo}
        darkMode={darkMode}
        language={language}
      />
      {/* Floating Compare Tray */}
      <AnimatePresence>
        {compareList.length > 0 && activeTab !== 'compare' && (
          <CompareTray
            compareList={compareList}
            onRemove={removeFromCompare}
            onCompareNow={() => setActiveTab('compare')}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Background handled by app-background class in App.jsx */}

      {/* Personalized Welcome & Stats (only show when schemes loaded and NOT in search mode) */}
      {!loading && schemes.length > 0 && activeTab === 'recommendations' && !displaySchemes.searchActive && (
        <div className="container mx-auto px-8 max-w-[1600px] mb-6 space-y-5">
          {/* Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 relative overflow-hidden shadow-sm dark:shadow-none"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f766e] dark:bg-[#0f766e] rounded-l-xl"></div>

            <div className="flex items-center justify-between gap-4 pl-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0f766e]/10 dark:bg-[#0f766e]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-[#0f766e] dark:text-[#5eead4]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#172033] dark:text-white mb-0.5">
                    {language === 'en'
                      ? `${sortedEligible.length} eligible schemes`
                      : `${sortedEligible.length} தகுதியான திட்டங்கள்`}
                  </h2>
                  <p className="text-sm text-[#526078] dark:text-[#94a3b8]">
                    {language === 'en'
                      ? `${displaySchemes.bestMatches?.length || 0} most relevant · ${sortedEligible.length - (displaySchemes.bestMatches?.length || 0)} other eligible · ${sortedNeedsInfo.length} need more info`
                      : `${displaySchemes.bestMatches?.length || 0} மிகவும் பொருத்தமான · ${sortedEligible.length - (displaySchemes.bestMatches?.length || 0)} பிற தகுதியானவை · ${sortedNeedsInfo.length} கூடுதல் தகவல்`}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 transition-all duration-200 hover:shadow-md dark:hover:border-[rgba(148,163,184,0.22)] hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0f766e]/10 dark:bg-[#0f766e]/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#0f766e] dark:text-[#5eead4]" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-[#0f766e] dark:text-[#5eead4] mb-1">
                    {sortedEligible.length}
                  </div>
                  <div className="text-sm font-semibold text-[#172033] dark:text-white mb-1">
                    {language === 'en' ? 'Eligible Schemes' : 'தகுதியான திட்டங்கள்'}
                  </div>
                  <div className="text-xs text-[#526078] dark:text-[#94a3b8]">
                    {language === 'en' ? 'Schemes you may qualify for' : 'நீங்கள் தகுதி பெறக்கூடிய திட்டங்கள்'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 transition-all duration-200 hover:shadow-md dark:hover:border-[rgba(148,163,184,0.22)] hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                    {sortedNeedsInfo.length}
                  </div>
                  <div className="text-sm font-semibold text-[#172033] dark:text-white mb-1">
                    {language === 'en' ? 'Needs More Info' : 'கூடுதல் தகவல்'}
                  </div>
                  <div className="text-xs text-[#526078] dark:text-[#94a3b8]">
                    {language === 'en' ? 'Schemes needing more details' : 'கூடுதல் விவரங்கள் தேவை'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 transition-all duration-200 hover:shadow-md dark:hover:border-[rgba(148,163,184,0.22)] hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {savedSchemes.length}
                  </div>
                  <div className="text-sm font-semibold text-[#172033] dark:text-white mb-1">
                    {language === 'en' ? 'Saved Schemes' : 'சேமிக்கப்பட்டது'}
                  </div>
                  <div className="text-xs text-[#526078] dark:text-[#94a3b8]">
                    {language === 'en' ? "Schemes you've saved" : 'நீங்கள் சேமித்த திட்டங்கள்'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 transition-all duration-200 hover:shadow-md dark:hover:border-[rgba(148,163,184,0.22)] hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {recentlyViewed.length}
                  </div>
                  <div className="text-sm font-semibold text-[#172033] dark:text-white mb-1">
                    {language === 'en' ? 'Recently Viewed' : 'சமீபத்தில்'}
                  </div>
                  <div className="text-xs text-[#526078] dark:text-[#94a3b8]">
                    {language === 'en' ? "Schemes you've seen recently" : 'சமீபத்தில் பார்த்த திட்டங்கள்'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Tracker quick summary */}
          {(() => {
            const td = loadTrackerData();
            if (!td.length) return null;
            return (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#526078] dark:text-[#94a3b8]">
                  {language === 'en' ? 'Tracker:' : 'கண்காணிப்பு:'}
                </span>
                <span className="text-sm font-medium text-[#0f766e] dark:text-[#5eead4]">
                  {language === 'en' ? `${td.length} tracked` : `${td.length} கண்காணிக்கப்படுகிறது`}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      <div className="container mx-auto px-8 max-w-[1600px]">

        {/* Refined Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-7 border-b border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] overflow-x-auto">
          <TabButton active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} darkMode={darkMode}>
            <Star className="w-4 h-4" />
            {language === 'en' ? 'Recommended' : 'பரிந்துரை'}
          </TabButton>
          <TabButton active={activeTab === 'all-schemes'} onClick={() => setActiveTab('all-schemes')} darkMode={darkMode}>
            <List className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'All Schemes' : 'அனைத்து திட்டங்கள்'}
          </TabButton>
          <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} darkMode={darkMode}>
            <Save className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Saved' : 'சேமிப்பு'} ({savedSchemes.length})
          </TabButton>
          <TabButton active={activeTab === 'recent'} onClick={() => setActiveTab('recent')} darkMode={darkMode}>
            <Clock className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Recently Viewed' : 'சமீபத்தில்'}
          </TabButton>
          <TabButton active={activeTab === 'compare'} onClick={() => setActiveTab('compare')} darkMode={darkMode}>
            <GitCompare className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Compare' : 'ஒப்பிடு'} ({compareList.length})
          </TabButton>
          <TabButton active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} darkMode={darkMode}>
            <FileCheck className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Tracker' : 'கண்காணிப்பு'}
          </TabButton>
          <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} darkMode={darkMode}>
            <Bell className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Notifications' : 'அறிவிப்புகள்'}
            {unreadNotifCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unreadNotifCount}</span>}
          </TabButton>
          <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} darkMode={darkMode}>
            <HelpCircle className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'FAQ' : 'கேள்விகள்'}
          </TabButton>
          <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} darkMode={darkMode}>
            <Mail className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'Contact' : 'தொடர்பு'}
          </TabButton>
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} darkMode={darkMode}>
            <UserCircle className="w-4 h-4 inline mr-1" />
            {language === 'en' ? 'My Profile' : 'சுயவிவரம்'}
          </TabButton>
        </div>

        {/* Filter and Sort Controls */}
        {activeTab === 'recommendations' && !loading && eligibleSchemes.length > 0 && (
          <div className="bg-white dark:bg-[var(--secondary-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl px-4 py-3 mb-7 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#526078] dark:text-[#94a3b8] whitespace-nowrap">
                {language === 'en' ? 'Category:' : 'வகை:'}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border border-[#d8e0ea] dark:border-[rgba(148,163,184,0.14)] rounded-lg bg-white dark:bg-[var(--elevated-surface)] text-[#172033] dark:text-white text-sm focus:ring-2 focus:ring-[#0f766e]/20 dark:focus:ring-[#5eead4]/20 focus:border-[#0f766e] dark:focus:border-[#5eead4] outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? (language === 'en' ? 'All Categories' : 'அனைத்து வகைகள்') : cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#526078] dark:text-[#94a3b8] whitespace-nowrap">
                {language === 'en' ? 'Sort By:' : 'வரிசைப்படுத்து:'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-[#d8e0ea] dark:border-[rgba(148,163,184,0.14)] rounded-lg bg-white dark:bg-[var(--elevated-surface)] text-[#172033] dark:text-white text-sm focus:ring-2 focus:ring-[#0f766e]/20 dark:focus:ring-[#5eead4]/20 focus:border-[#0f766e] dark:focus:border-[#5eead4] outline-none transition-all"
              >
                <option value="relevance">{language === 'en' ? 'Most Relevant' : 'மிகவும் பொருத்தமான'}</option>
                <option value="category">{language === 'en' ? 'Category' : 'வகை'}</option>
                <option value="department">{language === 'en' ? 'Department' : 'துறை'}</option>
              </select>
            </div>
            <button className="ml-auto px-3 py-1.5 text-sm font-medium text-[#526078] dark:text-[#94a3b8] hover:text-[#0f766e] dark:hover:text-[#5eead4] flex items-center gap-2 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              {language === 'en' ? 'Filters' : 'வடிகட்டிகள்'}
            </button>
          </div>
        )}

        {fetchError && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>
              {language === 'en'
                ? 'Unable to reach the server. Please check your connection and '
                : 'சேவையகத்தை அணுக முடியவில்லை. '}
              <button onClick={fetchSchemes} className="underline font-semibold">
                {language === 'en' ? 'try again' : 'மீண்டும் முயற்சிக்கவும்'}
              </button>.
            </span>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-primary"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'recommendations' && (
                <div className="space-y-12">
                  {/* Search Results Header */}
                  {displaySchemes.searchActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[var(--secondary-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 mb-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Search className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#526078] dark:text-[#94a3b8] mb-1">
                              {language === 'en' ? 'Search results for' : 'தேடல் முடிவுகள்'}
                            </p>
                            <h3 className="text-lg font-bold text-[#172033] dark:text-slate-100 truncate">
                              "{displaySchemes.searchQuery}"
                            </h3>
                            <p className="text-sm text-[#526078] dark:text-[#94a3b8] mt-1">
                              {displaySchemes.totalResults} {language === 'en' ? 'scheme(s) found' : 'திட்டம்/திட்டங்கள் கண்டுபிடிக்கப்பட்டன'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={onClearSearch}
                          className="px-4 py-2 text-sm font-medium text-[#526078] dark:text-[#94a3b8] hover:text-[#0f766e] dark:hover:text-[#5eead4] border border-[#d8e0ea] dark:border-[rgba(148,163,184,0.14)] rounded-lg hover:border-[#0f766e] dark:hover:border-[#5eead4] transition-colors whitespace-nowrap"
                        >
                          {language === 'en' ? 'Clear Search' : 'தேடலை அழி'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {displaySchemes.searchActive && displaySchemes.totalResults === 0 ? (
                    <div className="text-center py-16">
                      <Search className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'en' ? 'No schemes found' : 'திட்டங்கள் எதுவும் கிடைக்கவில்லை'}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {language === 'en'
                          ? `No schemes match "${displaySchemes.searchQuery}". Try different keywords or browse all schemes.`
                          : `"${displaySchemes.searchQuery}" உடன் பொருந்தும் திட்டங்கள் இல்லை. வேறு முக்கிய வார்த்தைகளை முயற்சிக்கவும்.`}
                      </p>
                      <button
                        onClick={onClearSearch}
                        className="text-[#0f766e] dark:text-[#5eead4] hover:underline text-sm font-medium"
                      >
                        {language === 'en' ? '← Back to recommendations' : '← பரிந்துரைகளுக்குத் திரும்பு'}
                      </button>
                    </div>
                  ) : !displaySchemes.searchActive && sortedEligible.length === 0 && sortedNeedsInfo.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      {language === 'en' ? 'Update your profile to discover eligible schemes.' : 'தகுதியான திட்டங்களைக் கண்டறிய உங்கள் சுயவிவரத்தைப் புதுப்பிக்கவும்.'}
                    </div>
                  ) : (
                    <>
                      {/* Search Mode: Show eligible results */}
                      {displaySchemes.searchActive && displaySchemes.eligible && displaySchemes.eligible.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#0f766e] dark:text-[#5eead4] leading-tight mb-1">
                              {language === 'en' ? `Eligible (${displaySchemes.eligible.length})` : `தகுதியானவை (${displaySchemes.eligible.length})`}
                            </h2>
                            <div className="w-16 h-0.5 bg-[#0f766e] dark:bg-[#5eead4]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.eligible.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Search Mode: Show needs-more-info results */}
                      {displaySchemes.searchActive && displaySchemes.needsInfo && displaySchemes.needsInfo.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#0f766e] dark:text-[#5eead4] leading-tight mb-1">
                              {language === 'en' ? `Needs More Information (${displaySchemes.needsInfo.length})` : `கூடுதல் தகவல் தேவை (${displaySchemes.needsInfo.length})`}
                            </h2>
                            <div className="w-16 h-0.5 bg-[#0f766e] dark:bg-[#5eead4]"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.needsInfo.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Search Mode: Show not-eligible results */}
                      {displaySchemes.searchActive && displaySchemes.notEligible && displaySchemes.notEligible.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-tight mb-1">
                              {language === 'en' ? `Not Eligible (${displaySchemes.notEligible.length})` : `தகுதியற்றவை (${displaySchemes.notEligible.length})`}
                            </h2>
                            <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
                            <p className="text-sm text-[#526078] dark:text-[#94a3b8] mt-2">
                              {language === 'en' ? 'These schemes do not match your current profile criteria' : 'இந்த திட்டங்கள் உங்கள் தற்போதைய சுயவிவர நிபந்தனைகளுக்கு பொருந்தவில்லை'}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.notEligible.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Normal Mode: Most Relevant Schemes Section */}
                      {!displaySchemes.searchActive && displaySchemes.bestMatches && displaySchemes.bestMatches.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 rounded-full bg-[#0f766e]/10 dark:bg-[#5eead4]/10 flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-[#0f766e] dark:text-[#5eead4]" />
                              </div>
                              <div className="flex-1">
                                <h2 className="text-xl font-bold text-[#0f766e] dark:text-[#5eead4] leading-tight">
                                  {language === 'en' ? 'Most Relevant Schemes' : 'மிகவும் பொருத்தமான திட்டங்கள்'}
                                </h2>
                                <div className="w-16 h-0.5 bg-[#0f766e] dark:bg-[#5eead4] mt-1"></div>
                              </div>
                            </div>
                            <p className="text-sm text-[#526078] dark:text-[#94a3b8] leading-relaxed ml-12">
                              {language === 'en' ? 'Schemes that closely match your profile' : 'உங்கள் சுயவிவரத்துடன் நெருக்கமாக பொருந்தும் திட்டங்கள்'}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.bestMatches.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Normal Mode: Other Eligible Schemes Section */}
                      {!displaySchemes.searchActive && displaySchemes.otherEligible && displaySchemes.otherEligible.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#0f766e] dark:text-[#5eead4] leading-tight mb-1">
                              {language === 'en' ? 'Other Eligible Schemes' : 'பிற தகுதியான திட்டங்கள்'}
                            </h2>
                            <div className="w-16 h-0.5 bg-[#0f766e] dark:bg-[#5eead4]"></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.otherEligible.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Normal Mode: Needs More Info Section */}
                      {!displaySchemes.searchActive && displaySchemes.needsInfo && displaySchemes.needsInfo.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-5"
                        >
                          <div className="mb-5">
                            <h2 className="text-xl font-bold text-[#0f766e] dark:text-[#5eead4] leading-tight mb-1">
                              {language === 'en' ? 'Needs More Information' : 'கூடுதல் தகவல் தேவை'}
                            </h2>
                            <div className="w-16 h-0.5 bg-[#0f766e] dark:bg-[#5eead4] mb-2"></div>
                            <p className="text-sm text-[#526078] dark:text-[#94a3b8] leading-relaxed">
                              {language === 'en' ? 'Provide additional details to determine eligibility' : 'தகுதியைத் தீர்மானிக்க கூடுதல் விவரங்களை வழங்கவும்'}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySchemes.needsInfo.map(s => (
                              <SchemeCard
                                key={s.scheme_id}
                                schemeData={s}
                                saved={savedSchemes.includes(s.scheme_id)}
                                onSave={toggleSave}
                                onCompare={addToCompare}
                                onView={() => addToRecentlyViewed(s.scheme_id)}
                                onViewDetails={handleViewDetails}
                                onProvideMissingInfo={handleProvideMissingInfo}
                                darkMode={darkMode}
                                language={language}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {schemes.filter(s => savedSchemes.includes(s.scheme_id)).map(s => (
                    <SchemeCard
                      key={s.scheme_id}
                      schemeData={s}
                      saved={true}
                      onSave={toggleSave}
                      onCompare={addToCompare}
                      onView={() => addToRecentlyViewed(s.scheme_id)}
                      onViewDetails={handleViewDetails}
                      onProvideMissingInfo={handleProvideMissingInfo}
                      darkMode={darkMode}
                      language={language}
                    />
                  ))}
                  {savedSchemes.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                      {language === 'en' ? "You haven't saved any schemes yet." : 'நீங்கள் இன்னும் எந்த திட்டங்களையும் சேமிக்கவில்லை.'}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {schemes.filter(s => recentlyViewed.includes(s.scheme_id)).map(s => (
                    <SchemeCard
                      key={s.scheme_id}
                      schemeData={s}
                      saved={savedSchemes.includes(s.scheme_id)}
                      onSave={toggleSave}
                      onCompare={addToCompare}
                      onView={() => addToRecentlyViewed(s.scheme_id)}
                      onViewDetails={handleViewDetails}
                      onProvideMissingInfo={handleProvideMissingInfo}
                      darkMode={darkMode}
                      language={language}
                    />
                  ))}
                  {recentlyViewed.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                      {language === 'en' ? 'No recently viewed schemes.' : 'சமீபத்தில் பார்த்த திட்டங்கள் இல்லை.'}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'all-schemes' && (
                <AllSchemes
                  profile={profile}
                  onUpdateProfile={onUpdateProfile}
                  onProvideMissingInfo={handleProvideMissingInfo}
                  onViewDetails={handleViewDetails}
                  savedSchemes={savedSchemes}
                  onSave={toggleSave}
                  onCompare={addToCompare}
                  onView={addToRecentlyViewed}
                  darkMode={darkMode}
                  language={language}
                  searchQuery={searchQuery}
                  onClearSearch={onClearSearch}
                />
              )}

              {activeTab === 'compare' && (
                <ComparisonView schemes={compareList} onRemove={removeFromCompare} darkMode={darkMode} language={language} />
              )}

              {activeTab === 'tracker' && (
                <ApplicationTracker savedSchemes={schemes.filter(s => savedSchemes.includes(s.scheme_id))} darkMode={darkMode} language={language} />
              )}

              {activeTab === 'notifications' && (
                <NotificationsPanel
                  notifications={notifications}
                  onMarkRead={markNotificationRead}
                  onClearAll={clearAllNotifications}
                  darkMode={darkMode}
                  language={language}
                />
              )}

              {activeTab === 'faq' && <FAQSection darkMode={darkMode} language={language} />}

              {activeTab === 'contact' && <ContactSection darkMode={darkMode} language={language} />}

              {activeTab === 'profile' && (
                isEditingProfile ? (
                  <ProfileEditor
                    profile={profile}
                    onUpdate={(updated) => {
                      onUpdateProfile(updated);
                      setIsEditingProfile(false);
                    }}
                    onCancel={() => setIsEditingProfile(false)}
                    darkMode={darkMode}
                    language={language}
                  />
                ) : (
                  <ProfilePage
                    profile={profile}
                    onUpdate={onUpdateProfile}
                    onEdit={() => setIsEditingProfile(true)}
                    darkMode={darkMode}
                    language={language}
                  />
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// Refined Tab Button Component
const TabButton = ({ children, active, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`relative font-medium py-3 px-4 transition-all whitespace-nowrap text-sm flex items-center gap-2 ${
      active
        ? 'text-[#0f766e] dark:text-[#5eead4]'
        : 'text-[#526078] dark:text-[#94a3b8] hover:text-[#172033] dark:hover:text-white'
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f766e] dark:bg-[#5eead4]"
        initial={false}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);

// Floating Compare Tray
const CompareTray = ({ compareList, onRemove, onCompareNow, language }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-2xl"
  >
    <div className="container mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 flex-shrink-0">
        <GitCompare className="w-4 h-4 text-primary dark:text-teal-400" />
        {language === 'en' ? 'Comparing' : 'ஒப்பிடுகிறது'} ({compareList.length}/3)
      </span>
      <div className="flex flex-wrap gap-2 flex-1">
        {compareList.map(s => {
          const schemeName = getLocalizedSchemeName(s.scheme, language);
          return (
            <span key={s.scheme_id} className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-800 dark:text-teal-200 text-xs font-medium px-3 py-1.5 rounded-full">
              {schemeName.length > 30 ? schemeName.slice(0, 30) + '…' : schemeName}
              <button onClick={() => onRemove(s.scheme_id)} className="hover:text-red-500 transition-colors ml-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          );
        })}
      </div>
      <button
        onClick={onCompareNow}
        className="flex-shrink-0 px-5 py-2 bg-primary hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors"
      >
        {language === 'en' ? 'Compare Now' : 'இப்போது ஒப்பிடு'}
      </button>
    </div>
  </motion.div>
);

// Comparison View Component
const ComparisonView = ({ schemes, onRemove, darkMode, language }) => {
  if (schemes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        {language === 'en' ? 'Add schemes to comparison from the recommendations tab.' : 'பரிந்துரைகள் தாவலில் இருந்து திட்டங்களை ஒப்பிடவும்.'}
      </div>
    );
  }

  // Localize all schemes once at the start
  const localizedSchemes = schemes.map(s => ({
    ...s,
    localizedScheme: getLocalizedScheme(s.scheme, language)
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse bg-white dark:bg-slate-800 rounded-lg shadow">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="p-4 text-left font-bold text-slate-700 dark:text-slate-200 sticky left-0 z-10 bg-slate-100 dark:bg-slate-700">
              {language === 'en' ? 'Attribute' : 'பண்பு'}
            </th>
            {localizedSchemes.map(s => (
              <th key={s.scheme_id} className="p-4 text-left relative min-w-[200px]">
                <button
                  onClick={() => onRemove(s.scheme_id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 pr-8">{s.localizedScheme.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-white dark:bg-slate-800">{language === 'en' ? 'Department' : 'துறை'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400 text-sm">{s.localizedScheme.department}</td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">{language === 'en' ? 'Official URL' : 'அதிகாரப்பூர்வ இணைப்பு'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4 text-sm">
                {s.scheme.officialUrl
                  ? <a href={s.scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline break-all">{s.scheme.officialUrl}</a>
                  : <span className="text-slate-400 dark:text-slate-500">—</span>
                }
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-white dark:bg-slate-800">{language === 'en' ? 'Matched Criteria' : 'பொருந்திய நிபந்தனைகள்'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4">
                {s.matched_criteria?.length > 0
                  ? <div className="flex flex-wrap gap-1">{s.matched_criteria.map(c => (
                      <span key={c} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs border border-green-200 dark:border-green-700">✓ {getEligibilityLabel(c, language)}</span>
                    ))}</div>
                  : <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
                }
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">{language === 'en' ? 'Missing Info' : 'விடுபட்ட தகவல்'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4">
                {s.missing_information?.length > 0
                  ? <div className="flex flex-wrap gap-1">{s.missing_information.map(c => (
                      <span key={c} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded text-xs border border-yellow-200 dark:border-yellow-700">? {getEligibilityLabel(c, language)}</span>
                    ))}</div>
                  : <span className="text-green-600 dark:text-green-400 text-sm">✓ {language === 'en' ? 'None' : 'இல்லை'}</span>
                }
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-white dark:bg-slate-800">{language === 'en' ? 'Failed Criteria' : 'தோல்வியடைந்த நிபந்தனைகள்'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4">
                {s.failed_criteria?.length > 0
                  ? <div className="flex flex-wrap gap-1">{s.failed_criteria.map(c => (
                      <span key={c} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded text-xs border border-red-200 dark:border-red-700">✕ {getEligibilityLabel(c, language)}</span>
                    ))}</div>
                  : <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
                }
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-slate-50 dark:bg-slate-800">{language === 'en' ? 'Application Method' : 'விண்ணப்பிக்கும் முறை'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                {s.localizedScheme.applicationMethod || <span className="text-slate-400 dark:text-slate-500">—</span>}
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 z-10 bg-white dark:bg-slate-800">{language === 'en' ? 'Documents Required' : 'தேவையான ஆவணங்கள்'}</td>
            {localizedSchemes.map(s => (
              <td key={s.scheme_id} className="p-4">
                <ul className="space-y-1">
                  {s.localizedScheme.documents.map((doc, i) => (
                    <li key={i} className="text-slate-600 dark:text-slate-400 text-sm flex gap-1.5 items-start">
                      <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>{doc}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// --- Application Tracker data layer ---

// Sequential stages leading to a final outcome
export const APPLICATION_STAGES = [
  'Not Started',
  'Preparing Documents',
  'Ready to Apply',
  'Application Submitted',
  'Under Review',
];

// Alternative final outcomes (mutually exclusive)
export const APPLICATION_OUTCOMES = ['Approved', 'Rejected'];

// All possible statuses for dropdown/selection
export const ALL_APPLICATION_STATUSES = [...APPLICATION_STAGES, ...APPLICATION_OUTCOMES];

const getTrackerKey = () =>
  `application_tracker_${(localStorage.getItem('current_user') || 'guest').toLowerCase()}`;

// Upgrades a persisted record to the current shape without losing existing fields.
// Converts locale-string lastUpdated to ISO; fills missing fields with empty strings.
// Migrates old status values to new branching model.
const migrateTrackerRecord = (record) => {
  let lastUpdated = record.lastUpdated || new Date().toISOString();
  // If it looks like a locale string (contains '/' or ',') convert it
  if (lastUpdated && (lastUpdated.includes('/') || lastUpdated.includes(','))) {
    const parsed = new Date(lastUpdated);
    lastUpdated = isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }

  // Migrate old status values to new model
  let status = record.status || 'Not Started';
  const oldToNew = {
    'Documents Prepared': 'Preparing Documents',
    // All others remain the same
  };
  status = oldToNew[status] || status;

  // Ensure status is valid (fallback to first stage if unknown)
  if (!ALL_APPLICATION_STATUSES.includes(status)) {
    status = APPLICATION_STAGES[0];
  }

  return {
    ...record,
    status,
    applicationDate: record.applicationDate ?? '',
    referenceNumber: record.referenceNumber ?? '',
    notes: record.notes ?? '',
    nextAction: record.nextAction ?? '',
    lastUpdated,
  };
};

const loadTrackerData = () => {
  const key = getTrackerKey();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw).map(migrateTrackerRecord);
    const legacy = localStorage.getItem('application_tracker');
    if (legacy) {
      const migrated = JSON.parse(legacy).map(migrateTrackerRecord);
      localStorage.setItem(key, JSON.stringify(migrated));
      localStorage.removeItem('application_tracker');
      return migrated;
    }
  } catch {
    localStorage.removeItem(key);
  }
  return [];
};

// Application Tracker Component
const ApplicationTracker = ({ savedSchemes, darkMode, language }) => {
  const [applications, setApplications] = useState(() => loadTrackerData());
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const persist = (updated) => {
    setApplications(updated);
    localStorage.setItem(getTrackerKey(), JSON.stringify(updated));
  };

  const updateStatus = (schemeId, status) => {
    persist(applications.map(app =>
      app.schemeId === schemeId ? { ...app, status, lastUpdated: new Date().toISOString() } : app
    ));
  };

  const updateField = (appId, field, value) => {
    persist(applications.map(app =>
      app.id === appId ? { ...app, [field]: value, lastUpdated: new Date().toISOString() } : app
    ));
  };

  const removeApplication = (appId) => {
    persist(applications.filter(app => app.id !== appId));
    if (expandedId === appId) setExpandedId(null);
    setDeleteConfirmId(null);
  };

  const addApplication = (schemeId, schemeName) => {
    if (applications.some(app => app.schemeId === schemeId)) return;
    const newApp = {
      id: Date.now(),
      schemeId,
      schemeName,
      status: APPLICATION_STAGES[0],
      applicationDate: '',
      referenceNumber: '',
      notes: '',
      nextAction: '',
      lastUpdated: new Date().toISOString(),
    };
    persist([newApp, ...applications]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {language === 'en' ? 'Application Tracker' : 'விண்ணப்ப கண்காணிப்பு'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {language === 'en'
            ? 'Progress is tracked manually by you — SchemEase does not connect to government application portals.'
            : 'முன்னேற்றம் உங்களால் கைமுறையாக கண்காணிக்கப்படுகிறது — SchemEase அரசு போர்ட்டல்களுடன் இணைக்கப்படவில்லை.'}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {language === 'en'
            ? 'No applications tracked yet. Add schemes from your saved list to track progress.'
            : 'இன்னும் விண்ணப்பங்கள் இல்லை. உங்கள் சேமித்த பட்டியலில் இருந்து திட்டங்களைச் சேர்க்கவும்.'}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const isExpanded = expandedId === app.id;
            const isConfirmingDelete = deleteConfirmId === app.id;
            const lastUpdatedDisplay = (() => {
              try { return new Date(app.lastUpdated).toLocaleDateString(); } catch { return app.lastUpdated; }
            })();

            // Determine current state
            const isApproved = app.status === 'Approved';
            const isRejected = app.status === 'Rejected';
            const isFinalOutcome = isApproved || isRejected;
            const currentStageIdx = APPLICATION_STAGES.indexOf(app.status);
            const isInProgress = currentStageIdx >= 0;

            return (
              <GlassCard key={app.id} className={darkMode ? 'dark' : ''}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">{app.schemeName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'en' ? 'Updated:' : 'புதுப்பிக்கப்பட்டது:'} {lastUpdatedDisplay}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Expand/collapse details */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 px-2 py-1 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                    >
                      {language === 'en' ? 'Details' : 'விவரங்கள்'}
                      <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    </button>
                    {/* Delete button */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => removeApplication(app.id)}
                          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md transition-colors"
                        >
                          {language === 'en' ? 'Confirm' : 'உறுதி'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(app.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title={language === 'en' ? 'Remove' : 'நீக்கு'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status tracker with branching outcomes */}
                <div className="space-y-3">
                  {/* Sequential stages */}
                  <div className="overflow-x-auto pb-1">
                    <div className="flex items-center min-w-max gap-0">
                      {APPLICATION_STAGES.map((stage, idx) => {
                        const isCompleted = isFinalOutcome || (isInProgress && idx < currentStageIdx);
                        const isCurrent = !isFinalOutcome && idx === currentStageIdx;

                        let dotColor, labelColor, lineColor;
                        if (isCompleted) {
                          dotColor = 'bg-green-500 border-green-500';
                          labelColor = 'text-green-700 dark:text-green-400';
                          lineColor = 'bg-green-400';
                        } else if (isCurrent) {
                          dotColor = 'bg-teal-500 border-teal-500 ring-2 ring-teal-300 dark:ring-teal-700';
                          labelColor = 'text-teal-700 dark:text-teal-300 font-bold';
                          lineColor = 'bg-slate-200 dark:bg-slate-600';
                        } else {
                          dotColor = 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500';
                          labelColor = 'text-slate-400 dark:text-slate-500';
                          lineColor = 'bg-slate-200 dark:bg-slate-600';
                        }

                        return (
                          <React.Fragment key={stage}>
                            <div className="flex flex-col items-center" style={{ minWidth: '76px' }}>
                              <button
                                onClick={() => updateStatus(app.schemeId, stage)}
                                title={stage}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${dotColor} hover:scale-110 focus:outline-none`}
                              >
                                {isCompleted && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {isCurrent && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                                    <circle cx="5" cy="5" r="2" fill="currentColor"/>
                                  </svg>
                                )}
                              </button>
                              <span className={`text-[10px] mt-1 text-center leading-tight ${labelColor}`} style={{ maxWidth: '72px' }}>{stage}</span>
                            </div>
                            {idx < APPLICATION_STAGES.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-0.5 mb-4 ${isCompleted ? 'bg-green-400' : lineColor}`} style={{ minWidth: '12px' }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Branching outcomes (Approved / Rejected) */}
                  <div className="flex items-start justify-center gap-8 pt-2">
                    {/* Approved branch */}
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-600 mb-1"></div>
                      <button
                        onClick={() => updateStatus(app.schemeId, 'Approved')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${
                          isApproved
                            ? 'bg-green-500 border-green-500 ring-2 ring-green-300 dark:ring-green-700'
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 hover:scale-110 hover:border-green-400'
                        }`}
                        title="Approved"
                      >
                        {isApproved && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 10 10">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <span className={`text-[11px] mt-1.5 font-medium ${
                        isApproved ? 'text-green-600 dark:text-green-400 font-bold' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {language === 'en' ? 'Approved' : 'அங்கீகரிக்கப்பட்டது'}
                      </span>
                    </div>

                    {/* Rejected branch */}
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-600 mb-1"></div>
                      <button
                        onClick={() => updateStatus(app.schemeId, 'Rejected')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${
                          isRejected
                            ? 'bg-red-500 border-red-500 ring-2 ring-red-300 dark:ring-red-700'
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 hover:scale-110 hover:border-red-400'
                        }`}
                        title="Rejected"
                      >
                        {isRejected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 10 10">
                            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </button>
                      <span className={`text-[11px] mt-1.5 font-medium ${
                        isRejected ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {language === 'en' ? 'Rejected' : 'நிராகரிக்கப்பட்டது'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'en' ? 'Application Date' : 'விண்ணப்ப தேதி'}
                          </label>
                          <input
                            type="date"
                            value={app.applicationDate || ''}
                            onChange={(e) => updateField(app.id, 'applicationDate', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'en' ? 'Reference Number' : 'குறிப்பு எண்'}
                          </label>
                          <input
                            type="text"
                            value={app.referenceNumber || ''}
                            onChange={(e) => updateField(app.id, 'referenceNumber', e.target.value)}
                            placeholder={language === 'en' ? 'e.g. APP-2024-XXXX' : ''}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'en' ? 'Next Action' : 'அடுத்த நடவடிக்கை'}
                          </label>
                          <input
                            type="text"
                            value={app.nextAction || ''}
                            onChange={(e) => updateField(app.id, 'nextAction', e.target.value)}
                            placeholder={language === 'en' ? 'e.g. Follow up on 30 Sep' : ''}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {language === 'en' ? 'Notes' : 'குறிப்புகள்'}
                          </label>
                          <textarea
                            rows={2}
                            value={app.notes || ''}
                            onChange={(e) => updateField(app.id, 'notes', e.target.value)}
                            placeholder={language === 'en' ? 'Any notes…' : ''}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      )}

      {savedSchemes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            {language === 'en' ? 'Add Saved Schemes to Tracker' : 'சேமிக்கப்பட்ட திட்டங்களை கண்காணிப்பில் சேர்க்கவும்'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSchemes.map(s => {
              const localizedName = getLocalizedSchemeName(s.scheme, language);
              return (
                <div key={s.scheme_id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{localizedName}</span>
                  <button
                    onClick={() => addApplication(s.scheme_id, localizedName)}
                    disabled={applications.some(app => app.schemeId === s.scheme_id)}
                    className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {applications.some(app => app.schemeId === s.scheme_id)
                      ? (language === 'en' ? 'Added' : 'சேர்க்கப்பட்டது')
                      : (language === 'en' ? 'Track' : 'கண்காணி')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Notifications Panel Component
const NotificationsPanel = ({ notifications, onMarkRead, onClearAll, darkMode, language }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {language === 'en' ? 'Notifications' : 'அறிவிப்புகள்'}
      </h2>
      {notifications.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-semibold"
        >
          {language === 'en' ? 'Clear All' : 'அனைத்தையும் அழி'}
        </button>
      )}
    </div>

    {notifications.length === 0 ? (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        {language === 'en' ? 'No notifications yet.' : 'இன்னும் அறிவிப்புகள் இல்லை.'}
      </div>
    ) : (
      <div className="space-y-3">
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${
              notif.read
                ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                : 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700'
            }`}
            onClick={() => !notif.read && onMarkRead(notif.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{notif.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// FAQ Section Component
const FAQSection = ({ darkMode, language }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = language === 'en' ? [
    {
      q: 'How does SchemEase determine eligibility?',
      a: 'SchemEase uses a deterministic eligibility engine that evaluates your profile against structured criteria defined for each scheme. It checks required criteria (must match), optional criteria (increases relevance), and identifies missing information. The system is data-driven and adds new schemes without modifying code.'
    },
    {
      q: 'What documents do I need?',
      a: 'Required documents vary by scheme. Each scheme card displays a complete document checklist. Common documents include Aadhaar Card, income certificate, caste certificate (if applicable), bank details, and scheme-specific documents like land records for agricultural schemes or disability certificates for welfare schemes.'
    },
    {
      q: 'Are these official government schemes?',
      a: 'Yes, all schemes in SchemEase are official Indian government schemes. Each scheme includes an "Official Source" link to the authentic government portal where you can verify details and apply. Always check the official source for the latest requirements before applying.'
    },
    {
      q: 'How is relevance calculated?',
      a: 'Relevance scoring considers how many of your profile attributes match the scheme criteria. A scheme matching your occupation, income, social category, age, and location will rank higher than one matching only one attribute. This ensures you see schemes most applicable to your specific situation.'
    },
    {
      q: 'Where do I apply?',
      a: 'Each scheme card shows the application method and official URL. Some schemes require online application through government portals, others through local offices (Gram Panchayat, Post Office, Bank Branch). Click "Official Source" on any scheme to visit the authentic application portal.'
    },
    {
      q: 'Can I save schemes?',
      a: 'Yes! Click the bookmark icon on any scheme card to save it. Your saved schemes are stored locally in your browser and remain accessible even after you log out. You can access them anytime from the "Saved Schemes" tab.'
    }
  ] : [
    {
      q: 'SchemEase தகுதியை எவ்வாறு தீர்மானிக்கிறது?',
      a: 'SchemEase ஒரு தீர்மான தகுதி இயந்திரத்தைப் பயன்படுத்துகிறது, இது ஒவ்வொரு திட்டத்திற்கும் வரையறுக்கப்பட்ட கட்டமைக்கப்பட்ட அளவுகோல்களுக்கு எதிராக உங்கள் சுயவிவரத்தை மதிப்பீடு செய்கிறது.'
    },
    {
      q: 'எனக்கு என்ன ஆவணங்கள் தேவை?',
      a: 'தேவையான ஆவணங்கள் திட்டத்தைப் பொறுத்து மாறுபடும். ஒவ்வொரு திட்ட அட்டையும் முழுமையான ஆவண சரிபார்ப்புப் பட்டியலைக் காட்டுகிறது.'
    },
    {
      q: 'இவை அதிகாரப்பூர்வ அரசாங்க திட்டங்களா?',
      a: 'ஆம், SchemEase இல் உள்ள அனைத்து திட்டங்களும் அதிகாரப்பூர்வ இந்திய அரசாங்க திட்டங்கள்.'
    },
    {
      q: 'பொருத்தம் எவ்வாறு கணக்கிடப்படுகிறது?',
      a: 'உங்கள் சுயவிவர பண்புக்கூறுகளில் எத்தனை திட்ட அளவுகோல்களுடன் பொருந்துகின்றன என்பதை பொருத்தம் மதிப்பெண் கருதுகிறது.'
    },
    {
      q: 'நான் எங்கே விண்ணப்பிக்க வேண்டும்?',
      a: 'ஒவ்வொரு திட்ட அட்டையும் விண்ணப்ப முறை மற்றும் அதிகாரப்பூர்வ URL ஐக் காட்டுகிறது.'
    },
    {
      q: 'திட்டங்களை சேமிக்க முடியுமா?',
      a: 'ஆம்! எந்த திட்ட அட்டையிலும் புக்மார்க் ஐகானைக் கிளிக் செய்து அதைச் சேமிக்கவும்.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {language === 'en' ? 'Frequently Asked Questions' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்'}
      </h2>
      {faqs.map((faq, idx) => (
        <motion.div
          key={idx}
          className={`rounded-lg border overflow-hidden transition-all ${
            openIndex === idx
              ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700 shadow-lg'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
          initial={false}
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className={`w-full p-4 flex justify-between items-center text-left transition-colors ${
              openIndex === idx
                ? 'hover:bg-teal-100 dark:hover:bg-teal-900/30'
                : 'hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <span className={`font-semibold ${
              openIndex === idx
                ? 'text-teal-900 dark:text-teal-100'
                : 'text-slate-800 dark:text-slate-100'
            }`}>
              {faq.q}
            </span>
            <motion.div animate={{ rotate: openIndex === idx ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className={`w-5 h-5 ${
                openIndex === idx
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`} />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-2 text-slate-700 dark:text-slate-200 text-sm leading-relaxed border-t border-teal-200 dark:border-teal-800">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Contact Section Component
const ContactSection = ({ darkMode, language }) => {
  const EMPTY = { name: '', email: '', subject: '', message: '' };
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }),
    ),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const result = await sendContactMessage(formData);
    if (result.success) {
      setStatus('success');
      setFormData(EMPTY);
    } else {
      setStatus('error');
      setErrorMsg(result.error || (language === 'en'
        ? 'Unable to send your message. Please try again.'
        : 'உங்கள் செய்தியை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
    }
  };

  const inputCls = 'w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none';

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {language === 'en' ? 'Contact & Support' : 'தொடர்பு & ஆதரவு'}
      </h2>

      <GlassPanel className={`${darkMode ? 'dark' : ''} space-y-6`}>
        {status === 'success' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {language === 'en' ? 'Message Sent!' : 'செய்தி அனுப்பப்பட்டது!'}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {language === 'en'
                ? 'Message sent successfully. We will get back to you soon.'
                : 'செய்தி வெற்றிகரமாக அனுப்பப்பட்டது. நாங்கள் விரைவில் தொடர்பு கொள்வோம்.'}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm text-primary dark:text-teal-400 underline"
            >
              {language === 'en' ? 'Send another message' : 'மீண்டும் அனுப்பு'}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Name' : 'பெயர்'} <span className="text-red-500">*</span>
              </label>
              <input type="text" required {...field('name')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Email' : 'மின்னஞ்சல்'} <span className="text-red-500">*</span>
              </label>
              <input type="email" required {...field('email')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Subject' : 'தலைப்பு'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                {...field('subject')}
                placeholder={language === 'en' ? 'e.g. Question about PM Kisan' : ''}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Message' : 'செய்தி'} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                {...field('message')}
                className={`${inputCls} resize-none`}
              />
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow flex items-center justify-center gap-2"
            >
              {status === 'sending' && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {status === 'sending'
                ? (language === 'en' ? 'Sending…' : 'அனுப்புகிறது…')
                : (language === 'en' ? 'Send Message' : 'செய்தி அனுப்பு')}
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
            {language === 'en' ? 'Contact & Support' : 'தொடர்பு & ஆதரவு'}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'en' ? 'Email:' : 'மின்னஞ்சல்:'}
                </span>{' '}
                <a
                  href="mailto:rakshan3284@gmail.com"
                  className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  rakshan3284@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'en' ? 'Support:' : 'ஆதரவு:'}
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  {language === 'en'
                    ? 'Scheme information, eligibility questions & website assistance'
                    : 'திட்ட தகவல், தகுதி கேள்விகள் & இணையதள உதவி'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {language === 'en' ? 'Response:' : 'பதில்:'}
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  {language === 'en'
                    ? "We'll respond to your enquiry by email"
                    : 'உங்கள் விசாரணைக்கு மின்னஞ்சல் மூலம் பதிலளிப்போம்'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export const ProfileEditor = ({ profile, onUpdate, onCancel, darkMode, language }) => {
  const [formData, setFormData] = useState(profile);

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <GlassPanel className={`max-w-2xl mx-auto ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {language === 'en' ? 'Edit Profile' : 'சுயவிவரத்தை திருத்து'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {language === 'en' ? 'Cancel' : 'ரத்து செய்'}
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <ProfileForm
          profile={formData}
          onChange={handleFieldChange}
          language={language}
        />
        <div className="flex gap-3 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'ரத்து செய்'}
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-teal-800 transition-colors shadow flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {language === 'en' ? 'Save & Update Schemes' : 'சேமித்து திட்டங்களை புதுப்பி'}
          </button>
        </div>
      </form>
    </GlassPanel>
  );
};
