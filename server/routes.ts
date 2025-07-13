import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from './storage';
import { 
  insertCompanySchema, 
  insertProductSchema, 
  insertPricingDataSchema,
  insertMarketTrendSchema,
  insertCrmIntegrationSchema,
  insertAnalysisReportSchema
} from '@shared/schema';

export function createRoutes(storage: IStorage): Router {
  const router = Router();

  // Companies routes
  router.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch companies' });
    }
  });

  router.get('/api/companies/:id', async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company' });
    }
  });

  router.post('/api/companies', async (req, res) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(data);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create company' });
    }
  });

  router.put('/api/companies/:id', async (req, res) => {
    try {
      const data = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(req.params.id, data);
      res.json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update company' });
    }
  });

  router.delete('/api/companies/:id', async (req, res) => {
    try {
      await storage.deleteCompany(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete company' });
    }
  });

  // Products routes
  router.get('/api/products', async (req, res) => {
    try {
      const { companyId } = req.query;
      const products = companyId 
        ? await storage.getProductsByCompany(companyId as string)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  router.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  router.post('/api/products', async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  router.put('/api/products/:id', async (req, res) => {
    try {
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  router.delete('/api/products/:id', async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Pricing Data routes
  router.get('/api/pricing-data', async (req, res) => {
    try {
      const { productId, companyId } = req.query;
      let pricingData;
      
      if (productId) {
        pricingData = await storage.getPricingDataByProduct(productId as string);
      } else if (companyId) {
        pricingData = await storage.getPricingDataByCompany(companyId as string);
      } else {
        pricingData = await storage.getPricingData();
      }
      
      res.json(pricingData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pricing data' });
    }
  });

  router.post('/api/pricing-data', async (req, res) => {
    try {
      const data = insertPricingDataSchema.parse(req.body);
      const pricingData = await storage.createPricingData(data);
      res.status(201).json(pricingData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create pricing data' });
    }
  });

  router.put('/api/pricing-data/:id', async (req, res) => {
    try {
      const data = insertPricingDataSchema.partial().parse(req.body);
      const pricingData = await storage.updatePricingData(req.params.id, data);
      res.json(pricingData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update pricing data' });
    }
  });

  router.delete('/api/pricing-data/:id', async (req, res) => {
    try {
      await storage.deletePricingData(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete pricing data' });
    }
  });

  // Market Trends routes
  router.get('/api/market-trends', async (req, res) => {
    try {
      const { industry } = req.query;
      const trends = industry 
        ? await storage.getMarketTrendsByIndustry(industry as string)
        : await storage.getMarketTrends();
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch market trends' });
    }
  });

  router.post('/api/market-trends', async (req, res) => {
    try {
      const data = insertMarketTrendSchema.parse(req.body);
      const trend = await storage.createMarketTrend(data);
      res.status(201).json(trend);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create market trend' });
    }
  });

  router.put('/api/market-trends/:id', async (req, res) => {
    try {
      const data = insertMarketTrendSchema.partial().parse(req.body);
      const trend = await storage.updateMarketTrend(req.params.id, data);
      res.json(trend);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update market trend' });
    }
  });

  router.delete('/api/market-trends/:id', async (req, res) => {
    try {
      await storage.deleteMarketTrend(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete market trend' });
    }
  });

  // CRM Integrations routes
  router.get('/api/crm-integrations', async (req, res) => {
    try {
      const integrations = await storage.getCrmIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch CRM integrations' });
    }
  });

  router.get('/api/crm-integrations/:id', async (req, res) => {
    try {
      const integration = await storage.getCrmIntegration(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'CRM integration not found' });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch CRM integration' });
    }
  });

  router.post('/api/crm-integrations', async (req, res) => {
    try {
      const data = insertCrmIntegrationSchema.parse(req.body);
      const integration = await storage.createCrmIntegration(data);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create CRM integration' });
    }
  });

  router.put('/api/crm-integrations/:id', async (req, res) => {
    try {
      const data = insertCrmIntegrationSchema.partial().parse(req.body);
      const integration = await storage.updateCrmIntegration(req.params.id, data);
      res.json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update CRM integration' });
    }
  });

  router.delete('/api/crm-integrations/:id', async (req, res) => {
    try {
      await storage.deleteCrmIntegration(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete CRM integration' });
    }
  });

  // Analysis Reports routes
  router.get('/api/analysis-reports', async (req, res) => {
    try {
      const reports = await storage.getAnalysisReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analysis reports' });
    }
  });

  router.get('/api/analysis-reports/:id', async (req, res) => {
    try {
      const report = await storage.getAnalysisReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Analysis report not found' });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analysis report' });
    }
  });

  router.post('/api/analysis-reports', async (req, res) => {
    try {
      const data = insertAnalysisReportSchema.parse(req.body);
      const report = await storage.createAnalysisReport(data);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create analysis report' });
    }
  });

  router.put('/api/analysis-reports/:id', async (req, res) => {
    try {
      const data = insertAnalysisReportSchema.partial().parse(req.body);
      const report = await storage.updateAnalysisReport(req.params.id, data);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update analysis report' });
    }
  });

  router.delete('/api/analysis-reports/:id', async (req, res) => {
    try {
      await storage.deleteAnalysisReport(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete analysis report' });
    }
  });

  return router;
}