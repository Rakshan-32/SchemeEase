// Centralized eligibility criteria label mapper
// Converts backend field IDs to human-readable labels in English and Tamil

export const ELIGIBILITY_LABELS = {
  // Demographics
  age: {
    en: 'Age meets scheme requirements',
    ta: 'வயது திட்ட தேவைகளை பூர்த்தி செய்கிறது',
    questionEn: 'What is your age?',
    questionTa: 'உங்கள் வயது என்ன?',
  },
  gender: {
    en: 'Gender matches scheme criteria',
    ta: 'பாலினம் திட்ட நிபந்தனைகளுக்கு பொருந்துகிறது',
    questionEn: 'What is your gender?',
    questionTa: 'உங்கள் பாலினம் என்ன?',
  },
  income: {
    en: 'Income within scheme limits',
    ta: 'வருமானம் திட்ட வரம்புகளுக்குள்',
    questionEn: 'What is your annual household income (₹)?',
    questionTa: 'உங்கள் ஆண்டு வருமானம் (₹)?',
  },
  socialCategory: {
    en: 'Social category matches',
    ta: 'சமூக வகை பொருந்துகிறது',
    questionEn: 'What is your social category?',
    questionTa: 'உங்கள் சமூக வகை என்ன?',
  },
  location: {
    en: 'Location matches scheme area',
    ta: 'இடம் திட்ட பகுதிக்கு பொருந்துகிறது',
    questionEn: 'What is your location/district?',
    questionTa: 'உங்கள் இடம்/மாவட்டம் என்ன?',
  },
  ruralUrban: {
    en: 'Residence type matches (Rural/Urban)',
    ta: 'வசிப்பிட வகை பொருந்துகிறது (கிராமம்/நகரம்)',
    questionEn: 'Do you live in a rural or urban area?',
    questionTa: 'நீங்கள் கிராமப்புறத்திலா நகர்ப்புறத்திலா வாழ்கிறீர்கள்?',
  },

  // Citizenship & Identity
  indianCitizen: {
    en: 'Indian citizen',
    ta: 'இந்திய குடிமகன்',
    questionEn: 'Are you an Indian citizen?',
    questionTa: 'நீங்கள் இந்திய குடிமகனா?',
  },
  minorityCommunity: {
    en: 'Belongs to minority community',
    ta: 'சிறுபான்மை சமூகத்தைச் சேர்ந்தவர்',
    questionEn: 'Do you belong to a minority community?',
    questionTa: 'நீங்கள் சிறுபான்மை சமூகத்தைச் சேர்ந்தவரா?',
  },
  poorHousehold: {
    en: 'Below Poverty Line (BPL) household',
    ta: 'வறுமைக் கோட்டுக்குக் கீழ் (BPL) குடும்பம்',
    questionEn: 'Does your household have a BPL card?',
    questionTa: 'உங்கள் குடும்பத்தில் BPL அட்டை உள்ளதா?',
  },
  incomeTaxPayer: {
    en: 'Income tax payer status matches',
    ta: 'வருமான வரி செலுத்துபவர் நிலை பொருந்துகிறது',
    questionEn: 'Do you pay income tax?',
    questionTa: 'நீங்கள் வருமான வரி செலுத்துகிறீர்களா?',
  },

  // Occupation - Farmer
  farmer: {
    en: 'Farmer / Agriculture profile',
    ta: 'விவசாயி / வேளாண்மை சுயவிவரம்',
    questionEn: 'Are you a farmer?',
    questionTa: 'நீங்கள் விவசாயியா?',
  },
  landholding: {
    en: 'Owns or cultivates agricultural land',
    ta: 'விவசாய நிலத்தை சொந்தமாக வைத்திருக்கிறார் அல்லது பயிரிடுகிறார்',
    questionEn: 'Do you own or cultivate agricultural land?',
    questionTa: 'உங்களிடம் விவசாய நிலம் உள்ளதா?',
  },
  insurableInterest: {
    en: 'Has stake in crop harvest (for insurance)',
    ta: 'பயிர் அறுவடையில் பங்கு உள்ளது (காப்பீட்டுக்காக)',
    questionEn: 'Do you have insurable interest in crops?',
    questionTa: 'பயிர் காப்பீட்டில் உங்களுக்கு ஆர்வம் உள்ளதா?',
  },
  producesNotifiedCrops: {
    en: 'Grows notified crops',
    ta: 'அறிவிக்கப்பட்ட பயிர்களை வளர்க்கிறார்',
    questionEn: 'Do you produce notified crops (pulses, oilseeds)?',
    questionTa: 'நீங்கள் அறிவிக்கப்பட்ட பயிர்களை உற்பத்தி செய்கிறீர்களா?',
  },

  // Occupation - Student
  student: {
    en: 'Student',
    ta: 'மாணவர்',
    questionEn: 'Are you currently a student?',
    questionTa: 'நீங்கள் தற்போது மாணவரா?',
  },
  educationLevel: {
    en: 'Education level matches scheme requirements',
    ta: 'கல்வி நிலை திட்ட தேவைகளுக்கு பொருந்துகிறது',
    questionEn: 'What is your current education level?',
    questionTa: 'உங்கள் தற்போதைய கல்வி நிலை என்ன?',
  },
  institutionType: {
    en: 'Institution type (Government/Private)',
    ta: 'நிறுவன வகை (அரசு/தனியார்)',
    questionEn: 'What type of institution do you attend?',
    questionTa: 'நீங்கள் எந்த வகை நிறுவனத்தில் படிக்கிறீர்கள்?',
  },
  studentStatus: {
    en: 'Student education level',
    ta: 'மாணவர் கல்வி நிலை',
    questionEn: 'What is your student status?',
    questionTa: 'உங்கள் மாணவர் நிலை என்ன?',
  },
  governmentSchoolStudent: {
    en: 'Studying in government institution',
    ta: 'அரசு நிறுவனத்தில் படிக்கிறார்',
    questionEn: 'Do you study in a government school?',
    questionTa: 'நீங்கள் அரசு பள்ளியில் படிக்கிறீர்களா?',
  },

  // Occupation - Worker
  unorganisedWorker: {
    en: 'Unorganised / Daily wage worker',
    ta: 'அமைப்புசாரா / அன்றாட கூலி தொழிலாளி',
    questionEn: 'Are you an unorganised sector worker?',
    questionTa: 'நீங்கள் அமைப்புசாரா தொழிலாளியா?',
  },
  epfoMember: {
    en: 'EPFO member',
    ta: 'EPFO உறுப்பினர்',
    questionEn: 'Are you a member of EPFO?',
    questionTa: 'நீங்கள் EPFO உறுப்பினரா?',
  },
  esicMember: {
    en: 'ESIC member',
    ta: 'ESIC உறுப்பினர்',
    questionEn: 'Are you a member of ESIC?',
    questionTa: 'நீங்கள் ESIC உறுப்பினரா?',
  },
  willingToDoUnskilledWork: {
    en: 'Willing to undertake unskilled rural employment',
    ta: 'திறமையற்ற கிராமப்புற வேலைவாய்ப்பை மேற்கொள்ள தயாராக உள்ளார்',
    questionEn: 'Are you willing to do unskilled manual work?',
    questionTa: 'நீங்கள் திறமையற்ற வேலை செய்ய தயாரா?',
  },

  // Occupation - Entrepreneur/Business
  firstTimeEntrepreneur: {
    en: 'First-time entrepreneur',
    ta: 'முதல் முறை தொழில்முனைவோர்',
    questionEn: 'Are you a first-time entrepreneur?',
    questionTa: 'நீங்கள் முதல் முறை தொழில்முனைவோரா?',
  },
  educatedYouth: {
    en: 'Educated youth entrepreneur',
    ta: 'படித்த இளைஞர் தொழில்முனைவோர்',
    questionEn: 'Are you an educated youth looking to start a business?',
    questionTa: 'நீங்கள் தொழில் தொடங்க விரும்பும் படித்த இளைஞரா?',
  },
  educatedUnemployed: {
    en: 'Educated unemployed',
    ta: 'படித்த வேலையில்லாதவர்',
    questionEn: 'Are you educated and currently unemployed?',
    questionTa: 'நீங்கள் படித்தவர் மற்றும் தற்போது வேலையில்லாதவரா?',
  },
  economicallyWeakerSection: {
    en: 'Economically weaker section',
    ta: 'பொருளாதார ரீதியாக பலவீனமான பிரிவு',
    questionEn: 'Do you belong to economically weaker section?',
    questionTa: 'நீங்கள் பொருளாதார ரீதியாக பலவீனமான பிரிவினரா?',
  },
  womenEntrepreneur: {
    en: 'Women entrepreneur',
    ta: 'பெண் தொழில்முனைவோர்',
    questionEn: 'Are you a woman entrepreneur?',
    questionTa: 'நீங்கள் பெண் தொழில்முனைவோரா?',
  },
  projectCost: {
    en: 'Project cost within scheme limits',
    ta: 'திட்டச் செலவு திட்ட வரம்புகளுக்குள்',
    questionEn: 'What is your estimated project cost (₹)?',
    questionTa: 'உங்கள் மதிப்பிடப்பட்ட திட்டச் செலவு (₹)?',
  },
  streetVendor: {
    en: 'Street vendor',
    ta: 'தெரு விற்பனையாளர்',
    questionEn: 'Are you a street vendor?',
    questionTa: 'நீங்கள் தெரு விற்பனையாளரா?',
  },
  dpiitRecognized: {
    en: 'DPIIT recognized startup',
    ta: 'DPIIT அங்கீகரிக்கப்பட்ட ஸ்டார்ட்அப்',
    questionEn: 'Is your startup DPIIT recognized?',
    questionTa: 'உங்கள் ஸ்டார்ட்அப் DPIIT அங்கீகாரம் பெற்றதா?',
  },
  indianPromoterHolding: {
    en: 'Indian promoter holding requirement met',
    ta: 'இந்திய பங்குதாரர் வைத்திருப்பு தேவை பூர்த்தி',
    questionEn: 'Does your business meet Indian promoter holding requirements?',
    questionTa: 'உங்கள் தொழிலில் இந்திய பங்குதாரர் வைத்திருப்பு தேவை பூர்த்தியாகிறதா?',
  },
  nonCorporate: {
    en: 'Non-corporate entity',
    ta: 'நிறுவன சார்பற்ற நிறுவனம்',
    questionEn: 'Is your business non-corporate?',
    questionTa: 'உங்கள் தொழில் நிறுவனமற்றதா (கார்பரேட் அல்ல)?',
  },
  loanAmount: {
    en: 'Loan amount within scheme limits',
    ta: 'கடன் தொகை திட்ட வரம்புகளுக்குள்',
    questionEn: 'What loan amount do you need?',
    questionTa: 'உங்களுக்கு எவ்வளவு கடன் தொகை தேவை?',
  },

  // Occupation - Fisheries
  fisheriesSector: {
    en: 'Works in fisheries sector',
    ta: 'மீன்வளத் துறையில் பணியாற்றுகிறார்',
    questionEn: 'Are you involved in the fisheries sector?',
    questionTa: 'நீங்கள் மீன்வளத் துறையில் உள்ளீர்களா?',
  },
  nonFarm: {
    en: 'Non-farm activity',
    ta: 'வேளாண்மை சாரா நடவடிக்கை',
    questionEn: 'Is your business in the non-farm sector?',
    questionTa: 'உங்கள் தொழில் விவசாயமற்ற துறையிலா?',
  },

  // Special Categories - Women
  pregnantOrLactatingWoman: {
    en: 'Pregnant or lactating woman',
    ta: 'கர்ப்பிணி அல்லது பாலூட்டும் பெண்',
    questionEn: 'Are you pregnant or lactating?',
    questionTa: 'நீங்கள் கர்ப்பமாக அல்லது பாலூட்டுகிறீர்களா?',
  },
  firstChild: {
    en: 'First child',
    ta: 'முதல் குழந்தை',
    questionEn: 'Is this your first child?',
    questionTa: 'இது உங்கள் முதல் குழந்தையா?',
  },

  // Special Categories - Disability
  disability: {
    en: 'Person with disability',
    ta: 'மாற்றுத்திறனாளி',
    questionEn: 'Do you have a disability (40% or more)?',
    questionTa: 'உங்களுக்கு மாற்றுத்திறன் உள்ளதா (40% அல்லது அதற்கு மேல்)?',
  },
  bereavedFamily: {
    en: 'Bereaved family member',
    ta: 'இழப்புக்குள்ளான குடும்ப உறுப்பினர்',
    questionEn: 'Has your family lost the primary breadwinner?',
    questionTa: 'உங்கள் குடும்ப தலைவரை இழந்துள்ளீர்களா?',
  },

  // Housing & Infrastructure
  functionalTapConnection: {
    en: 'Has functional tap water connection',
    ta: 'செயல்படும் குழாய் நீர் இணைப்பு உள்ளது',
    questionEn: 'Do you have a functional tap water connection?',
    questionTa: 'உங்களிடம் குழாய் தண்ணீர் இணைப்பு உள்ளதா?',
  },
  noToiletAtHome: {
    en: 'No toilet facility at home',
    ta: 'வீட்டில் கழிவறை வசதி இல்லை',
    questionEn: 'Do you have a toilet at home?',
    questionTa: 'வீட்டில் கழிவறை உள்ளதா?',
  },
  ownsPuccaHouse: {
    en: 'Owns a pucca (permanent) house',
    ta: 'பக்கா (நிரந்தர) வீடு சொந்தமாக உள்ளது',
    questionEn: 'Do you own a pucca (permanent) house?',
    questionTa: 'உங்களிடம் பக்கா வீடு உள்ளதா?',
  },
  seccDatabase: {
    en: 'Registered in SECC database',
    ta: 'SECC தரவுத்தளத்தில் பதிவு செய்யப்பட்டுள்ளது',
    questionEn: 'Are you registered in the SECC database?',
    questionTa: 'நீங்கள் SECC தரவுத்தளத்தில் பதிவு செய்யப்பட்டுள்ளீர்களா?',
  },
  sewerageConnection: {
    en: 'Has sewerage connection',
    ta: 'சாக்கடை இணைப்பு உள்ளது',
    questionEn: 'Do you have a sewerage connection?',
    questionTa: 'உங்களிடம் சாக்கடை இணைப்பு உள்ளதா?',
  },
  urbanArea: {
    en: 'Lives in urban area',
    ta: 'நகர்ப்புறத்தில் வாழ்கிறார்',
    questionEn: 'Do you live in an urban area?',
    questionTa: 'நீங்கள் நகர்ப்புறத்தில் வாழ்கிறீர்களா?',
  },
  engagedInBegging: {
    en: 'Engaged in begging / destitute',
    ta: 'பிச்சை எடுக்கும் / ஆதரவற்ற நிலையில்',
    questionEn: 'Are you engaged in begging / destitute?',
    questionTa: 'நீங்கள் பிச்சை எடுக்கும் / ஆதரவற்ற நிலையில் உள்ளீர்களா?',
  },
  institution: {
    en: 'Applying as or through an institution',
    ta: 'நிறுவனம் மூலம் விண்ணப்பிக்கிறது',
    questionEn: 'Are you applying as or through an institution / organisation?',
    questionTa: 'நீங்கள் நிறுவனம் / அமைப்பு மூலம் விண்ணப்பிக்கிறீர்களா?',
  },
  pregnantWoman: {
    en: 'Pregnant woman',
    ta: 'கர்ப்பிணி பெண்',
    questionEn: 'Are you currently pregnant?',
    questionTa: 'நீங்கள் தற்போது கர்ப்பமாக உள்ளீர்களா?',
  },
  transgender: {
    en: 'Transgender person',
    ta: 'திருநங்கை',
    questionEn: 'Do you identify as transgender?',
    questionTa: 'நீங்கள் திருநங்கையா?',
  },
};

