import { 
  users, exchangeRates, alerts, polls, 
  type User, type InsertUser, 
  type ExchangeRate, type Alert, type InsertAlert,
  type Poll, type InsertPoll, type SuggestionType,
  type ForecastPoint, type RateHistory, type PollSummary
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exchange rate methods
  getCurrentRate(): Promise<number>;
  getRateHistory(days: number): Promise<RateHistory[]>;
  getForecast(days: number): Promise<ForecastPoint[]>;
  getSuggestion(): Promise<SuggestionType>;
  
  // Alert methods
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(): Promise<Alert[]>;
  
  // Poll methods
  createPoll(poll: InsertPoll): Promise<Poll>;
  getPollSummary(): Promise<PollSummary>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rates: Map<string, ExchangeRate>;
  private alertsList: Map<number, Alert>;
  private pollsList: Map<number, Poll>;
  currentUserId: number;
  currentRateId: number;
  currentAlertId: number;
  currentPollId: number;

  constructor() {
    this.users = new Map();
    this.rates = new Map();
    this.alertsList = new Map();
    this.pollsList = new Map();
    this.currentUserId = 1;
    this.currentRateId = 1;
    this.currentAlertId = 1;
    this.currentPollId = 1;
    
    // Initialize with 30 days of mock historical data
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate slightly varied rates (base: 172.3)
      const variation = Math.sin(i / 5) * 3 + Math.random() * 0.5;
      const rate = 172.3 + variation;
      
      this.rates.set(date.toISOString().split('T')[0], {
        id: this.currentRateId++,
        date: date,
        rate: rate,
        source: "mock-data"
      });
    }
    
    // Initialize with some mock poll data
    for (let i = 0; i < 1400; i++) {
      const rand = Math.random();
      let vote;
      if (rand < 0.68) vote = "yes";
      else if (rand < 0.9) vote = "neutral";
      else vote = "no";
      
      this.pollsList.set(this.currentPollId, {
        id: this.currentPollId++,
        vote: vote,
        created: new Date()
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getCurrentRate(): Promise<number> {
    // Get today's rate or the latest one
    const today = new Date().toISOString().split('T')[0];
    
    const latestRate = Array.from(this.rates.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
    return latestRate ? latestRate.rate : 172.3; // Default if no rates
  }
  
  async getRateHistory(days: number = 30): Promise<RateHistory[]> {
    // Get rates for the last 'days' number of days
    const sortedRates = Array.from(this.rates.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Take only the number of days requested, or all of them if not enough
    const limitedRates = sortedRates.slice(Math.max(0, sortedRates.length - days));
    
    return limitedRates.map(rate => ({
      date: rate.date.toISOString().split('T')[0],
      rate: rate.rate
    }));
  }
  
  async getForecast(days: number = 7): Promise<ForecastPoint[]> {
    const currentRate = await this.getCurrentRate();
    const forecast: ForecastPoint[] = [];
    
    // Generate forecast starting from tomorrow
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    // General upward trend with increasing confidence bands
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const rate = currentRate + (i * 0.5) + (Math.random() * 0.2);
      const confidenceRange = 0.5 + (i * 0.3);
      
      forecast.push({
        date: dateString,
        rate: rate,
        confidence: [rate - confidenceRange, rate + confidenceRange]
      });
    }
    
    return forecast;
  }
  
  async getSuggestion(): Promise<SuggestionType> {
    // Simple algorithm: If the rate is trending up over the last 7 days,
    // it's a good time to exchange JPY to VND
    const history = await this.getRateHistory(7);
    
    if (history.length < 2) return "neutral";
    
    const firstRate = history[0].rate;
    const lastRate = history[history.length - 1].rate;
    const percentChange = ((lastRate - firstRate) / firstRate) * 100;
    
    if (percentChange > 1) return "good";
    if (percentChange < -1) return "bad";
    return "neutral";
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const newAlert: Alert = {
      ...alert,
      id,
      created: new Date(),
      triggered: false
    };
    
    this.alertsList.set(id, newAlert);
    return newAlert;
  }
  
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alertsList.values());
  }
  
  async createPoll(poll: InsertPoll): Promise<Poll> {
    const id = this.currentPollId++;
    const newPoll: Poll = {
      ...poll,
      id,
      created: new Date()
    };
    
    this.pollsList.set(id, newPoll);
    return newPoll;
  }
  
  async getPollSummary(): Promise<PollSummary> {
    const polls = Array.from(this.pollsList.values());
    const total = polls.length;
    
    const yesPollCount = polls.filter(poll => poll.vote === "yes").length;
    const neutralPollCount = polls.filter(poll => poll.vote === "neutral").length;
    const noPollCount = polls.filter(poll => poll.vote === "no").length;
    
    return {
      yes: {
        count: yesPollCount,
        percentage: Math.round((yesPollCount / total) * 100) 
      },
      neutral: {
        count: neutralPollCount,
        percentage: Math.round((neutralPollCount / total) * 100)
      },
      no: {
        count: noPollCount,
        percentage: Math.round((noPollCount / total) * 100)
      },
      total
    };
  }
}

export const storage = new MemStorage();
