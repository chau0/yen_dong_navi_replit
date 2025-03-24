// API functions for fetching data from the backend

import { SuggestionType } from "./utils";

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

// Fetch the current exchange rate
export async function fetchCurrentRate(): Promise<CurrentRateInfo> {
  const response = await fetch('/api/rate/current');
  return response.json();
}

// Fetch the exchange rate history
export async function fetchRateHistory(): Promise<RateHistoryEntry[]> {
  const response = await fetch('/api/rate/history');
  return response.json();
}

// Fetch the exchange rate forecast
export async function fetchRateForecast(): Promise<ForecastEntry[]> {
  const response = await fetch('/api/forecast');
  return response.json();
}

// Fetch the exchange rate suggestion
export async function fetchSuggestion(): Promise<SuggestionResponse> {
  const response = await fetch('/api/suggestion');
  return response.json();
}

// Fetch the poll data
export async function fetchPollData(): Promise<PollData> {
  const response = await fetch('/api/poll');
  return response.json();
}

// Submit a vote to the poll
export async function submitVote(vote: SuggestionType): Promise<PollData> {
  const response = await fetch('/api/poll/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vote }),
  });
  return response.json();
}

// Set an alert for the exchange rate
export async function setAlert(alert: AlertSettings): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/alert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(alert),
  });
  return response.json();
}
