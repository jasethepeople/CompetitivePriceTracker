import { 
  Company, InsertCompany, 
  Product, InsertProduct, 
  PricingData, InsertPricingData,
  MarketTrend, InsertMarketTrend,
  CrmIntegration, InsertCrmIntegration,
  AnalysisReport, InsertAnalysisReport
} from '@shared/schema';

export interface IStorage {
  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | null>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: string): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCompany(companyId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Pricing Data
  getPricingData(): Promise<PricingData[]>;
  getPricingDataByProduct(productId: string): Promise<PricingData[]>;
  getPricingDataByCompany(companyId: string): Promise<PricingData[]>;
  createPricingData(data: InsertPricingData): Promise<PricingData>;
  updatePricingData(id: string, data: Partial<InsertPricingData>): Promise<PricingData>;
  deletePricingData(id: string): Promise<void>;

  // Market Trends
  getMarketTrends(): Promise<MarketTrend[]>;
  getMarketTrendsByIndustry(industry: string): Promise<MarketTrend[]>;
  createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend>;
  updateMarketTrend(id: string, trend: Partial<InsertMarketTrend>): Promise<MarketTrend>;
  deleteMarketTrend(id: string): Promise<void>;

  // CRM Integrations
  getCrmIntegrations(): Promise<CrmIntegration[]>;
  getCrmIntegration(id: string): Promise<CrmIntegration | null>;
  createCrmIntegration(integration: InsertCrmIntegration): Promise<CrmIntegration>;
  updateCrmIntegration(id: string, integration: Partial<InsertCrmIntegration>): Promise<CrmIntegration>;
  deleteCrmIntegration(id: string): Promise<void>;

  // Analysis Reports
  getAnalysisReports(): Promise<AnalysisReport[]>;
  getAnalysisReport(id: string): Promise<AnalysisReport | null>;
  createAnalysisReport(report: InsertAnalysisReport): Promise<AnalysisReport>;
  updateAnalysisReport(id: string, report: Partial<InsertAnalysisReport>): Promise<AnalysisReport>;
  deleteAnalysisReport(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private companies: Company[] = [];
  private products: Product[] = [];
  private pricingData: PricingData[] = [];
  private marketTrends: MarketTrend[] = [];
  private crmIntegrations: CrmIntegration[] = [];
  private analysisReports: AnalysisReport[] = [];

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return this.companies;
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.companies.find(c => c.id === id) || null;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const newCompany: Company = {
      id: this.generateId(),
      ...company,
      createdAt: new Date(),
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    
    this.companies[index] = { ...this.companies[index], ...company };
    return this.companies[index];
  }

  async deleteCompany(id: string): Promise<void> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Company not found');
    
    this.companies.splice(index, 1);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductsByCompany(companyId: string): Promise<Product[]> {
    return this.products.filter(p => p.companyId === companyId);
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      ...product,
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    this.products.splice(index, 1);
  }

  // Pricing Data
  async getPricingData(): Promise<PricingData[]> {
    return this.pricingData;
  }

  async getPricingDataByProduct(productId: string): Promise<PricingData[]> {
    return this.pricingData.filter(pd => pd.productId === productId);
  }

  async getPricingDataByCompany(companyId: string): Promise<PricingData[]> {
    const companyProducts = this.products.filter(p => p.companyId === companyId);
    const productIds = companyProducts.map(p => p.id);
    return this.pricingData.filter(pd => productIds.includes(pd.productId));
  }

  async createPricingData(data: InsertPricingData): Promise<PricingData> {
    const newData: PricingData = {
      id: this.generateId(),
      ...data,
    };
    this.pricingData.push(newData);
    return newData;
  }

  async updatePricingData(id: string, data: Partial<InsertPricingData>): Promise<PricingData> {
    const index = this.pricingData.findIndex(pd => pd.id === id);
    if (index === -1) throw new Error('Pricing data not found');
    
    this.pricingData[index] = { ...this.pricingData[index], ...data };
    return this.pricingData[index];
  }

  async deletePricingData(id: string): Promise<void> {
    const index = this.pricingData.findIndex(pd => pd.id === id);
    if (index === -1) throw new Error('Pricing data not found');
    
    this.pricingData.splice(index, 1);
  }

  // Market Trends
  async getMarketTrends(): Promise<MarketTrend[]> {
    return this.marketTrends;
  }

  async getMarketTrendsByIndustry(industry: string): Promise<MarketTrend[]> {
    return this.marketTrends.filter(mt => mt.industry === industry);
  }

  async createMarketTrend(trend: InsertMarketTrend): Promise<MarketTrend> {
    const newTrend: MarketTrend = {
      id: this.generateId(),
      ...trend,
    };
    this.marketTrends.push(newTrend);
    return newTrend;
  }

  async updateMarketTrend(id: string, trend: Partial<InsertMarketTrend>): Promise<MarketTrend> {
    const index = this.marketTrends.findIndex(mt => mt.id === id);
    if (index === -1) throw new Error('Market trend not found');
    
    this.marketTrends[index] = { ...this.marketTrends[index], ...trend };
    return this.marketTrends[index];
  }

  async deleteMarketTrend(id: string): Promise<void> {
    const index = this.marketTrends.findIndex(mt => mt.id === id);
    if (index === -1) throw new Error('Market trend not found');
    
    this.marketTrends.splice(index, 1);
  }

  // CRM Integrations
  async getCrmIntegrations(): Promise<CrmIntegration[]> {
    return this.crmIntegrations;
  }

  async getCrmIntegration(id: string): Promise<CrmIntegration | null> {
    return this.crmIntegrations.find(ci => ci.id === id) || null;
  }

  async createCrmIntegration(integration: InsertCrmIntegration): Promise<CrmIntegration> {
    const newIntegration: CrmIntegration = {
      id: this.generateId(),
      ...integration,
      createdAt: new Date(),
    };
    this.crmIntegrations.push(newIntegration);
    return newIntegration;
  }

  async updateCrmIntegration(id: string, integration: Partial<InsertCrmIntegration>): Promise<CrmIntegration> {
    const index = this.crmIntegrations.findIndex(ci => ci.id === id);
    if (index === -1) throw new Error('CRM integration not found');
    
    this.crmIntegrations[index] = { ...this.crmIntegrations[index], ...integration };
    return this.crmIntegrations[index];
  }

  async deleteCrmIntegration(id: string): Promise<void> {
    const index = this.crmIntegrations.findIndex(ci => ci.id === id);
    if (index === -1) throw new Error('CRM integration not found');
    
    this.crmIntegrations.splice(index, 1);
  }

  // Analysis Reports
  async getAnalysisReports(): Promise<AnalysisReport[]> {
    return this.analysisReports;
  }

  async getAnalysisReport(id: string): Promise<AnalysisReport | null> {
    return this.analysisReports.find(ar => ar.id === id) || null;
  }

  async createAnalysisReport(report: InsertAnalysisReport): Promise<AnalysisReport> {
    const newReport: AnalysisReport = {
      id: this.generateId(),
      ...report,
      createdAt: new Date(),
    };
    this.analysisReports.push(newReport);
    return newReport;
  }

  async updateAnalysisReport(id: string, report: Partial<InsertAnalysisReport>): Promise<AnalysisReport> {
    const index = this.analysisReports.findIndex(ar => ar.id === id);
    if (index === -1) throw new Error('Analysis report not found');
    
    this.analysisReports[index] = { ...this.analysisReports[index], ...report };
    return this.analysisReports[index];
  }

  async deleteAnalysisReport(id: string): Promise<void> {
    const index = this.analysisReports.findIndex(ar => ar.id === id);
    if (index === -1) throw new Error('Analysis report not found');
    
    this.analysisReports.splice(index, 1);
  }
}