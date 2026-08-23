import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import ProfileForm from './ProfileForm';

const OCC_LABELS = {
  Student:             { en: 'Student',                         ta: 'மாணவர்' },
  Farmer:              { en: 'Farmer / Agriculture',             ta: 'விவசாயி' },
  Salaried:            { en: 'Salaried Employee',                ta: 'சம்பளதாரர்' },
  DailyWage:           { en: 'Daily Wage / Unorganised Worker',  ta: 'அன்றாட கூலி தொழிலாளி' },
  SelfEmployed:        { en: 'Self-employed',                    ta: 'சுய தொழில்' },
  Entrepreneur:        { en: 'Entrepreneur / Business Owner',    ta: 'தொழில்முனைவோர்' },
  MSME:                { en: 'MSME Owner',                       ta: 'MSME உரிமையாளர்' },
  Unemployed:          { en: 'Unemployed / Job Seeker',          ta: 'வேலையற்றவர்' },
  Homemaker:           { en: 'Homemaker',                        ta: 'இல்லத்தரசி' },
  SeniorCitizen:       { en: 'Senior Citizen / Retired',         ta: 'மூத்த குடிமகன்' },
  PersonWithDisability:{ en: 'Person with Disability',           ta: 'மாற்றுத்திறனாளி' },
  StreetVendor:        { en: 'Street Vendor',                    ta: 'தெரு விற்பனையாளர்' },
  Other:               { en: 'Other',                            ta: 'பிற' },
};

const TOTAL_STEPS = 4;

