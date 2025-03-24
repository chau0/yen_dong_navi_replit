import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAlertSchema, insertPollSchema, SuggestionType } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Current exchange rate
  app.get("/api/rate/current", async (req: Request, res: Response) => {
    try {
      const rate = await storage.getCurrentRate();
      res.json({ rate, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ message: "Error fetching current exchange rate" });
    }
  });

  // Historical exchange rates
  app.get("/api/rate/history", async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const history = await storage.getRateHistory(days);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Error fetching historical exchange rates" });
    }
  });

  // Forecast exchange rates
  app.get("/api/forecast", async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const forecast = await storage.getForecast(days);
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exchange rate forecast" });
    }
  });

  // Exchange rate recommendation
  app.get("/api/suggestion", async (req: Request, res: Response) => {
    try {
      const suggestion = await storage.getSuggestion();
      res.json({ suggestion });
    } catch (error) {
      res.status(500).json({ message: "Error getting exchange rate suggestion" });
    }
  });

  // Set alert
  app.post("/api/alert", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating alert" });
      }
    }
  });

  // Get all alerts
  app.get("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching alerts" });
    }
  });

  // Submit poll vote
  app.post("/api/poll", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPollSchema.parse(req.body);
      const poll = await storage.createPoll(validatedData);
      res.status(201).json(poll);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid poll data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating poll" });
      }
    }
  });

  // Get poll summary
  app.get("/api/poll/summary", async (req: Request, res: Response) => {
    try {
      const summary = await storage.getPollSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Error fetching poll summary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
