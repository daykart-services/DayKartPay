import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Auth from './pages/Auth'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import ProductsPage from './pages/ProductsPage'
import PaymentPage from './pages/PaymentPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* Products Routes */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              
              {/* Category Routes */}
              <Route path="/beds" element={<CategoryPage />} />
              <Route path="/stationery" element={<CategoryPage />} />
              <Route path="/books" element={<CategoryPage />} />
              <Route path="/bathware" element={<CategoryPage />} />
              <Route path="/dorm" element={<CategoryPage />} />
              
              {/* Product Detail Route */}
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* Payment Route */}
              <Route path="/payment" element={<PaymentPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App