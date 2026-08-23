import React from 'react';

const STATUS_LABEL = {
  ELIGIBLE: 'ELIGIBLE',
  NEEDS_MORE_INFO: 'NEEDS MORE INFORMATION',
  NOT_ELIGIBLE: 'NOT ELIGIBLE',
};

const SchemePrintView = ({ scheme, eligibility_status, matched_criteria, missing_information, failed_criteria, relevance_score }) => {
  if (!scheme) return null;

  return (
    <div className="scheme-print-content">
      {/* Header */}
      <div className="print-header">
        <span className="print-logo">SchemEase</span>
        <span className="print-tagline">Government Schemes, Made Easier to Find</span>
      </div>

      <hr className="print-divider" />

      {/* Scheme identity */}
      <h1 className="print-scheme-name">{scheme.name}</h1>
      <p className="print-meta">{scheme.department} &nbsp;·&nbsp; {scheme.category}</p>
      <p className="print-description">{scheme.description}</p>

      {/* Eligibility result */}
      {eligibility_status && (
        <div className={`print-eligibility print-eligibility--${eligibility_status.toLowerCase()}`}>
          <strong>Your Eligibility: {STATUS_LABEL[eligibility_status] || eligibility_status}</strong>
          {relevance_score != null && <span> ({relevance_score}% match)</span>}

          {matched_criteria?.length > 0 && (
            <div className="print-criteria-block">
              <strong>Why you qualify:</strong>
              <ul>{matched_criteria.map(c => <li key={c}>✓ {c}</li>)}</ul>
            </div>
          )}

          {missing_information?.length > 0 && (
            <div className="print-criteria-block">
              <strong>Missing information:</strong>
              <ul>{missing_information.map(c => <li key={c}>? {c}</li>)}</ul>
            </div>
          )}

          {failed_criteria?.length > 0 && (
            <div className="print-criteria-block">
              <strong>Does not meet:</strong>
              <ul>{failed_criteria.map(c => <li key={c}>✕ {c}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {/* Benefits */}
      <h2 className="print-section-heading">Benefits</h2>
      <ul className="print-list">
        {scheme.benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      {/* Documents */}
      <h2 className="print-section-heading">Required Documents</h2>
      <ul className="print-list">
        {scheme.documents.map((d, i) => <li key={i}>{d}</li>)}
      </ul>

      {/* How to apply */}
      <h2 className="print-section-heading">How to Apply</h2>
      <p className="print-body">{scheme.applicationMethod}</p>

      {/* Official URL */}
      <p className="print-url">Official Website: <span>{scheme.officialUrl}</span></p>

      <hr className="print-divider" />

      {/* Footer */}
      <p className="print-footer">Generated using SchemEase</p>
    </div>
  );
};

export default SchemePrintView;
