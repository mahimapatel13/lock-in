import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false); // New success state
    const { login, register } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [touched, setTouched] = useState({
        email: false,
        username: false,
        password: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        setError("");
        setIsSubmitted(false);
        setTouched({ email: false, username: false, password: false });
    }, [isLogin]);

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const isFieldInvalid = (field, value) => touched[field] && !value;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitted(false);
        setTouched({ email: true, username: true, password: true });

        try {
            setIsLoading(true);
            if (isLogin) {
                if (!password || !email) throw new Error("Please fill in all fields.");
                await login(email, password);
                navigate('/home');
            } else {
                if (!username || !email) throw new Error("Please fill in all fields.");
                await register(email, username);
                // Success: Switch to success UI instead of browser alert
                setIsSubmitted(true);
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const errorAnimation = {
        initial: { opacity: 0, y: -5 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -5 },
        transition: { type: "spring", stiffness: 500, damping: 30 }
    };

    return (
        
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div 
                initial={{ x: 10, y: 10 }}
                animate={{ x: 0, y: 0 }}
                className="w-full max-w-md bg-white border-0.5 border-black p-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            >
                <header className="mb-8">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-black/80">
                        {isLogin ? 'Login' : 'Join Us'}
                    </h3>
                    <p className="text-sm font-bold text-gray-600">
                        {isLogin ? 'Welcome back, focus expert.' : 'Start your productivity journey.'}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 py-4 text-center"
                        >
                            <div className="bg-green-400 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="font-black uppercase text-sm tracking-tight text-black">
                                    Sucessfully Registered. Check your email.
                                </p>
       
                            </div>
                            <Button 
                                onClick={() => setIsLogin(true)}
                                className="w-full h-12 bg-white text-black font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                Back to Login
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={handleSubmit} 
                            className="space-y-2"
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <Alert variant="destructive" className="bg-red-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                                            <AlertDescription className="font-bold text-black uppercase text-xs">
                                                {error}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1">
                                {!isLogin && (
                                    <div className="flex flex-col">
                                        <label className="block text-xs text-black/75 font-black uppercase mb-1">Username</label>
                                        <Input 
                                            placeholder="username"
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)}
                                            onBlur={() => handleBlur('username')}
                                            className={`border-2 transition-colors focus-visible:ring-0 focus:ring-0 shadow-neo ${isFieldInvalid('username', username) ? 'border-red-500 bg-red-50' : 'border-black/30'}`}
                                        />
                                        <div className="h-5 mt-1">
                                            <AnimatePresence>
                                                {isFieldInvalid('username', username) && (
                                                    <motion.p {...errorAnimation} className="text-[10px] font-black text-red-600 uppercase italic">! Username is required</motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <label className="block text-xs text-black/75 font-black uppercase mb-1">Email</label>
                                    <Input 
                                        type="email" 
                                        placeholder="hello@work.com"
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => handleBlur('email')}
                                        className={`border-2 transition-colors focus-visible:ring-0 focus:ring-0 shadow-neo ${isFieldInvalid('email', email) ? 'border-red-500 bg-red-50' : 'border-black/30 '}`}
                                    />
                                    <div className="h-5 mt-1">
                                        <AnimatePresence>
                                            {isFieldInvalid('email', email) && (
                                                <motion.p {...errorAnimation} className="text-[10px] font-black text-red-600 uppercase italic">! Email address is required</motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {isLogin && (
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-xs text-black/75 font-black uppercase">Password</label>
                                            <button type="button" onClick={() => navigate('/forgot-password')} className="text-[10px] font-black uppercase underline decoration-2 underline-offset-2 hover:text-[#5294FF]">Forgot?</button>
                                        </div>
                                        <Input 
                                            type="password" 
                                            placeholder="••••••••"
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => handleBlur('password')}
                                            className={`border-2 transition-colors focus-visible:ring-0 focus:ring-0 shadow-neo ${isFieldInvalid('password', password) ? 'border-red-500 bg-red-50' : 'border-black/30'}`}
                                        />
                                        <div className="h-5 mt-1">
                                            <AnimatePresence>
                                                {isFieldInvalid('password', password) && (
                                                    <motion.p {...errorAnimation} className="text-[10px] font-black text-red-600 uppercase italic">! Password is required</motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button 
                                disabled={isLoading}
                                type="submit" 
                                className="w-full h-14 bg-[#5294FF] text-black font-black uppercase text-lg border-2 border-black/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                            >
                                {isLoading ? 'Wait...' : (isLogin ? 'Login Now' : 'Create Account')}
                            </Button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-6 pt-6 border-t-2 border-black/30 flex flex-col items-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-[black] uppercase underline decoration-2 underline-offset-4 hover:text-gray-500 transition-colors"
                    >
                        {isLogin ? "New here? Create an account" : "Got an account? Log in instead"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthForm;