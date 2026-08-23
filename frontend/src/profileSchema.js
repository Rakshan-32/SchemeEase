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
    titleEn: 'Occupation & Status',
    titleTa: 'தொழில் & நிலை',
    subtitleEn: 'Select all that apply to discover relevant schemes:',
    subtitleTa: 'பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்:',
    fields: [
      {
        key: 'farmer',
        type: 'checkbox',
        labelEn: 'I am a Farmer',
        labelTa: 'நான் ஒரு விவசாயி',
        size: 'lg',
        groupHintEn: 'Answer these to find agriculture schemes:',
        groupHintTa: 'விவசாய திட்டங்களைக் கண்டறிய பதிலளிக்கவும்:',
        groupHintColor: 'teal',
      },
      {
        key: 'landholding',
        type: 'checkbox',
        labelEn: 'I own agricultural land',
        labelTa: 'எனக்கு விவசாய நிலம் உள்ளது',
        showWhen: (p) => !!p.farmer,
        indent: true,
      },
      {
        key: 'insurableInterest',
        type: 'checkbox',
        labelEn: 'I have insurable interest in crops',
        labelTa: 'பயிர் காப்பீடு ஆர்வம் உள்ளது',
        showWhen: (p) => !!p.farmer,
        indent: true,
      },
      {
        key: 'studentStatus',
        type: 'select',
        labelEn: 'Student Status',
        labelTa: 'மாணவர் நிலை',
        options: [
          { value: 'No',                labelEn: 'Not a student',          labelTa: 'மாணவர் அல்ல' },
          { value: 'Yes',               labelEn: 'Student - Class 1 to 8', labelTa: 'மாணவர் - வகுப்பு 1 முதல் 8' },
          { value: 'Class 9 to 12',     labelEn: 'Student - Class 9 to 12',labelTa: 'மாணவர் - வகுப்பு 9 முதல் 12' },
          { value: 'Post Matric',       labelEn: 'Post Matric / College',  labelTa: 'கல்லூரி' },
          { value: 'School',            labelEn: 'School (General)',        labelTa: 'பள்ளி' },
          { value: 'Government School', labelEn: 'Government School',      labelTa: 'அரசு பள்ளி' },
        ],
      },
      {
        key: 'governmentSchoolStudent',
        type: 'checkbox',
        labelEn: 'Studying in Government School',
        labelTa: 'அரசு பள்ளியில் படிக்கிறேன்',
        showWhen: (p) => p.studentStatus === 'Government School' || p.studentStatus === 'Yes',
        indent: true,
      },
      {
        key: 'unorganisedWorker',
        type: 'checkbox',
        labelEn: 'Unorganised Worker',
        labelTa: 'அமைப்புசாரா தொழிலாளி',
        size: 'lg',
      },
      {
        key: 'epfoMember',
        type: 'checkbox',
        labelEn: 'EPFO Member',
        labelTa: 'EPFO உறுப்பினர்',
        showWhen: (p) => !!p.unorganisedWorker,
        indent: true,
      },
      {
        key: 'esicMember',
        type: 'checkbox',
        labelEn: 'ESIC Member',
        labelTa: 'ESIC உறுப்பினர்',
        showWhen: (p) => !!p.unorganisedWorker,
        indent: true,
      },
      {
        key: 'firstTimeEntrepreneur',
        type: 'checkbox',
        labelEn: 'First-time Entrepreneur',
        labelTa: 'முதல் முறை தொழில்முனைவோர்',
        size: 'lg',
      },
      {
        key: 'disability',
        type: 'checkbox',
        labelEn: 'Person with Disability',
        labelTa: 'மாற்றுத்திறனாளி',
        size: 'lg',
      },
      {
        key: 'minorityCommunity',
        type: 'checkbox',
        labelEn: 'Minority Community (Muslim / Christian / Sikh / Buddhist / Parsi / Jain)',
        labelTa: 'சிறுபான்மை சமூகம் (முஸ்லிம் / கிறிஸ்தவர் / சீக்கியர் / பௌத்தர் / பார்சி / ஜைனர்)',
        size: 'lg',
      },
      {
        key: 'poorHousehold',
        type: 'checkbox',
        labelEn: 'BPL Household',
        labelTa: 'BPL குடும்பம்',
        size: 'lg',
      },
      {
        key: 'streetVendor',
        type: 'checkbox',
        labelEn: 'Street Vendor',
        labelTa: 'தெரு விற்பனையாளர்',
        size: 'lg',
      },
      {
        key: 'incomeTaxPayer',
        type: 'checkbox',
        labelEn: 'Income Tax Payer',
        labelTa: 'வருமான வரி செலுத்துபவர்',
        size: 'lg',
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
