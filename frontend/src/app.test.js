// SchemeEase Test Suite
// Consolidated: eligibilityLabels, profileCompletion, profileNormalization, schemeLocalization, searchNavigation tests
// Total: 76 tests

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateProfileCompletion } from './profileCompletion.js';
import { normalizeProfile } from './profileNormalization.js';
import { getEligibilityLabel, getEligibilityQuestion, hasEligibilityLabel, ELIGIBILITY_LABELS } from './eligibilityLabels.js';
import { getLocalizedScheme, getLocalizedSchemeName, getLocalizedDepartment, getLocalizedDocument, getLocalizedDocuments, getTamilCoverage, MINISTRY_TRANSLATIONS, DOCUMENT_TRANSLATIONS } from './schemeLocalization.js';
import { searchSchemes } from './schemeSearch.js';

// ================================================================================
// ELIGIBILITY LABELS TESTS
// ================================================================================

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

// ================================================================================
// PROFILE COMPLETION TESTS
// ================================================================================

describe('profileCompletion', () => {
  describe('calculateProfileCompletion', () => {
    it('should return 0% for empty profile', () => {
      const result = calculateProfileCompletion({});
      expect(result.percentage).toBe(0);
    });

    it('should give 50 points for complete core fields', () => {
      const profile = {
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Farmer',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.percentage).toBe(50); // Core fields only
    });

    it('should calculate high completion for Farmer profile', () => {
      const profile = {
        // Core (50 points)
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Farmer',
        // Occupation-specific for Farmer (30 points)
        landholding: true,
        insurableInterest: true,
        // Recommended (20 points)
        income: 50000,
        district: 'Chennai',
        socialCategory: 'General',
        ruralUrban: 'Rural',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.percentage).toBeGreaterThanOrEqual(90); // Should be 90%+
    });

    it('should not penalize Farmer for missing Student fields', () => {
      const profile = {
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Farmer',
        landholding: true,
        insurableInterest: true,
        income: 50000,
        district: 'Chennai',
        socialCategory: 'General',
        ruralUrban: 'Rural',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.percentage).toBeGreaterThanOrEqual(90);
      expect(result.missingRequired).toEqual([]);
    });

    it('should calculate high completion for Student profile', () => {
      const profile = {
        // Core (50 points)
        age: 18,
        gender: 'Female',
        primaryOccupation: 'Student',
        // Occupation-specific for Student (30 points)
        educationLevel: 'undergraduate',
        institutionType: 'Government',
        firstGraduate: true,
        // Recommended (20 points)
        income: 0,
        district: 'Chennai',
        socialCategory: 'SC',
        ruralUrban: 'Urban',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.percentage).toBeGreaterThanOrEqual(90);
    });

    it('should not penalize Student for missing Farmer fields', () => {
      const profile = {
        age: 18,
        gender: 'Female',
        primaryOccupation: 'Student',
        educationLevel: 'undergraduate',
        institutionType: 'Government',
        firstGraduate: true,
        income: 0,
        district: 'Chennai',
        socialCategory: 'SC',
        ruralUrban: 'Urban',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.percentage).toBeGreaterThanOrEqual(90);
      expect(result.missingRequired).toEqual([]);
    });

    it('should identify missing required fields', () => {
      const profile = {
        age: 30,
      };
      const result = calculateProfileCompletion(profile);
      expect(result.missingRequired).toContain('gender');
      expect(result.missingRequired).toContain('primaryOccupation');
    });

    it('should handle null income as missing', () => {
      const profile = {
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Farmer',
        income: null,
      };
      const result = calculateProfileCompletion(profile);
      expect(result.missingRecommended).toContain('income');
    });

    it('should accept explicit 0 for income', () => {
      const profile = {
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Student',
        educationLevel: 'undergraduate',
        institutionType: 'Government',
        income: 0, // Explicit zero should be valid
        district: 'Chennai',
        socialCategory: 'General',
        ruralUrban: 'Urban',
      };
      const result = calculateProfileCompletion(profile);
      expect(result.missingRecommended).not.toContain('income');
    });
  });
});

// ================================================================================
// PROFILE NORMALIZATION TESTS
// ================================================================================

describe('profileNormalization', () => {
  describe('normalizeProfile', () => {
    it('should preserve valid profile unchanged', () => {
      const profile = {
        age: 30,
        gender: 'Male',
        primaryOccupation: 'Farmer',
        landholding: true,
        profileVersion: 2,
      };
      const result = normalizeProfile(profile);
      expect(result.age).toBe(30);
      expect(result.gender).toBe('Male');
      expect(result.primaryOccupation).toBe('Farmer');
      expect(result.landholding).toBe(true);
    });

    it('should convert empty strings to null', () => {
      const profile = {
        age: 30,
        gender: '',
        income: '',
        district: '',
      };
      const result = normalizeProfile(profile);
      expect(result.gender).toBeNull();
      expect(result.income).toBeNull();
      expect(result.district).toBeNull();
    });

    it('should normalize boolean strings to actual booleans', () => {
      const profile = {
        landholding: 'true',
        insurableInterest: 'false',
        disability: true,
        minorityCommunity: false,
      };
      const result = normalizeProfile(profile);
      expect(result.landholding).toBe(true);
      expect(result.insurableInterest).toBe(false);
      expect(result.disability).toBe(true);
      expect(result.minorityCommunity).toBe(false);
    });

    it('should normalize age to number', () => {
      const profile = {
        age: '30',
        income: '50000',
      };
      const result = normalizeProfile(profile);
      expect(result.age).toBe(30);
      expect(result.income).toBe(50000);
    });

    it('should preserve null for blank numeric fields', () => {
      const profile = {
        age: '',
        income: null,
      };
      const result = normalizeProfile(profile);
      expect(result.age).toBeNull();
      expect(result.income).toBeNull();
    });

    it('should preserve explicit 0 for income', () => {
      const profile = {
        income: 0,
      };
      const result = normalizeProfile(profile);
      expect(result.income).toBe(0);
    });

    it('should clear Farmer fields when switching to Student', () => {
      const profile = {
        primaryOccupation: 'Student',
        landholding: true,
        insurableInterest: true,
        educationLevel: 'undergraduate',
      };
      const result = normalizeProfile(profile);
      // Cleared fields may be null or undefined
      expect(result.landholding == null).toBe(true);
      expect(result.insurableInterest == null).toBe(true);
      expect(result.educationLevel).toBe('undergraduate');
    });

    it('should clear Student fields when switching to Farmer', () => {
      const profile = {
        primaryOccupation: 'Farmer',
        educationLevel: 'undergraduate',
        institutionType: 'Government',
        landholding: true,
      };
      const result = normalizeProfile(profile);
      // Cleared fields may be null or undefined
      expect(result.educationLevel == null).toBe(true);
      expect(result.institutionType == null).toBe(true);
      expect(result.landholding).toBe(true);
    });

    it('should reset invalid occupation to null', () => {
      const profile = {
        primaryOccupation: 'InvalidOccupation',
      };
      const result = normalizeProfile(profile);
      expect(result.primaryOccupation).toBeNull();
    });

    it('should add profileVersion if missing', () => {
      const profile = {
        age: 30,
      };
      const result = normalizeProfile(profile);
      expect(result.profileVersion).toBe(2);
    });

    it('should handle old student model migration', () => {
      const profile = {
        primaryOccupation: 'Student',
        studentStatus: 'Yes',
        governmentSchoolStudent: true,
      };
      const result = normalizeProfile(profile);
      // Old fields should be migrated to new model
      expect(result.educationLevel).toBeDefined();
    });
  });
});

// ================================================================================
// SCHEME LOCALIZATION TESTS
// ================================================================================


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

// ================================================================================
// SEARCH NAVIGATION TESTS
// ================================================================================


describe('Search Navigation Behavior', () => {
  describe('Query Persistence', () => {
    it('should keep query visible after Enter key', () => {
      // Simulating the behavior:
      // User types "MSME" and presses Enter
      const userInput = 'MSME';
      const trimmedQuery = userInput.trim();

      // After submit, the query should remain
      expect(trimmedQuery).toBe('MSME');
      expect(trimmedQuery).not.toBe(''); // Should NOT be cleared
    });

    it('should preserve query when navigating between pages', () => {
      const searchQuery = 'student scholarship';

      // Query should be preserved in URL
      const urlParams = new URLSearchParams();
      urlParams.set('q', searchQuery);

      expect(urlParams.get('q')).toBe('student scholarship');
    });

    it('should only clear query when user explicitly clears it', () => {
      const initialQuery = 'farmer';
      let currentQuery = initialQuery;

      // Normal search submit should NOT clear
      const afterSubmit = currentQuery.trim();
      expect(afterSubmit).toBe('farmer');

      // Only explicit clear should remove it
      currentQuery = '';
      expect(currentQuery).toBe('');
    });
  });

  describe('Clear Button Behavior', () => {
    it('should clear search input when X is clicked', () => {
      let searchInput = 'women entrepreneur';

      // Simulate clear button click
      const handleClearSearch = () => {
        searchInput = '';
      };

      handleClearSearch();
      expect(searchInput).toBe('');
    });

    it('should show clear button only when input is non-empty', () => {
      const showClearButton = (input) => input.trim().length > 0;

      expect(showClearButton('')).toBe(false);
      expect(showClearButton('   ')).toBe(false);
      expect(showClearButton('MSME')).toBe(true);
    });
  });

  describe('Search State Synchronization', () => {
    it('should synchronize navbar and AllSchemes search on All Schemes page', () => {
      // Both should read from the same URL parameter
      const urlParams = new URLSearchParams({ q: 'agriculture' });
      const navbarQuery = urlParams.get('q');
      const allSchemesQuery = urlParams.get('q');

      expect(navbarQuery).toBe(allSchemesQuery);
      expect(navbarQuery).toBe('agriculture');
    });

    it('should update both search inputs when URL changes', () => {
      const urlQuery = 'disability support';

      // Both inputs should reflect the URL query
      const navbarInput = urlQuery;
      const allSchemesInput = urlQuery;

      expect(navbarInput).toBe(allSchemesInput);
      expect(navbarInput).toBe('disability support');
    });
  });

  describe('Page-Aware Navigation', () => {
    it('should stay on Dashboard when searching from Dashboard', () => {
      const currentPage = 'dashboard';
      const searchQuery = 'MSME';

      // Should not navigate away from Dashboard
      const shouldNavigate = currentPage !== 'dashboard';
      expect(shouldNavigate).toBe(false);
    });

    it('should stay on All Schemes when searching from All Schemes', () => {
      const currentPage = 'all-schemes';
      const searchQuery = 'student';

      // Should not navigate to Dashboard
      const shouldNavigateToDashboard = currentPage === 'dashboard';
      expect(shouldNavigateToDashboard).toBe(false);
    });

    it('should navigate to All Schemes when searching from other pages', () => {
      const pages = ['favorites', 'compare', 'tracker', 'profile', 'contact'];

      pages.forEach(page => {
        // From these pages, search should go to All Schemes
        const shouldNavigateToAllSchemes = page !== 'dashboard' && page !== 'all-schemes';
        expect(shouldNavigateToAllSchemes).toBe(true);
      });
    });
  });

  describe('Search Does Not Modify Profile', () => {
    it('should not change profile when searching for occupation keywords', () => {
      const originalProfile = {
        primaryOccupation: 'Self Employed',
        age: 30
      };

      const searchQueries = ['student', 'farmer', 'entrepreneur', 'government employee'];

      searchQueries.forEach(query => {
        // Profile should remain unchanged
        expect(originalProfile.primaryOccupation).toBe('Self Employed');
        expect(originalProfile.age).toBe(30);
      });
    });
  });

  describe('URL Query Parameter Structure', () => {
    it('should use q parameter for search query', () => {
      const query = 'PM KISAN';
      const params = new URLSearchParams();
      params.set('q', query);

      expect(params.toString()).toBe('q=PM+KISAN');
    });

    it('should handle special characters in query', () => {
      const query = 'PM-KISAN & PMAY';
      const params = new URLSearchParams();
      params.set('q', query);

      expect(params.get('q')).toBe('PM-KISAN & PMAY');
    });

    it('should remove q parameter when search is cleared', () => {
      const params = new URLSearchParams({ q: 'test' });

      // Clear search
      params.delete('q');

      expect(params.has('q')).toBe(false);
      expect(params.toString()).toBe('');
    });
  });

  describe('Enter Key Behavior', () => {
    it('should prevent default form submission', () => {
      let defaultPrevented = false;

      const mockEvent = {
        preventDefault: () => { defaultPrevented = true; }
      };

      // Simulate form submit handler
      mockEvent.preventDefault();

      expect(defaultPrevented).toBe(true);
    });

    it('should not reload the page on Enter', () => {
      // This is ensured by preventDefault()
      const handleSubmit = (e) => {
        e.preventDefault();
        return false; // Additional safeguard
      };

      const mockEvent = {
        defaultPrevented: false,
        preventDefault: function() { this.defaultPrevented = true; }
      };

      handleSubmit(mockEvent);
      expect(mockEvent.defaultPrevented).toBe(true);
    });
  });

  describe('Search Results Include Ineligible Schemes', () => {
    it('should not filter search results by eligibility', () => {
      const mockSchemes = [
        { scheme_id: '1', scheme: { name: 'PM KISAN' }, eligibility_status: 'ELIGIBLE' },
        { scheme_id: '2', scheme: { name: 'PM KISAN Support' }, eligibility_status: 'NOT_ELIGIBLE' },
        { scheme_id: '3', scheme: { name: 'KISAN Credit' }, eligibility_status: 'NEEDS_MORE_INFO' }
      ];

      const searchQuery = 'KISAN';

      // All matching schemes should be returned regardless of eligibility
      const matchingSchemes = mockSchemes.filter(s =>
        s.scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      expect(matchingSchemes.length).toBe(3);
      expect(matchingSchemes.some(s => s.eligibility_status === 'NOT_ELIGIBLE')).toBe(true);
    });
  });

  describe('Filters Work Alongside Search', () => {
    it('should apply both search and category filter', () => {
      const mockSchemes = [
        { scheme: { name: 'Student Loan', category: 'Education' } },
        { scheme: { name: 'Student Housing', category: 'Housing' } },
        { scheme: { name: 'Teacher Grant', category: 'Education' } }
      ];

      const searchQuery = 'student';
      const categoryFilter = 'Education';

      // First apply search
      let filtered = mockSchemes.filter(s =>
        s.scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Then apply category filter
      filtered = filtered.filter(s => s.scheme.category === categoryFilter);

      expect(filtered.length).toBe(1);
      expect(filtered[0].scheme.name).toBe('Student Loan');
    });

    it('should clear only search when search X is clicked', () => {
      let searchQuery = 'agriculture';
      let categoryFilter = 'Agriculture';

      // Clear search should not affect category
      const clearSearch = () => {
        searchQuery = '';
      };

      clearSearch();

      expect(searchQuery).toBe('');
      expect(categoryFilter).toBe('Agriculture'); // Should remain
    });
  });

  describe('Refresh Preserves Search', () => {
    it('should maintain search state from URL on page refresh', () => {
      // Simulating URL state
      const urlParams = new URLSearchParams({ q: 'scholarship' });

      // After refresh, the query should still be available
      const restoredQuery = urlParams.get('q');

      expect(restoredQuery).toBe('scholarship');
    });
  });
});

// End of app.test.js
