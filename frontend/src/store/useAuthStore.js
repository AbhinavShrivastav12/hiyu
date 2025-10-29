import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set,get) => ({
   authUser: null,
   isSigningUp: false,
   isLoggingIn: false,
   isUpdatingProfile: false,
   onlineUsers: [],
   isCheckingAuth: true,
   socket: null,
   //for authentication
   checkAuth: async() => {
    try {
        const res = await axiosInstance.get('/auth/check');
        set({ authUser:res.data });
        get().connectSocket();

    } catch(error) {
        console.error("Error in checkAuth: ", error);
        set({ authUser:null });
    } finally {
        set({ isCheckingAuth: false });
    }
   },
   //for signing up
     signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();

    } catch (error) {
        console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  //for login
  login: async ( data ) => {
    set({ isLoggingIn : true });
    try {
        const res = await axiosInstance.post("/auth/login" ,data);
        set({ authUser : res.data });
        toast.success("Logged in successfully");
        get().connectSocket();

    } catch (error) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message)
    }
  },
//for logout
   logout: async () => {
    try {
         await axiosInstance.post("/auth/logout");
        set({ authUser : null });
        toast.success("Logout successfully");
        get().disconnectSocket();

    } catch (error) {
        console.error("Logout failed: ",error);
        toast.error(error.response.data.message)
    }
   },
   //update the profile
   updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
   },

   connectSocket: () => {
    const { authUser } = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BACKEND_URL ,{
      query : {
        userId: authUser._id
      }
    });
    
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (usersId) => {
      set({ onlineUsers: usersId })
    })
   },

   disconnectSocket: () => {
    if(get().socket?.connected)
      get().socket.disconnect();
   },
})); 