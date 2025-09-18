import { 
  type User, 
  type InsertUser, 
  type Model, 
  type InsertModel,
  type Audit,
  type InsertAudit,
  type FairnessMetrics,
  type Report,
  type InsertReport,
  type UploadedFile,
  type InsertUploadedFile
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Models
  getModel(id: string): Promise<Model | undefined>;
  getModelsByUserId(userId: string): Promise<Model[]>;
  createModel(model: InsertModel & { userId: string }): Promise<Model>;
  updateModelStatus(id: string, status: string): Promise<void>;
  
  // Audits
  getAudit(id: string): Promise<Audit | undefined>;
  getAuditsByUserId(userId: string): Promise<Audit[]>;
  createAudit(audit: InsertAudit & { userId: string }): Promise<Audit>;
  updateAuditProgress(id: string, progress: number, status?: string): Promise<void>;
  completeAudit(id: string, fairnessScore: number): Promise<void>;
  
  // Fairness Metrics
  getFairnessMetrics(auditId: string): Promise<FairnessMetrics | undefined>;
  createFairnessMetrics(metrics: Omit<FairnessMetrics, 'id'>): Promise<FairnessMetrics>;
  
  // Reports
  getReportsByUserId(userId: string): Promise<Report[]>;
  createReport(report: InsertReport & { userId: string }): Promise<Report>;
  
  // Files
  getFilesByModelId(modelId: string): Promise<UploadedFile[]>;
  createFile(file: InsertUploadedFile): Promise<UploadedFile>;
  markFileProcessed(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private models: Map<string, Model> = new Map();
  private audits: Map<string, Audit> = new Map();
  private fairnessMetrics: Map<string, FairnessMetrics> = new Map();
  private reports: Map<string, Report> = new Map();
  private files: Map<string, UploadedFile> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: "user-1",
      username: "demo@biasguard.com",
      password: "password123"
    };
    this.users.set(sampleUser.id, sampleUser);

    // Create sample models
    const models = [
      {
        id: "model-1",
        name: "Credit Scoring Model",
        description: "ML model for credit risk assessment",
        uploadedAt: new Date(Date.now() - 86400000 * 2),
        status: "completed",
        userId: sampleUser.id
      },
      {
        id: "model-2", 
        name: "HR Screening Model",
        description: "Automated resume screening system",
        uploadedAt: new Date(Date.now() - 86400000),
        status: "processing",
        userId: sampleUser.id
      }
    ];

    models.forEach(model => this.models.set(model.id, model));

    // Create sample audits
    const audits = [
      {
        id: "audit-1",
        modelId: "model-1",
        status: "completed",
        progress: 100,
        createdAt: new Date(Date.now() - 86400000 * 2),
        completedAt: new Date(Date.now() - 86400000),
        fairnessScore: 0.873,
        userId: sampleUser.id
      },
      {
        id: "audit-2",
        modelId: "model-2", 
        status: "in_progress",
        progress: 65,
        createdAt: new Date(Date.now() - 43200000),
        completedAt: null,
        fairnessScore: null,
        userId: sampleUser.id
      }
    ];

    audits.forEach(audit => this.audits.set(audit.id, audit));

    // Create sample fairness metrics
    const metrics: FairnessMetrics = {
      id: "metrics-1",
      auditId: "audit-1",
      demographicParity: 0.73,
      equalOpportunity: 0.85,
      calibration: 0.52,
      accuracy: 0.952,
      precision: 0.937,
      recall: 0.955,
      f1Score: 0.946,
      confusionMatrix: { tn: 850, fp: 45, fn: 32, tp: 673 },
      groupMetrics: {
        "Group A": { score: 0.85, count: 450 },
        "Group B": { score: 0.73, count: 380 },
        "Group C": { score: 0.52, count: 270 }
      }
    };

    this.fairnessMetrics.set(metrics.id, metrics);

    // Create sample reports
    const reports = [
      {
        id: "report-1",
        auditId: "audit-1", 
        title: "Credit Model Audit Report",
        generatedAt: new Date(Date.now() - 7200000),
        pdfUrl: "/reports/credit-model-audit.pdf",
        userId: sampleUser.id
      },
      {
        id: "report-2",
        auditId: "audit-1",
        title: "HR Screening Analysis Report", 
        generatedAt: new Date(Date.now() - 86400000),
        pdfUrl: "/reports/hr-screening-analysis.pdf",
        userId: sampleUser.id
      }
    ];

    reports.forEach(report => this.reports.set(report.id, report));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getModel(id: string): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async getModelsByUserId(userId: string): Promise<Model[]> {
    return Array.from(this.models.values()).filter(model => model.userId === userId);
  }

  async createModel(model: InsertModel & { userId: string }): Promise<Model> {
    const id = randomUUID();
    const newModel: Model = {
      ...model,
      id,
      uploadedAt: new Date(),
      status: "pending",
      description: model.description || null
    };
    this.models.set(id, newModel);
    return newModel;
  }

  async updateModelStatus(id: string, status: string): Promise<void> {
    const model = this.models.get(id);
    if (model) {
      this.models.set(id, { ...model, status });
    }
  }

  async getAudit(id: string): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async getAuditsByUserId(userId: string): Promise<Audit[]> {
    return Array.from(this.audits.values()).filter(audit => audit.userId === userId);
  }

  async createAudit(audit: InsertAudit & { userId: string }): Promise<Audit> {
    const id = randomUUID();
    const newAudit: Audit = {
      ...audit,
      id,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
      completedAt: null,
      fairnessScore: null,
      modelId: audit.modelId || null
    };
    this.audits.set(id, newAudit);
    return newAudit;
  }

  async updateAuditProgress(id: string, progress: number, status?: string): Promise<void> {
    const audit = this.audits.get(id);
    if (audit) {
      this.audits.set(id, { 
        ...audit, 
        progress, 
        ...(status && { status })
      });
    }
  }

  async completeAudit(id: string, fairnessScore: number): Promise<void> {
    const audit = this.audits.get(id);
    if (audit) {
      this.audits.set(id, {
        ...audit,
        status: "completed",
        progress: 100,
        completedAt: new Date(),
        fairnessScore
      });
    }
  }

  async getFairnessMetrics(auditId: string): Promise<FairnessMetrics | undefined> {
    return Array.from(this.fairnessMetrics.values()).find(metrics => metrics.auditId === auditId);
  }

  async createFairnessMetrics(metrics: Omit<FairnessMetrics, 'id'>): Promise<FairnessMetrics> {
    const id = randomUUID();
    const newMetrics: FairnessMetrics = { ...metrics, id };
    this.fairnessMetrics.set(id, newMetrics);
    return newMetrics;
  }

  async getReportsByUserId(userId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.userId === userId);
  }

  async createReport(report: InsertReport & { userId: string }): Promise<Report> {
    const id = randomUUID();
    const newReport: Report = {
      ...report,
      id,
      generatedAt: new Date(),
      pdfUrl: `/reports/${report.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      auditId: report.auditId || null
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  async getFilesByModelId(modelId: string): Promise<UploadedFile[]> {
    return Array.from(this.files.values()).filter(file => file.modelId === modelId);
  }

  async createFile(file: InsertUploadedFile): Promise<UploadedFile> {
    const id = randomUUID();
    const newFile: UploadedFile = {
      ...file,
      id,
      uploadedAt: new Date(),
      processed: false,
      modelId: file.modelId || null
    };
    this.files.set(id, newFile);
    return newFile;
  }

  async markFileProcessed(id: string): Promise<void> {
    const file = this.files.get(id);
    if (file) {
      this.files.set(id, { ...file, processed: true });
    }
  }
}

export const storage = new MemStorage();
