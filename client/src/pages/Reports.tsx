import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, FileText, Edit, Trash2, Download, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDate, formatDateRange } from '@/lib/utils';
import { AnalysisReport, InsertAnalysisReport, insertAnalysisReportSchema, Company } from '@shared/schema';

const reportTypeColors = {
  'pricing-analysis': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'market-trend': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'competitor-comparison': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'opportunity-assessment': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function Reports() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<AnalysisReport | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  const { data: reports = [], isLoading } = useQuery<AnalysisReport[]>({
    queryKey: ['/api/analysis-reports'],
  });

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  const form = useForm<InsertAnalysisReport>({
    resolver: zodResolver(insertAnalysisReportSchema),
    defaultValues: {
      title: '',
      type: 'pricing-analysis',
      companyIds: [],
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      insights: [],
      recommendations: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAnalysisReport) => apiRequest('/api/analysis-reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analysis-reports'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Analysis report created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create analysis report',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAnalysisReport> }) => 
      apiRequest(`/api/analysis-reports/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analysis-reports'] });
      setIsDialogOpen(false);
      setEditingReport(null);
      form.reset();
      toast({
        title: 'Success',
        description: 'Analysis report updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update analysis report',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/analysis-reports/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analysis-reports'] });
      toast({
        title: 'Success',
        description: 'Analysis report deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete analysis report',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertAnalysisReport) => {
    if (editingReport) {
      updateMutation.mutate({ id: editingReport.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (report: AnalysisReport) => {
    setEditingReport(report);
    form.reset({
      title: report.title,
      type: report.type,
      companyIds: report.companyIds,
      dateRange: report.dateRange,
      insights: report.insights,
      recommendations: report.recommendations,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis report?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCompanyNames = (companyIds: string[]) => {
    return companyIds.map(id => {
      const company = companies.find(c => c.id === id);
      return company?.name || 'Unknown Company';
    }).join(', ');
  };

  const filteredReports = selectedType 
    ? reports.filter(report => report.type === selectedType)
    : reports;

  const reportTypeStats = reports.reduce((acc, report) => {
    const type = report.type;
    if (!acc[type]) {
      acc[type] = { type, count: 0, recent: 0 };
    }
    acc[type].count++;
    
    // Count reports from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (report.createdAt >= thirtyDaysAgo) {
      acc[type].recent++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analysis Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage competitive intelligence reports
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingReport(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? 'Edit Analysis Report' : 'Create New Analysis Report'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter report title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pricing-analysis">Pricing Analysis</option>
                          <option value="market-trend">Market Trend</option>
                          <option value="competitor-comparison">Competitor Comparison</option>
                          <option value="opportunity-assessment">Opportunity Assessment</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateRange.start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateRange.end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingReport ? 'Update' : 'Create'} Report
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(reportTypeStats).map((stat: any) => (
          <Card key={stat.type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {stat.type.replace('-', ' ')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                {stat.recent} created this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Report Types</option>
          <option value="pricing-analysis">Pricing Analysis</option>
          <option value="market-trend">Market Trend</option>
          <option value="competitor-comparison">Competitor Comparison</option>
          <option value="opportunity-assessment">Opportunity Assessment</option>
        </select>
        {selectedType && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedType('')}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No analysis reports yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first analysis report to start generating insights
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(report)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reportTypeColors[report.type]}`}>
                    {report.type.replace('-', ' ')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateRange(report.dateRange.start, report.dateRange.end)}</span>
                  </div>
                  
                  {report.companyIds.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Companies: </span>
                      <span className="text-muted-foreground">
                        {getCompanyNames(report.companyIds)}
                      </span>
                    </div>
                  )}
                  
                  {report.insights.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Insights: </span>
                      <span className="text-muted-foreground">{report.insights.length}</span>
                    </div>
                  )}
                  
                  {report.recommendations.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Recommendations: </span>
                      <span className="text-muted-foreground">{report.recommendations.length}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Created: {formatDate(report.createdAt)}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}