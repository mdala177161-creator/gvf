/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderStatus } from './pages/OrderStatus';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Admin } from './pages/Admin';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-screen flex flex-col bg-[#080D19] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <div className="flex-1">
        {currentView === 'home' && <Home />}
        {currentView === 'products' && <Products initialTypeFilter="all" />}
        {currentView === 'free' && <Products initialTypeFilter="free" />}
        {currentView === 'premium' && <Products initialTypeFilter="premium" />}
        {currentView === 'categories' && <CategoriesPage />}
        {currentView === 'product_details' && <ProductDetails />}
        {currentView === 'cart' && <Cart />}
        {currentView === 'checkout' && <Checkout />}
        {currentView === 'order_status' && <OrderStatus />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'privacy' && <Privacy />}
        {currentView === 'terms' && <Terms />}
        {currentView === 'admin' && <Admin />}
      </div>

      <Footer />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
