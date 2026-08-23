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
        min: 0,
        max: 120,
        placeholderEn: 'Enter your age',
        placeholderTa: 'உங்கள் வயதை உள்ளிடவும்',
        validationEn: (v) => {
          if (!v && v !== 0) return 'Age is required';
          if (v < 0 || v > 120) return 'Age must be between 0 and 120';
          return null;
        },
        validationTa: (v) => {
          if (!v && v !== 0) return 'வயது தேவை';
          if (v < 0 || v > 120) return 'வயது 0 முதல் 120 க்கு இடையில் இருக்க வேண்டும்';
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
        placeholderEn: '0',
        placeholderTa: '0',
        validationEn: (v) => (v < 0 ? 'Income cannot be negative' : null),
        validationTa: (v) => (v < 0 ? 'வருமானம் எதிர்மறையாக இருக்க முடியாது' : null),
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
        labelEn: 'I own agricultural land',
        labelTa: 'எனக்கு விவசாய நிலம் உள்ளது',
        showWhen: (p) => p.primaryOccupation === 'Farmer',
        indent: true,
      },
      {
        key: 'insurableInterest',
        type: 'checkbox',
        labelEn: 'I have insurable interest in crops',
        labelTa: 'பயிர் காப்பீடு ஆர்வம் உள்ளது',
        showWhen: (p) => p.primaryOccupation === 'Farmer',
        indent: true,
      },

      // Student-specific follow-ups
      {
        key: 'studentStatus',
        type: 'select',
        labelEn: 'Student Level',
        labelTa: 'மாணவர் நிலை',
        showWhen: (p) => p.primaryOccupation === 'Student',
        options: [
          { value: 'Yes',               labelEn: 'Class 1 to 8',           labelTa: 'வகுப்பு 1 முதல் 8' },
          { value: 'Class 9 to 12',     labelEn: 'Class 9 to 12',          labelTa: 'வகுப்பு 9 முதல் 12' },
          { value: 'Post Matric',       labelEn: 'Post Matric / College',   labelTa: 'கல்லூரி' },
          { value: 'School',            labelEn: 'School (General)',         labelTa: 'பள்ளி' },
          { value: 'Government School', labelEn: 'Government School',       labelTa: 'அரசு பள்ளி' },
        ],
      },
      {
        key: 'governmentSchoolStudent',
        type: 'checkbox',
        labelEn: 'Studying in Government School',
        labelTa: 'அரசு பள்ளியில் படிக்கிறேன்',
        showWhen: (p) => p.primaryOccupation === 'Student' && (p.studentStatus === 'Government School' || p.studentStatus === 'Yes'),
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

      // Cross-cutting attributes (any occupation) — Stage 2 will move these to a dedicated Secondary Identities section
      {
        key: 'disability',
        type: 'checkbox',
        labelEn: 'Person with Disability',
        labelTa: 'மாற்றுத்திறனாளி',
        size: 'lg',
        showWhen: (p) => p.primaryOccupation && p.primaryOccupation !== 'PersonWithDisability',
      },
      {
        key: 'minorityCommunity',
        type: 'checkbox',
        labelEn: 'Minority Community (Muslim / Christian / Sikh / Buddhist / Parsi / Jain)',
        labelTa: 'சிறுபான்மை சமூகம் (முஸ்லிம் / கிறிஸ்தவர் / சீக்கியர் / பௌத்தர் / பார்சி / ஜைனர்)',
        size: 'lg',
        showWhen: (p) => !!p.primaryOccupation,
      },
      {
        key: 'poorHousehold',
        type: 'checkbox',
        labelEn: 'BPL / Below Poverty Line Household',
        labelTa: 'BPL குடும்பம்',
        size: 'lg',
        showWhen: (p) => !!p.primaryOccupation,
      },
      {
        key: 'incomeTaxPayer',
        type: 'checkbox',
        labelEn: 'Income Tax Payer',
        labelTa: 'வருமான வரி செலுத்துபவர்',
        size: 'lg',
        showWhen: (p) => !!p.primaryOccupation,
      },
    ],
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
            labelEn: 'Willing to do unskilled work (MGNREGA)',
            labelTa: 'திறமையற்ற வேலை செய்ய தயாராக உள்ளேன்',
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
