import {useEffect} from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from '../store/authStore';


export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

     const { checkAuth , user, token} = useAuthStore();

     // Check authentication status on initial load
      useEffect(() => {
        checkAuth();
      }, []);
      
     // Redirect based on authentication status and current route segments
     useEffect(() => {
       // Guard: don't attempt navigation until segments are available
       if (!segments || segments.length === 0) return;

       const isAuthRoute = segments[0] === "(auth)";
       const isSignedIn = user && token;

       if (!isSignedIn && !isAuthRoute) {
         router.replace("/(auth)");
       } else if (isSignedIn && isAuthRoute) {
         router.replace("/(tabs)");
       }
     }, [user, token, segments]);



  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}


