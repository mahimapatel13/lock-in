import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { getAccessToken, setAccessToken } from '../../services/authService';

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = {};

        if (isLogin) {
            // For LoginRequest: Send password and whichever identifier the user filled in
            payload = {
                password: password,
                email : email
            };
            
            // Basic client-side check to ensure at least one is present
            if (!password || !email) {
                alert("Please enter password and email.");
                return;
            }
        } else {
            // For RegisterUserRequest: Both username and email are required
            payload = {
                username: username,
                email: email,
                password: password // Assuming registration also needs a password
            };
        }

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        api.post(endpoint, payload)
            .then(res => {
                // /r handles the header token storage automatically
                // const user = res.data;
                console.log("Login Successful for:", res.data.user.Username);
                console.log("Success! Navigation triggered....");
                // token = getAccessToken()
                // console.log(token)

                navigate('/room/create'); 
            })
            .catch(err => {
                // If the backend 'binding' fails, it usually returns a 400 error
                console.error("Validation or Auth error:", err.response?.data);
                alert(err.response?.data?.error || "An error occurred");
                // console.log(err.data.error)
            });
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

            <input 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
            />

            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            
            <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer'}}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </form>
    );
};


export default AuthForm