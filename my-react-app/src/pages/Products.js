import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Package, Plus, Minus, Check } from 'lucide-react';
import { productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.productId === product.id);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { productId: product.id, quantity: 1, product }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(
            cart.map((item) => {
                if (item.productId === productId) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const placeOrder = async () => {
        try {
            const orderData = {
                items: cart.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };
            await ordersAPI.create(orderData);
            setCart([]);
            setShowCart(false);
            setOrderSuccess(true);
            setTimeout(() => setOrderSuccess(false), 3000);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCartAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                            <p className="text-gray-600 mt-1">Browse our amazing collection</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Search products..."
                                />
                            </div>

                            {!isAdmin() && (
                                <button
                                    onClick={() => setShowCart(!showCart)}
                                    className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Cart</span>
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {cart.length}
                    </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {orderSuccess && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-slide-in">
                    <Check className="h-5 w-5" />
                    <span>Order placed successfully!</span>
                </div>
            )}

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center">
                                    <Package className="h-20 w-20 text-white opacity-80" />
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                                        <span className="text-sm text-gray-500">
                      Stock: {product.stockQuantity}
                    </span>
                                    </div>

                                    {!isAdmin() && (
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stockQuantity === 0}
                                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            <div className="bg-indigo-600 text-white p-6">
                                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                                <p className="text-indigo-100 mt-1">{cart.length} items</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-gray-600">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.productId} className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    ${item.product.price.toFixed(2)} each
                                                </p>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, -1)}
                                                            className="bg-white p-1 rounded-full hover:bg-gray-200"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <span className="font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, 1)}
                                                            className="bg-white p-1 rounded-full hover:bg-gray-200"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <p className="text-right mt-2 font-semibold text-indigo-600">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="border-t bg-gray-50 p-6">
                                    <div className="flex justify-between text-lg font-semibold mb-4">
                                        <span>Total:</span>
                                        <span className="text-indigo-600">${totalCartAmount.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={placeOrder}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;