// Centralized deterministic scheme search utility
// Works without AI/API - pure client-side keyword matching and ranking

// Search keyword aliases for categories and common terms
const SEARCH_KEYWORDS = {
  // Agriculture
  agriculture: ['farmer', 'farming', 'agriculture', 'agricultural', 'crop', 'cultivation', 'kisan', 'land', 'harvest', 'produce', 'விவசாயி', 'விவசாயம்', 'பயிர்', 'நிலம்'],

  // Education / Student
  education: ['student', 'scholarship', 'school', 'college', 'education', 'study', 'educational', 'undergraduate', 'postgraduate', 'diploma', 'iti', 'class', 'மாணவர்', 'கல்வி', 'உதவித்தொகை', 'பள்ளி', 'கல்லூரி'],

  // Entrepreneurship / MSME / Business
  entrepreneurship: ['msme', 'micro', 'small', 'medium', 'enterprise', 'business', 'startup', 'entrepreneur', 'entrepreneurship', 'self employed', 'loan', 'credit', 'mudra', 'தொழில்', 'தொழில்முனைவோர்', 'வணிகம்', 'கடன்', 'ஸ்டார்ட்அப்'],

  // Women
  women: ['women', 'woman', 'female', 'girl', 'mother', 'maternity', 'pregnancy', 'pregnant', 'lactating', 'பெண்', 'பெண்கள்', 'தாய்', 'கர்ப்பிணி'],

  // Disability
  disability: ['disability', 'disabled', 'handicap', 'divyang', 'pwd', 'மாற்றுத்திறன்', 'மாற்றுத்திறனாளி'],

  // Employment / Worker
  employment: ['employment', 'job', 'work', 'worker', 'labour', 'labor', 'wage', 'daily wage', 'unorganised', 'mgnrega', 'வேலை', 'வேலைவாய்ப்பு', 'தொழிலாளி', 'கூலி'],

  // Housing
  housing: ['housing', 'house', 'home', 'awas', 'pmay', 'shelter', 'வீடு', 'வீட்டுவசதி', 'குடியிருப்பு'],

  // Health
  health: ['health', 'medical', 'hospital', 'insurance', 'treatment', 'ayushman', 'சுகாதாரம்', 'மருத்துவ', 'மருத்துவமனை', 'காப்பீடு'],

  // Senior Citizen
  senior: ['senior', 'elderly', 'old', 'pension', 'retirement', 'aged', 'மூத்த', 'முதியோர்', 'ஓய்வூதியம்'],

  // Social Security
  social: ['security', 'pension', 'welfare', 'assistance', 'support', 'benefit', 'பாதுகாப்பு', 'நலன்', 'உதவி'],

  // Sanitation
  sanitation: ['toilet', 'sanitation', 'swachh', 'latrine', 'கழிவறை', 'சுகாதாரம்'],

  // Infrastructure
  infrastructure: ['water', 'electricity', 'road', 'tap', 'connection', 'jal', 'நீர்', 'மின்சாரம்', 'குழாய்'],
};

