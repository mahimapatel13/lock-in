import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth"

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const [error, setError] = useState('')
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")


        if (isLogin) {
            if (!password || !email) {
                alert("Please enter password and email.");
                return;
            }
            try{
                await login (email, password);
                navigate('/room/create');
            } catch (err){
                setError("Failed to sign in. Please check your credentials." || err.message)
            }
        } else {
            if (!username || !email ) {
                alert("Please enter username and email.");
                return;
            }

            try{
                await register(email, username);
                setIsLogin(true)
                navigate('/login')
                alert("Please check your email.")
                
            } catch (err){
                setError(err.message || "Something went wrong");
            }
        }

    };

    return (
        <form onSubmit={handleSubmit} className="auth-container">
            <h3>{isLogin ? 'Login' : 'Create Account'}</h3>
            
            {!isLogin && (
                <input 
                    type="text" 
                    placeholder="Username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
            )}
        
            <input 
                type="email" 
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            />

            {isLogin && (<input 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
            />)}


            {error && <div className="error"> {error}</div>}

            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            
            <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer'}}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </form>
    );
};


export default AuthForm