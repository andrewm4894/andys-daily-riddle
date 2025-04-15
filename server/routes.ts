import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createDailyRiddle, getLatestRiddle, getRiddles, getRiddleCount } from "./services/riddleService";
import { startRiddleScheduler } from "./scheduler";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the scheduler to generate daily riddles
  startRiddleScheduler();

  // API Endpoints
  
  // Get the latest riddle
  app.get("/api/riddles/latest", async (req: Request, res: Response) => {
    try {
      const latestRiddle = await getLatestRiddle();
      
      if (!latestRiddle) {
        return res.status(404).json({ message: "No riddles found" });
      }
      
      return res.json(latestRiddle);
    } catch (error) {
      console.error("Error fetching latest riddle:", error);
      return res.status(500).json({ message: "Failed to fetch the latest riddle" });
    }
  });

  // Get paginated riddles
  app.get("/api/riddles", async (req: Request, res: Response) => {
    try {
      const limitSchema = z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().positive().default(10)
      );
      
      const offsetSchema = z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().nonnegative().default(0)
      );
      
      const limit = limitSchema.parse(req.query.limit);
      const offset = offsetSchema.parse(req.query.offset);
      
      const riddles = await getRiddles(limit, offset);
      const total = await getRiddleCount();
      
      return res.json({
        riddles,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + riddles.length < total
        }
      });
    } catch (error) {
      console.error("Error fetching riddles:", error);
      return res.status(500).json({ message: "Failed to fetch riddles" });
    }
  });

  // Manually generate a new riddle (for testing/admin purposes)
  app.post("/api/riddles/generate", async (req: Request, res: Response) => {
    try {
      const result = await createDailyRiddle();
      
      if (result.success) {
        const latestRiddle = await getLatestRiddle();
        return res.status(201).json(latestRiddle);
      } else {
        return res.status(500).json({ message: result.error || "Failed to generate riddle" });
      }
    } catch (error) {
      console.error("Error generating riddle:", error);
      return res.status(500).json({ message: "Failed to generate a new riddle" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
