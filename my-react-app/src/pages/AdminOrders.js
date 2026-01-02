import React, { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, User, ShoppingBag } from 'lucide-react';
import { ordersAPI } from '../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getAll();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PROCESSING: 'bg-purple-100 text-purple-800',
            SHIPPED: 'bg-indigo-100 text-indigo-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredOrders =
        filterStatus === 'ALL'
            ? orders
            : orders.filter((order) => order.status === filterStatus);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

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
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor all customer orders</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <ShoppingBag className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">
                                    ${totalRevenue.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending Orders</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">
                                    {orders.filter((o) => o.status === 'PENDING').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Package className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filterStatus === status
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {filterStatus === 'ALL'
                                ? 'No orders have been placed yet.'
                                : `No orders with status: ${filterStatus}`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-indigo-600 text-white rounded-full p-2">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-semibold text-gray-900">#{order.id}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <User className="h-4 w-4" />
                                                <span>{order.username}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(order.orderDate)}</span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                        {order.status}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-4">
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between py-3 border-b last:border-b-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-indigo-600">
                                                    ${item.subtotal.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Total */}
                                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <DollarSign className="h-5 w-5" />
                                            <span className="font-medium">Total Amount</span>
                                        </div>
                                        <span className="text-2xl font-bold text-indigo-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;