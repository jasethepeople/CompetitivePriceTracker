import { z } from 'zod';

// Company entity for competitor tracking
export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  website: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const insertCompanySchema = companySchema.omit({ id: true, createdAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = z.infer<typeof companySchema>;

// Product entity for pricing analysis
export const productSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  features: z.array(z.string()),
  targetMarket: z.string().optional(),
  createdAt: z.date(),
});

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof productSchema>;

// Pricing data for competitive analysis
export const pricingDataSchema = z.object({
  id: z.string(),
  productId: z.string(),
  price: z.number(),
  currency: z.string(),
  pricingModel: z.enum(['one-time', 'monthly', 'yearly', 'usage-based', 'tiered']),
  planName: z.string().optional(),
  features: z.array(z.string()),
  dateCollected: z.date(),
  source: z.string().optional(),
});

export const insertPricingDataSchema = pricingDataSchema.omit({ id: true });
export type InsertPricingData = z.infer<typeof insertPricingDataSchema>;
export type PricingData = z.infer<typeof pricingDataSchema>;

// Market trends for analysis
export const marketTrendSchema = z.object({
  id: z.string(),
  industry: z.string(),
  trendType: z.enum(['pricing', 'feature', 'market-share', 'customer-satisfaction']),
  title: z.string(),
  description: z.string(),
  impact: z.enum(['high', 'medium', 'low']),
  dateIdentified: z.date(),
  source: z.string().optional(),
});

export const insertMarketTrendSchema = marketTrendSchema.omit({ id: true });
export type InsertMarketTrend = z.infer<typeof insertMarketTrendSchema>;
export type MarketTrend = z.infer<typeof marketTrendSchema>;

// CRM integration settings
export const crmIntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['salesforce', 'hubspot', 'pipedrive', 'zoho', 'custom']),
  apiKey: z.string(),
  apiUrl: z.string().optional(),
  isActive: z.boolean(),
  lastSync: z.date().optional(),
  createdAt: z.date(),
});

export const insertCrmIntegrationSchema = crmIntegrationSchema.omit({ id: true, createdAt: true });
export type InsertCrmIntegration = z.infer<typeof insertCrmIntegrationSchema>;
export type CrmIntegration = z.infer<typeof crmIntegrationSchema>;

// Analysis reports
export const analysisReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['pricing-analysis', 'market-trend', 'competitor-comparison', 'opportunity-assessment']),
  companyIds: z.array(z.string()),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  createdAt: z.date(),
});

export const insertAnalysisReportSchema = analysisReportSchema.omit({ id: true, createdAt: true });
export type InsertAnalysisReport = z.infer<typeof insertAnalysisReportSchema>;
export type AnalysisReport = z.infer<typeof analysisReportSchema>;