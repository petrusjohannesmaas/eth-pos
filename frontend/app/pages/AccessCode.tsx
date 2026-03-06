import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Lock } from 'lucide-react';

export default function AccessCodeScreen() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInput = (digit: string) => {
        if (code.length < 4) {
            setCode(prev => prev + digit);
            setError('');
        }
    };

    const handleDelete = () => {
        setCode(prev => prev.slice(0, -1));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (code.length === 0) return;

        try {
            const user = await authService.login(code);
            login(user);
            if (user.role === 'admin') {
                navigate('/admin'); // or to pos, could let them choose
            } else {
                navigate('/pos');
            }
        } catch (err) {
            setError('Invalid access code');
            setCode('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">PoS Login</h1>
                    <p className="text-gray-400 mt-2 text-sm text-center">
                        Enter your cashier or admin access code
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex justify-center mb-2">
                        <input
                            type="password"
                            value={code}
                            readOnly
                            className="w-full text-center text-3xl tracking-[1em] bg-gray-900 text-white rounded-lg py-4 outline-none border border-gray-700"
                            placeholder="••••"
                        />
                    </div>
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                </form>

                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleInput(num.toString())}
                            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-4 rounded-xl transition-colors active:scale-95"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleDelete}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-500 text-lg font-medium py-4 rounded-xl transition-colors active:scale-95"
                    >
                        DEL
                    </button>
                    <button
                        onClick={() => handleInput('0')}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-2xl py-4 rounded-xl transition-colors active:scale-95"
                    >
                        0
                    </button>
                    <button
                        onClick={() => handleSubmit()}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-medium py-4 rounded-xl transition-colors active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
