import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Products from './pages/Products';
import AdminProducts from './pages/AdminProducts';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/AdminOrders';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/products" replace />} />

                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute>
                                    <Products />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedRoute requireAdmin={true}>
                                    <AdminProducts />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <MyOrders />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute requireAdmin={true}>
                                    <AdminOrders />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;