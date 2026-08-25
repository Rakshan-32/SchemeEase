import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { getEligibilityQuestion } from './eligibilityLabels';

// Input component for different field types
const FieldInput = ({ field, value, onChange, language }) => {
  // Boolean fields
  if ([
    'landholding', 'insurableInterest', 'producesNotifiedCrops', 'seccDatabase',
    'firstChild', 'pregnantWoman', 'pregnantOrLactatingWoman', 'noToiletAtHome',
    'functionalTapConnection', 'ownsPuccaHouse', 'willingToDoUnskilledWork',
    'governmentSchoolStudent', 'unorganisedWorker', 'epfoMember', 'esicMember',
    'incomeTaxPayer', 'indianCitizen', 'bereavedFamily',
    'firstTimeEntrepreneur', 'nonCorporate', 'nonFarm', 'dpiitRecognized',
    'streetVendor', 'fisheriesSector', 'minorityCommunity', 'transgender',
    'disability', 'poorHousehold', 'sewerageConnection', 'urbanArea', 'farmer',
    'engagedInBegging', 'institution'
  ].includes(field)) {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
            value === true
              ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
              : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-green-400'
          }`}
        >
          {language === 'en' ? 'Yes' : 'ஆம்'}
        </button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
            value === false
              ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
              : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-red-400'
          }`}
        >
          {language === 'en' ? 'No' : 'இல்லை'}
        </button>
      </div>
    );
  }

  // Number fields (integer)
  if (['age', 'income', 'loanAmount'].includes(field)) {
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min="0"
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        placeholder="0"
      />
    );
  }

  // Number fields (percentage/decimal)
  if (['indianPromoterHolding'].includes(field)) {
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min="0"
        max="100"
        step="0.1"
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        placeholder="0.0"
      />
    );
  }

  // Select fields
  if (field === 'gender') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="">{language === 'en' ? 'Select...' : 'தேர்ந்தெடுக்கவும்...'}</option>
        <option value="Male">{language === 'en' ? 'Male' : 'ஆண்'}</option>
        <option value="Female">{language === 'en' ? 'Female' : 'பெண்'}</option>
        <option value="Other">{language === 'en' ? 'Other' : 'பிற'}</option>
      </select>
    );
  }

  if (field === 'socialCategory') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="">{language === 'en' ? 'Select...' : 'தேர்ந்தெடுக்கவும்...'}</option>
        <option value="General">General</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="OBC">OBC</option>
      </select>
    );
  }

  if (field === 'ruralUrban') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="">{language === 'en' ? 'Select...' : 'தேர்ந்தெடுக்கவும்...'}</option>
        <option value="Rural">{language === 'en' ? 'Rural' : 'கிராமம்'}</option>
        <option value="Urban">{language === 'en' ? 'Urban' : 'நகரம்'}</option>
      </select>
    );
  }

  if (field === 'studentStatus') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
      >
        <option value="">{language === 'en' ? 'Select...' : 'தேர்ந்தெடுக்கவும்...'}</option>
        <option value="No">{language === 'en' ? 'Not a student' : 'மாணவர் அல்ல'}</option>
        <option value="Yes">{language === 'en' ? 'Student (Class 1-8)' : 'மாணவர் (வகுப்பு 1-8)'}</option>
        <option value="Class 9 to 12">{language === 'en' ? 'Class 9 to 12' : 'வகுப்பு 9 முதல் 12'}</option>
        <option value="Post Matric">{language === 'en' ? 'Post Matric / College' : 'கல்லூரி'}</option>
      </select>
    );
  }

  // Default text input
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
    />
  );
};

const MissingInfoModal = ({ isOpen, onClose, schemeName, missingFields, currentProfile, onSubmit, darkMode, language }) => {
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Update profile with new responses
    const updatedProfile = { ...currentProfile, ...responses };

    // Call the callback with updated profile
    await onSubmit(updatedProfile);

    setIsSubmitting(false);
    setResponses({});
    onClose();
  };

  const allAnswered = missingFields.every(field => responses[field] !== undefined && responses[field] !== null && responses[field] !== '');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl ${darkMode ? 'dark' : ''}`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {language === 'en' ? 'Provide Missing Information' : 'தவறிய தகவலை வழங்கவும்'}
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {language === 'en'
                  ? `${schemeName} may be suitable for you. Please answer ${missingFields.length} more ${missingFields.length === 1 ? 'question' : 'questions'} to check eligibility.`
                  : `${schemeName} உங்களுக்கு ஏற்றதாக இருக்கலாம். தகுதியை சரிபார்க்க ${missingFields.length} கேள்விகளுக்கு பதிலளிக்கவும்.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {missingFields.map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <label className="block">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {getEligibilityQuestion(field, language)}
                    </span>
                  </div>
                  <FieldInput
                    field={field}
                    value={responses[field]}
                    onChange={(value) => handleFieldChange(field, value)}
                    language={language}
                  />
                </label>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'ரத்து செய்'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                allAnswered && !isSubmitting
                  ? 'bg-primary text-white hover:bg-teal-700 shadow-lg'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {language === 'en' ? 'Checking...' : 'சரிபார்க்கிறது...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {language === 'en' ? 'Check Eligibility' : 'தகுதியை சரிபார்க்கவும்'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MissingInfoModal;
