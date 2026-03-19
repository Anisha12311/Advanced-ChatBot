import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const socket = io(URL, { autoConnect: false });

socket.connect();

export default socket;
