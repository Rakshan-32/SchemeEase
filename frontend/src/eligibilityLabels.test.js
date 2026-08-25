import { describe, it, expect } from 'vitest';
import { getEligibilityLabel, getEligibilityQuestion, hasEligibilityLabel, ELIGIBILITY_LABELS } from './eligibilityLabels';

describe('eligibilityLabels', () => {
  describe('getEligibilityLabel', () => {
    it('should return English label for known criterion', () => {
      const label = getEligibilityLabel('farmer', 'en');
      expect(label).toBe('Farmer / Agriculture profile');
    });

    it('should return Tamil label for known criterion', () => {
      const label = getEligibilityLabel('farmer', 'ta');
      expect(label).toBe('விவசாயி / வேளாண்மை சுயவிவரம்');
    });

    it('should return fallback for unknown criterion', () => {
      const label = getEligibilityLabel('unknownCriterion', 'en');
      expect(label).toMatch(/Unknown Criterion/);
    });

    it('should default to English if language not specified', () => {
      const label = getEligibilityLabel('age');
      expect(label).toBe('Age meets scheme requirements');
    });
  });

  describe('getEligibilityQuestion', () => {
    it('should return English question for known criterion', () => {
      const question = getEligibilityQuestion('landholding', 'en');
      expect(question).toBe('Do you own or cultivate agricultural land?');
    });

    it('should return Tamil question for known criterion', () => {
      const question = getEligibilityQuestion('landholding', 'ta');
      expect(question).toBe('உங்களிடம் விவசாய நிலம் உள்ளதா?');
    });

    it('should return fallback for unknown criterion', () => {
      const question = getEligibilityQuestion('unknownField', 'en');
      expect(question).toBeTruthy();
    });
  });

  describe('hasEligibilityLabel', () => {
    it('should return true for known criterion', () => {
      expect(hasEligibilityLabel('farmer')).toBe(true);
      expect(hasEligibilityLabel('age')).toBe(true);
    });

    it('should return false for unknown criterion', () => {
      expect(hasEligibilityLabel('unknownCriterion')).toBe(false);
    });
  });

  describe('ELIGIBILITY_LABELS coverage', () => {
    it('should have both en and ta labels for all criteria', () => {
      Object.entries(ELIGIBILITY_LABELS).forEach(([key, labels]) => {
        expect(labels.en).toBeDefined();
        expect(labels.ta).toBeDefined();
        expect(labels.en).not.toBe('');
        expect(labels.ta).not.toBe('');
      });
    });

    it('should have question forms for all criteria', () => {
      Object.entries(ELIGIBILITY_LABELS).forEach(([key, labels]) => {
        expect(labels.questionEn).toBeDefined();
        expect(labels.questionTa).toBeDefined();
      });
    });
  });
});
