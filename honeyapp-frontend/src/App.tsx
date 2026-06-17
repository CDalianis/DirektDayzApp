import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProducerDashboardPage } from './pages/ProducerDashboardPage';
import { ProducerDetailPage } from './pages/ProducerDetailPage';
import { ProducersPage } from './pages/ProducersPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { RegisterConsumerPage } from './pages/RegisterConsumerPage';
import { RegisterProducerPage } from './pages/RegisterProducerPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register/producer" element={<RegisterProducerPage />} />
              <Route path="register/consumer" element={<RegisterConsumerPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:uuid" element={<ProductDetailPage />} />
              <Route path="producers" element={<ProducersPage />} />
              <Route path="producers/:uuid" element={<ProducerDetailPage />} />
              <Route element={<ProtectedRoute roles={['PRODUCER']} />}>
                <Route path="producer/dashboard" element={<ProducerDashboardPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
