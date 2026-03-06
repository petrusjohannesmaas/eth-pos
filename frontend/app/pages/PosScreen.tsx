import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { productService, transactionService } from '../services/api';
import Navbar from '../components/Navbar';
import { Search, Plus, Trash2, CheckCircle, Package } from 'lucide-react';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function PosScreen() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    const [barcode, setBarcode] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [error, setError] = useState('');

    // Checkout modal
    const [showCheckout, setShowCheckout] = useState(false);
    const [cashReceived, setCashReceived] = useState('');
    const [receiptMode, setReceiptMode] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            barcodeInputRef.current?.focus();
        }
    }, [user, navigate, receiptMode]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal; // Assume no tax for MVP

    const cashNum = parseFloat(cashReceived) || 0;
    const change = Math.max(0, cashNum - total);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        try {
            const product = await productService.getByBarcode(barcode.trim());
            setError('');

            setCart(prev => {
                const existing = prev.find(item => item.productId === product._id);
                if (existing) {
                    return prev.map(item =>
                        item.productId === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }];
            });
            setBarcode('');
        } catch (err: any) {
            setError('Product not found or error occurred.');
            setBarcode('');
        }
        barcodeInputRef.current?.focus();
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
        barcodeInputRef.current?.focus();
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setShowCheckout(true);
    };

    const completeTransaction = async () => {
        if (cashNum < total) {
            setError('Insufficient cash received');
            return;
        }

        try {
            await transactionService.create({
                items: cart,
                subtotal,
                total,
                cashReceived: cashNum,
                change,
                cashierId: user?._id,
                cashierName: user?.name
            });

            setReceiptMode(true);
            setShowCheckout(false);
        } catch (err) {
            setError('Failed to process transaction');
        }
    };

    const resetPos = () => {
        setCart([]);
        setCashReceived('');
        setReceiptMode(false);
        setError('');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto p-4 flex gap-6 h-[calc(100vh-80px)]">
                {/* Left Side: Input & Product History */}
                <div className="w-2/3 flex flex-col">
                    <form onSubmit={handleScan} className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            ref={barcodeInputRef}
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="w-full bg-gray-800 border-2 border-gray-700 text-white pl-12 pr-4 py-4 rounded-xl text-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Scan barcode or type and press Enter..."
                            autoFocus
                            disabled={receiptMode || showCheckout}
                        />
                    </form>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-hidden flex flex-col">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package className="w-6 h-6 text-gray-400" />
                            Recent Items Scanned
                        </h2>

                        {cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <Package className="w-16 h-16 mb-4 opacity-20" />
                                <p>No products yet</p>
                                <p className="text-sm">Scan a barcode to start</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                {[...cart].reverse().map((item, idx) => (
                                    <div key={idx} className="bg-gray-700/50 p-4 rounded-xl flex justify-between items-center group">
                                        <div>
                                            <p className="font-bold text-lg">{item.name}</p>
                                            <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)} x {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-xl">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart Summary */}
                <div className="w-1/3 bg-gray-800 border border-gray-700 rounded-2xl flex flex-col overflow-hidden">
                    <div className="bg-gray-750 p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold">Current Order</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-gray-700 pb-3">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-200">{item.name}</p>
                                    <p className="text-sm text-gray-400">₹{item.price.toFixed(2)} (x{item.quantity})</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-750 border-t border-gray-700">
                        <div className="flex justify-between text-lg mb-2 text-gray-400">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-3xl font-bold text-white mb-6">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl text-xl transition-colors"
                        >
                            Checkout (₹{total.toFixed(2)})
                        </button>
                    </div>
                </div>
            </main>

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center">Cash Checkout</h2>

                        <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl mb-6 flex justify-between items-center text-xl">
                            <span>Total Due:</span>
                            <span className="font-bold text-red-400 text-2xl">₹{total.toFixed(2)}</span>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2">Cash Received</label>
                            <input
                                type="number"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                className="w-full bg-gray-700 text-white text-3xl p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>

                        <div className={`p-4 rounded-xl mb-6 flex justify-between items-center text-xl ${change > 0 ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            <span>Change:</span>
                            <span className="font-bold text-2xl">₹{change.toFixed(2)}</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={completeTransaction}
                                disabled={cashNum < total}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {receiptMode && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-black p-8 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

                        <div className="flex flex-col items-center mb-6">
                            <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
                            <h2 className="text-2xl font-bold">Transaction Complete</h2>
                            <p className="text-gray-500 text-sm">{new Date().toLocaleString()}</p>
                        </div>

                        <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4 space-y-2">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Due</span>
                                <span className="font-bold">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cash Received</span>
                                <span>₹{cashNum.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                                <span>Change</span>
                                <span>₹{change.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={resetPos}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
                        >
                            New Transaction
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
