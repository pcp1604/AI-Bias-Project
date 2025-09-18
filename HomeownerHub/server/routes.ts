import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertModelSchema, insertAuditSchema, insertReportSchema, insertUploadedFileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      // For demo purposes, return hardcoded stats
      // In real app, these would be calculated from actual data
      const stats = {
        totalModels: 24,
        activeAudits: 8,
        fairnessScore: 87.3,
        riskAlerts: 3
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get models
  app.get("/api/models", async (req, res) => {
    try {
      // For demo, use hardcoded user ID
      const models = await storage.getModelsByUserId("user-1");
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Create model
  app.post("/api/models", async (req, res) => {
    try {
      const validatedData = insertModelSchema.parse(req.body);
      const model = await storage.createModel({
        ...validatedData,
        userId: "user-1" // hardcoded for demo
      });
      res.json(model);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid model data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create model" });
      }
    }
  });

  // Get audits
  app.get("/api/audits", async (req, res) => {
    try {
      const audits = await storage.getAuditsByUserId("user-1");
      res.json(audits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audits" });
    }
  });

  // Create audit
  app.post("/api/audits", async (req, res) => {
    try {
      const validatedData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit({
        ...validatedData,
        userId: "user-1"
      });
      
      // Start audit processing simulation
      setTimeout(async () => {
        await storage.updateAuditProgress(audit.id, 25, "in_progress");
        setTimeout(async () => {
          await storage.updateAuditProgress(audit.id, 65);
          setTimeout(async () => {
            await storage.completeAudit(audit.id, 0.82);
          }, 5000);
        }, 3000);
      }, 1000);
      
      res.json(audit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid audit data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create audit" });
      }
    }
  });

  // Get audit details with metrics
  app.get("/api/audits/:id", async (req, res) => {
    try {
      const audit = await storage.getAudit(req.params.id);
      if (!audit) {
        return res.status(404).json({ error: "Audit not found" });
      }
      
      const metrics = await storage.getFairnessMetrics(audit.id);
      res.json({ audit, metrics });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit details" });
    }
  });

  // Get fairness metrics
  app.get("/api/fairness-metrics/:auditId", async (req, res) => {
    try {
      const metrics = await storage.getFairnessMetrics(req.params.auditId);
      if (!metrics) {
        return res.status(404).json({ error: "Metrics not found" });
      }
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fairness metrics" });
    }
  });

  // Get reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReportsByUserId("user-1");
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Generate report
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport({
        ...validatedData,
        userId: "user-1"
      });
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid report data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to generate report" });
      }
    }
  });

  // File upload simulation
  app.post("/api/upload", async (req, res) => {
    try {
      const { modelId, filename, size } = req.body;
      const file = await storage.createFile({
        modelId,
        filename,
        size: parseInt(size)
      });
      
      // Simulate file processing
      setTimeout(async () => {
        await storage.markFileProcessed(file.id);
      }, 2000);
      
      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Get uploaded files for a model
  app.get("/api/files/:modelId", async (req, res) => {
    try {
      const files = await storage.getFilesByModelId(req.params.modelId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
