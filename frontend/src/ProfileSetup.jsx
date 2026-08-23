import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import ProfileForm from './ProfileForm';

const TOTAL_STEPS = 3;

const ProfileSetup = ({ onComplete, darkMode, language, initialProfile = {} }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(initialProfile);
  const [stepValid, setStepValid] = useState(false);

  const t = (en, ta) => (language === 'en' ? en : ta);

  const handleFieldChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (!stepValid) return;
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
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {t('Complete Your Profile', 'உங்கள் சுயவிவரத்தை முடிக்கவும்')}
              </h2>
              <span className="text-sm font-semibold text-primary dark:text-teal-400">
                {t(`Step ${step} of ${TOTAL_STEPS}`, `படி ${step} / ${TOTAL_STEPS}`)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
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
                  {t('Basic Information', 'அடிப்படை தகவல்')}
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
                    {t('Additional Details', 'கூடுதல் விவரங்கள்')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 -mt-4">
                    {t(
                      'These questions help us find more specific schemes for you:',
                      'இவை உங்களுக்கு குறிப்பிட்ட திட்டங்களைக் கண்டறிய உதவும்:'
                    )}
                  </p>
                </>
              )}

              <ProfileForm
                section={step}
                profile={profile}
                onChange={handleFieldChange}
                language={language}
                onValidChange={setStepValid}
              />

              {step === TOTAL_STEPS && (
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4 flex items-start gap-3 mt-6">
                  <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-teal-800 dark:text-teal-200">
                    <p className="font-semibold mb-1">
                      {t('Profile Complete!', 'சுயவிவரம் முடிந்தது!')}
                    </p>
                    <p>
                      {t(
                        'Click "Complete Setup" to discover personalized government schemes.',
                        'தனிப்பயனாக்கப்பட்ட அரசு திட்டங்களைக் கண்டறிய "அமைவை முடிக்கவும்" என்பதைக் கிளிக் செய்யவும்.'
                      )}
                    </p>
                  </div>
                </div>
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
              disabled={!stepValid}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${
                stepValid
                  ? 'bg-primary hover:bg-teal-700 text-white'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {step < TOTAL_STEPS
                ? t('Next', 'அடுத்து')
                : t('Complete Setup', 'அமைவை முடிக்கவும்')}
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
