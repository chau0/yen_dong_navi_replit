// API functions for fetching data from the backend

import { SuggestionType } from "./utils";

export const API_BASE_URL = 'http://localhost:8000';

// Rate history entry
export interface RateHistoryEntry {
  date: string;
  rate: number;
}

// Forecast entry with confidence values
export interface ForecastEntry {
  date: string;
  rate: number;
  confidence: [number, number]; // [lower, upper]
}

// Current rate information
export interface CurrentRateInfo {
  rate: number;
  timestamp: string;
}

// Suggestion response
export interface SuggestionResponse {
  suggestion: SuggestionType;
  reason: string;
}

// Poll option
export interface PollOption {
  value: SuggestionType;
  label: string;
  votes: number;
  percentage: number;
}

// Poll data
export interface PollData {
  totalVotes: number;
  options: PollOption[];
}

// Alert settings
export interface AlertSettings {
  type: 'above' | 'below';
  rate: number;
  email: string;
}

const fetchOptions: RequestInit = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Remove or set to 'same-origin' instead of 'include'
  credentials: 'omit'
};
// Fetch the current exchange rate
export async function fetchCurrentRate(): Promise<CurrentRateInfo> {
  const response = await fetch(`${API_BASE_URL}/api/rate/current`, fetchOptions);
  return response.json();
}

// Fetch the exchange rate history
export async function fetchRateHistory(): Promise<RateHistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/rate/history`, fetchOptions);
  return response.json();
}

// Fetch the exchange rate forecast
export async function fetchRateForecast(): Promise<ForecastEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/forecast`, fetchOptions);
  return response.json();
}

// Fetch the exchange rate suggestion
export async function fetchSuggestion(): Promise<SuggestionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/suggestion`, fetchOptions);
  return response.json();
}

// Fetch the poll data
export async function fetchPollData(): Promise<PollData> {
  const response = await fetch(`${API_BASE_URL}/api/poll/summary`, fetchOptions);
  return response.json();
}

// Submit a vote to the poll
export async function submitVote(vote: SuggestionType): Promise<PollData> {
  const response = await fetch(`${API_BASE_URL}/api/poll/vote`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify({ vote }),
  });
  return response.json();
}

// Set an alert for the exchange rate
export async function setAlert(alert: AlertSettings): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/alert`, {
    ...fetchOptions,
    method: 'POST',
    body: JSON.stringify(alert),
  });
  return response.json();
}
