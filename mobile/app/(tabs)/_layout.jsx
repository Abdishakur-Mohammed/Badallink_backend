import { Tabs } from 'expo-router'
import COLORS from '../../constants/colors'
import IonIcons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function RootLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,

            headerTitleStyle: {
                color: COLORS.textPrimary,
                fontWeight: '600'
            },

            headerShadowVisible: false,
            tabBarStyle: {
                backgroundColor: COLORS.cardBackground,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingTop: 10,
                paddingBottom: insets.bottom,
                height: 40 + insets.bottom,

            }

        }}>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <IonIcons name="home-outline" color={color} size={size} />
                )

            }} />
            <Tabs.Screen name="create" options={{
                title: 'Create',
                tabBarIcon: ({ color, size }) => (
                    <IonIcons name="add-circle-outline" color={color} size={size} />
                )
            }} />
            <Tabs.Screen name="inbox" options={{
                title: 'Inbox',
                tabBarIcon: ({ color, size }) => (
                    <IonIcons name="notifications-outline" color={color} size={size} />
                )
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <IonIcons name="person-outline" color={color} size={size} />
                )
            }} />
        </Tabs>
    )
}