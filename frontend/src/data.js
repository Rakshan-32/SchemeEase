// Translate primaryOccupation (new canonical UI field) into the boolean fields
// that backend/engine.py reads from schemes.json criteria. engine.py is unchanged.
// primaryOccupation values → engine boolean keys:
//   Farmer          → farmer: true
//   DailyWage       → unorganisedWorker: true
//   StreetVendor    → streetVendor: true
//   PersonWithDisability → disability: true (also set by the secondary disability checkbox)
//
// IMPORTANT: Entrepreneur and MSME do NOT automatically map to firstTimeEntrepreneur.
// Being an MSME owner or entrepreneur does NOT mean someone is starting their first business.
// firstTimeEntrepreneur should only be set when explicitly answered via MissingInfoModal.
//
// Student model: Maps new educationLevel/institutionType to legacy backend fields
// for backwards compatibility with existing schemes.json
function deriveProfileForEngine(profile) {
  const p = { ...profile };
  const occ = p.primaryOccupation;
  if (occ) {
    // When primaryOccupation is known, it is authoritative — override any stale
    // direct boolean values that may have been written by MissingInfoModal answers.
    p.farmer               = (occ === 'Farmer');
    p.unorganisedWorker    = (occ === 'DailyWage');
    p.streetVendor         = (occ === 'StreetVendor');

    // Map new student model to both canonical and legacy backend fields
    if (occ === 'Student') {
      // Set canonical field that schemes can check directly
      p.student = true;

      // Pass educationLevel and institutionType directly (engine will use these)
      // No need to convert - engine.py already handles list matching

      // Backward compatibility: convert educationLevel → studentStatus for old schemes
      if (p.educationLevel && !p.studentStatus) {
        const levelToStatus = {
          'class_1_8': 'Yes',
          'class_9_10': 'Class 9 to 12',
          'class_11_12': 'Class 9 to 12',
          'iti': 'Post Matric',
          'diploma': 'Post Matric',
          'undergraduate': 'Post Matric',
          'postgraduate': 'Post Matric',
          'other': 'School',
        };
        p.studentStatus = levelToStatus[p.educationLevel] || 'Yes';
      }

      // Map institutionType → governmentSchoolStudent for backend compatibility
      if (p.institutionType === 'Government' && p.governmentSchoolStudent == null) {
        p.governmentSchoolStudent = true;
      }
    }

    // Do NOT automatically set firstTimeEntrepreneur for Entrepreneur or MSME.
    // If a scheme requires this field, it will show up in MissingInfoModal.
    // Only clear it if we're switching away from a business-related occupation.
    if (occ !== 'Entrepreneur' && occ !== 'MSME' && occ !== 'SelfEmployed') {
      // User switched to non-business occupation, clear entrepreneur status
      if (p.firstTimeEntrepreneur != null) p.firstTimeEntrepreneur = null;
    }
    // Otherwise preserve the explicitly answered value from MissingInfoModal

    // disability can also come from the secondaryIdentities checkbox — only add,
    // never clear, so a Farmer who also has a disability keeps disability: true.
    if (occ === 'PersonWithDisability') p.disability = true;
  }
  // No primaryOccupation: preserve any direct field answers (e.g. from MissingInfoModal)
  return p;
}

// Set VITE_API_BASE_URL in frontend/.env (see .env.example). No trailing slash.
const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.PROD
    ? (() => { throw new Error('VITE_API_BASE_URL is not configured for production'); })()
    : 'http://localhost:8000'
);

export const fetchScheme = async (schemeId) => {
  try {
    const res = await fetch(`${API_BASE}/schemes/${encodeURIComponent(schemeId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.scheme || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const analyzeProfile = async (profile) => {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: deriveProfileForEngine(profile) })
    });
    if (!res.ok) throw new Error("API failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const explainScheme = async (profile, schemeData) => {
  try {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile,
        scheme_name: schemeData.scheme.name,
        match_status: schemeData.eligibility_status,
        matched: schemeData.matched_criteria,
        missing: schemeData.missing_information,
        failed: schemeData.failed_criteria
      })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const extractProfile = async (text) => {
  try {
    const res = await fetch(`${API_BASE}/extract-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const sendContactMessage = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || 'Unable to send your message. Please try again.' };
    }
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Unable to send your message. Please try again.' };
  }
};
