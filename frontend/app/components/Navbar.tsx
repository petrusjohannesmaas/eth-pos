import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, ShoppingCart } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4 text-white">
                    <ShoppingCart className="w-6 h-6 text-blue-500" />
                    <span className="font-bold text-xl tracking-wide">MERN PoS</span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        {user.role}
                    </span>
                </div>

                <div className="flex items-center space-x-6 text-gray-300">
                    <span className="font-medium">Welcome, {user.name}</span>

                    <div className="flex space-x-2">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
                                title="Admin Panel"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="hidden sm:inline">Admin</span>
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/pos')}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
                            title="POS"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">POS</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center space-x-2 ml-2"
                            title="Lock POS"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Lock</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
