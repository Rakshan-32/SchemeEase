// Field schema for ProfileForm — consumed by both ProfileSetup (per-step) and ProfileEditor (all sections).
// Each section maps to a wizard step. ProfileEditor shows all three.

export const SECTIONS = [
  {
    key: 'basic',
    step: 1,
    titleEn: 'Basic Information',
    titleTa: 'அடிப்படை தகவல்',
    fields: [
      {
        key: 'age',
        type: 'number',
        labelEn: 'Age',
        labelTa: 'வயது',
        required: true,
        min: 1,
        max: 120,
        placeholderEn: 'Enter your age',
        placeholderTa: 'உங்கள் வயதை உள்ளிடவும்',
        validationEn: (v) => {
          if (v == null || v === '') return 'Age is required';
          const num = Number(v);
          if (isNaN(num)) return 'Please enter a valid age';
          if (num < 1 || num > 120) return 'Age must be between 1 and 120';
          return null;
        },
        validationTa: (v) => {
          if (v == null || v === '') return 'வயது தேவை';
          const num = Number(v);
          if (isNaN(num)) return 'சரியான வயதை உள்ளிடவும்';
          if (num < 1 || num > 120) return 'வயது 1 முதல் 120 க்கு இடையில் இருக்க வேண்டும்';
          return null;
        },
      },
      {
        key: 'gender',
        type: 'select',
        labelEn: 'Gender',
        labelTa: 'பாலினம்',
        required: true,
        options: [
          { value: 'Male',   labelEn: 'Male',   labelTa: 'ஆண்' },
          { value: 'Female', labelEn: 'Female', labelTa: 'பெண்' },
          { value: 'Other',  labelEn: 'Other',  labelTa: 'பிற' },
        ],
      },
      {
        key: 'income',
        type: 'number',
        labelEn: 'Annual Income (₹)',
        labelTa: 'ஆண்டு வருமானம் (₹)',
        min: 0,
        placeholderEn: 'Enter annual income (optional)',
        placeholderTa: 'ஆண்டு வருமானத்தை உள்ளிடவும் (விருப்பம்)',
        validationEn: (v) => {
          // null/blank is allowed (optional field)
          if (v == null || v === '') return null;
          const num = Number(v);
          if (isNaN(num)) return 'Please enter a valid income';
          if (num < 0) return 'Income cannot be negative';
          return null;
        },
        validationTa: (v) => {
          // null/blank is allowed (optional field)
          if (v == null || v === '') return null;
          const num = Number(v);
          if (isNaN(num)) return 'சரியான வருமானத்தை உள்ளிடவும்';
          if (num < 0) return 'வருமானம் எதிர்மறையாக இருக்க முடியாது';
          return null;
        },
      },
      {
        key: 'socialCategory',
        type: 'select',
        labelEn: 'Social Category',
        labelTa: 'சமூக வகை',
        options: [
          { value: 'General', labelEn: 'General', labelTa: 'General' },
          { value: 'SC',      labelEn: 'SC',      labelTa: 'SC' },
          { value: 'ST',      labelEn: 'ST',      labelTa: 'ST' },
          { value: 'OBC',     labelEn: 'OBC',     labelTa: 'OBC' },
        ],
      },
      {
        key: 'district',
        type: 'select',
        labelEn: 'District (Tamil Nadu)',
        labelTa: 'மாவட்டம் (தமிழ்நாடு)',
        options: [
          { value: 'Ariyalur', labelEn: 'Ariyalur', labelTa: 'அரியலூர்' },
          { value: 'Chengalpattu', labelEn: 'Chengalpattu', labelTa: 'செங்கல்பட்டு' },
          { value: 'Chennai', labelEn: 'Chennai', labelTa: 'சென்னை' },
          { value: 'Coimbatore', labelEn: 'Coimbatore', labelTa: 'கோயம்புத்தூர்' },
          { value: 'Cuddalore', labelEn: 'Cuddalore', labelTa: 'கடலூர்' },
          { value: 'Dharmapuri', labelEn: 'Dharmapuri', labelTa: 'தர்மபுரி' },
          { value: 'Dindigul', labelEn: 'Dindigul', labelTa: 'திண்டுக்கல்' },
          { value: 'Erode', labelEn: 'Erode', labelTa: 'ஈரோடு' },
          { value: 'Kallakurichi', labelEn: 'Kallakurichi', labelTa: 'கள்ளக்குறிச்சி' },
          { value: 'Kanchipuram', labelEn: 'Kanchipuram', labelTa: 'காஞ்சிபுரம்' },
          { value: 'Kanyakumari', labelEn: 'Kanyakumari', labelTa: 'கன்னியாகுமரி' },
          { value: 'Karur', labelEn: 'Karur', labelTa: 'கரூர்' },
          { value: 'Krishnagiri', labelEn: 'Krishnagiri', labelTa: 'கிருஷ்ணகிரி' },
          { value: 'Madurai', labelEn: 'Madurai', labelTa: 'மதுரை' },
          { value: 'Mayiladuthurai', labelEn: 'Mayiladuthurai', labelTa: 'மயிலாடுதுறை' },
          { value: 'Nagapattinam', labelEn: 'Nagapattinam', labelTa: 'நாகப்பட்டினம்' },
          { value: 'Namakkal', labelEn: 'Namakkal', labelTa: 'நாமக்கல்' },
          { value: 'Nilgiris', labelEn: 'Nilgiris', labelTa: 'நீலகிரி' },
          { value: 'Perambalur', labelEn: 'Perambalur', labelTa: 'பெரம்பலூர்' },
          { value: 'Pudukkottai', labelEn: 'Pudukkottai', labelTa: 'புதுக்கோட்டை' },
          { value: 'Ramanathapuram', labelEn: 'Ramanathapuram', labelTa: 'இராமநாதபுரம்' },
          { value: 'Ranipet', labelEn: 'Ranipet', labelTa: 'ராணிப்பேட்டை' },
          { value: 'Salem', labelEn: 'Salem', labelTa: 'சேலம்' },
          { value: 'Sivaganga', labelEn: 'Sivaganga', labelTa: 'சிவகங்கை' },
          { value: 'Tenkasi', labelEn: 'Tenkasi', labelTa: 'தென்காசி' },
          { value: 'Thanjavur', labelEn: 'Thanjavur', labelTa: 'தஞ்சாவூர்' },
          { value: 'Theni', labelEn: 'Theni', labelTa: 'தேனி' },
          { value: 'Thoothukudi', labelEn: 'Thoothukudi (Tuticorin)', labelTa: 'தூத்துக்குடி' },
          { value: 'Tiruchirappalli', labelEn: 'Tiruchirappalli (Trichy)', labelTa: 'திருச்சிராப்பள்ளி' },
          { value: 'Tirunelveli', labelEn: 'Tirunelveli', labelTa: 'திருநெல்வேலி' },
          { value: 'Tirupathur', labelEn: 'Tirupathur', labelTa: 'திருப்பத்தூர்' },
          { value: 'Tiruppur', labelEn: 'Tiruppur', labelTa: 'திருப்பூர்' },
          { value: 'Tiruvallur', labelEn: 'Tiruvallur', labelTa: 'திருவள்ளூர்' },
          { value: 'Tiruvannamalai', labelEn: 'Tiruvannamalai', labelTa: 'திருவண்ணாமலை' },
          { value: 'Tiruvarur', labelEn: 'Tiruvarur', labelTa: 'திருவாரூர்' },
          { value: 'Vellore', labelEn: 'Vellore', labelTa: 'வேலூர்' },
          { value: 'Viluppuram', labelEn: 'Viluppuram', labelTa: 'விழுப்புரம்' },
          { value: 'Virudhunagar', labelEn: 'Virudhunagar', labelTa: 'விருதுநகர்' },
        ],
      },
      {
        key: 'ruralUrban',
        type: 'select',
        labelEn: 'Rural/Urban',
        labelTa: 'கிராமம்/நகரம்',
        options: [
          { value: 'Rural', labelEn: 'Rural', labelTa: 'கிராமம்' },
          { value: 'Urban', labelEn: 'Urban', labelTa: 'நகரம்' },
        ],
      },
    ],
  },

  {
    key: 'occupation',
    step: 2,
    titleEn: 'What Best Describes You?',
    titleTa: 'உங்களை சிறந்த முறையில் விவரிப்பது எது?',
    subtitleEn: 'Select your primary occupation to find relevant schemes:',
    subtitleTa: 'பொருத்தமான திட்டங்களைக் கண்டறிய உங்கள் முதன்மை தொழிலைத் தேர்ந்தெடுக்கவும்:',
    fields: [
      {
        key: 'primaryOccupation',
        type: 'occupation_cards',
        required: true,
        labelEn: 'Primary Occupation',
        labelTa: 'முதன்மை தொழில்',
        options: [
          { value: 'Student',            labelEn: 'Student',                        labelTa: 'மாணவர்',                   icon: 'GraduationCap' },
          { value: 'Farmer',             labelEn: 'Farmer / Agriculture',           labelTa: 'விவசாயி',                  icon: 'Sprout' },
          { value: 'Salaried',           labelEn: 'Salaried Employee',              labelTa: 'சம்பளதாரர்',               icon: 'Briefcase' },
          { value: 'DailyWage',          labelEn: 'Daily Wage / Unorganised Worker',labelTa: 'அன்றாட கூலி தொழிலாளி',    icon: 'HardHat' },
          { value: 'SelfEmployed',       labelEn: 'Self-employed',                  labelTa: 'சுய தொழில்',               icon: 'Store' },
          { value: 'Entrepreneur',       labelEn: 'Entrepreneur / Business Owner',  labelTa: 'தொழில்முனைவோர்',           icon: 'TrendingUp' },
          { value: 'MSME',               labelEn: 'MSME Owner',                     labelTa: 'MSME உரிமையாளர்',          icon: 'Building2' },
          { value: 'Unemployed',         labelEn: 'Unemployed / Job Seeker',        labelTa: 'வேலையற்றவர்',              icon: 'Search' },
          { value: 'Homemaker',          labelEn: 'Homemaker',                      labelTa: 'இல்லத்தரசி',               icon: 'Home' },
          { value: 'SeniorCitizen',      labelEn: 'Senior Citizen / Retired',       labelTa: 'மூத்த குடிமகன்',           icon: 'Clock' },
          { value: 'PersonWithDisability', labelEn: 'Person with Disability',       labelTa: 'மாற்றுத்திறனாளி',         icon: 'Heart' },
          { value: 'StreetVendor',       labelEn: 'Street Vendor',                  labelTa: 'தெரு விற்பனையாளர்',        icon: 'ShoppingCart' },
          { value: 'Other',              labelEn: 'Other',                          labelTa: 'பிற',                      icon: 'User' },
        ],
      },

      // Farmer-specific follow-ups
      {
        key: 'landholding',
        type: 'checkbox',
        labelEn: 'I own or cultivate agricultural land',
        labelTa: 'நான் விவசாய நிலத்தை சொந்தமாக வைத்திருக்கிறேன் அல்லது பயிரிடுகிறேன்',
        showWhen: (p) => p.primaryOccupation === 'Farmer',
        indent: true,
      },
      {
        key: 'insurableInterest',
        type: 'checkbox',
        labelEn: 'I grow crops or have a financial stake in the harvest',
        labelTa: 'நான் பயிர்களை வளர்க்கிறேன் அல்லது அறுவடையில் நிதி பங்கு வைத்திருக்கிறேன்',
        hintEn: 'Required for crop insurance schemes',
        hintTa: 'பயிர் காப்பீடு திட்டங்களுக்கு தேவை',
        showWhen: (p) => p.primaryOccupation === 'Farmer',
        indent: true,
      },

      // Student-specific follow-ups
      {
        key: 'educationLevel',
        type: 'select',
        labelEn: 'Current Education Level',
        labelTa: 'தற்போதைய கல்வி நிலை',
        showWhen: (p) => p.primaryOccupation === 'Student',
        options: [
          { value: 'class_1_8',       labelEn: 'Class 1–8',           labelTa: 'வகுப்பு 1–8' },
          { value: 'class_9_10',      labelEn: 'Class 9–10',          labelTa: 'வகுப்பு 9–10' },
          { value: 'class_11_12',     labelEn: 'Class 11–12',         labelTa: 'வகுப்பு 11–12' },
          { value: 'iti',             labelEn: 'ITI',                 labelTa: 'ITI' },
          { value: 'diploma',         labelEn: 'Diploma',             labelTa: 'டிப்ளோமா' },
          { value: 'undergraduate',   labelEn: 'Undergraduate',       labelTa: 'இளங்கலை' },
          { value: 'postgraduate',    labelEn: 'Postgraduate',        labelTa: 'முதுகலை' },
          { value: 'other',           labelEn: 'Other',               labelTa: 'பிற' },
        ],
      },
      {
        key: 'institutionType',
        type: 'select',
        labelEn: 'Institution Type',
        labelTa: 'நிறுவன வகை',
        showWhen: (p) => p.primaryOccupation === 'Student' && p.educationLevel,
        options: [
          { value: 'Government',       labelEn: 'Government',              labelTa: 'அரசு' },
          { value: 'GovernmentAided',  labelEn: 'Government Aided',        labelTa: 'அரசு உதவி பெறும்' },
          { value: 'Private',          labelEn: 'Private',                 labelTa: 'தனியார்' },
          { value: 'Other',            labelEn: 'Other',                   labelTa: 'பிற' },
        ],
      },
      {
        key: 'firstGraduate',
        type: 'checkbox',
        labelEn: 'First person in family to pursue higher education',
        labelTa: 'குடும்பத்தில் உயர் கல்வி பயில்வோர் முதல் நபர்',
        showWhen: (p) => p.primaryOccupation === 'Student' && ['undergraduate', 'postgraduate'].includes(p.educationLevel),
        indent: true,
      },

      // Daily Wage / Unorganised Worker follow-ups
      {
        key: 'epfoMember',
        type: 'checkbox',
        labelEn: 'EPFO Member',
        labelTa: 'EPFO உறுப்பினர்',
        showWhen: (p) => p.primaryOccupation === 'DailyWage',
        indent: true,
      },
      {
        key: 'esicMember',
        type: 'checkbox',
        labelEn: 'ESIC Member',
        labelTa: 'ESIC உறுப்பினர்',
        showWhen: (p) => p.primaryOccupation === 'DailyWage',
        indent: true,
      },

      // Entrepreneur / MSME / Self-employed follow-ups
      {
        key: 'firstTimeEntrepreneur',
        type: 'checkbox',
        labelEn: 'This is my first business venture',
        labelTa: 'இது எனது முதல் தொழில் முயற்சி',
        showWhen: (p) => ['Entrepreneur', 'MSME', 'SelfEmployed'].includes(p.primaryOccupation),
        indent: true,
      },

    ],

    // Shown after occupation is chosen — cross-cutting identities that coexist with any primary role.
    // Rendered as a distinct "Anything else?" block by OccupationSection.
    secondaryIdentities: {
      titleEn: 'Anything else that applies to you?',
      titleTa: 'வேறு ஏதாவது உங்களுக்கு பொருந்துமா?',
      showWhen: (p) => !!p.primaryOccupation,
      fields: [
        {
          key: 'disability',
          type: 'checkbox',
          labelEn: 'Person with Disability',
          labelTa: 'மாற்றுத்திறனாளி',
          // Hidden when user already picked PersonWithDisability as primary (already derived)
          showWhen: (p) => p.primaryOccupation !== 'PersonWithDisability',
        },
        {
          key: 'minorityCommunity',
          type: 'checkbox',
          labelEn: 'Minority Community',
          labelTa: 'சிறுபான்மை சமூகம்',
        },
        {
          key: 'poorHousehold',
          type: 'checkbox',
          labelEn: 'BPL / Below Poverty Line Household',
          labelTa: 'BPL குடும்பம்',
        },
        {
          key: 'incomeTaxPayer',
          type: 'checkbox',
          labelEn: 'Income Tax Payer',
          labelTa: 'வருமான வரி செலுத்துபவர்',
        },
      ],
    },
  },

  {
    key: 'additional',
    step: 3,
    titleEn: 'Additional Details',
    titleTa: 'கூடுதல் விவரங்கள்',
    subtitleEn: 'These questions help us find more specific schemes for you:',
    subtitleTa: 'இவை உங்களுக்கு குறிப்பிட்ட திட்டங்களைக் கண்டறிய உதவும்:',
    groups: [
      {
        key: 'women',
        titleEn: null,
        titleTa: null,
        showWhen: (p) => p.gender === 'Female',
        hintEn: 'Women-specific schemes available:',
        hintTa: 'பெண்களுக்கான குறிப்பிட்ட திட்டங்கள்:',
        hintColor: 'pink',
        fields: [
          {
            key: 'pregnantOrLactatingWoman',
            type: 'checkbox',
            labelEn: 'Pregnant or Lactating Woman',
            labelTa: 'கர்ப்பிணி அல்லது பாலூட்டும் பெண்',
            size: 'lg',
          },
          {
            key: 'firstChild',
            type: 'checkbox',
            labelEn: 'Is this your first child?',
            labelTa: 'இது உங்கள் முதல் குழந்தையா?',
            showWhen: (p) => !!p.pregnantOrLactatingWoman,
            indent: true,
          },
        ],
      },
      {
        key: 'housing',
        titleEn: 'Housing & Infrastructure',
        titleTa: 'வீடு & உள்கட்டமைப்பு',
        fields: [
          {
            key: 'ownsPuccaHouse',
            type: 'checkbox',
            labelEn: 'I own a pucca house',
            labelTa: 'எனக்கு பக்கா வீடு உள்ளது',
            size: 'lg',
          },
          {
            key: 'noToiletAtHome',
            type: 'checkbox',
            labelEn: 'No Toilet at Home',
            labelTa: 'வீட்டில் கழிவறை இல்லை',
            size: 'lg',
          },
          {
            key: 'functionalTapConnection',
            type: 'checkbox',
            labelEn: 'I have a functional tap connection',
            labelTa: 'எனக்கு குழாய் இணைப்பு உள்ளது',
            size: 'lg',
          },
        ],
      },
      {
        key: 'other',
        titleEn: 'Other Details',
        titleTa: 'பிற விவரங்கள்',
        fields: [
          {
            key: 'indianCitizen',
            type: 'checkbox',
            labelEn: 'Indian Citizen',
            labelTa: 'இந்திய குடிமகன்',
            size: 'lg',
          },
          {
            key: 'willingToDoUnskilledWork',
            type: 'checkbox',
            labelEn: 'Interested in rural employment guarantee work',
            labelTa: 'கிராமப்புற வேலைவாய்ப்பு உத்தரவாத வேலையில் ஆர்வம்',
            hintEn: 'For MGNREGA and similar wage employment schemes',
            hintTa: 'MGNREGA மற்றும் இதுபோன்ற கூலி வேலைவாய்ப்பு திட்டங்களுக்கு',
            size: 'lg',
            showWhen: (p) => p.ruralUrban === 'Rural',
          },
        ],
      },
    ],
  },
];

// Map step number → section (for ProfileSetup)
export const SECTION_BY_STEP = Object.fromEntries(
  SECTIONS.map((s) => [s.step, s])
);

// Fields that are specific to each primaryOccupation value.
// When primaryOccupation changes, these are nulled out so stale values
// from the previous role don't silently affect eligibility matching.
// null = "not yet answered" → engine treats as UNKNOWN → NEEDS_MORE_INFO.
const OCCUPATION_SPECIFIC_FIELDS = {
  Farmer:    ['landholding', 'insurableInterest'],
  Student:   ['educationLevel', 'institutionType', 'firstGraduate', 'studentStatus', 'governmentSchoolStudent'], // includes legacy fields
  DailyWage: ['epfoMember', 'esicMember'],
  Entrepreneur: ['firstTimeEntrepreneur'],
  MSME: ['firstTimeEntrepreneur'],
  SelfEmployed: ['firstTimeEntrepreneur'],
};

export function clearFieldsFor(occupation) {
  const fields = OCCUPATION_SPECIFIC_FIELDS[occupation] || [];
  return Object.fromEntries(fields.map((k) => [k, null]));
}
