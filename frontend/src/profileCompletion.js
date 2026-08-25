// Calculates personalized profile completion based on relevant fields only.
// A Farmer should NOT lose points for unanswered Student fields.

// Core fields everyone should fill
const CORE_FIELDS = [
  'age',
  'gender',
  'primaryOccupation',
];

// Strongly recommended for better matching (but not strictly required)
const RECOMMENDED_FIELDS = [
  'income',
  'socialCategory',
  'district',
  'ruralUrban',
  'indianCitizen',
];

// Occupation-specific fields that matter ONLY for that occupation
const OCCUPATION_FIELDS = {
  Farmer: ['landholding', 'insurableInterest'],
  Student: ['educationLevel', 'institutionType'], // firstGraduate is optional, handled separately
  DailyWage: ['epfoMember', 'esicMember'],
  Entrepreneur: ['firstTimeEntrepreneur'],
  MSME: ['firstTimeEntrepreneur'],
  SelfEmployed: ['firstTimeEntrepreneur'],
};

// Secondary identity fields
const SECONDARY_IDENTITY_FIELDS = [
  'disability',
  'minorityCommunity',
  'poorHousehold',
  'incomeTaxPayer',
];

/**
 * Calculate personalized profile completion percentage
 * @param {Object} profile - The user's profile
 * @returns {Object} { percentage, completed, total, missingRequired, missingRecommended }
 */
export function calculateProfileCompletion(profile) {
  if (!profile || typeof profile !== 'object') {
    return { percentage: 0, completed: 0, total: 1, missingRequired: [], missingRecommended: [] };
  }

  const isAnswered = (key) => {
    const val = profile[key];
    return val != null && val !== '' && val !== false; // false for unchecked boxes means "answered as no"
  };

  // Core required fields
  const requiredFields = [...CORE_FIELDS];
  const completedRequired = requiredFields.filter(isAnswered);
  const missingRequired = requiredFields.filter(k => !isAnswered(k));

  // Add occupation-specific fields if relevant
  const occ = profile.primaryOccupation;
  const occFields = OCCUPATION_FIELDS[occ] || [];
  const completedOccFields = occFields.filter(isAnswered);

  // Recommended fields (count answered ones)
  const completedRecommended = RECOMMENDED_FIELDS.filter(isAnswered);
  const missingRecommended = RECOMMENDED_FIELDS.filter(k => !isAnswered(k));

  // Total points system:
  // - Core required: 50 points (divided among core fields)
  // - Occupation-specific: 30 points (divided among occ fields if any)
  // - Recommended: 20 points (divided among recommended fields)

  const coreWeight = 50;
  const occWeight = occFields.length > 0 ? 30 : 0; // 0 if no occ-specific fields
  const recWeight = 20;

  let score = 0;

  // Core fields contribution
  if (requiredFields.length > 0) {
    score += (completedRequired.length / requiredFields.length) * coreWeight;
  }

  // Occupation fields contribution
  if (occFields.length > 0) {
    score += (completedOccFields.length / occFields.length) * occWeight;
  } else {
    // If no occ-specific fields, redistribute weight to recommended
    score += occWeight; // full weight since nothing to fill
  }

  // Recommended fields contribution
  if (RECOMMENDED_FIELDS.length > 0) {
    score += (completedRecommended.length / RECOMMENDED_FIELDS.length) * recWeight;
  }

  const percentage = Math.round(Math.min(score, 100));

  const totalRelevant = requiredFields.length + occFields.length + RECOMMENDED_FIELDS.length;
  const completed = completedRequired.length + completedOccFields.length + completedRecommended.length;

  return {
    percentage,
    completed,
    total: totalRelevant,
    missingRequired,
    missingRecommended,
  };
}
