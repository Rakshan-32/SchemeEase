import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, User, ShieldCheck, Home } from 'lucide-react';

const OCC_LABELS = {
  Student:              { en: 'Student',                          ta: 'மாணவர்' },
  Farmer:               { en: 'Farmer / Agriculture',              ta: 'விவசாயி' },
  Salaried:             { en: 'Salaried Employee',                 ta: 'சம்பளதாரர்' },
  DailyWage:            { en: 'Daily Wage / Unorganised Worker',   ta: 'அன்றாட கூலி தொழிலாளி' },
  SelfEmployed:         { en: 'Self-employed',                     ta: 'சுய தொழில்' },
  Entrepreneur:         { en: 'Entrepreneur / Business Owner',     ta: 'தொழில்முனைவோர்' },
  MSME:                 { en: 'MSME Owner',                        ta: 'MSME உரிமையாளர்' },
  Unemployed:           { en: 'Unemployed / Job Seeker',           ta: 'வேலையற்றவர்' },
  Homemaker:            { en: 'Homemaker',                         ta: 'இல்லத்தரசி' },
  SeniorCitizen:        { en: 'Senior Citizen / Retired',          ta: 'மூத்த குடிமகன்' },
  PersonWithDisability: { en: 'Person with Disability',            ta: 'மாற்றுத்திறனாளி' },
  StreetVendor:         { en: 'Street Vendor',                     ta: 'தெரு விற்பனையாளர்' },
  Other:                { en: 'Other',                             ta: 'பிற' },
};

const getUserName = () => {
  const email = localStorage.getItem('current_user') || '';
  try {
    const users = JSON.parse(localStorage.getItem('schemease_users') || '{}');
    return users[email]?.name || email.split('@')[0] || 'User';
  } catch {
    return email.split('@')[0] || 'User';
  }
};

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const completionPct = (profile) =>
  Math.round(Math.min(Object.keys(profile).length / 20, 1) * 100);

const CIRC = 2 * Math.PI * 36;

// Read-only section card — renders a dl of label/value rows.
// value === null/undefined → muted italic "Not specified".
const SectionCard = ({ title, icon: Icon, rows, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-teal-500" />
      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <dl className="divide-y divide-slate-100 dark:divide-slate-700/60">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between items-start py-2.5 gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400 shrink-0">{label}</dt>
          <dd className={`text-sm font-medium text-right ${
            value == null
              ? 'text-slate-400 dark:text-slate-500 italic'
              : 'text-slate-800 dark:text-white'
          }`}>
            {value ?? 'Not specified'}
          </dd>
        </div>
      ))}
    </dl>
  </motion.div>
);

