import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile } from './data';
import { GlassCard, GlassPanel, SchemeCard } from './components';
import MissingInfoModal from './MissingInfoModal';
import SchemeDetailModal from './SchemeDetailModal';
import AllSchemes from './AllSchemes';
import ProfileForm from './ProfileForm';
import { Search, UserCircle, Save, SlidersHorizontal, Bell, FileCheck, HelpCircle, Mail, GitCompare, Printer, Share2, ChevronDown, CheckCircle, Clock, X, List } from 'lucide-react';

export const Landing = ({ onLogin, darkMode, language }) => {
  return (
    <div className={`min-h-screen relative flex items-center bg-cover bg-center bg-no-repeat ${darkMode ? 'dark' : ''}`} style={{ backgroundImage: "url('/ribbon-building.jpg')" }}>
      {/* Noise Texture Overlay */}
      <div className="bg-noise"></div>

      {/* Background Dimming (lighter now for glass contrast) */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/40' : 'bg-slate-900/10'} backdrop-blur-[2px]`}></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="flex-1 text-white relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Soft vignette backing for left-side text */}
          <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/40 via-black/10 to-transparent -z-10 blur-xl"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
            SCHEMEASE <span className="text-teal-400">2.0</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-light mb-8 drop-shadow-md">
            Government schemes, made easier to find.
          </p>
          
          <ul className="space-y-3 text-slate-50 font-medium">
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              Personalized deterministic scheme matching
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              Complete document checklists
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-teal-500/20 p-1 rounded-full border border-teal-400/30 text-teal-300">✓</span>
              Cross-category AI-enhanced recommendations
            </li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-panel-true glass-shimmer p-8 text-center">
            <h2 className="text-3xl font-bold text-white glass-text mb-3">Welcome Back</h2>
            <p className="text-slate-100/90 glass-text mb-8 text-sm font-medium">Sign in to discover schemes tailored for you.</p>
            
            <button 
              onClick={onLogin}
              className="w-full py-3.5 px-4 btn-primary-glow rounded-xl font-bold mb-5"
            >
              Sign In to Dashboard
            </button>
            <p className="text-xs text-white/60 font-light">
              * This is a demonstration environment. Profile data is stored securely in your browser's local storage.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const Dashboard = ({ profile, onUpdateProfile, darkMode, language, initialSchemeId }) => {
  const [schemes, setSchemes] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState(() => JSON.parse(localStorage.getItem('saved_schemes') || '[]'));
  const [recentlyViewed, setRecentlyViewed] = useState(() => JSON.parse(localStorage.getItem('recently_viewed') || '[]'));
  const [compareList, setCompareList] = useState([]);
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications') || '[]'));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [missingInfoModal, setMissingInfoModal] = useState({ isOpen: false, schemeData: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, schemeData: null });

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
    const data = await analyzeProfile(profile);
    if (data && data.results) {
      setSchemes(data.results);
      // Add notification for new matches
      if (data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length > 0) {
        addNotification(`Found ${data.results.filter(s => s.eligibility_status === 'ELIGIBLE').length} eligible schemes for you!`);
      }
    }
    setLoading(false);
  };

  const toggleSave = (id) => {
    setSavedSchemes(prev => {
      const newSaved = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      if (!prev.includes(id)) {
        addNotification(`Scheme saved successfully!`);
      }
      return newSaved;
    });
  };

  const addToCompare = (schemeData) => {
    if (compareList.length >= 3) {
      alert('You can compare up to 3 schemes at a time');
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

  // Best matches: top 3-5 schemes with highest relevance
  const bestMatches = sortedEligible.slice(0, Math.min(5, Math.ceil(sortedEligible.length * 0.3)));
  const otherEligible = sortedEligible.slice(bestMatches.length);

  const eligibleSchemes = schemes.filter(s => s.eligibility_status === 'ELIGIBLE' || s.eligibility_status === 'NEEDS_MORE_INFO');

  const categories = ['all', ...new Set(schemes.map(s => s.scheme.category))];
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen relative pt-24 pb-12 px-6 transition-colors duration-300`}>
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
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="animated-gradient-bg"></div>

        {/* Glowing orbs */}
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>

        {/* Floating particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Grid pattern */}
        <div className="grid-pattern"></div>

        {/* Overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/90' : 'bg-white/90'}`}></div>
      </div>

      {/* Personalized Welcome & Stats (only show when schemes loaded) */}
      {!loading && schemes.length > 0 && activeTab === 'recommendations' && (
        <div className="container mx-auto mb-8 space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-teal-500/10 to-primary/10 dark:from-primary/20 dark:via-teal-500/20 dark:to-primary/20 rounded-2xl p-6 border border-primary/20 dark:border-primary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {language === 'en'
                    ? `Welcome back! We found ${sortedEligible.length} schemes for you.`
                    : `வரவேற்கிறோம்! உங்களுக்கு ${sortedEligible.length} திட்டங்கள் கிடைத்தன.`}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {language === 'en'
                    ? `Based on your profile, you have ${bestMatches.length} best matches and ${sortedNeedsInfo.length} potential matches.`
                    : `உங்கள் சுயவிவரத்தின் அடிப்படையில், ${bestMatches.length} சிறந்த பொருத்தங்கள் மற்றும் ${sortedNeedsInfo.length} சாத்தியமான பொருத்தங்கள்.`}
                </p>
              </div>
              {/* Profile Completion */}
              {profile && (
                <div className="flex-shrink-0">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-slate-200 dark:text-slate-700"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 36}`}
                          strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(Object.keys(profile).length / 20, 1))}`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary dark:text-teal-400">
                          {Math.round(Math.min(Object.keys(profile).length / 20, 1) * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {language === 'en' ? 'Profile' : 'சுயவிவரம்'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-teal-200 dark:border-teal-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                {sortedEligible.length}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Eligible Schemes' : 'தகுதியான திட்டங்கள்'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-yellow-200 dark:border-yellow-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {sortedNeedsInfo.length}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Needs More Info' : 'கூடுதல் தகவல்'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {savedSchemes.length}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Saved Schemes' : 'சேமிக்கப்பட்டது'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {recentlyViewed.length}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Recently Viewed' : 'சமீபத்தில்'}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="container mx-auto">

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
          <TabButton active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} darkMode={darkMode}>
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

        {/* Filter and Sort Controls (show for recommendations tab) */}
        {activeTab === 'recommendations' && !loading && eligibleSchemes.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Category:' : 'வகை:'}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? (language === 'en' ? 'All Categories' : 'அனைத்து வகைகள்') : cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Sort By:' : 'வரிசைப்படுத்து:'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="relevance">{language === 'en' ? 'Most Relevant' : 'மிகவும் பொருத்தமான'}</option>
                <option value="category">{language === 'en' ? 'Category' : 'வகை'}</option>
                <option value="department">{language === 'en' ? 'Department' : 'துறை'}</option>
              </select>
            </div>
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
                  {sortedEligible.length === 0 && sortedNeedsInfo.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      {language === 'en' ? 'Update your profile to discover eligible schemes.' : 'தகுதியான திட்டங்களைக் கண்டறிய உங்கள் சுயவிவரத்தைப் புதுப்பிக்கவும்.'}
                    </div>
                  ) : (
                    <>
                      {/* Best Matches Section */}
                      {bestMatches.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 border-t-2 border-primary"></div>
                            <div className="text-center">
                              <h2 className="text-2xl font-bold text-primary dark:text-teal-400 mb-1">
                                {language === 'en' ? '✨ Best Matches For You' : '✨ உங்களுக்கான சிறந்த பொருத்தங்கள்'}
                              </h2>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {language === 'en' ? 'Highly relevant schemes based on your profile' : 'உங்கள் சுயவிவரத்தின் அடிப்படையில் மிகவும் பொருத்தமான திட்டங்கள்'}
                              </p>
                            </div>
                            <div className="flex-1 border-t-2 border-primary"></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bestMatches.map(s => (
                              <motion.div
                                key={s.scheme_id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                              >
                                <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  {language === 'en' ? 'TOP MATCH' : 'சிறந்த'}
                                </div>
                                <SchemeCard
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
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Other Eligible Schemes Section */}
                      {otherEligible.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              {language === 'en' ? 'Other Schemes You May Be Eligible For' : 'நீங்கள் தகுதியுடைய பிற திட்டங்கள்'}
                            </h2>
                            <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherEligible.map(s => (
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

                      {/* Needs More Info Section */}
                      {sortedNeedsInfo.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 border-t border-yellow-300 dark:border-yellow-700"></div>
                            <div className="text-center">
                              <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-1">
                                {language === 'en' ? '🔍 Potential Matches — More Information Needed' : '🔍 சாத்தியமான பொருத்தங்கள் — கூடுதல் தகவல் தேவை'}
                              </h2>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {language === 'en' ? 'Answer a few more questions to unlock these schemes' : 'இந்த திட்டங்களைத் திறக்க இன்னும் சில கேள்விகளுக்கு பதிலளிக்கவும்'}
                              </p>
                            </div>
                            <div className="flex-1 border-t border-yellow-300 dark:border-yellow-700"></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedNeedsInfo.map(s => (
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
                <ProfileEditor profile={profile} onUpdate={onUpdateProfile} darkMode={darkMode} language={language} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ children, active, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`font-semibold pb-2 px-2 border-b-2 transition-colors whitespace-nowrap text-sm ${
      active
        ? 'border-primary text-primary dark:text-teal-400'
        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
    }`}
  >
    {children}
  </button>
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-lg shadow">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="p-4 text-left font-bold text-slate-700 dark:text-slate-200">
              {language === 'en' ? 'Attribute' : 'பண்பு'}
            </th>
            {schemes.map(s => (
              <th key={s.scheme_id} className="p-4 text-left relative">
                <button
                  onClick={() => onRemove(s.scheme_id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 pr-8">{s.scheme.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{language === 'en' ? 'Category' : 'வகை'}</td>
            {schemes.map(s => <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400">{s.scheme.category}</td>)}
          </tr>
          <tr className="border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{language === 'en' ? 'Eligibility' : 'தகுதி'}</td>
            {schemes.map(s => <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400">{s.eligibility_status.replace(/_/g, ' ')}</td>)}
          </tr>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{language === 'en' ? 'Relevance' : 'பொருத்தம்'}</td>
            {schemes.map(s => <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400">{s.relevance_score}%</td>)}
          </tr>
          <tr className="border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{language === 'en' ? 'Benefits' : 'நன்மைகள்'}</td>
            {schemes.map(s => (
              <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400">
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {s.scheme.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </td>
            ))}
          </tr>
          <tr className="border-t dark:border-slate-700">
            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{language === 'en' ? 'Documents' : 'ஆவணங்கள்'}</td>
            {schemes.map(s => (
              <td key={s.scheme_id} className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                {s.scheme.documents.length} {language === 'en' ? 'required' : 'தேவை'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Application Tracker Component
const ApplicationTracker = ({ savedSchemes, darkMode, language }) => {
  const [applications, setApplications] = useState(() =>
    JSON.parse(localStorage.getItem('application_tracker') || '[]')
  );

  const updateStatus = (schemeId, status) => {
    const updated = applications.map(app =>
      app.schemeId === schemeId ? { ...app, status, lastUpdated: new Date().toLocaleString() } : app
    );
    setApplications(updated);
    localStorage.setItem('application_tracker', JSON.stringify(updated));
  };

  const addApplication = (schemeId, schemeName) => {
    const newApp = {
      id: Date.now(),
      schemeId,
      schemeName,
      status: 'Not Started',
      lastUpdated: new Date().toLocaleString()
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('application_tracker', JSON.stringify(updated));
  };

  const statuses = ['Not Started', 'Documents Prepared', 'Application Submitted', 'Under Review', 'Approved', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {language === 'en' ? 'Application Tracker' : 'விண்ணப்ப கண்காணிப்பு'}
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          {language === 'en'
            ? 'No applications tracked yet. Add schemes from your saved list to track progress.'
            : 'இன்னும் விண்ணப்பங்கள் இல்லை. உங்கள் சேமித்த பட்டியலில் இருந்து திட்டங்களைச் சேர்க்கவும்.'}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <GlassCard key={app.id} className={darkMode ? 'dark' : ''}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{app.schemeName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'en' ? 'Last Updated:' : 'கடைசியாக புதுப்பிக்கப்பட்டது:'} {app.lastUpdated}
                  </p>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.schemeId, e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {savedSchemes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            {language === 'en' ? 'Add Saved Schemes to Tracker' : 'சேமிக்கப்பட்ட திட்டங்களை கண்காணிப்பில் சேர்க்கவும்'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSchemes.map(s => (
              <div key={s.scheme_id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.scheme.name}</span>
                <button
                  onClick={() => addApplication(s.scheme_id, s.scheme.name)}
                  disabled={applications.some(app => app.schemeId === s.scheme_id)}
                  className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {applications.some(app => app.schemeId === s.scheme_id)
                    ? (language === 'en' ? 'Added' : 'சேர்க்கப்பட்டது')
                    : (language === 'en' ? 'Track' : 'கண்காணி')}
                </button>
              </div>
            ))}
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
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {language === 'en' ? 'Contact & Support' : 'தொடர்பு & ஆதரவு'}
      </h2>

      <GlassPanel className={`${darkMode ? 'dark' : ''} space-y-6`}>
        {submitted ? (
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
                ? 'Thank you for reaching out. We will get back to you soon.'
                : 'தொடர்பு கொண்டதற்கு நன்றி. நாங்கள் விரைவில் உங்களை தொடர்பு கொள்வோம்.'}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Name' : 'பெயர்'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Email' : 'மின்னஞ்சல்'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Message' : 'செய்தி'}
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow"
            >
              {language === 'en' ? 'Send Message' : 'செய்தி அனுப்பு'}
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            {language === 'en' ? 'Other Ways to Reach Us' : 'எங்களை அணுக பிற வழிகள்'}
          </h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>📧 Email: support@schemease.gov.in</p>
            <p>📞 Helpline: 1800-XXX-XXXX (Toll-Free)</p>
            <p>🕐 Hours: Mon-Fri, 9:00 AM - 6:00 PM IST</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export const ProfileEditor = ({ profile, onUpdate, darkMode, language }) => {
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
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {language === 'en' ? 'Your Profile' : 'உங்கள் சுயவிவரம்'}
      </h2>
      <form onSubmit={handleSubmit}>
        <ProfileForm
          profile={formData}
          onChange={handleFieldChange}
          language={language}
        />
        <button
          type="submit"
          className="w-full mt-6 py-3 px-4 bg-primary text-white rounded-lg font-bold hover:bg-teal-800 transition-colors shadow flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {language === 'en' ? 'Save Profile & Find Schemes' : 'சுயவிவரத்தைச் சேமித்து திட்டங்களைக் கண்டறியவும்'}
        </button>
      </form>
    </GlassPanel>
  );
};
