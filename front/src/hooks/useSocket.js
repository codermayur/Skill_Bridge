import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Returns the connected socket.io instance (or null while disconnected).
 * The returned value is reactive — effects that depend on it re-run when
 * the socket connects or disconnects.
 */
export function useSocket() {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token]);

  return socket;
}
