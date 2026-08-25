// Profile normalization and migration utility
// Safely handles schema changes without deleting valid user data

const CURRENT_PROFILE_VERSION = 2;

// Field name migrations (old → new)
const FIELD_MIGRATIONS = {
  // Student model migration: old studentStatus → new educationLevel
  // This is handled specially below to map values correctly
};

// Valid occupation values
const VALID_OCCUPATIONS = [
  'Student', 'Farmer', 'Salaried', 'DailyWage', 'SelfEmployed',
  'Entrepreneur', 'MSME', 'Unemployed', 'Homemaker', 'SeniorCitizen',
  'PersonWithDisability', 'StreetVendor', 'Other',
];

// Fields specific to each occupation (cleaned when occupation changes)
const OCCUPATION_SPECIFIC_FIELDS = {
  Farmer: ['landholding', 'insurableInterest'],
  Student: ['educationLevel', 'institutionType', 'firstGraduate', 'studentStatus', 'governmentSchoolStudent'], // includes legacy
  DailyWage: ['epfoMember', 'esicMember'],
  Entrepreneur: ['firstTimeEntrepreneur'],
  MSME: ['firstTimeEntrepreneur'],
  SelfEmployed: ['firstTimeEntrepreneur'],
};

/**
 * Normalize and migrate a profile to the current schema
 * @param {Object} profile - Raw profile from localStorage
 * @returns {Object} Normalized profile
 */
export function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return {};
  }

  let normalized = { ...profile };

  // Set or update profile version
  normalized.profileVersion = CURRENT_PROFILE_VERSION;

  // Migrate renamed fields
  for (const [oldKey, newKey] of Object.entries(FIELD_MIGRATIONS)) {
    if (oldKey in normalized && !(newKey in normalized)) {
      normalized[newKey] = normalized[oldKey];
      delete normalized[oldKey];
    }
  }

  // Normalize empty strings to null for consistency
  for (const key in normalized) {
    if (normalized[key] === '') {
      normalized[key] = null;
    }
  }

  // Normalize booleans (some old code might have stored strings)
  const booleanFields = [
    'landholding', 'insurableInterest', 'governmentSchoolStudent',
    'epfoMember', 'esicMember', 'firstTimeEntrepreneur',
    'disability', 'minorityCommunity', 'poorHousehold', 'incomeTaxPayer',
    'ownsPuccaHouse', 'noToiletAtHome', 'functionalTapConnection',
    'indianCitizen', 'willingToDoUnskilledWork',
    'pregnantOrLactatingWoman', 'firstChild',
  ];
  booleanFields.forEach(key => {
    if (key in normalized) {
      const val = normalized[key];
      if (val === 'true') normalized[key] = true;
      else if (val === 'false' || val === null || val === '') normalized[key] = false;
      // Keep explicit true/false as-is
    }
  });

  // Normalize numeric fields (age, income)
  const numericFields = ['age', 'income'];
  numericFields.forEach(key => {
    if (key in normalized) {
      const val = normalized[key];
      // Convert to number if it's a string
      if (typeof val === 'string' && val !== '') {
        const num = Number(val);
        normalized[key] = isNaN(num) ? null : num;
      } else if (val === '' || val == null) {
        normalized[key] = null;
      }
    }
  });

  // Validate and normalize primaryOccupation
  if (normalized.primaryOccupation && !VALID_OCCUPATIONS.includes(normalized.primaryOccupation)) {
    console.warn(`Invalid occupation: ${normalized.primaryOccupation}, resetting to null`);
    normalized.primaryOccupation = null;
  }

  // Migrate old student model to new model
  if (normalized.primaryOccupation === 'Student' && normalized.studentStatus && !normalized.educationLevel) {
    // Map old studentStatus values to new educationLevel
    const statusToLevel = {
      'Yes': 'class_1_8',
      'Class 9 to 12': 'class_9_10',
      'Post Matric': 'undergraduate',
      'School': 'class_1_8',
      'Government School': 'class_1_8',
    };

    if (statusToLevel[normalized.studentStatus]) {
      normalized.educationLevel = statusToLevel[normalized.studentStatus];
    }

    // If old status indicated government school, set institution type
    if (normalized.studentStatus === 'Government School' || normalized.governmentSchoolStudent) {
      normalized.institutionType = 'Government';
    }
  }

  // Clean up stale occupation-specific fields
  if (normalized.primaryOccupation) {
    const currentOccFields = OCCUPATION_SPECIFIC_FIELDS[normalized.primaryOccupation] || [];
    // Null out fields from OTHER occupations that are no longer relevant
    Object.entries(OCCUPATION_SPECIFIC_FIELDS).forEach(([occ, fields]) => {
      if (occ !== normalized.primaryOccupation) {
        fields.forEach(field => {
          if (field in normalized && !currentOccFields.includes(field)) {
            // Only null it out if it's not relevant to current occupation
            normalized[field] = null;
          }
        });
      }
    });
  }

  // Remove obsolete fields (add any deprecated field names here)
  const obsoleteFields = [
    // Example: 'oldDeprecatedField',
  ];
  obsoleteFields.forEach(field => {
    delete normalized[field];
  });

  return normalized;
}

/**
 * Check if a profile needs normalization
 * @param {Object} profile
 * @returns {boolean}
 */
export function needsNormalization(profile) {
  if (!profile || typeof profile !== 'object') return true;
  return profile.profileVersion !== CURRENT_PROFILE_VERSION;
}
