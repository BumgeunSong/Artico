import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import { sendFirebaseMessagingTokenToServer } from "@/utils/tokenUntils";

export async function checkExistingPermission(): Promise<void> {
    const permission = Notification.permission;
    if (permission === "granted") {
        // user already granted permission in the past
        const token = await requestFirebaseToken();
        if (token) {
            console.log("Existing token:", token);
        }
    }
}

export async function requestPermission(userId: string): Promise<void> {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const token = await requestFirebaseToken();
            if (token) {
                console.log("New token:", token);
                sendFirebaseMessagingTokenToServer(userId, token);
            }
        } else {
            console.log("User denied notifications");
        }
    } catch (error) {
        console.error("Error requesting permission:", error);
    }
}


export async function requestFirebaseToken(): Promise<string | null> {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
        const token = await getToken(messaging, { vapidKey });
        return token ?? null;
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
}