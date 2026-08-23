import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, HelpCircle, FileText, ChevronDown, Bookmark, ExternalLink, Printer, Share2, GitCompare, X, Plus } from 'lucide-react';
import SchemePrintView from './SchemePrintView';

export const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div 
    className={`glass-card p-6 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const GlassPanel = ({ children, className = '', ...props }) => (
  <div className={`glass-panel p-8 ${className}`} {...props}>
    {children}
  </div>
);

export const SchemeCard = ({ schemeData, onSave, saved, onCompare, onView, onProvideMissingInfo, onViewDetails, darkMode, language }) => {
  const { scheme, eligibility_status, relevance_score, matched_criteria, missing_information, failed_criteria } = schemeData;
  const printTargetRef = useRef(null);

  useEffect(() => {
    if (onView) onView();
  }, []);

  const statusColors = {
    ELIGIBLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700',
    NEEDS_MORE_INFO: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
    NOT_ELIGIBLE: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700'
  };

  const statusIcons = {
    ELIGIBLE: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
    NEEDS_MORE_INFO: <HelpCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    NOT_ELIGIBLE: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
  };

  const handlePrint = () => {
    const el = printTargetRef.current;
    if (!el) return;
    el.classList.add('is-printing');
    const cleanup = () => {
      el.classList.remove('is-printing');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  const handleShare = async () => {
    const deepLink = `${window.location.origin}/schemes/${scheme.id}`;
    const shareData = {
      title: scheme.name,
      text: `${scheme.name} - ${scheme.description}`,
      url: deepLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(deepLink);
      alert(language === 'en' ? 'Scheme link copied to clipboard!' : 'திட்ட இணைப்பு நகலெடுக்கப்பட்டது!');
    }
  };

  return (
    <GlassCard className={`flex flex-col gap-4 relative overflow-hidden group ${darkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <span className="text-xs font-semibold tracking-wider text-primary dark:text-teal-400 uppercase mb-1 block">
            {scheme.department}
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{scheme.name}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 whitespace-nowrap ${statusColors[eligibility_status]}`}>
          {statusIcons[eligibility_status]}
          {eligibility_status.replace(/_/g, ' ')}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{scheme.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
        <div>
          <strong className="block text-slate-700 dark:text-slate-200 mb-1">
            {language === 'en' ? 'Benefits' : 'நன்மைகள்'}
          </strong>
          <ul className="list-disc pl-4 text-slate-600 dark:text-slate-400 space-y-1 text-xs">
            {scheme.benefits.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)}
            {scheme.benefits.length > 3 && <li className="text-primary dark:text-teal-400 font-semibold">+{scheme.benefits.length - 3} more</li>}
          </ul>
        </div>
        <div>
          <strong className="block text-slate-700 dark:text-slate-200 mb-1">
            {language === 'en' ? 'Documents' : 'ஆவணங்கள்'}
          </strong>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-xs">
            {scheme.documents.slice(0, 3).map((d, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <FileText className="w-3 h-3 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="line-clamp-2">{d}</span>
              </li>
            ))}
            {scheme.documents.length > 3 && (
              <li className="text-primary dark:text-teal-400 font-semibold ml-4.5">
                +{scheme.documents.length - 3} {language === 'en' ? 'more' : 'மேலும்'}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-lg p-3 mt-2 text-xs">
        <strong className="block text-slate-700 dark:text-slate-200 mb-2">
          {eligibility_status === 'NEEDS_MORE_INFO'
            ? (language === 'en' ? `Missing Information (${missing_information.length}):` : `தவறிய தகவல் (${missing_information.length}):`)
            : (language === 'en' ? `Why this matched (${relevance_score}% Relevance):` : `ஏன் பொருத்தம் (${relevance_score}%):`)}
        </strong>
        <div className="flex flex-wrap gap-1.5">
          {matched_criteria.map(c => (
            <span key={c} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-200 dark:border-green-700 text-xs">
              ✓ {c}
            </span>
          ))}
          {missing_information.map(c => (
            <span key={c} className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded border border-yellow-200 dark:border-yellow-700 text-xs">
              ? {c}
            </span>
          ))}
          {failed_criteria.map(c => (
            <span key={c} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded border border-red-200 dark:border-red-700 text-xs">
              ✕ {c}
            </span>
          ))}
        </div>

        {/* Provide Missing Information Button */}
        {eligibility_status === 'NEEDS_MORE_INFO' && missing_information.length > 0 && onProvideMissingInfo && (
          <button
            onClick={() => onProvideMissingInfo(schemeData)}
            className="mt-3 w-full py-2 px-4 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-yellow-300 dark:border-yellow-700"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Provide Missing Information' : 'தவறிய தகவலை வழங்கவும்'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => onViewDetails && onViewDetails(schemeData)}
          className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex justify-center items-center gap-1.5"
        >
          {language === 'en' ? 'View Details' : 'விவரங்களைக் காண்க'}
        </button>
        <button
          onClick={() => onSave(scheme.id)}
          className={`p-2 rounded-lg border transition-colors ${
            saved
              ? 'bg-primary text-white border-primary'
              : 'bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:text-primary hover:border-primary border-slate-200 dark:border-slate-600'
          }`}
          title={language === 'en' ? 'Save Scheme' : 'சேமி'}
        >
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
        </button>
        {onCompare && (
          <button
            onClick={() => onCompare(schemeData)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors"
            title={language === 'en' ? 'Add to Compare' : 'ஒப்பிடு'}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handlePrint}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors"
          title={language === 'en' ? 'Print' : 'அச்சிடு'}
        >
          <Printer className="w-4 h-4" />
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors"
          title={language === 'en' ? 'Share' : 'பகிர்'}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden print target — made visible only during window.print() */}
      <div ref={printTargetRef} className="scheme-print-target">
        <SchemePrintView
          scheme={scheme}
          eligibility_status={eligibility_status}
          matched_criteria={matched_criteria}
          missing_information={missing_information}
          failed_criteria={failed_criteria}
          relevance_score={relevance_score}
        />
      </div>
    </GlassCard>
  );
};
