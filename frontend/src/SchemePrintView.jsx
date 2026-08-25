import React from 'react';
import { getEligibilityLabel } from './eligibilityLabels';

const STATUS_LABEL = {
  en: {
    ELIGIBLE: 'ELIGIBLE',
    NEEDS_MORE_INFO: 'NEEDS MORE INFORMATION',
    NOT_ELIGIBLE: 'NOT ELIGIBLE',
  },
  ta: {
    ELIGIBLE: 'தகுதியுடையவர்',
    NEEDS_MORE_INFO: 'கூடுதல் தகவல் தேவை',
    NOT_ELIGIBLE: 'தகுதியற்றவர்',
  },
};

const SchemePrintView = ({ scheme, eligibility_status, matched_criteria, missing_information, failed_criteria, language = 'en' }) => {
  if (!scheme) return null;

  return (
    <div className="scheme-print-content">
      {/* Header */}
      <div className="print-header">
        <div className="print-logo">SchemeEase</div>
        <div className="print-tagline">
          {language === 'en' ? 'Government Schemes, Made Easier to Find' : 'அரசு திட்டங்கள், கண்டறிய எளிதானது'}
        </div>
      </div>

      <hr className="print-divider" />

      {/* Scheme identity */}
      <h1 className="print-scheme-name">{scheme.name}</h1>
      <p className="print-meta">{scheme.department} · {scheme.category}</p>
      <p className="print-description">{scheme.description}</p>

      {/* Eligibility result */}
      {eligibility_status && (
        <div className={`print-eligibility print-eligibility--${eligibility_status.toLowerCase()}`}>
          <div className="print-eligibility-status">
            <strong>
              {language === 'en' ? 'Your Eligibility: ' : 'உங்கள் தகுதி: '}
              {STATUS_LABEL[language][eligibility_status] || eligibility_status}
            </strong>
          </div>

          {matched_criteria?.length > 0 && (
            <div className="print-criteria-block">
              <strong>{language === 'en' ? 'Why you qualify:' : 'ஏன் தகுதியுடையவர்:'}</strong>
              <ul>{matched_criteria.map(c => <li key={c}>✓ {getEligibilityLabel(c, language)}</li>)}</ul>
            </div>
          )}

          {missing_information?.length > 0 && (
            <div className="print-criteria-block">
              <strong>{language === 'en' ? 'Missing information:' : 'தவறிய தகவல்:'}</strong>
              <ul>{missing_information.map(c => <li key={c}>? {getEligibilityLabel(c, language)}</li>)}</ul>
            </div>
          )}

          {failed_criteria?.length > 0 && (
            <div className="print-criteria-block">
              <strong>{language === 'en' ? 'Does not meet:' : 'பொருந்தவில்லை:'}</strong>
              <ul>{failed_criteria.map(c => <li key={c}>✕ {getEligibilityLabel(c, language)}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {/* Benefits */}
      <h2 className="print-section-heading">{language === 'en' ? 'BENEFITS' : 'நன்மைகள்'}</h2>
      <ul className="print-list">
        {scheme.benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      {/* Documents */}
      <h2 className="print-section-heading">{language === 'en' ? 'REQUIRED DOCUMENTS' : 'தேவையான ஆவணங்கள்'}</h2>
      <ul className="print-list">
        {scheme.documents.map((d, i) => <li key={i}>{d}</li>)}
      </ul>

      {/* How to apply */}
      <h2 className="print-section-heading">{language === 'en' ? 'HOW TO APPLY' : 'விண்ணப்பிக்கும் முறை'}</h2>
      <p className="print-body">{scheme.applicationMethod}</p>

      {/* Official URL */}
      {scheme.officialUrl && (
        <p className="print-url">
          <strong>{language === 'en' ? 'Official Website: ' : 'அதிகாரப்பூர்வ இணையதளம்: '}</strong>
          <a href={scheme.officialUrl} className="print-link">{scheme.officialUrl}</a>
        </p>
      )}

      <hr className="print-divider print-divider-thick" />

      {/* Information disclaimer */}
      <div className="print-disclaimer">
        <span className="print-disclaimer-icon">ⓘ</span>
        <p className="print-disclaimer-text">
          {language === 'en'
            ? 'This information is sourced from government portals and SchemeEase. Please verify details on the official website before applying.'
            : 'இந்த தகவல் அரசு போர்ட்டல்கள் மற்றும் SchemeEase இலிருந்து பெறப்பட்டது. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ இணையதளத்தில் விவரங்களை சரிபார்க்கவும்.'}
        </p>
      </div>

      {/* Footer */}
      <div className="print-footer">
        {language === 'en' ? 'Generated using SchemeEase' : 'SchemeEase மூலம் உருவாக்கப்பட்டது'}
      </div>
    </div>
  );
};

export default SchemePrintView;
