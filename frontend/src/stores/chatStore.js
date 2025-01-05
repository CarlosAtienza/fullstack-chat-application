import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetches all users (for sidebar)
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

  // Gets messages from userId
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Sends the message to selected User
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeMessages:  () => {
    const {selectedUser} = get();
    if (!selectedUser) return;

    //get socket from authStore
    const socket = useAuthStore.getState().socket;
    socket.on("getMessage", (newMessage)=>{
      //check if message sent is from selected user (if user is viewing another user's chatlog)
      if (newMessage.senderId !== selectedUser._id) return;

      set({
        messages:[...get().messages, newMessage],
      });
    });
  },

  unsubscribeMessages:  () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },




 

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));