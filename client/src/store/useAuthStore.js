import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignedIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    
    onlineUsers: [],
    socket: null,
    
    checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            set({authUser: null, isCheckingAuth: false});
            return;
        }
        
        try {
            const res = await axiosInstance.get('auth/check');
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            localStorage.removeItem('authToken');
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },
    
    signUp: async (data) => {
        set({ isSignedIn: true });
        try {
            const res = await axiosInstance.post("auth/signup", data);
            
            if (res.data.token) {
                localStorage.setItem("authToken", res.data.token);
                // Update axios headers for subsequent requests
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            }
            
            set({ authUser: res.data });
            toast.success("Account created successfully");
            window.location.href = "/";
            get().connectSocket();
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
                localStorage.setItem("authToken", res.data.token);
                // Update axios headers for subsequent requests
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                
                set({
                    authUser: res.data,
                    token: res.data.token,
                    isAuthenticated: true,
                });
                
                toast.success("Login successful!");
                get().connectSocket();
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
            // Remove token from localStorage and axios headers
            localStorage.removeItem("authToken");
            delete axiosInstance.defaults.headers.common['Authorization'];
            
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    
    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },
    
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        
        set({ socket: socket });
        
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
    },
    
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
