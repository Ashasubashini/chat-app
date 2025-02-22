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
    }

}));