// Scheme-specific keyword enhancements (for commonly searched acronyms/specific names)
const SCHEME_SPECIFIC_KEYWORDS = {
  'pm-kisan': ['pm kisan', 'pmkisan', 'pm-kisan', 'kisan samman', 'kisan samman nidhi', '6000', 'farmer income'],
  'pmmy': ['mudra', 'pmmy', 'pm mudra', 'micro loan', 'collateral free'],
  'standup-india': ['standup', 'stand up', 'sc st loan', 'women loan', 'greenfield', 'msme', 'sc st entrepreneur', 'women entrepreneur'],
  'pmfby': ['crop insurance', 'pmfby', 'fasal bima', 'insurance'],
  'pm-jay': ['ayushman', 'pmjay', 'pm jay', 'health insurance', '5 lakh'],
  'post-matric-sc': ['sc scholarship', 'sc students', 'scheduled caste scholarship'],
  'post-matric-minorities': ['minority scholarship', 'muslim christian sikh'],
  'nmms': ['nmms', 'merit scholarship', 'means cum merit'],
  'pmegp': ['pmegp', 'kvic', 'employment generation'],
  'startup-india-seed-fund': ['startup india', 'seed fund', 'dpiit'],
  'pm-kusum': ['solar pump', 'kusum', 'renewable energy farmer'],
  'mgnrega': ['mgnrega', 'nrega', 'rural employment', '100 days'],
  'ssy': ['sukanya', 'ssy', 'girl child', 'daughter'],
  'apy': ['atal pension', 'apy', 'unorganised pension'],
  'pmuy': ['ujjwala', 'lpg', 'gas connection', 'cylinder'],
  'pm-svanidhi': ['svanidhi', 'street vendor', 'micro credit'],
  'jjm': ['jal jeevan', 'tap water', 'rural water'],
  'e-shram': ['eshram', 'e-shram', 'unorganised worker card'],
  'pm-poshan': ['mid day meal', 'poshan', 'school meal'],
  'pradhan-mantri-awas-yojana-urban': ['pmay urban', 'urban housing', 'affordable housing city'],
  'pradhan-mantri-awas-yojana-gramin': ['pmay gramin', 'pmay rural', 'rural housing'],
  'swachh-bharat-toilet': ['swachh bharat', 'toilet scheme', 'sbm'],
  'tn-needs': ['needs', 'tamil nadu entrepreneur', 'tn entrepreneur', 'tn msme', 'first generation entrepreneur', 'new entrepreneur development'],
  'tn-uyegp': ['uyegp', 'unemployed youth', 'tamil nadu employment', 'tn employment generation', 'youth entrepreneur'],
  'tn-twees': ['twees', 'women entrepreneur', 'tamil nadu women', 'tn women entrepreneur', 'women empowerment', 'பெண் தொழில்முனைவோர்'],
};

/**
 * Normalize text for search comparison
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s஀-௿]/g, ' ') // Keep alphanumeric and Tamil Unicode
    .replace(/\s+/g, ' ');
}

/**
 * Calculate search relevance score for a scheme
 * @param {Object} scheme - Scheme object from schemes.json
 * @param {string} query - Search query
 * @param {string} language - 'en' or 'ta'
 * @returns {number} - Relevance score (0-1000+)
 */
function calculateRelevanceScore(scheme, query, language = 'en') {
  if (!query || !scheme) return 0;

  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery.split(' ').filter(t => t.length > 0);

  let score = 0;

  // 1. Exact scheme name match (highest priority) - 1000 points
  const schemeName = normalizeText(scheme.name);
  if (schemeName === normalizedQuery) {
    score += 1000;
  } else if (schemeName.includes(normalizedQuery)) {
    score += 800;
  }

  // 2. Scheme ID exact match - 900 points
  const schemeId = normalizeText(scheme.id);
  if (schemeId === normalizedQuery || schemeId.replace(/-/g, '') === normalizedQuery.replace(/\s/g, '')) {
    score += 900;
  }

  // 3. Scheme-specific keywords - 700 points per match
  const specificKeywords = SCHEME_SPECIFIC_KEYWORDS[scheme.id] || [];
  for (const keyword of specificKeywords) {
    if (normalizeText(keyword) === normalizedQuery || normalizedQuery.includes(normalizeText(keyword))) {
      score += 700;
    }
  }

  // 4. Category exact match - 500 points
  const category = normalizeText(scheme.category);
  if (category === normalizedQuery || queryTokens.includes(category)) {
    score += 500;
  }

  // 5. Category keyword aliases - 400 points
  for (const [categoryKey, keywords] of Object.entries(SEARCH_KEYWORDS)) {
    const matches = keywords.filter(kw => {
      const normalized = normalizeText(kw);
      return queryTokens.includes(normalized) || normalizedQuery.includes(normalized);
    });
    if (matches.length > 0) {
      // Check if this scheme's category relates to this keyword group
      if (category.includes(categoryKey) ||
          (categoryKey === 'agriculture' && category.includes('agriculture')) ||
          (categoryKey === 'education' && category.includes('education')) ||
          (categoryKey === 'entrepreneurship' && (category.includes('entrepreneurship') || category.includes('livelihood'))) ||
          (categoryKey === 'women' && category.includes('women')) ||
          (categoryKey === 'disability' && category.includes('disability')) ||
          (categoryKey === 'employment' && (category.includes('employment') || category.includes('skill'))) ||
          (categoryKey === 'housing' && category.includes('housing')) ||
          (categoryKey === 'health' && category.includes('health')) ||
          (categoryKey === 'senior' && category.includes('social')) ||
          (categoryKey === 'social' && category.includes('social')) ||
          (categoryKey === 'sanitation' && category.includes('sanitation')) ||
          (categoryKey === 'infrastructure' && category.includes('infrastructure'))) {
        score += 400 * matches.length;
      }
    }
  }

  // 6. Department match - 300 points
  const department = normalizeText(scheme.department);
  for (const token of queryTokens) {
    if (department.includes(token) && token.length > 3) {
      score += 300;
    }
  }

  // 7. Description match - 100 points per token
  const description = normalizeText(language === 'ta' && scheme.description_ta ? scheme.description_ta : scheme.description);
  let descriptionMatches = 0;
  for (const token of queryTokens) {
    if (token.length > 2 && description.includes(token)) {
      descriptionMatches++;
    }
  }
  score += descriptionMatches * 100;

  // 8. Benefits match - 80 points per token
  const benefits = Array.isArray(scheme.benefits) ? scheme.benefits.join(' ') : '';
  const benefitsTa = Array.isArray(scheme.benefits_ta) ? scheme.benefits_ta.join(' ') : '';
  const benefitsText = normalizeText(language === 'ta' && benefitsTa ? benefitsTa : benefits);
  let benefitsMatches = 0;
  for (const token of queryTokens) {
    if (token.length > 2 && benefitsText.includes(token)) {
      benefitsMatches++;
    }
  }
  score += benefitsMatches * 80;

  // 9. Application method match - 50 points per token
  const applicationMethod = normalizeText(language === 'ta' && scheme.applicationMethod_ta ? scheme.applicationMethod_ta : scheme.applicationMethod);
  let appMethodMatches = 0;
  for (const token of queryTokens) {
    if (token.length > 2 && applicationMethod.includes(token)) {
      appMethodMatches++;
    }
  }
  score += appMethodMatches * 50;

  return score;
}

