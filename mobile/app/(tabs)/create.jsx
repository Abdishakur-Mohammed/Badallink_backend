import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import {useState} from 'react'
import { useRouter } from 'expo-router';
import styles from '../../assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../constants/api';

export default function create() {
  const [title , setTitle] = useState('');
  const [description , setDescription] = useState('');
  const [offering, setOffering] = useState('');
  const [need, setNeed] = useState('');
  const [loading , setLoading] = useState(false);

  const router = useRouter();
  const {token} = useAuthStore()

  const handleSubmit = async () => {
    if (!title || !description || !offering || !need) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://badallink-backend.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, offering, need })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      Alert.alert('Success', 'Post created successfully');
      setTitle('');
      setDescription('');
      setOffering('');
      setNeed('');
      router.push('/');
      
    } catch (error) {
      console.log("error creating the post", error);
      Alert.alert('Error', error.message);
    }finally{
      setLoading(false);
    }


  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create a post </Text>
            <Text style={styles.subtitle}>Share your skills with other for exchange</Text>
          </View>

          <View style={styles.form}>
            {/* BOOK TITLE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Post Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter post title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            {/* DESCRIPTION */}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Post Description</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="information-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter posst description"
                  placeholderTextColor={COLORS.placeholderText}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Offering</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="hand-right-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="What you offer"
                  placeholderTextColor={COLORS.placeholderText}
                  value={offering}
                  onChangeText={setOffering}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Need</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="What you need"
                  placeholderTextColor={COLORS.placeholderText}
                  value={need}
                  onChangeText={setNeed}
                />
              </View>
            </View>

          {/* SUBMIT BUTTON */}
          
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>

          </View>


        </View>
      
      </ScrollView>

    </KeyboardAvoidingView>
  )
}