const ProfilePage = ({ profile, onUpdate, darkMode, language }) => {
  const t = (en, ta) => (language === 'en' ? en : ta);
  const name = getUserName();
  const initials = getInitials(name);
  const pct = completionPct(profile);
  const occKey = profile.primaryOccupation;
  const occLabel = occKey
    ? (language === 'en' ? OCC_LABELS[occKey]?.en : OCC_LABELS[occKey]?.ta) ?? occKey
    : null;

  // null/undefined → null (renders as "Not specified")
  const bool3 = (v) =>
    v === true ? t('Yes', 'ஆம்') : v === false ? t('No', 'இல்லை') : null;

  // ── Personal ──────────────────────────────────────────────────────
  const personalRows = [
    [t('Age', 'வயது'),             profile.age != null ? String(profile.age) : null],
    [t('Gender', 'பாலினம்'),       profile.gender ?? null],
    [t('Annual Income', 'ஆண்டு வருமானம்'),
      profile.income != null ? `₹${Number(profile.income).toLocaleString('en-IN')}` : null],
    [t('Social Category', 'சமூக வகை'), profile.socialCategory ?? null],
    [t('Rural / Urban', 'கிராமம் / நகரம்'), profile.ruralUrban ?? null],
  ];

  // ── Occupation ────────────────────────────────────────────────────
  const occRows = [
    [t('Primary Occupation', 'முதன்மை தொழில்'), occLabel],
  ];
  if (occKey === 'Farmer') {
    occRows.push(
      [t('Owns Agricultural Land', 'விவசாய நிலம் உள்ளது'), bool3(profile.landholding)],
      [t('Insurable Interest in Crops', 'பயிர் காப்பீட்டு ஆர்வம்'), bool3(profile.insurableInterest)],
    );
  }
  if (occKey === 'Student') {
    occRows.push(
      [t('Student Level', 'மாணவர் நிலை'), profile.studentStatus ?? null],
      [t('Govt. School Student', 'அரசு பள்ளி மாணவர்'), bool3(profile.governmentSchoolStudent)],
    );
  }
  if (occKey === 'DailyWage') {
    occRows.push(
      [t('EPFO Member', 'EPFO உறுப்பினர்'), bool3(profile.epfoMember)],
      [t('ESIC Member', 'ESIC உறுப்பினர்'), bool3(profile.esicMember)],
    );
  }

  // ── Economic & Community ──────────────────────────────────────────
  const econRows = [
    [t('Person with Disability', 'மாற்றுத்திறனாளி'),
      occKey === 'PersonWithDisability'
        ? t('Yes (primary role)', 'ஆம் (முதன்மை பங்கு)')
        : bool3(profile.disability == null ? undefined : !!profile.disability)],
    [t('Minority Community', 'சிறுபான்மை சமூகம்'),
      bool3(profile.minorityCommunity == null ? undefined : !!profile.minorityCommunity)],
    [t('BPL Household', 'BPL குடும்பம்'),
      bool3(profile.poorHousehold == null ? undefined : !!profile.poorHousehold)],
    [t('Income Tax Payer', 'வருமான வரி செலுத்துபவர்'),
      bool3(profile.incomeTaxPayer == null ? undefined : !!profile.incomeTaxPayer)],
  ];

  // ── Additional Details ────────────────────────────────────────────
  const addlRows = [];
  if (profile.gender === 'Female') {
    addlRows.push([t('Pregnant / Lactating', 'கர்ப்பிணி / பாலூட்டும்'),
      bool3(profile.pregnantOrLactatingWoman)]);
    if (profile.pregnantOrLactatingWoman) {
      addlRows.push([t('First Child', 'முதல் குழந்தை'), bool3(profile.firstChild)]);
    }
  }
  addlRows.push(
    [t('Owns Pucca House', 'பக்கா வீடு உள்ளது'),      bool3(profile.ownsPuccaHouse)],
    [t('No Toilet at Home', 'வீட்டில் கழிவறை இல்லை'), bool3(profile.noToiletAtHome)],
    [t('Functional Tap Connection', 'குழாய் இணைப்பு'), bool3(profile.functionalTapConnection)],
    [t('Indian Citizen', 'இந்திய குடிமகன்'),           bool3(profile.indianCitizen)],
  );
  if (profile.ruralUrban === 'Rural') {
    addlRows.push([t('Willing for Unskilled Work (MGNREGA)', 'திறமையற்ற வேலை (MGNREGA)'),
      bool3(profile.willingToDoUnskilledWork)]);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ── Header card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
      >
        {/* Avatar circle */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md select-none">
          {initials}
        </div>

        {/* Name + occupation + location */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white truncate">{name}</h2>
          <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {occLabel && (
              <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                <Briefcase className="w-4 h-4 text-teal-500 flex-shrink-0" />
                {occLabel}
              </span>
            )}
            {profile.ruralUrban && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {profile.ruralUrban}
              </span>
            )}
          </div>
        </div>

        {/* Completion ring */}
        <div className="flex-shrink-0 text-center">
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r="36"
                stroke="currentColor" strokeWidth="8" fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="40" cy="40" r="36"
                stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - pct / 100)}
                strokeLinecap="round"
                className="text-teal-500 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{pct}%</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            {t('Profile', 'சுயவிவரம்')}
          </p>
        </div>
      </motion.div>

      <SectionCard
        title={t('Personal', 'தனிப்பட்ட விவரம்')}
        icon={User}
        rows={personalRows}
        delay={0.05}
      />

      <SectionCard
        title={t('Occupation', 'தொழில்')}
        icon={Briefcase}
        rows={occRows}
        delay={0.1}
      />

      <SectionCard
        title={t('Economic & Community', 'பொருளாதார & சமூகம்')}
        icon={ShieldCheck}
        rows={econRows}
        delay={0.15}
      />

      <SectionCard
        title={t('Additional Details', 'கூடுதல் விவரங்கள்')}
        icon={Home}
        rows={addlRows}
        delay={0.2}
      />

    </div>
  );
};

export default ProfilePage;
