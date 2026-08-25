import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, HelpCircle, FileText, ChevronDown, Bookmark, ExternalLink, Printer, Share2, GitCompare, X, Plus, Coins, ArrowRight } from 'lucide-react';
import { usePrint } from './PrintContext';
import { getEligibilityLabel } from './eligibilityLabels';
import {
  getLocalizedScheme,
  getLocalizedDepartment,
  getLocalizedDocuments,
  getLocalizedDescription,
  getLocalizedBenefits,
  getLocalizedApplicationMethod
} from './schemeLocalization';

// ── Shared share utility ─────────────────────────────────────────────────────
// Generates the SchemEase deep link, tries Web Share API first, then falls
// back to Clipboard. Calls onResult('copied' | 'error') so callers can show
// inline feedback without alert().
export async function shareScheme(scheme, language, onResult) {
  if (!scheme?.id) {
    onResult?.('error');
    return;
  }
  const url = `${window.location.origin}/schemes/${scheme.id}`;
  const shareData = {
    title: scheme.name,
    text: language === 'en'
      ? `${scheme.name} – Check your eligibility on SchemEase`
      : `${scheme.name} – SchemEase-இல் உங்கள் தகுதியை சரிபார்க்கவும்`,
    url,
  };

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData);
      // navigator.share resolves only on confirmed share — no further action needed.
      return;
    } catch (err) {
      // AbortError = user dismissed the sheet — silent. Anything else: fall through to copy.
      if (err?.name === 'AbortError') return;
    }
  }

  // Clipboard fallback
  try {
    await navigator.clipboard.writeText(url);
    onResult?.('copied');
  } catch {
    onResult?.('error');
  }
}

