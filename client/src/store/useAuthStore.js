import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import SignUp from '../pages/SignUp';


export const useAuthStore = create((set) => ({
    authUser: null,
    isSignedIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,   
    onlineUsers: [],

    checkAuth : async () => {
        try {
            const res = await axiosInstance.get('/auth/check');

            set({authUser: res.data});
        } catch (error) {
            set ({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }

    },

    signUp: async (data) => {
        set({ isSignedIn: true });
        try {
            const res = await axiosInstance.post("auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSignedIn: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
    
        try {
            const res = await axiosInstance.post("auth/login", data);
            console.log("Login API Response:", res.data); 
    
            if (res.data.token) {
                set({
                    authUser: res.data, 
                    token: res.data.token, 
                    isAuthenticated: true,
                });
    
                localStorage.setItem("authToken", res.data.token);
                toast.success("Login successful!");
            } else {
                console.warn("Token missing in response:", res.data);
                throw new Error("Authentication failed. No token received.");
            }
        } catch (error) {
            console.error("Login Error Response:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to login");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser:null});
            toast.success("logout successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile : async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Profile update failed:", error);   
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    }

}));