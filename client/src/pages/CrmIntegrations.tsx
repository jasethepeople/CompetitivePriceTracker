import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Database, Edit, Trash2, Power, PowerOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDate } from '@/lib/utils';
import { CrmIntegration, InsertCrmIntegration, insertCrmIntegrationSchema } from '@shared/schema';
import { SiSalesforce, SiHubspot } from 'react-icons/si';

const crmTypeIcons = {
  salesforce: SiSalesforce,
  hubspot: SiHubspot,
  pipedrive: Database,
  zoho: Database,
  custom: Settings,
};

const crmTypeColors = {
  salesforce: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  hubspot: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  pipedrive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  zoho: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  custom: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export default function CrmIntegrations() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<CrmIntegration | null>(null);

  const { data: integrations = [], isLoading } = useQuery<CrmIntegration[]>({
    queryKey: ['/api/crm-integrations'],
  });

  const form = useForm<InsertCrmIntegration>({
    resolver: zodResolver(insertCrmIntegrationSchema),
    defaultValues: {
      name: '',
      type: 'salesforce',
      apiKey: '',
      apiUrl: '',
      isActive: true,
      lastSync: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCrmIntegration) => apiRequest('/api/crm-integrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm-integrations'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'CRM integration added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add CRM integration',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCrmIntegration> }) => 
      apiRequest(`/api/crm-integrations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm-integrations'] });
      setIsDialogOpen(false);
      setEditingIntegration(null);
      form.reset();
      toast({
        title: 'Success',
        description: 'CRM integration updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update CRM integration',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/crm-integrations/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm-integrations'] });
      toast({
        title: 'Success',
        description: 'CRM integration deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete CRM integration',
        variant: 'destructive',
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiRequest(`/api/crm-integrations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm-integrations'] });
      toast({
        title: 'Success',
        description: 'Integration status updated',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update integration status',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertCrmIntegration) => {
    if (editingIntegration) {
      updateMutation.mutate({ id: editingIntegration.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (integration: CrmIntegration) => {
    setEditingIntegration(integration);
    form.reset({
      name: integration.name,
      type: integration.type,
      apiKey: integration.apiKey,
      apiUrl: integration.apiUrl || '',
      isActive: integration.isActive,
      lastSync: integration.lastSync,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this CRM integration?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Integrations</h1>
          <p className="text-muted-foreground">
            Connect with your CRM systems to sync competitive intelligence data
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingIntegration(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Edit CRM Integration' : 'Add New CRM Integration'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Integration Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter integration name" {...field} />
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
                      <FormLabel>CRM Type</FormLabel>
                      <FormControl>
                        <select 
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="salesforce">Salesforce</option>
                          <option value="hubspot">HubSpot</option>
                          <option value="pipedrive">Pipedrive</option>
                          <option value="zoho">Zoho CRM</option>
                          <option value="custom">Custom</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter API key" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://api.example.com" 
                          {...field} 
                        />
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
                    {editingIntegration ? 'Update' : 'Add'} Integration
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No CRM integrations yet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your CRM systems to sync competitive intelligence data
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Integration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = crmTypeIcons[integration.type];
            return (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${crmTypeColors[integration.type]}`}>
                            {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(integration.id, integration.isActive)}
                        title={integration.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {integration.isActive ? 
                          <Power className="h-4 w-4 text-green-600" /> : 
                          <PowerOff className="h-4 w-4 text-red-600" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(integration)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        integration.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {integration.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {integration.apiUrl && (
                      <div>
                        <span className="text-sm font-medium">API URL: </span>
                        <span className="text-sm text-muted-foreground">
                          {integration.apiUrl}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Added: {formatDate(integration.createdAt)}
                      </span>
                      {integration.lastSync && (
                        <span>
                          Last sync: {formatDate(integration.lastSync)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Integration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Instructions</CardTitle>
          <CardDescription>
            How to set up your CRM integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Salesforce</h4>
              <p className="text-sm text-muted-foreground">
                Generate an API key in your Salesforce organization settings. 
                Go to Setup → App Manager → New Connected App and configure OAuth settings.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">HubSpot</h4>
              <p className="text-sm text-muted-foreground">
                Create a private app in your HubSpot developer portal. 
                Navigate to Settings → Integrations → Private Apps and generate an access token.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Pipedrive</h4>
              <p className="text-sm text-muted-foreground">
                Get your API token from Settings → Personal preferences → API. 
                The API URL should be in the format: https://company.pipedrive.com/api/v1
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Custom Integration</h4>
              <p className="text-sm text-muted-foreground">
                For custom CRM systems, provide the API endpoint URL and authentication token. 
                Ensure your API supports REST calls for data synchronization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}