import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, FileText, CheckCircle, AlertCircle, HelpCircle, Bookmark, GitCompare, Printer, Share2 } from 'lucide-react';
import { usePrint } from './PrintContext';
import { shareScheme } from './components';
import { getEligibilityLabel } from './eligibilityLabels';
import { getLocalizedScheme } from './schemeLocalization';

const SchemeDetailModal = ({ isOpen, onClose, schemeData, saved, onSave, onCompare, onProvideMissingInfo, darkMode, language }) => {
  const { printScheme } = usePrint();
  const [shareState, setShareState] = useState(null); // null | 'copied' | 'error'

  if (!isOpen || !schemeData) return null;

  const { scheme, eligibility_status, relevance_score, matched_criteria, missing_information, failed_criteria } = schemeData;
  const localizedScheme = getLocalizedScheme(scheme, language);

  const statusConfig = {
    ELIGIBLE: {
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      label: language === 'en' ? 'You are eligible for this scheme' : 'நீங்கள் இந்த திட்டத்திற்கு தகுதியுடையவர்'
    },
    NEEDS_MORE_INFO: {
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      label: language === 'en' ? 'More information needed' : 'கூடுதல் தகவல் தேவை'
    },
    NOT_ELIGIBLE: {
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      label: language === 'en' ? 'Currently not eligible' : 'தற்போது தகுதியற்றவர்'
    }
  };

  const status = statusConfig[eligibility_status];

  const handleShare = () => {
    shareScheme(localizedScheme, language, (result) => {
      setShareState(result);
      setTimeout(() => setShareState(null), 2500);
    });
  };

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'dark' : ''}`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-start z-10">
            <div className="flex-1 pr-4">
              <div className="text-xs font-semibold tracking-wider text-primary dark:text-teal-400 uppercase mb-2">
                {localizedScheme.department}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {localizedScheme.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full font-medium">
                  {scheme.category}
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full font-medium">
                  {relevance_score}% Match
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Eligibility Status Banner */}
            <div className={`${status.bg} ${status.border} border-2 rounded-xl p-4 flex items-start gap-4`}>
              <div className={status.color}>
                {status.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${status.color} mb-2`}>
                  {status.label}
                </h3>

                {matched_criteria.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      {language === 'en' ? 'Why you qualify:' : 'நீங்கள் ஏன் தகுதியுடையவர்:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matched_criteria.map(c => (
                        <span key={c} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-200 dark:border-green-700">
                          ✓ {getEligibilityLabel(c, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {missing_information.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      {language === 'en' ? 'Missing information:' : 'தவறிய தகவல்:'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {missing_information.map(c => (
                        <span key={c} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-700">
                          ? {getEligibilityLabel(c, language)}
                        </span>
                      ))}
                    </div>
                    {onProvideMissingInfo && (
                      <button
                        onClick={() => {
                          onProvideMissingInfo(schemeData);
                          onClose();
                        }}
                        className="text-sm font-semibold text-primary dark:text-teal-400 hover:underline"
                      >
                        {language === 'en' ? '→ Provide this information now' : '→ இப்போது இந்த தகவலை வழங்கவும்'}
                      </button>
                    )}
                  </div>
                )}

                {failed_criteria.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      {language === 'en' ? 'Why you may not qualify:' : 'நீங்கள் ஏன் தகுதியற்றவராக இருக்கலாம்:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {failed_criteria.map(c => (
                        <span key={c} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-200 dark:border-red-700">
                          ✕ {getEligibilityLabel(c, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {language === 'en' ? 'About this Scheme' : 'இந்த திட்டத்தைப் பற்றி'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {localizedScheme.description}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {language === 'en' ? 'Benefits' : 'நன்மைகள்'}
              </h3>
              <ul className="space-y-2">
                {localizedScheme.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {language === 'en' ? 'Required Documents' : 'தேவையான ஆவணங்கள்'}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {localizedScheme.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <FileText className="w-5 h-5 text-primary dark:text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Method */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {language === 'en' ? 'How to Apply' : 'எவ்வாறு விண்ணப்பிக்க வேண்டும்'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                {localizedScheme.applicationMethod}
              </p>
            </div>

            {/* Official Link */}
            <div className="bg-gradient-to-r from-primary/10 to-teal-500/10 dark:from-primary/20 dark:to-teal-500/20 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {language === 'en' ? 'Official Government Portal' : 'அதிகாரப்பூர்வ அரசு இணையதளம்'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                {language === 'en'
                  ? 'Visit the official government website to apply or get more details:'
                  : 'விண்ணப்பிக்க அல்லது கூடுதல் விவரங்களைப் பெற அதிகாரப்பூர்வ அரசு இணையதளத்தைப் பார்வையிடவும்:'}
              </p>
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-teal-700 text-white font-bold rounded-lg transition-colors"
              >
                {language === 'en' ? 'Visit Official Portal' : 'அதிகாரப்பூர்வ இணையதளத்தைப் பார்க்கவும்'}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 flex flex-wrap gap-3">
            <button
              onClick={() => onSave(scheme.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                saved
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Bookmark className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
              {saved
                ? (language === 'en' ? 'Saved' : 'சேமிக்கப்பட்டது')
                : (language === 'en' ? 'Save Scheme' : 'திட்டத்தைச் சேமிக்கவும்')}
            </button>

            {onCompare && (
              <button
                onClick={() => {
                  onCompare(schemeData);
                  onClose();
                }}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-all"
              >
                <GitCompare className="w-5 h-5" />
                {language === 'en' ? 'Compare' : 'ஒப்பிடு'}
              </button>
            )}

            <button
              onClick={() => printScheme({
                scheme: localizedScheme,
                eligibility_status,
                matched_criteria,
                missing_information,
                failed_criteria
              }, language)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-all"
            >
              <Printer className="w-5 h-5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Print' : 'அச்சிடு'}</span>
            </button>

            <button
              onClick={handleShare}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                shareState === 'copied'
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : shareState === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">
                {shareState === 'copied'
                  ? (language === 'en' ? 'Copied!' : 'நகலெடுக்கப்பட்டது!')
                  : shareState === 'error'
                  ? (language === 'en' ? 'Copy failed' : 'தோல்வி')
                  : (language === 'en' ? 'Share' : 'பகிர்')}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SchemeDetailModal;
