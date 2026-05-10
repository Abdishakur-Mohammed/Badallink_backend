
import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../constants/api";
import RequestItem from "../components/RequestItem"
import COLORS from "../../constants/colors";


export default function Inbox() {

    const { token } = useAuthStore();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/requests`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setRequests(data);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

    }, []);

    //handle statues update
    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();
            if (response.ok) {
                setRequests(prev => prev.map(req =>
                    req._id === requestId ? { ...req, status: newStatus } : req
                ));
                console.log("status updated successfully")
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading requests...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RequestItem request={item} onAccept={() => handleStatusUpdate(item._id, 'accepted')} onReject={() => handleStatusUpdate(item._id, 'rejected')} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No requests yet</Text>
                        <Text style={styles.emptySubtext}>When someone requests a book swap, it will appear here.</Text>
                    </View>
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textSecondary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
