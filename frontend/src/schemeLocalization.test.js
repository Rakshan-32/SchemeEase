// Automated tests for Tamil localization system
import { describe, it, expect } from 'vitest';
import {
  getLocalizedScheme,
  getLocalizedDepartment,
  getLocalizedDocument,
  getLocalizedDocuments,
  MINISTRY_TRANSLATIONS,
  DOCUMENT_TRANSLATIONS,
  getTamilCoverage,
} from './schemeLocalization';

describe('Scheme Localization System', () => {
  const mockScheme = {
    id: 'test-scheme',
    name: 'Test Scheme',
    name_ta: 'சோதனை திட்டம்',
    department: 'Ministry of Agriculture and Farmers Welfare',
    description: 'Test description in English',
    description_ta: 'ஆங்கிலத்தில் சோதனை விவரம்',
    benefits: ['Benefit 1', 'Benefit 2'],
    benefits_ta: ['நன்மை 1', 'நன்மை 2'],
    documents: ['Aadhaar Card', 'Bank Account Details'],
    applicationMethod: 'Apply online',
    applicationMethod_ta: 'ஆன்லைனில் விண்ணப்பிக்கவும்',
  };

  describe('getLocalizedScheme', () => {
    it('returns English scheme when language is en', () => {
      const result = getLocalizedScheme(mockScheme, 'en');
      expect(result.name).toBe('Test Scheme');
      expect(result.description).toBe('Test description in English');
    });

    it('returns Tamil scheme when language is ta', () => {
      const result = getLocalizedScheme(mockScheme, 'ta');
      expect(result.name).toBe('சோதனை திட்டம்');
      expect(result.description).toBe('ஆங்கிலத்தில் சோதனை விவரம்');
    });

    it('falls back to English when Tamil fields are missing', () => {
      const schemeWithoutTamil = {
        ...mockScheme,
        name_ta: undefined,
        description_ta: undefined,
      };
      const result = getLocalizedScheme(schemeWithoutTamil, 'ta');
      expect(result.name).toBe('Test Scheme');
      expect(result.description).toBe('Test description in English');
    });

    it('returns null for null scheme', () => {
      expect(getLocalizedScheme(null, 'ta')).toBeNull();
    });

    it('localizes department using ministry mapping', () => {
      const result = getLocalizedScheme(mockScheme, 'ta');
      expect(result.department).toBe('வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்');
    });

    it('localizes documents using document mapping', () => {
      const result = getLocalizedScheme(mockScheme, 'ta');
      expect(result.documents[0]).toBe('ஆதார் அட்டை');
      expect(result.documents[1]).toBe('வங்கி கணக்கு விவரங்கள்');
    });
  });

  describe('getLocalizedDepartment', () => {
    it('returns English department when language is en', () => {
      const dept = 'Ministry of Agriculture and Farmers Welfare';
      expect(getLocalizedDepartment(dept, 'en')).toBe(dept);
    });

    it('returns Tamil department when language is ta', () => {
      const dept = 'Ministry of Agriculture and Farmers Welfare';
      const result = getLocalizedDepartment(dept, 'ta');
      expect(result).toBe('வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்');
    });

    it('falls back to English for unmapped department', () => {
      const dept = 'Unknown Ministry';
      const result = getLocalizedDepartment(dept, 'ta');
      expect(result).toBe(dept);
    });

    it('handles null/undefined gracefully', () => {
      expect(getLocalizedDepartment(null, 'ta')).toBeNull();
      expect(getLocalizedDepartment(undefined, 'ta')).toBeUndefined();
    });
  });

  describe('getLocalizedDocument', () => {
    it('returns English document when language is en', () => {
      const doc = 'Aadhaar Card';
      expect(getLocalizedDocument(doc, 'en')).toBe(doc);
    });

    it('returns Tamil document when language is ta', () => {
      const doc = 'Aadhaar Card';
      expect(getLocalizedDocument(doc, 'ta')).toBe('ஆதார் அட்டை');
    });

    it('falls back to English for unmapped document', () => {
      const doc = 'Unknown Document';
      const result = getLocalizedDocument(doc, 'ta');
      expect(result).toBe(doc);
    });

    it('handles null/undefined gracefully', () => {
      expect(getLocalizedDocument(null, 'ta')).toBeNull();
      expect(getLocalizedDocument(undefined, 'ta')).toBeUndefined();
    });
  });

  describe('getLocalizedDocuments', () => {
    it('returns original array when language is en', () => {
      const docs = ['Aadhaar Card', 'Bank Account Details'];
      expect(getLocalizedDocuments(docs, 'en')).toEqual(docs);
    });

    it('returns localized array when language is ta', () => {
      const docs = ['Aadhaar Card', 'Bank Account Details'];
      const result = getLocalizedDocuments(docs, 'ta');
      expect(result[0]).toBe('ஆதார் அட்டை');
      expect(result[1]).toBe('வங்கி கணக்கு விவரங்கள்');
    });

    it('returns original array for non-array input', () => {
      expect(getLocalizedDocuments(null, 'ta')).toBeNull();
      expect(getLocalizedDocuments('not an array', 'en')).toBe('not an array');
    });
  });

  describe('Tamil Coverage', () => {
    it('calculates correct coverage percentage', () => {
      const coverage = getTamilCoverage(mockScheme);
      expect(coverage.total).toBe(4);
      expect(coverage.covered).toBe(4);
      expect(coverage.percentage).toBe(100);
      expect(coverage.missing).toEqual([]);
    });

    it('identifies missing Tamil fields', () => {
      const incompleteScheme = {
        ...mockScheme,
        description_ta: undefined,
        benefits_ta: undefined,
      };
      const coverage = getTamilCoverage(incompleteScheme);
      expect(coverage.covered).toBe(2);
      expect(coverage.percentage).toBe(50);
      expect(coverage.missing).toContain('description');
      expect(coverage.missing).toContain('benefits');
    });
  });

  describe('Ministry Translation Coverage', () => {
    it('has translations for common ministries', () => {
      const ministries = [
        'Ministry of Agriculture and Farmers Welfare',
        'Ministry of Rural Development',
        'National Health Authority',
        'Ministry of Education',
        'Ministry of Social Justice and Empowerment',
      ];

      ministries.forEach((ministry) => {
        expect(MINISTRY_TRANSLATIONS[ministry]).toBeDefined();
        expect(MINISTRY_TRANSLATIONS[ministry].ta).toBeTruthy();
      });
    });
  });

  describe('Document Translation Coverage', () => {
    it('has translations for common documents', () => {
      const documents = [
        'Aadhaar Card',
        'Bank Account Details',
        'Ration Card',
        'Income Certificate',
        'Passport Photograph',
        'Birth Certificate',
        'PAN Card',
        'Voter ID',
      ];

      documents.forEach((doc) => {
        expect(DOCUMENT_TRANSLATIONS[doc]).toBeDefined();
        expect(DOCUMENT_TRANSLATIONS[doc].ta).toBeTruthy();
      });
    });
  });

  describe('Value Integrity', () => {
    it('preserves monetary values in localization', () => {
      const schemeWithMoney = {
        ...mockScheme,
        benefits: ['₹6,000 per year', 'Payable in ₹2,000 installments'],
        benefits_ta: ['ஆண்டுக்கு ₹6,000', '₹2,000 தவணைகளில் செலுத்தப்படும்'],
      };

      const result = getLocalizedScheme(schemeWithMoney, 'ta');
      // Check that monetary values are present in Tamil
      expect(result.benefits[0]).toContain('₹6,000');
      expect(result.benefits[1]).toContain('₹2,000');
    });

    it('does not modify original scheme object', () => {
      const original = { ...mockScheme };
      getLocalizedScheme(mockScheme, 'ta');
      expect(mockScheme).toEqual(original);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings gracefully', () => {
      const emptyScheme = {
        id: 'empty',
        name: '',
        department: '',
        description: '',
        benefits: [],
        documents: [],
        applicationMethod: '',
      };
      const result = getLocalizedScheme(emptyScheme, 'ta');
      expect(result).toBeDefined();
      expect(result.name).toBe('');
      expect(result.benefits).toEqual([]);
    });

    it('handles special characters in scheme content', () => {
      const specialScheme = {
        ...mockScheme,
        description: 'Benefits: ₹10,000-₹50,000 (50% subsidy)',
        description_ta: 'நன்மைகள்: ₹10,000-₹50,000 (50% மானியம்)',
      };
      const result = getLocalizedScheme(specialScheme, 'ta');
      expect(result.description).toContain('₹');
      expect(result.description).toContain('%');
    });
  });
});
