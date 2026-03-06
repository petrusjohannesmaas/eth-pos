import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { productService, userService } from '../services/api';
import Navbar from '../components/Navbar';
import { ShieldAlert, Plus, Users, Package } from 'lucide-react';

export default function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

    // Product Form
    const [productName, setProductName] = useState('');
    const [productBarcode, setProductBarcode] = useState('');
    const [productPrice, setProductPrice] = useState('');

    // User Form
    const [userName, setUserName] = useState('');
    const [userAccessCode, setUserAccessCode] = useState('');
    const [userRole, setUserRole] = useState('cashier');

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else if (user.role !== 'admin') {
            navigate('/pos');
        }
    }, [user, navigate]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productService.create({
                name: productName,
                barcode: productBarcode,
                price: parseFloat(productPrice)
            });
            setMessage({ type: 'success', text: 'Product created successfully' });
            setProductName(''); setProductBarcode(''); setProductPrice('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create product' });
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.create({
                name: userName,
                accessCode: userAccessCode,
                role: userRole
            });
            setMessage({ type: 'success', text: 'User created successfully' });
            setUserName(''); setUserAccessCode(''); setUserRole('cashier');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create user' });
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto p-4 max-w-4xl mt-8">
                <div className="flex items-center space-x-3 mb-8">
                    <ShieldAlert className="w-8 h-8 text-blue-500" />
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex space-x-4 mb-6 relative z-10">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === 'products' ? 'bg-gray-800 text-white border-t border-x border-gray-700' : 'bg-gray-900 text-gray-500 hover:text-gray-300 border-b border-gray-700'}`}
                    >
                        <Package className="w-5 h-5" />
                        <span>Products</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === 'users' ? 'bg-gray-800 text-white border-t border-x border-gray-700' : 'bg-gray-900 text-gray-500 hover:text-gray-300 border-b border-gray-700'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span>Users</span>
                    </button>
                    <div className="flex-1 border-b border-gray-700"></div>
                </div>

                <div className="bg-gray-800 border-x border-b border-gray-700 p-8 rounded-b-xl rounded-tr-xl -mt-6">
                    {activeTab === 'products' ? (
                        <form onSubmit={handleAddProduct} className="max-w-md space-y-4">
                            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Coca Cola 500ml"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Barcode</label>
                                <input
                                    type="text"
                                    required
                                    value={productBarcode}
                                    onChange={e => setProductBarcode(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="Scan or type barcode"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={productPrice}
                                    onChange={e => setProductPrice(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 mt-4">
                                <Plus className="w-5 h-5" />
                                <span>Save Product</span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAddUser} className="max-w-md space-y-4">
                            <h2 className="text-2xl font-bold mb-6">Add New User</h2>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Access Code (4 digits)</label>
                                <input
                                    type="text"
                                    required
                                    pattern="\d{4}"
                                    maxLength={4}
                                    value={userAccessCode}
                                    onChange={e => setUserAccessCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 tracking-[0.5em] font-mono text-center"
                                    placeholder="0000"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Role</label>
                                <select
                                    value={userRole}
                                    onChange={e => setUserRole(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-white"
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 mt-4">
                                <Plus className="w-5 h-5" />
                                <span>Save User</span>
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
