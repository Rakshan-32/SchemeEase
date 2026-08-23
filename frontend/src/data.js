// Translate primaryOccupation (new canonical UI field) into the boolean fields
// that backend/engine.py reads from schemes.json criteria. engine.py is unchanged.
// primaryOccupation values → engine boolean keys:
//   Farmer          → farmer: true
//   DailyWage       → unorganisedWorker: true
//   Entrepreneur    → firstTimeEntrepreneur: true
//   MSME            → firstTimeEntrepreneur: true  (closest match in current schema)
//   StreetVendor    → streetVendor: true
//   PersonWithDisability → disability: true (also set by the secondary disability checkbox)
function deriveProfileForEngine(profile) {
  const p = { ...profile };
  const occ = p.primaryOccupation;
  if (occ) {
    // When primaryOccupation is known, it is authoritative — override any stale
    // direct boolean values that may have been written by MissingInfoModal answers.
    p.farmer               = (occ === 'Farmer');
    p.unorganisedWorker    = (occ === 'DailyWage');
    p.firstTimeEntrepreneur = (occ === 'Entrepreneur' || occ === 'MSME');
    p.streetVendor         = (occ === 'StreetVendor');
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
