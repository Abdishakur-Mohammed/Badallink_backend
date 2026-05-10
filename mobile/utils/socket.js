import { io } from "socket.io-client";

// This is our one and only Walkie-Talkie tower
const SOCKET_URL = "https://badallink-backend.onrender.com"; // Notice no /api here!

const socket = io(SOCKET_URL, {
    autoConnect: false, // We only turn it on when the user is logged in
});

export default socket;
