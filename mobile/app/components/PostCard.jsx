import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import COLORS from '../../constants/colors';


import { API_BASE_URL } from '../../constants/api';
import { useAuthStore } from '../../store/authStore';

export default function PostCard({ item, onDeleteSuccess }) {
  const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '';
  const rawAvatar = item?.user?.profileImage || `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(item?.user?.username || 'user')}`;
  const avatarUrl = rawAvatar.includes('/svg') ? rawAvatar.replace('/svg', '/png') : rawAvatar;

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const handleRequest = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: item.user._id,
          post: item._id
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to request')
      alert('Request sent successfully')
    } catch (error) {
      console.error('Error sending request:', error)
      alert(error.message)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this skill post?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/posts/${item._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (response.ok) {
                if (onDeleteSuccess) onDeleteSuccess(item._id);
              }
            } catch (error) {
              console.error("Error deleting post:", error);
            }
          } 
        }
      ]
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.user.username}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.badge, styles.offering]}>
          <Text style={styles.badgeLabel}>Offering</Text>
          <Text style={styles.badgeValue}>{item.offering}</Text>
        </View>

        <View style={[styles.badge, styles.need]}>
          <Text style={styles.badgeLabel}>Want</Text>
          <Text style={styles.badgeValue}>{item.need}</Text>
        </View>
      </View>

      {user?._id !== item.user._id ? (
        <TouchableOpacity style={styles.button} onPress={handleRequest}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4444' }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Post</Text>
        </TouchableOpacity>
      )}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: COLORS.border,
  },
  username: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  body: {
    marginTop: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offering: {},
  need: {},
  badgeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
});
