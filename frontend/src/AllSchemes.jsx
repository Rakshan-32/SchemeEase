import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { SchemeCard } from './components';
import { analyzeProfile } from './data';

const AllSchemes = ({ profile, onUpdateProfile, onProvideMissingInfo, onViewDetails, savedSchemes, onSave, onCompare, onView, darkMode, language }) => {
  const [allSchemes, setAllSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAllSchemes();
  }, [profile]);

  const loadAllSchemes = async () => {
    setLoading(true);
    try {
      const data = await analyzeProfile(profile);
      if (data && data.results) {
        setAllSchemes(data.results);
      }
    } catch (error) {
      console.error('Error loading schemes:', error);
    }
    setLoading(false);
  };

  // Get unique categories and departments
  const categories = ['all', ...new Set(allSchemes.map(s => s.scheme.category))];
  const departments = ['all', ...new Set(allSchemes.map(s => s.scheme.department))];

  // Filter schemes
  const filteredSchemes = allSchemes.filter(s => {
    // Search filter
    if (searchQuery && !s.scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.scheme.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && s.scheme.category !== selectedCategory) {
      return false;
    }

    // Department filter
    if (selectedDepartment !== 'all' && s.scheme.department !== selectedDepartment) {
      return false;
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'eligible' && s.eligibility_status !== 'ELIGIBLE') return false;
      if (selectedStatus === 'needs_info' && s.eligibility_status !== 'NEEDS_MORE_INFO') return false;
      if (selectedStatus === 'not_eligible' && s.eligibility_status !== 'NOT_ELIGIBLE') return false;
      if (selectedStatus === 'saved' && !savedSchemes.includes(s.scheme_id)) return false;
    }

    return true;
  });

  // Sort schemes
  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    if (sortBy === 'relevance') {
      // Prioritize by status first, then relevance
      const statusRank = { 'ELIGIBLE': 3, 'NEEDS_MORE_INFO': 2, 'NOT_ELIGIBLE': 1 };
      const statusDiff = (statusRank[b.eligibility_status] || 0) - (statusRank[a.eligibility_status] || 0);
      if (statusDiff !== 0) return statusDiff;
      return b.relevance_score - a.relevance_score;
    }
    if (sortBy === 'name') return a.scheme.name.localeCompare(b.scheme.name);
    if (sortBy === 'category') return a.scheme.category.localeCompare(b.scheme.category);
    if (sortBy === 'department') return a.scheme.department.localeCompare(b.scheme.department);
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSortBy('relevance');
  };

  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0,
    selectedDepartment !== 'all' ? 1 : 0,
    selectedStatus !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`min-h-screen pt-24 pb-12 px-6 ${darkMode ? 'dark' : ''}`}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/ribbon-building.jpg')" }}
        ></div>
        <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-sm`}></div>
      </div>

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {language === 'en' ? 'All Government Schemes' : 'அனைத்து அரசு திட்டங்கள்'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {language === 'en'
              ? `Browse all ${allSchemes.length} schemes in our database. Search, filter, and discover programs for you.`
              : `எங்கள் தரவுத்தளத்தில் உள்ள அனைத்து ${allSchemes.length} திட்டங்களையும் உலாவவும்.`}
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search schemes by name or description...' : 'திட்டங்களைத் தேடுங்கள்...'}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {language === 'en' ? 'Filters' : 'வடிகட்டிகள்'}
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-primary dark:bg-slate-900 dark:text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'en' ? 'Category' : 'வகை'}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="all">{language === 'en' ? 'All Categories' : 'அனைத்து வகைகள்'}</option>
                    {categories.filter(c => c !== 'all').sort().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'en' ? 'Department' : 'துறை'}
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="all">{language === 'en' ? 'All Departments' : 'அனைத்து துறைகள்'}</option>
                    {departments.filter(d => d !== 'all').sort().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'en' ? 'Eligibility Status' : 'தகுதி நிலை'}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="all">{language === 'en' ? 'All Statuses' : 'அனைத்து நிலைகள்'}</option>
                    <option value="eligible">{language === 'en' ? '✅ Eligible' : '✅ தகுதியுடையவர்'}</option>
                    <option value="needs_info">{language === 'en' ? '🟡 Needs More Info' : '🟡 கூடுதல் தகவல்'}</option>
                    <option value="not_eligible">{language === 'en' ? '❌ Not Eligible' : '❌ தகுதியற்றவர்'}</option>
                    <option value="saved">{language === 'en' ? '🔖 Saved' : '🔖 சேமிக்கப்பட்டது'}</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'en' ? 'Sort By' : 'வரிசைப்படுத்து'}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="relevance">{language === 'en' ? 'Most Relevant' : 'மிகவும் பொருத்தமான'}</option>
                    <option value="name">{language === 'en' ? 'Name (A-Z)' : 'பெயர் (அ-ஔ)'}</option>
                    <option value="category">{language === 'en' ? 'Category' : 'வகை'}</option>
                    <option value="department">{language === 'en' ? 'Department' : 'துறை'}</option>
                  </select>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                  >
                    <X className="w-4 h-4" />
                    {language === 'en' ? 'Clear All Filters' : 'அனைத்து வடிகட்டிகளையும் அழிக்கவும்'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-sm text-slate-600 dark:text-slate-400"
        >
          {loading ? (
            <span>{language === 'en' ? 'Loading schemes...' : 'திட்டங்களை ஏற்றுகிறது...'}</span>
          ) : (
            <span>
              {language === 'en'
                ? `Showing ${sortedSchemes.length} of ${allSchemes.length} schemes`
                : `${allSchemes.length} இல் ${sortedSchemes.length} திட்டங்கள் காட்டப்படுகின்றன`}
            </span>
          )}
        </motion.div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-primary"></div>
          </div>
        ) : sortedSchemes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
              {language === 'en' ? 'No schemes found matching your filters.' : 'உங்கள் வடிகட்டிகளுடன் பொருந்தும் திட்டங்கள் இல்லை.'}
            </p>
            <button
              onClick={clearFilters}
              className="text-primary dark:text-teal-400 font-medium hover:underline"
            >
              {language === 'en' ? 'Clear filters and try again' : 'வடிகட்டிகளை அழித்து மீண்டும் முயற்சிக்கவும்'}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedSchemes.map((s, index) => (
              <motion.div
                key={s.scheme_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <SchemeCard
                  schemeData={s}
                  saved={savedSchemes.includes(s.scheme_id)}
                  onSave={onSave}
                  onCompare={onCompare}
                  onView={onView}
                  onViewDetails={onViewDetails}
                  onProvideMissingInfo={onProvideMissingInfo}
                  darkMode={darkMode}
                  language={language}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllSchemes;
