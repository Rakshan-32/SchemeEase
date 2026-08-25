import { describe, it, expect } from 'vitest';
import { calculateProfileCompletion } from './profileCompletion';

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
