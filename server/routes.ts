import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createDailyRiddle, getLatestRiddle, getRiddles, getRiddleCount } from "./services/riddleService";
import { startRiddleScheduler } from "./scheduler";
import { rateLimiter } from "./services/rateLimiter";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  // Endpoint to check remaining riddle generation limit
  app.get("/api/riddles/limit", (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const remaining = rateLimiter.getRemainingRequests(ip);
    return res.json({ 
      remaining,
      limit: 10,
      canGenerate: remaining > 0
    });
  });
  
  // Stripe payment endpoint - create a payment intent for riddle generation
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      // Create a payment intent for $1.00 USD
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // Amount in cents ($1.00)
        currency: "usd",
        // Add metadata for tracking
        metadata: {
          service: "riddle_generation",
        },
      });

      // Return the client secret to the client
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent", 
        error: error.message 
      });
    }
  });
  
  // Payment verification endpoint that generates a riddle upon successful payment
  app.post("/api/generate-paid-riddle", async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }

      // Verify the payment status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Check if payment was successful
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ 
          message: "Payment has not been completed", 
          status: paymentIntent.status 
        });
      }

      // Generate a new riddle - using the same function used for daily riddles
      const result = await createDailyRiddle();
      
      if (!result.success) {
        return res.status(500).json({ 
          message: "Failed to generate riddle after payment",
          error: result.error
        });
      }
      
      // Get the newly created riddle
      const newRiddle = await getLatestRiddle();
      
      return res.status(201).json(newRiddle);
    } catch (error: any) {
      console.error("Error generating paid riddle:", error);
      return res.status(500).json({ 
        message: "Failed to generate riddle after payment", 
        error: error.message 
      });
    }
  });

  // Manually generate a new riddle with rate limiting
  app.post("/api/riddles/generate", async (req: Request, res: Response) => {
    try {
      // Get client IP for rate limiting
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      
      // Check if user has hit their daily limit
      if (!rateLimiter.canGenerate(ip)) {
        return res.status(429).json({ 
          message: "Daily limit reached. You can generate up to 10 riddles per day.",
          remaining: 0,
          resetTime: "Midnight in your local timezone"
        });
      }
      
      // Check if count parameter is provided for generating multiple riddles
      const countSchema = z.preprocess(
        (val) => parseInt(String(val), 10),
        z.number().positive().default(1)
      );
      
      const count = req.query.count ? countSchema.parse(req.query.count) : 1;
      // For rate limiting, restrict count to maximum of remaining riddles
      const actualCount = Math.min(count, rateLimiter.getRemainingRequests(ip));
      
      let generatedCount = 0;
      let lastRiddle = null;
      
      for (let i = 0; i < actualCount; i++) {
        const result = await createDailyRiddle();
        
        if (result.success) {
          generatedCount++;
          lastRiddle = await getLatestRiddle();
          // Increment the rate limiter counter
          rateLimiter.increment(ip);
        }
      }
      
      const remaining = rateLimiter.getRemainingRequests(ip);
      
      if (generatedCount > 0) {
        if (count === 1) {
          return res.status(201).json({
            ...lastRiddle,
            remainingToday: remaining
          });
        } else {
          return res.status(201).json({ 
            message: `Successfully generated ${generatedCount} riddles`,
            lastRiddle,
            remainingToday: remaining
          });
        }
      } else {
        return res.status(500).json({ 
          message: "Failed to generate riddles",
          remainingToday: remaining
        });
      }
    } catch (error) {
      console.error("Error generating riddle:", error);
      return res.status(500).json({ message: "Failed to generate a new riddle" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
