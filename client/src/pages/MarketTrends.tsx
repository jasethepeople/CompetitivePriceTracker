import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, TrendingUp, Edit, Trash2, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDate } from '@/lib/utils';
import { MarketTrend, InsertMarketTrend, insertMarketTrendSchema } from '@shared/schema';

const impactColors = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const trendTypeIcons = {
  pricing: TrendingUp,
  feature: Activity,
  'market-share': AlertCircle,
  'customer-satisfaction': Activity,
};

export default function MarketTrends() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrend, setEditingTrend] = useState<MarketTrend | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  const { data: marketTrends = [], isLoading } = useQuery<MarketTrend[]>({
    queryKey: ['/api/market-trends'],
  });

  const form = useForm<InsertMarketTrend>({
    resolver: zodResolver(insertMarketTrendSchema),
    defaultValues: {
      industry: '',
      trendType: 'pricing',
      title: '',
      description: '',
      impact: 'medium',
      dateIdentified: new Date(),
      source: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertMarketTrend) => apiRequest('/api/market-trends', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/market-trends'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Market trend added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add market trend',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertMarketTrend> }) => 
      apiRequest(`/api/market-trends/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/market-trends'] });
      setIsDialogOpen(false);
      setEditingTrend(null);
      form.reset();
      toast({
        title: 'Success',
        description: 'Market trend updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update market trend',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/market-trends/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/market-trends'] });
      toast({
        title: 'Success',
        description: 'Market trend deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete market trend',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertMarketTrend) => {
    if (editingTrend) {
      updateMutation.mutate({ id: editingTrend.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (trend: MarketTrend) => {
    setEditingTrend(trend);
    form.reset({
      industry: trend.industry,
      trendType: trend.trendType,
      title: trend.title,
      description: trend.description,
      impact: trend.impact,
      dateIdentified: trend.dateIdentified,
      source: trend.source || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this market trend?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTrends = selectedIndustry 
    ? marketTrends.filter(trend => trend.industry === selectedIndustry)
    : marketTrends;

  const uniqueIndustries = [...new Set(marketTrends.map(trend => trend.industry))];

  const trendsByType = marketTrends.reduce((acc, trend) => {
    const type = trend.trendType;
    if (!acc[type]) {
      acc[type] = { type, count: 0, high: 0, medium: 0, low: 0 };
    }
    acc[type].count++;
    acc[type][trend.impact]++;
    return acc;
  }, {} as Record<string, any>);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold">Market Trends</h1>
          <p className="text-muted-foreground">
            Track and analyze market trends across industries
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTrend(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Market Trend
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTrend ? 'Edit Market Trend' : 'Add New Market Trend'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trend title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter industry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trendType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trend Type</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pricing">Pricing</option>
                          <option value="feature">Feature</option>
                          <option value="market-share">Market Share</option>
                          <option value="customer-satisfaction">Customer Satisfaction</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Level</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe the trend..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input placeholder="Where did you identify this trend?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    {editingTrend ? 'Update' : 'Add'} Trend
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select 
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Industries</option>
          {uniqueIndustries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        {selectedIndustry && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedIndustry('')}
          >
            Clear Filter
          </Button>
        )}
      </div>

      {/* Trend Type Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(trendsByType).map((summary: any) => {
          const Icon = trendTypeIcons[summary.type as keyof typeof trendTypeIcons];
          return (
            <Card key={summary.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {summary.type.replace('-', ' ')}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.count}</div>
                <div className="flex space-x-1 mt-2">
                  <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                    {summary.high} High
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">
                    {summary.medium} Med
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                    {summary.low} Low
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trends List */}
      {filteredTrends.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No market trends yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding market trends you've identified in your industry
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Trend
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map((trend) => {
            const Icon = trendTypeIcons[trend.trendType];
            return (
              <Card key={trend.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(trend)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(trend.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{trend.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {trend.trendType.replace('-', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${impactColors[trend.impact]}`}>
                        {trend.impact.charAt(0).toUpperCase() + trend.impact.slice(1)} Impact
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trend.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Identified: {formatDate(trend.dateIdentified)}</span>
                      {trend.source && <span>Source: {trend.source}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}