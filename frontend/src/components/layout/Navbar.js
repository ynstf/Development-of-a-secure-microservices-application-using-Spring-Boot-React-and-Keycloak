import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, User, Menu, X, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin, isClient } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShoppingBag className="h-8 w-8 text-white" />
                            <span className="text-white text-2xl font-bold">ShopHub</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user && (
                            <>
                                <Link
                                    to="/products"
                                    className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Package className="h-5 w-5" />
                                    <span>Products</span>
                                </Link>

                                {isAdmin() && (
                                    <Link
                                        to="/admin/products"
                                        className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                                    >
                                        Manage Products
                                    </Link>
                                )}

                                {isClient() && (
                                    <Link
                                        to="/orders"
                                        className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>My Orders</span>
                                    </Link>
                                )}

                                {isAdmin() && (
                                    <Link
                                        to="/admin/orders"
                                        className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200"
                                    >
                                        All Orders
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3 bg-white/20 px-4 py-2 rounded-lg">
                                    <User className="h-5 w-5 text-white" />
                                    <span className="text-white font-medium">{user.username}</span>
                                    {isAdmin() && (
                                        <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                                            ADMIN
                                        </span>
                                    )}
                                    {isClient() && (
                                        <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full font-semibold">
                                            CLIENT
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-indigo-700">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {user && (
                            <>
                                <Link
                                    to="/products"
                                    className="text-white block px-3 py-2 rounded-md hover:bg-white/20"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Products
                                </Link>

                                {isAdmin() && (
                                    <Link
                                        to="/admin/products"
                                        className="text-white block px-3 py-2 rounded-md hover:bg-white/20"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Manage Products
                                    </Link>
                                )}

                                {isClient() && (
                                    <Link
                                        to="/orders"
                                        className="text-white block px-3 py-2 rounded-md hover:bg-white/20"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                )}

                                {isAdmin() && (
                                    <Link
                                        to="/admin/orders"
                                        className="text-white block px-3 py-2 rounded-md hover:bg-white/20"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        All Orders
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="text-white w-full text-left px-3 py-2 rounded-md hover:bg-white/20"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;