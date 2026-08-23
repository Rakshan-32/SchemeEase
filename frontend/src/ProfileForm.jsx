import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { SECTIONS, SECTION_BY_STEP } from './profileSchema';

const HINT_COLORS = {
  teal: {
    wrap: 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700',
    icon: 'text-teal-600 dark:text-teal-400',
    text: 'text-teal-800 dark:text-teal-200',
  },
  pink: {
    wrap: 'bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700',
    icon: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-800 dark:text-pink-200',
  },
};

const inputBase =
  'w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all';

// ── primitive renderers ──────────────────────────────────────────────────────

function HintBanner({ color = 'teal', text }) {
  const c = HINT_COLORS[color];
  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg ${c.wrap}`}>
      <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
      <span className={`text-xs ${c.text}`}>{text}</span>
    </div>
  );
}

function NumberField({ field, value, error, onChange, t }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {t(field.labelEn, field.labelTa)}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value ?? ''}
        min={field.min}
        max={field.max}
        placeholder={t(field.placeholderEn, field.placeholderTa)}
        onChange={(e) => onChange(field.key, parseInt(e.target.value) || 0, field)}
        className={`${inputBase} ${error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ field, value, onChange, t }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {t(field.labelEn, field.labelTa)}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(field.key, e.target.value, field)}
        className={`${inputBase} border-slate-300 dark:border-slate-600`}
      >
        <option value="">{t('Select...', 'தேர்ந்தெடுக்கவும்...')}</option>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelEn, o.labelTa)}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ field, value, onChange, t }) {
  const isLg = field.size === 'lg';
  const padding = isLg ? 'p-4' : 'p-3';
  const checkSize = isLg ? 'w-5 h-5' : 'w-4 h-4';
  const labelSize = isLg ? 'font-medium' : 'text-sm font-medium';

  return (
    <label
      className={`flex items-center gap-3 ${padding} border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}
    >
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(field.key, e.target.checked, field)}
        className={`${checkSize} text-primary rounded focus:ring-primary`}
      />
      <span className={`${labelSize} text-slate-700 dark:text-slate-200`}>
        {t(field.labelEn, field.labelTa)}
      </span>
    </label>
  );
}

// ── section renderers ────────────────────────────────────────────────────────

function BasicSection({ section, profile, errors, onChange, t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {section.fields.map((field) => {
        if (field.type === 'number') {
          return (
            <NumberField
              key={field.key}
              field={field}
              value={profile[field.key]}
              error={errors[field.key]}
              onChange={onChange}
              t={t}
            />
          );
        }
        return (
          <SelectField
            key={field.key}
            field={field}
            value={profile[field.key]}
            onChange={onChange}
            t={t}
          />
        );
      })}
    </div>
  );
}

function OccupationSection({ section, profile, errors, onChange, t }) {
  // Collect indented children keyed by their parent field key
  const childrenOf = {};
  section.fields.forEach((field) => {
    if (field.indent && field.showWhen) {
      // Find the parent: the most recent non-indent checkbox before this field
      const idx = section.fields.indexOf(field);
      for (let i = idx - 1; i >= 0; i--) {
        const candidate = section.fields[i];
        if (!candidate.indent && candidate.type === 'checkbox') {
          (childrenOf[candidate.key] = childrenOf[candidate.key] || []).push(field);
          break;
        }
      }
    }
  });

  const renderedAsChild = new Set(
    Object.values(childrenOf).flat().map((f) => f.key)
  );

  return (
    <div className="space-y-4">
      {section.fields
        .filter((f) => !renderedAsChild.has(f.key))
        .map((field) => {
          if (field.type === 'select') {
            return (
              <SelectField
                key={field.key}
                field={field}
                value={profile[field.key]}
                onChange={onChange}
                t={t}
              />
            );
          }

          const children = childrenOf[field.key] || [];

          return (
            <React.Fragment key={field.key}>
              <CheckboxField
                field={field}
                value={profile[field.key]}
                onChange={onChange}
                t={t}
              />
              {children.length > 0 && (
                <AnimatePresence>
                  {field.showWhen
                    ? field.showWhen(profile) && profile[field.key]
                      ? renderChildBlock(children, field, profile, onChange, t)
                      : null
                    : !!profile[field.key]
                      ? renderChildBlock(children, field, profile, onChange, t)
                      : null}
                </AnimatePresence>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

function renderChildBlock(children, parentField, profile, onChange, t) {
  return (
    <motion.div
      key={`${parentField.key}-children`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="ml-8 space-y-3 overflow-hidden"
    >
      {parentField.groupHintEn && (
        <HintBanner
          color={parentField.groupHintColor || 'teal'}
          text={t(parentField.groupHintEn, parentField.groupHintTa)}
        />
      )}
      {children.map((child) => (
        <CheckboxField
          key={child.key}
          field={child}
          value={profile[child.key]}
          onChange={onChange}
          t={t}
        />
      ))}
    </motion.div>
  );
}

function AdditionalSection({ section, profile, errors, onChange, t }) {
  return (
    <div className="space-y-6">
      {section.groups.map((group) => {
        const groupVisible = group.showWhen ? group.showWhen(profile) : true;

        return (
          <AnimatePresence key={group.key}>
            {groupVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {group.titleEn && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-3">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t(group.titleEn, group.titleTa)}
                    </h4>
                  </div>
                )}
                {group.hintEn && (
                  <div className="mb-3">
                    <HintBanner color={group.hintColor || 'teal'} text={t(group.hintEn, group.hintTa)} />
                  </div>
                )}
                <div className="space-y-3">
                  {group.fields.map((field) => {
                    const fieldVisible = field.showWhen ? field.showWhen(profile) : true;

                    return (
                      <AnimatePresence key={field.key}>
                        {fieldVisible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`overflow-hidden${field.indent ? ' ml-8' : ''}`}
                          >
                            <CheckboxField
                              field={field}
                              value={profile[field.key]}
                              onChange={onChange}
                              t={t}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────

const ProfileForm = ({ section, profile, onChange, language, onValidChange }) => {
  const [errors, setErrors] = useState({});
  const t = (en, ta) => (language === 'en' ? en : ta);

  const sectionsToRender = section
    ? [SECTION_BY_STEP[section]].filter(Boolean)
    : SECTIONS;

  const handleChange = (key, value, fieldDef) => {
    onChange(key, value);

    const fn = language === 'en' ? fieldDef?.validationEn : fieldDef?.validationTa;
    const error = fn ? fn(value) : null;

    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  };

  // Tell parent whether this section is valid (required fields filled, no errors)
  useEffect(() => {
    if (!onValidChange) return;

    const visibleFields = sectionsToRender.flatMap((s) =>
      s.fields ? s.fields : s.groups.flatMap((g) => g.fields)
    );
    const requiredFields = visibleFields.filter((f) => f.required);
    const allFilled = requiredFields.every((f) => !!profile[f.key]);
    const noErrors = !Object.keys(errors).some((k) => visibleFields.some((f) => f.key === k));

    onValidChange(allFilled && noErrors);
  }, [errors, profile, section]);

  return (
    <div className="space-y-8">
      {sectionsToRender.map((sec) => (
        <div key={sec.key}>
          {/* Show section title only in "all" mode (ProfileEditor) */}
          {!section && (
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              {t(sec.titleEn, sec.titleTa)}
            </h3>
          )}

          {sec.key === 'basic' && (
            <BasicSection section={sec} profile={profile} errors={errors} onChange={handleChange} t={t} />
          )}
          {sec.key === 'occupation' && (
            <OccupationSection section={sec} profile={profile} errors={errors} onChange={handleChange} t={t} />
          )}
          {sec.key === 'additional' && (
            <AdditionalSection section={sec} profile={profile} errors={errors} onChange={handleChange} t={t} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProfileForm;