const ProfileSetup = ({ onComplete, darkMode, language, initialProfile = {} }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(initialProfile);
  const [stepValid, setStepValid] = useState(false);

  const t = (en, ta) => (language === 'en' ? en : ta);

  const handleFieldChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = step === 4 ? true : stepValid;

  const handleNext = () => {
    if (!isStepValid) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      setStepValid(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      localStorage.setItem(`profile_${currentUser}`, JSON.stringify(profile));
      const users = JSON.parse(localStorage.getItem('schemease_users') || '{}');
      if (users[currentUser]) {
        users[currentUser].profileCompleted = true;
        localStorage.setItem('schemease_users', JSON.stringify(users));
      }
    }
    localStorage.setItem('user_profile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 ${darkMode ? 'dark' : ''} py-12 px-4`}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
        >
          {/* Step indicator */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              {t('Complete Your Profile', 'உங்கள் சுயவிவரத்தை முடிக்கவும்')}
            </h2>
            <div className="flex items-start">
              {[
                { n: 1, label: t('About You', 'உங்களைப் பற்றி') },
                { n: 2, label: t('Your Role', 'உங்கள் பங்கு') },
                { n: 3, label: t('Details', 'விவரங்கள்') },
                { n: 4, label: t('Review', 'மதிப்பாய்வு') },
              ].map(({ n, label }, i) => (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center min-w-0">
                    <motion.div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                        step > n
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : step === n
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                      }`}
                      animate={step === n ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step > n ? <CheckCircle className="w-4 h-4" /> : n}
                    </motion.div>
                    <span className={`mt-1.5 text-xs font-medium text-center leading-tight ${
                      step > n ? 'text-teal-600 dark:text-teal-400' :
                      step === n ? 'text-primary dark:text-teal-400' :
                      'text-slate-400 dark:text-slate-500'
                    }`}>{label}</span>
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-0.5 mt-4 mx-1 transition-colors duration-300 ${
                      step > n ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {step === 1 && (
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {t('About You', 'உங்களைப் பற்றி')}
                </h3>
              )}
              {step === 2 && (
                <>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {t('What Best Describes You?', 'உங்களை சிறந்த முறையில் விவரிப்பது எது?')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 -mt-4">
                    {t('Select your primary occupation to find relevant schemes:', 'பொருத்தமான திட்டங்களைக் கண்டறிய உங்கள் முதன்மை தொழிலைத் தேர்ந்தெடுக்கவும்:')}
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {t('Relevant Details', 'தொடர்புடைய விவரங்கள்')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 -mt-4">
                    {t(
                      'These questions help us find more specific schemes for you:',
                      'இவை உங்களுக்கு குறிப்பிட்ட திட்டங்களைக் கண்டறிய உதவும்:'
                    )}
                  </p>
                </>
              )}

              {step === 4 && (
                <>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {t('Review Profile', 'சுயவிவரத்தை மதிப்பாய்வு செய்யவும்')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 -mt-4">
                    {t(
                      'Check your details before we find your schemes.',
                      'உங்கள் திட்டங்களைக் கண்டறிவதற்கு முன் விவரங்களை சரிபார்க்கவும்.'
                    )}
                  </p>
                  {/* Block 1 — Personal */}
                  {(() => {
                    const yesNo = (v) => (v ? t('Yes', 'ஆம்') : t('No', 'இல்லை'));
                    const rows1 = [
                      [t('Age', 'வயது'), profile.age ?? '—'],
                      [t('Gender', 'பாலினம்'), profile.gender ?? '—'],
                      [t('Annual Income', 'ஆண்டு வருமானம்'),
                        profile.income != null ? `₹${Number(profile.income).toLocaleString()}` : '—'],
                      [t('Social Category', 'சமூக வகை'), profile.socialCategory ?? '—'],
                      [t('Rural / Urban', 'கிராமம் / நகரம்'), profile.ruralUrban ?? '—'],
                    ];
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                            {t('Personal', 'தனிப்பட்ட விவரம்')}
                          </h4>
                          <button
                            onClick={() => setStep(1)}
                            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                          >
                            {t('Edit', 'திருத்து')}
                          </button>
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {rows1.map(([label, value]) => (
                            <React.Fragment key={label}>
                              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                              <dd className="text-slate-800 dark:text-white font-medium">{String(value)}</dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    );
                  })()}

                  {/* Block 2 — Primary Role */}
                  {(() => {
                    const yesNo = (v) => (v ? t('Yes', 'ஆம்') : t('No', 'இல்லை'));
                    const occ = profile.primaryOccupation;
                    const occEntry = occ ? OCC_LABELS[occ] : null;
                    const occDisplay = occEntry ? t(occEntry.en, occEntry.ta) : (occ ?? '—');
                    const rows2 = [
                      [t('Occupation', 'தொழில்'), occDisplay],
                      ...(occ === 'Farmer' ? [
                        [t('Owns Land', 'நிலம் உள்ளது'), yesNo(profile.landholding)],
                        [t('Crop Insurance Interest', 'பயிர் காப்பீட்டு ஆர்வம்'), yesNo(profile.insurableInterest)],
                      ] : []),
                      ...(occ === 'Student' ? [
                        [t('Student Level', 'மாணவர் நிலை'), profile.studentStatus ?? '—'],
                        [t('Govt School', 'அரசு பள்ளி'), yesNo(profile.governmentSchoolStudent)],
                      ] : []),
                      ...(occ === 'Salaried' ? [
                        [t('EPFO Member', 'EPFO உறுப்பினர்'), yesNo(profile.epfoMember)],
                        [t('ESIC Member', 'ESIC உறுப்பினர்'), yesNo(profile.esicMember)],
                      ] : []),
                    ];
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                            {t('Primary Role', 'முதன்மை பங்கு')}
                          </h4>
                          <button
                            onClick={() => setStep(2)}
                            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                          >
                            {t('Edit', 'திருத்து')}
                          </button>
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {rows2.map(([label, value]) => (
                            <React.Fragment key={label}>
                              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                              <dd className="text-slate-800 dark:text-white font-medium">{String(value)}</dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    );
                  })()}

                  {/* Block 3 — Additional Eligibility */}
                  {(() => {
                    const NOT_SPECIFIED = t('Not specified', 'குறிப்பிடப்படவில்லை');
                    const boolVal = (v) =>
                      v === true ? t('Yes', 'ஆம்') : v === false ? t('No', 'இல்லை') : NOT_SPECIFIED;
                    const rows3 = [
                      [t('Person with Disability', 'மாற்றுத்திறனாளி'),
                        profile.primaryOccupation === 'PersonWithDisability'
                          ? t('Yes (primary role)', 'ஆம் (முதன்மை பங்கு)')
                          : boolVal(profile.disability == null ? undefined : !!profile.disability)],
                      [t('Minority Community', 'சிறுபான்மை சமூகம்'), boolVal(profile.minorityCommunity == null ? undefined : !!profile.minorityCommunity)],
                      [t('BPL Household', 'BPL குடும்பம்'), boolVal(profile.poorHousehold == null ? undefined : !!profile.poorHousehold)],
                      [t('Income Tax Payer', 'வருமான வரி செலுத்துபவர்'), boolVal(profile.incomeTaxPayer == null ? undefined : !!profile.incomeTaxPayer)],
                    ];
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">
                            {t('Additional Eligibility', 'கூடுதல் தகுதி')}
                          </h4>
                          <button
                            onClick={() => setStep(2)}
                            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                          >
                            {t('Edit', 'திருத்து')}
                          </button>
                        </div>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {rows3.map(([label, value]) => (
                            <React.Fragment key={label}>
                              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                              <dd className={`font-medium ${value === NOT_SPECIFIED ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-800 dark:text-white'}`}>
                                {value}
                              </dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    );
                  })()}
                </>
              )}

              {step < 4 && (
                <ProfileForm
                  section={step}
                  profile={profile}
                  onChange={handleFieldChange}
                  language={language}
                  onValidChange={setStepValid}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-300 font-semibold hover:text-primary dark:hover:text-teal-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                {t('Back', 'பின்செல்')}
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!isStepValid}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                isStepValid
                  ? 'bg-primary hover:bg-teal-700 text-white'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {step < TOTAL_STEPS
                ? t('Next', 'அடுத்து')
                : t('Find My Schemes', 'என் திட்டங்களைக் கண்டறி')}
              {step < TOTAL_STEPS
                ? <ChevronRight className="w-5 h-5" />
                : <CheckCircle className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
