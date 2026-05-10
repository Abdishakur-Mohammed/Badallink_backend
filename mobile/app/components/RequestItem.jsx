import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';


export default function RequestItem({ request, onAccept, onReject }) {
    const user = useAuthStore((state) => state.user);
    return (
        <View style={styles.card}>
            <Text style={styles.badge}>
                {request.from._id === user?._id ? "Sent" : "Received"}
            </Text>

            <Text style={styles.username}> {request.from.username} wants to swap!</Text>
            <Text style={styles.postTitle}>Regarding: {request.post.title}</Text>
            {request.status === 'pending' && request.to._id === user?._id ? (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={onAccept}>
                        <Text style={styles.btnText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={onReject}>
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.statusText}>
                        Status: {request.status.toUpperCase()}
                        {request.status === 'pending' && " (Waiting...)"}
                    </Text>

                    {request.status === 'accepted' && (
                        <TouchableOpacity style={styles.btnChat} onPress={() => router.push(`/chat/${request._id}`)}>
                            <Text style={styles.btnText}>Open Chat</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    postTitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    btnAccept: {
        backgroundColor: COLORS.primary,
    },
    btnReject: {
        backgroundColor: '#ff4444',
    },
    btnChat: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "500",
        color: "#666"
    },
    badge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: COLORS.background,
        color: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 12,
        fontWeight: '600',


    },

})