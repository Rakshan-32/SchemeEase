const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
      body: JSON.stringify({ profile })
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