/**
 * Search schemes by query
 * @param {Array} schemes - Array of scheme objects (with eligibility data if available)
 * @param {string} query - Search query
 * @param {string} language - 'en' or 'ta'
 * @param {Object} options - Additional options
 * @param {boolean} options.includeEligibility - If true, boost scores based on eligibility_status
 * @returns {Array} - Filtered and ranked schemes
 */
export function searchSchemes(schemes, query, language = 'en', options = {}) {
  if (!schemes || schemes.length === 0) return [];
  if (!query || query.trim().length === 0) return schemes;

  const { includeEligibility = false } = options;

  // Calculate relevance for each scheme
  const scoredSchemes = schemes.map(schemeData => {
    // Handle both plain scheme objects and scheme result objects (with eligibility_status)
    const scheme = schemeData.scheme || schemeData;
    const relevanceScore = calculateRelevanceScore(scheme, query, language);

    return {
      ...schemeData,
      _searchScore: relevanceScore,
    };
  });

  // Filter out schemes with zero relevance
  const filtered = scoredSchemes.filter(s => s._searchScore > 0);

  // Sort by relevance score, then by eligibility if available
  filtered.sort((a, b) => {
    // Primary sort: search relevance
    if (a._searchScore !== b._searchScore) {
      return b._searchScore - a._searchScore;
    }

    // Secondary sort: eligibility status (if available and enabled)
    if (includeEligibility && a.eligibility_status && b.eligibility_status) {
      const statusRank = { 'ELIGIBLE': 3, 'NEEDS_MORE_INFO': 2, 'NOT_ELIGIBLE': 1 };
      const aRank = statusRank[a.eligibility_status] || 0;
      const bRank = statusRank[b.eligibility_status] || 0;
      if (aRank !== bRank) {
        return bRank - aRank;
      }
    }

    // Tertiary sort: alphabetical by name
    const aName = (a.scheme || a).name || '';
    const bName = (b.scheme || b).name || '';
    return aName.localeCompare(bName);
  });

  return filtered;
}

/**
 * Get suggested search terms based on partial query
 * @param {string} query - Partial search query
 * @param {string} language - 'en' or 'ta'
 * @returns {Array} - Suggested search terms
 */
export function getSuggestedSearchTerms(query, language = 'en') {
  if (!query || query.length < 2) return [];

  const normalized = normalizeText(query);
  const suggestions = new Set();

  // Check category keywords
  for (const keywords of Object.values(SEARCH_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizeText(keyword).startsWith(normalized)) {
        suggestions.add(keyword);
      }
    }
  }

  // Limit to top 5 suggestions
  return Array.from(suggestions).slice(0, 5);
}
