import { useContext, useMemo } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { AuthContext } from "./AuthContext";
import API_ENDPOINTS from "../api/apiConfig";

export default function useEcho() {
  const { accessToken } = useContext(AuthContext);

  const echo = useMemo(() => {
    if (!accessToken) return null;

    // Needed for Echo to work in React Native
    global.Pusher = Pusher;

    return new Echo({
      broadcaster: "pusher",
      key: "4irvuhvpnbo2iomzrvq9", // your actual key
      cluster: "mt1",
      forceTLS: true,
      wsHost: "ws.pusherapp.com", // or your own host if self-hosted
      wsPort: 443,
      wssPort: 443,
      encrypted: true,
      enabledTransports: ["ws", "wss"],
      disableStats: true,
      authEndpoint: API_ENDPOINTS.broadcasting,
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }, [accessToken]);

  return echo;
}