import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, updateHabitSchema, insertCompletionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all habits with stats
  app.get("/api/habits", async (req, res) => {
    try {
      const date = req.query.date as string;
      const habits = await storage.getHabitsWithStats(date);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  // Get specific habit
  app.get("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const habit = await storage.getHabit(id);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit" });
    }
  });

  // Create new habit
  app.post("/api/habits", async (req, res) => {
    try {
      const parsed = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(parsed);
      res.status(201).json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Update habit
  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = updateHabitSchema.parse(req.body);
      const habit = await storage.updateHabit(id, parsed);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Delete habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteHabit(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Toggle habit completion
  app.post("/api/habits/:id/toggle", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const { date } = req.body;
      
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
      
      const completion = await storage.toggleCompletion(habitId, date);
      res.json(completion);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle completion" });
    }
  });

  // Get completions
  app.get("/api/completions", async (req, res) => {
    try {
      const habitId = req.query.habitId ? parseInt(req.query.habitId as string) : undefined;
      const date = req.query.date as string;
      
      const completions = await storage.getCompletions(habitId, date);
      res.json(completions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
