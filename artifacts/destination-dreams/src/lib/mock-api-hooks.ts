import { useState, useCallback, useEffect } from 'react';

// Mock types
export enum RsvpAttendanceStatus {
  attending = "attending",
  not_sure = "not_sure",
  not_attending = "not_attending"
}

export interface ContactInfo {
  name: string;
  relation: string;
  phone: string;
  whatsappUrl?: string;
}

export interface EventInfo {
  day: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  dressCode: string;
  description?: string;
}

export interface BlessingInfo {
  id: number;
  guestName: string;
  message: string;
  createdAt: Date;
}

export interface AirportInfo {
  name: string;
  code: string;
  travelTime: string;
  transferInfo?: string;
}

export interface HotelInfo {
  name: string;
  type: 'primary' | 'secondary';
  description: string;
  checkIn: string;
  checkOut: string;
  groupCode?: string;
  bookingUrl?: string;
}

export interface LocalExperience {
  name: string;
  description: string;
  category: string;
  distanceFromHotel: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Mock hooks
export function useGetWeddingConfig() {
  return { data: null, isLoading: false }; // Not used since Home.tsx now uses mockConfig directly
}

export function useCreateRsvp() {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback((variables: { data: any }, options?: { onSuccess?: () => void, onError?: (error: any) => void }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      options?.onSuccess?.();
    }, 1000);
  }, []);
  return { mutate, isPending };
}


export function useGetRsvpStats() {
  return { data: { attending: 42, total: 50, notSure: 5, notAttending: 3, totalGuests: 85 }, isLoading: false };
}

// Persistent blessings mock store
let initialBlessings: BlessingInfo[] = [];
try {
  const stored = localStorage.getItem('wedding_blessings');
  if (stored) {
    initialBlessings = JSON.parse(stored).map((b: any) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
  }
} catch (e) {
  // Ignore error in non-browser envs
}

if (initialBlessings.length === 0) {
  initialBlessings = [
    { id: 1, guestName: "Sarah", message: "Congratulations to the beautiful couple!", createdAt: new Date() },
    { id: 2, guestName: "Michael", message: "Wishing you a lifetime of happiness.", createdAt: new Date() },
  ];
  try {
    localStorage.setItem('wedding_blessings', JSON.stringify(initialBlessings));
  } catch (e) {}
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function addBlessing(guestName: string, message: string) {
  const newBlessing: BlessingInfo = {
    id: Date.now(),
    guestName,
    message,
    createdAt: new Date(),
  };
  initialBlessings = [newBlessing, ...initialBlessings];
  try {
    localStorage.setItem('wedding_blessings', JSON.stringify(initialBlessings));
  } catch (e) {}
  notifyListeners();
}

export function useListBlessings() {
  const [, setTick] = useState(0);
  
  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  return { data: initialBlessings, refetch, isLoading: false };
}

export function useCreateBlessing(options: { mutation?: { onSuccess?: () => void } } = {}) {
  const [isPending, setIsPending] = useState(false);
  const mutate = useCallback((variables: { data: any }) => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      addBlessing(variables.data.guestName, variables.data.message);
      options.mutation?.onSuccess?.();
    }, 1000);
  }, [options.mutation]);
  return { mutate, isPending };
}

