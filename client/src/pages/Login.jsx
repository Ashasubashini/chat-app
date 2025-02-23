import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import logo from "../assets/chatterbee.png";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";

const Login = () => {
    const { login, users } = useAuthStore(); // Assuming 'users' contains registered users
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Email validation function
    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!email || !password) return toast.error("All fields are required.");
        if (!validateEmail(email)) return toast.error("Enter a valid email address.");
    
        setLoading(true);
    
        try {
            await login({ email, password });
            navigate("/"); // Redirect to home on successful login
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen grid lg:grid-cols-[40%_60%]">
            {/* Left Side - Login Form */}
            <div className="flex flex-col justify-center items-center bg-[#0A192F] text-white w-full">
                <div className="w-full max-w-sm">
                    <div className="flex">
                        <img src={logo} alt="Logo" className="w-[500px] h-[200px] mx-auto" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4 mt-0">
                        <h2 className="text-xl font-semibold text-center">Login to Your Account</h2>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-600 bg-[#112240] text-white rounded-lg focus:outline-none focus:border-[#64ffda]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-600 bg-[#112240] text-white rounded-lg focus:outline-none focus:border-[#64ffda]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#64ffda] text-[#0A192F] py-2 rounded-lg font-semibold hover:bg-[#52e0c4] transition duration-300 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don't have an account?{" "}
                            <Link to="/signup" className="link link-primary">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Component */}
            <div className="bg-[#112A42] flex justify-center items-center p-8">
                <AuthImagePattern
                    title="Welcome Back!"
                    subtitle="Log in to continue your journey and connect with your community."
                />
            </div>
        </div>
    );
};

export default Login;
