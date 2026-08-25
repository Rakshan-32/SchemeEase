import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ExternalLink, ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { fetchScheme } from './data';
import { getLocalizedScheme } from './schemeLocalization';

const FIELD_LABELS = {
  age: 'Age', income: 'Annual income (₹)', gender: 'Gender', socialCategory: 'Social category',
  ruralUrban: 'Location', farmer: 'Farmer', landholding: 'Owns agricultural land',
  poorHousehold: 'BPL household', disability: 'Person with disability',
  pregnantOrLactatingWoman: 'Pregnant or lactating woman', studentStatus: 'Student status',
  indianCitizen: 'Indian citizen', unorganisedWorker: 'Unorganised worker',
  firstTimeEntrepreneur: 'First-time entrepreneur', streetVendor: 'Street vendor',
  noToiletAtHome: 'No toilet at home', ownsPuccaHouse: 'Owns pucca house',
  functionalTapConnection: 'Has functional tap connection', minorityCommunity: 'Minority community',
  insurableInterest: 'Insurable interest in crops', epfoMember: 'EPFO member',
  esicMember: 'ESIC member', willingToDoUnskilledWork: 'Willing to do unskilled work',
  governmentSchoolStudent: 'Government school student', incomeTaxPayer: 'Income tax payer',
  bereavedFamily: 'Bereaved family', firstChild: 'First child', seccDatabase: 'SECC database',
};

function formatCondition(key, val) {
  const label = FIELD_LABELS[key] || key;
  if (typeof val === 'boolean') return `${label}: ${val ? 'Yes' : 'No'}`;
  if (typeof val === 'object' && !Array.isArray(val)) {
    if (val.min != null && val.max != null) return `${label}: ${val.min}–${val.max}`;
    if (val.min != null) return `${label}: ${val.min} or older`;
    if (val.max != null) return `${label}: up to ${val.max}`;
  }
  if (Array.isArray(val)) return `${label}: ${val.join(' or ')}`;
  return `${label}: ${val}`;
}

function CriteriaList({ criteria }) {
  if (!criteria || !Object.keys(criteria).length) return null;
  return (
    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
      {Object.entries(criteria).map(([key, val]) => {
        if (key === 'any_of') {
          return (
            <li key="any_of" className="ml-2">
              <span className="font-medium">One of:</span>
              <ul className="ml-4 mt-1 space-y-1">
                {val.map((group, i) =>
                  Object.entries(group).map(([gk, gv]) => (
                    <li key={`${i}-${gk}`} className="text-slate-600 dark:text-slate-400">· {formatCondition(gk, gv)}</li>
                  ))
                )}
              </ul>
            </li>
          );
        }
        return <li key={key} className="ml-2">· {formatCondition(key, val)}</li>;
      })}
    </ul>
  );
}

const SchemePublicView = ({ schemeId: schemeIdProp, darkMode, language, onLoginClick }) => {
  // schemeIdProp is passed by App.jsx (no <Route> context there).
  // useParams() handles the case where SchemePublicView is rendered inside a <Route>.
  const params = useParams();
  const schemeId = schemeIdProp || params.schemeId;
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchScheme(schemeId).then(s => {
      if (s) setScheme(s);
      else setNotFound(true);
      setLoading(false);
    });
  }, [schemeId]);

  const t = (en, ta) => language === 'en' ? en : ta;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Scheme not found.</p>
        <button onClick={() => navigate('/')} className="text-primary underline text-sm">Go to homepage</button>
      </div>
    );
  }

  const required = scheme.eligibility?.required_criteria || {};
  const optional = scheme.eligibility?.optional_criteria || {};
  const localizedScheme = getLocalizedScheme(scheme, language);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
      {/* Minimal nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-extrabold text-primary dark:text-teal-400">SCHEMEASE</span>
        </button>
        <button
          onClick={onLoginClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          {t('Sign in to check eligibility', 'தகுதியை சரிபார்க்க உள்நுழைக')}
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Eligibility CTA banner */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-teal-800 dark:text-teal-200 text-sm">
              {t('Want to know if you qualify?', 'தகுதியை அறிய விரும்புகிறீர்களா?')}
            </p>
            <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
              {t('Sign in to get a personalized eligibility check for this scheme.', 'இந்த திட்டத்திற்கான தனிப்பயனாக்கப்பட்ட தகுதி சரிபார்ப்பு பெற உள்நுழைக.')}
            </p>
          </div>
          <button
            onClick={onLoginClick}
            className="flex-shrink-0 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors"
          >
            {t('Sign in / Register', 'உள்நுழைக / பதிவு செய்க')}
          </button>
        </div>

        {/* Scheme header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-teal-400 mb-1">{localizedScheme.department}</p>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{localizedScheme.name}</h1>
          <span className="inline-block text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{scheme.category}</span>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{localizedScheme.description}</p>
        </div>

        {/* Benefits */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('Benefits', 'நன்மைகள்')}</h2>
          <ul className="space-y-2">
            {localizedScheme.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 text-teal-500 font-bold">✓</span> {b}
              </li>
            ))}
          </ul>
        </section>

        {/* Eligibility requirements */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('Who Can Apply', 'யார் விண்ணப்பிக்கலாம்')}</h2>
          {Object.keys(required).length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('Required:', 'தேவையானது:')}</p>
              <CriteriaList criteria={required} />
            </div>
          )}
          {Object.keys(optional).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('Also relevant:', 'மேலும் பொருத்தமானது:')}</p>
              <CriteriaList criteria={optional} />
            </div>
          )}
        </section>

        {/* Documents */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('Required Documents', 'தேவையான ஆவணங்கள்')}</h2>
          <ul className="space-y-2">
            {localizedScheme.documents.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <FileText className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" /> {d}
              </li>
            ))}
          </ul>
        </section>

        {/* How to apply */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{t('How to Apply', 'எவ்வாறு விண்ணப்பிக்க வேண்டும்')}</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">{localizedScheme.applicationMethod}</p>
        </section>

        {/* Official link */}
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary dark:text-teal-400 hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          {t('Official Website', 'அதிகாரப்பூர்வ இணையதளம்')}
        </a>

        <p className="text-xs text-slate-400 text-center pt-4 border-t border-slate-200 dark:border-slate-700">
          Generated using SchemEase
        </p>
      </div>
    </div>
  );
};

export default SchemePublicView;
