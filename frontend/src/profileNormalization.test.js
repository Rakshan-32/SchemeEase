import { describe, it, expect } from 'vitest';
import { normalizeProfile } from './profileNormalization';

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