/**
 * Get human-readable label for an eligibility criterion
 * @param {string} key - Backend field ID
 * @param {string} language - 'en' or 'ta'
 * @returns {string} Human-readable label
 */
export function getEligibilityLabel(key, language = 'en') {
  if (!key) return '';

  const labels = ELIGIBILITY_LABELS[key];
  if (!labels) {
    // Fallback: convert camelCase to readable format
    console.warn(`Missing eligibility label for: ${key}`);
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  return labels[language] || labels.en || key;
}

/**
 * Get question form for an eligibility criterion (for MissingInfoModal)
 * @param {string} key - Backend field ID
 * @param {string} language - 'en' or 'ta'
 * @returns {string} Question text
 */
export function getEligibilityQuestion(key, language = 'en') {
  if (!key) return '';

  const labels = ELIGIBILITY_LABELS[key];
  if (!labels) {
    console.warn(`Missing eligibility question for: ${key}`);
    // Fallback: convert camelCase to question format
    const readable = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    return language === 'en' ? `Do you have ${readable.toLowerCase()}?` : readable;
  }

  const questionKey = language === 'en' ? 'questionEn' : 'questionTa';
  return labels[questionKey] || labels[language] || labels.en || key;
}

/**
 * Get labels for multiple criteria
 * @param {string[]} keys - Array of backend field IDs
 * @param {string} language - 'en' or 'ta'
 * @returns {string[]} Array of human-readable labels
 */
export function getEligibilityLabels(keys, language = 'en') {
  if (!Array.isArray(keys)) return [];
  return keys.map(key => getEligibilityLabel(key, language));
}

/**
 * Check if a criterion has a label defined
 * @param {string} key - Backend field ID
 * @returns {boolean}
 */
export function hasEligibilityLabel(key) {
  return key in ELIGIBILITY_LABELS;
}