export const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
    className={`card-surface p-6 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
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
  const localizedScheme = getLocalizedScheme(scheme, language);
  const { printScheme } = usePrint();
  const [shareState, setShareState] = useState(null); // null | 'copied' | 'error'

  useEffect(() => {
    if (onView) onView();
  }, []);

  const statusColors = {
    ELIGIBLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-700',
    NEEDS_MORE_INFO: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700',
    NOT_ELIGIBLE: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-700'
  };

  const handleShare = () => {
    shareScheme(localizedScheme, language, (result) => {
      setShareState(result);
      setTimeout(() => setShareState(null), 2500);
    });
  };

  // Calculate how many benefits/documents to show
  const benefitsToShow = localizedScheme.benefits.slice(0, 2);
  const benefitsRemaining = localizedScheme.benefits.length - benefitsToShow.length;
  const documentsToShow = localizedScheme.documents.slice(0, 2);
  const documentsRemaining = localizedScheme.documents.length - documentsToShow.length;

  // Relevance is already 0-100 from backend, no multiplication needed
  const relevancePercent = relevance_score || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-[var(--elevated-surface)] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] rounded-xl p-5 shadow-sm dark:shadow-none transition-all duration-200 hover:shadow-md dark:hover:border-[rgba(148,163,184,0.22)] flex flex-col gap-4 ${darkMode ? 'dark' : ''}`}
    >
      {/* Header: Department + Eligibility Badge */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold tracking-wide text-[#0f766e] dark:text-[#5eead4] uppercase block mb-1.5">
            {localizedScheme.department}
          </span>
          <h3 className="text-base font-bold text-[#172033] dark:text-white leading-snug mb-1">
            {localizedScheme.name}
          </h3>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase whitespace-nowrap flex-shrink-0 ${statusColors[eligibility_status]}`}>
          {eligibility_status === 'ELIGIBLE'
            ? (language === 'en' ? 'ELIGIBLE' : 'தகுதி')
            : eligibility_status === 'NEEDS_MORE_INFO'
            ? (language === 'en' ? 'NEEDS INFO' : 'தகவல்')
            : (language === 'en' ? 'NOT ELIGIBLE' : 'தகுதியற்ற')}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#526078] dark:text-[#94a3b8] leading-relaxed line-clamp-2">
        {localizedScheme.description}
      </p>

      {/* Benefits + Documents Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Benefits Column */}
        {localizedScheme.benefits.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wide">
              {language === 'en' ? 'Benefits' : 'நன்மைகள்'}
            </h4>
            <ul className="space-y-1">
              {benefitsToShow.map((benefit, idx) => (
                <li key={idx} className="text-sm text-[#526078] dark:text-[#94a3b8] flex items-start gap-2">
                  <span className="text-[#0f766e] dark:text-[#5eead4] mt-0.5">•</span>
                  <span className="flex-1 line-clamp-1">{benefit}</span>
                </li>
              ))}
            </ul>
            {benefitsRemaining > 0 && (
              <p className="text-xs font-medium text-[#0f766e] dark:text-[#5eead4]">
                +{benefitsRemaining} {language === 'en' ? 'more' : 'மேலும்'}
              </p>
            )}
          </div>
        )}

        {/* Documents Column */}
        {localizedScheme.documents.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-[#172033] dark:text-white uppercase tracking-wide">
              {language === 'en' ? 'Documents' : 'ஆவணங்கள்'}
            </h4>
            <ul className="space-y-1">
              {documentsToShow.map((doc, idx) => (
                <li key={idx} className="text-sm text-[#526078] dark:text-[#94a3b8] flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#0f766e] dark:text-[#5eead4] mt-0.5 flex-shrink-0" />
                  <span className="flex-1 line-clamp-1">{doc}</span>
                </li>
              ))}
            </ul>
            {documentsRemaining > 0 && (
              <p className="text-xs font-medium text-[#0f766e] dark:text-[#5eead4]">
                +{documentsRemaining} {language === 'en' ? 'more' : 'மேலும்'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Why This Matched Panel */}
      {(matched_criteria.length > 0 || missing_information.length > 0) && (
        <div className="bg-[#f8fafc] dark:bg-[rgba(148,163,184,0.05)] border border-[#e2e8f0] dark:border-[rgba(148,163,184,0.1)] rounded-lg p-3">
          <h4 className="text-xs font-bold text-[#172033] dark:text-white mb-2 flex items-center gap-2">
            {eligibility_status === 'ELIGIBLE' ? (
              <>
                {language === 'en' ? 'Why this matched' : 'ஏன் பொருத்தம்'}
                {relevancePercent !== null && (
                  <span className="text-[#0f766e] dark:text-[#5eead4]">
                    ({relevancePercent}% {language === 'en' ? 'Relevance' : 'பொருத்தம்'})
                  </span>
                )}
              </>
            ) : (
              <>{language === 'en' ? 'Why this may match' : 'ஏன் பொருத்தமாக இருக்கலாம்'}</>
            )}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {matched_criteria.slice(0, 4).map(c => (
              <span key={c} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs border border-green-200 dark:border-green-700/30 font-medium">
                ✓ {getEligibilityLabel(c, language)}
              </span>
            ))}
            {missing_information.length > 0 && (
              <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-xs border border-amber-200 dark:border-amber-700/30 font-medium">
                ? {language === 'en' ? 'Missing info' : 'தகவல் இல்லை'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Bar - All in One Row */}
      <div className="mt-auto pt-4 border-t border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] space-y-3">
        {/* Single Row with All Actions */}
        <div className="flex items-center gap-2">
          {/* View Details - flex:1 */}
          <button
            onClick={() => onViewDetails && onViewDetails(schemeData)}
            className="flex-1 py-2 px-4 bg-[#0f766e] hover:bg-[#0d655f] dark:bg-[#0f766e] dark:hover:bg-[#0d655f] text-white rounded-lg font-bold transition-all text-sm"
            aria-label={language === 'en' ? 'View scheme details' : 'திட்ட விவரங்களைக் காண்க'}
          >
            {language === 'en' ? 'View Details' : 'விவரங்கள்'}
          </button>

          {/* Icon Actions */}
          <button
            onClick={() => onSave(scheme.id)}
            className={`p-2 rounded-lg transition-all ${
              saved
                ? 'bg-[#0f766e] text-white'
                : 'bg-white dark:bg-[var(--secondary-surface)] text-[#526078] dark:text-[#94a3b8] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] hover:border-[#0f766e] dark:hover:border-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#5eead4]'
            }`}
            title={language === 'en' ? 'Save scheme' : 'திட்டத்தை சேமிக்கவும்'}
            aria-label={language === 'en' ? 'Save scheme' : 'திட்டத்தை சேமிக்கவும்'}
          >
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>

          {onCompare && (
            <button
              onClick={() => onCompare(schemeData)}
              className="p-2 rounded-lg bg-white dark:bg-[var(--secondary-surface)] text-[#526078] dark:text-[#94a3b8] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] hover:border-[#0f766e] dark:hover:border-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#5eead4] transition-all"
              title={language === 'en' ? 'Add to compare' : 'ஒப்பிடவும்'}
              aria-label={language === 'en' ? 'Add to compare' : 'ஒப்பிடவும்'}
            >
              <GitCompare className="w-4 h-4" />
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
            className="p-2 rounded-lg bg-white dark:bg-[var(--secondary-surface)] text-[#526078] dark:text-[#94a3b8] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] hover:border-[#0f766e] dark:hover:border-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#5eead4] transition-all"
            title={language === 'en' ? 'Print scheme' : 'திட்டத்தை அச்சிடவும்'}
            aria-label={language === 'en' ? 'Print scheme' : 'திட்டத்தை அச்சிடவும்'}
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white dark:bg-[var(--secondary-surface)] text-[#526078] dark:text-[#94a3b8] border border-[#dde4ee] dark:border-[rgba(148,163,184,0.14)] hover:border-[#0f766e] dark:hover:border-[#5eead4] hover:text-[#0f766e] dark:hover:text-[#5eead4] transition-all relative"
            title={language === 'en' ? 'Share scheme' : 'திட்டத்தை பகிரவும்'}
            aria-label={language === 'en' ? 'Share scheme' : 'திட்டத்தை பகிரவும்'}
          >
            <Share2 className="w-4 h-4" />
            {shareState === 'copied' && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f766e] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {language === 'en' ? 'Link copied!' : 'இணைப்பு நகலெடுக்கப்பட்டது!'}
              </span>
            )}
          </button>
        </div>

        {/* Provide Missing Information Button */}
        {eligibility_status === 'NEEDS_MORE_INFO' && missing_information.length > 0 && onProvideMissingInfo && (
          <button
            onClick={() => onProvideMissingInfo(schemeData)}
            className="w-full py-2 px-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-700/30 text-sm"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Provide Missing Information' : 'தவறிய தகவலை வழங்கவும்'}
          </button>
        )}
      </div>
    </motion.div>
  );
};
