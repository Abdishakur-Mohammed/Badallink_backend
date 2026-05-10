import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { API_BASE_URL } from '../../constants/api';
import PostCard from '../components/PostCard'; // We'll use this for the list!
import COLORS from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';

export default function Profile() {
  const { user, logout, token } = useAuthStore();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only MY posts every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchMyPosts = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/posts/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          setMyPosts(data);
        } catch (error) {
          console.error("Error fetching my posts:", error);
        } finally {
          setLoading(false);
        }
      };

      if (token) fetchMyPosts();
    }, [token])
  );

  const handleDeleteSuccess = (postId) => {
    setMyPosts(prev => prev.filter(post => post._id !== postId));
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: user?.profileImage || `https://api.dicebear.com/7.x/avataaars/png?seed=${user?.username}` }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* 2. My Posts Section */}
      <View style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>My Skills & Posts</Text>
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>You haven't posted any skills yet.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#eee'
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold'
  },
  postsContainer: {
    flex: 1,
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primary
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  }
});
