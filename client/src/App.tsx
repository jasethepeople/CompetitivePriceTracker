import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { queryClient } from '@/lib/queryClient';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import Products from '@/pages/Products';
import PricingAnalysis from '@/pages/PricingAnalysis';
import MarketTrends from '@/pages/MarketTrends';
import CrmIntegrations from '@/pages/CrmIntegrations';
import Reports from '@/pages/Reports';
import Layout from '@/components/Layout';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="bi-tool-theme">
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/companies" component={Companies} />
            <Route path="/products" component={Products} />
            <Route path="/pricing" component={PricingAnalysis} />
            <Route path="/trends" component={MarketTrends} />
            <Route path="/crm" component={CrmIntegrations} />
            <Route path="/reports" component={Reports} />
          </Switch>
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;