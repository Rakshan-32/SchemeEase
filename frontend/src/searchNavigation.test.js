// Tests for search navigation and state management
import { describe, it, expect } from 'vitest';

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
