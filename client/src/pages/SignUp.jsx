import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import logo from '../assets/chatterbee.png';
import { Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import AuthImagePattern from "../components/AuthImagePattern";



const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
    });

    const { signUp, isSignedIn } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullname.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@+\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");

        return true;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success === true) {
            await signUp(formData);
            navigate('/'); // Redirect to the homepage after successful sign-up
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-[40%_60%]">
            {/* Left Side */}
            <div className="flex flex-col justify-center items-center bg-[#0A192F] text-white w-full">
                <div className="w-full max-w-sm"> 
                    <div className="flex">
                        <img src={logo} alt="Logo" className="w-[500px] h-[200px] mx-auto" /> 
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-0">
                        <h2 className="text-xl font-semibold text-center">Create Your Account</h2>

                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-600 bg-[#112240] text-white rounded-lg focus:outline-none focus:border-[#64ffda]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-600 bg-[#112240] text-white rounded-lg focus:outline-none focus:border-[#64ffda]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-600 bg-[#112240] text-white rounded-lg focus:outline-none focus:border-[#64ffda]"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="mr-2"
                            />
                            <label className="text-sm">Show Password</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#64ffda] text-[#0A192F] py-2 rounded-lg font-semibold hover:bg-[#52e0c4] transition duration-300 flex items-center justify-center"
                            disabled={isSignedIn}
                        >
                            {isSignedIn ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">LogIn</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Larger Width */}
            <div className="bg-[#112A42] flex justify-center items-center p-8">
                <AuthImagePattern
                    title="Join Our Community!"
                    subtitle="Connect with friends, share moments, and stay in touch with your loved ones"
                />
            </div>
        </div>
    );
};

export default SignUp;
