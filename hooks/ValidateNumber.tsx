// File: hooks/usePhoneVerification.ts
"use client"
import { useState } from 'react';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  hasPhone: boolean;
}

export const usePhoneVerification = () => {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneLoading, setPhoneLoading] = useState(false);

  /**
   * Fetch user details to check if phone number is registered
   */
  const fetchUserDetails = async (): Promise<UserDetails | null> => {
    try {
      const res = await fetch('/api/get-number');
      const data = await res.json();

      if (!data.success) {
        console.error('Failed to fetch user details:', data.message);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  /**
   * Save phone number to user profile
   */
  const savePhoneNumber = async (phone: string): Promise<boolean> => {
    // Frontend validation
    if (!phone || !/^\d{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }

    setPhoneLoading(true);
    setPhoneError(null);

    try {
      const res = await fetch('/api/save-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!data.success) {
        setPhoneError(data.message || 'Failed to save phone number');
        return false;
      }

      return true;
    } catch (error) {
      setPhoneError('Error saving phone number. Please try again.');
      console.error('Error:', error);
      return false;
    } finally {
      setPhoneLoading(false);
    }
  };

  return {
    fetchUserDetails,
    savePhoneNumber,
    phoneError,
    setPhoneError,
    phoneLoading,
  };
};