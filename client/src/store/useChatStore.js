import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";


export const useChatStore = create((set, get) => ({
    Messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
    },
      
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data }); // Ensure this is set correctly
        } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to fetch messages");
        } finally {
        set({ isMessagesLoading: false });
        }
    },
    
      

    sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
        toast.error("No user selected");
        return;
    }
    
    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
    } catch (error) {
        console.error("Send message error:", error);
        toast.error(error.response?.data?.message || "Failed to send message");
    }
},

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) return;
    
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },
    
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },

    setSelectedUser: (selectedUser) => set({ selectedUser }),



}));


