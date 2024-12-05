import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    // Add event listeners to handle errors
    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      // Close socket connection and remove listeners on cleanup
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
