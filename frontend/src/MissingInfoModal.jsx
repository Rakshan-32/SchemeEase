import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

// Map backend field names to human-readable questions
const fieldToQuestion = (field, language = 'en') => {
  const mapping = {
    en: {
      landholding: 'Do you own agricultural land?',
      insurableInterest: 'Do you have insurable interest in crops?',
      producesNotifiedCrops: 'Do you produce notified crops (pulses, oilseeds)?',
      seccDatabase: 'Are you registered in the SECC database?',
      firstChild: 'Is this your first child?',
      pregnantWoman: 'Are you currently pregnant?',
      pregnantOrLactatingWoman: 'Are you pregnant or lactating?',
      noToiletAtHome: 'Do you have a toilet at home?',
      functionalTapConnection: 'Do you have a functional tap water connection?',
      ownsPuccaHouse: 'Do you own a pucca (permanent) house?',
      willingToDoUnskilledWork: 'Are you willing to do unskilled manual work?',
      governmentSchoolStudent: 'Do you study in a government school?',
      unorganisedWorker: 'Are you an unorganised sector worker?',
      epfoMember: 'Are you a member of EPFO?',
      esicMember: 'Are you a member of ESIC?',
      incomeTaxPayer: 'Do you pay income tax?',
      indianCitizen: 'Are you an Indian citizen?',
      bereavedFamily: 'Has your family lost the primary breadwinner?',
      firstTimeEntrepreneur: 'Are you a first-time entrepreneur?',
      nonCorporate: 'Is your business non-corporate?',
      nonFarm: 'Is your business in the non-farm sector?',
      dpiitRecognized: 'Is your startup DPIIT recognized?',
      streetVendor: 'Are you a street vendor?',
      fisheriesSector: 'Are you involved in the fisheries sector?',
      minorityCommunity: 'Do you belong to a minority community?',
      transgender: 'Do you identify as transgender?',
      disability: 'Do you have a disability (40% or more)?',
      poorHousehold: 'Does your household have a BPL card?',
      sewerageConnection: 'Do you have a sewerage connection?',
      urbanArea: 'Do you live in an urban area?',
      engagedInBegging: 'Are you engaged in begging / destitute?',
      institution: 'Are you applying as or through an institution / organisation?',
      age: 'What is your age?',
      income: 'What is your annual household income (₹)?',
      gender: 'What is your gender?',
      socialCategory: 'What is your social category?',
      ruralUrban: 'Do you live in a rural or urban area?',
      studentStatus: 'What is your student status?',
      farmer: 'Are you a farmer?'
    },
    ta: {
      landholding: 'உங்களிடம் விவசாய நிலம் உள்ளதா?',
      insurableInterest: 'பயிர் காப்பீட்டில் உங்களுக்கு ஆர்வம் உள்ளதா?',
      producesNotifiedCrops: 'நீங்கள் அறிவிக்கப்பட்ட பயிர்களை உற்பத்தி செய்கிறீர்களா?',
      seccDatabase: 'நீங்கள் SECC தரவுத்தளத்தில் பதிவு செய்யப்பட்டுள்ளீர்களா?',
      firstChild: 'இது உங்கள் முதல் குழந்தையா?',
      pregnantWoman: 'நீங்கள் தற்போது கர்ப்பமாக உள்ளீர்களா?',
      pregnantOrLactatingWoman: 'நீங்கள் கர்ப்பமாக அல்லது பாலூட்டுகிறீர்களா?',
      noToiletAtHome: 'வீட்டில் கழிவறை உள்ளதா?',
      functionalTapConnection: 'குழாய் தண்ணீர் இணைப்பு உள்ளதா?',
      ownsPuccaHouse: 'பக்கா வீடு உள்ளதா?',
      willingToDoUnskilledWork: 'திறமையற்ற வேலை செய்ய தயாரா?',
      governmentSchoolStudent: 'அரசு பள்ளியில் படிக்கிறீர்களா?',
      unorganisedWorker: 'அமைப்புசாரா தொழிலாளி?',
      epfoMember: 'EPFO உறுப்பினரா?',
      esicMember: 'ESIC உறுப்பினரா?',
      incomeTaxPayer: 'வருமான வரி செலுத்துகிறீர்களா?',
      indianCitizen: 'இந்திய குடிமகனா?',
      bereavedFamily: 'குடும்ப தலைவரை இழந்துள்ளீர்களா?',
      firstTimeEntrepreneur: 'முதல் முறை தொழில்முனைவோரா?',
      streetVendor: 'தெரு விற்பனையாளரா?',
      fisheriesSector: 'மீன்வளத் துறையில் உள்ளீர்களா?',
      minorityCommunity: 'சிறுபான்மை சமூகத்தைச் சேர்ந்தவரா?',
      disability: 'மாற்றுத்திறனாளியா?',
      poorHousehold: 'BPL அட்டை உள்ளதா?',
      nonCorporate: 'உங்கள் தொழில் நிறுவனமற்றதா (கார்பரேட் அல்ல)?',
      nonFarm: 'உங்கள் தொழில் விவசாயமற்ற துறையிலா?',
      dpiitRecognized: 'உங்கள் ஸ்டார்ட்அப் DPIIT அங்கீகாரம் பெற்றதா?',
      sewerageConnection: 'சாக்கடை இணைப்பு உள்ளதா?',
      urbanArea: 'நகர்ப்புறத்தில் வாழ்கிறீர்களா?',
      engagedInBegging: 'நீங்கள் பிச்சை எடுக்கும் / ஆதரவற்ற நிலையில் உள்ளீர்களா?',
      institution: 'நிறுவனம் / அமைப்பு மூலம் விண்ணப்பிக்கிறீர்களா?',
      age: 'உங்கள் வயது என்ன?',
      income: 'ஆண்டு வருமானம் (₹)?',
      gender: 'பாலினம்?',
      socialCategory: 'சமூக வகை?',
      ruralUrban: 'கிராமம் அல்லது நகரம்?',
      studentStatus: 'மாணவர் நிலை?',
      farmer: 'விவசாயியா?'
    }
  };

  return mapping[language][field] || field;
};

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

  // Number fields
  if (['age', 'income'].includes(field)) {
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min="0"
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        placeholder={field === 'age' ? '0' : '0'}
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
                      {fieldToQuestion(field, language)}
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
