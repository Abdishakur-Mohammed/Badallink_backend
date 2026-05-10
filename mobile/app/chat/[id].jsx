import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { API_BASE_URL } from "../../constants/api";
import { useLocalSearchParams } from "expo-router";
import COLORS from "../../constants/colors";
import socket from "../../utils/socket";


export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const { token, user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {

            try {
                const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [id, token]);

    //for real time messaging 

    useEffect(() => {
        // 1. Connect and Join the booth
        socket.connect();
        socket.emit('join-chat', { requestId: id });

        // 2. Listen for the megaphone
        socket.on('receive_message', (newMessage) => {
            // We only add the message if it's not already in our list
            setMessages((prev) => {
                const exists = prev.find(m => m._id === newMessage._id);
                if (exists) return prev;
                return [...prev, newMessage];
            });
        });

        // 3. CLEANUP (The most important part!)
        return () => {
            socket.off('receive_message');
            socket.disconnect();
        };
    }, [id]);



    const handleSendMessage = async () => {
        if (!inputText.trim() || !token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request: id,
                    text: inputText.trim()
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, data]);
                setInputText("")
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
        );
    }



    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fdfdfd' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >

            <View style={styles.container}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => item._id || `temp-${index}`}
                    renderItem={({ item }) => {
                        const isMine = item.sender._id === user._id;

                        return (
                            <View style={[
                                { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
                                isMine ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
                            ]}>
                                {/* 1. Show avatar for THEM on the LEFT */}
                                {!isMine && (
                                    <Image
                                        source={{ uri: item.sender.profileImage || `https://api.dicebear.com/7.x/avataaars/png?seed=${item.sender.username}` }}
                                        style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
                                    />
                                )}

                                <View style={[
                                    styles.messageBubble,
                                    isMine ? styles.myMessage : styles.otherMessage
                                ]}>
                                    <Text style={[
                                        styles.messageText,
                                        isMine ? { color: 'white' } : { color: 'black' }
                                    ]}>
                                        {item.text}
                                    </Text>

                                    <Text style={[
                                        styles.messageTime,
                                        isMine ? { color: 'rgba(255,255,255,0.7)' } : { color: '#888' }
                                    ]}>
                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>

                                {/* 2. Show avatar for ME on the RIGHT */}
                                {isMine && (
                                    <Image
                                        source={{ uri: user.profileImage || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.username}` }}
                                        style={{ width: 28, height: 28, borderRadius: 14, marginLeft: 8 }}
                                    />
                                )}
                            </View>
                        );
                    }}
                    contentContainerStyle={{ padding: 15 }}
                    showsVerticalScrollIndicator={false}
                />


                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline

                    />

                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 16,
        fontWeight: "bold"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    listContent: {
        paddingBottom: 20,
    },
    messageBubble: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        marginBottom: 10,
        maxWidth: '75%',
    },
    myMessage: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },

    messageTime: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
