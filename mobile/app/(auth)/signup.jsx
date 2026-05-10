import { View, Text,KeyboardAvoidingView, Platform,TextInput,TouchableOpacity,Link, ActivityIndicator, Alert } from 'react-native'
import {use, useState} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import COLORS from '../../constants/colors'
import styles from '../../assets/styles/signup.styles'
import { useAuthStore } from '../../store/authStore'

export default function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
 

  const router = useRouter()

  const {user, isLoading, register} = useAuthStore()

  const hadleSignUp = () => {

    const result = register(username, email, password)

    if(!result) Alert.alert('Error', result.error)
  }
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
    <View style={styles.container}>
      <View style={styles.card}> 
        {/*Header*/}
        <View style={styles.header}>
          <Text style={styles.title}>Badallink</Text>
          <Text style={styles.subtitle}>Sign up to swap skills with skills/credit</Text>
        </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.placeholderText}
              placeholder="Enter your username"
              keyboardType="email-address"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>

      
        {/* Email*/}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.placeholderText}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password*/}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.placeholderText}
              placeholder="Enter your password"
              keyboardType="default"
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={COLORS.primary} 
              style={styles.inputIconRight}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={hadleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color='fff'  />) : (
              <Text style={styles.buttonText}>Sign Up</Text>
          )}

        </TouchableOpacity>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>

        </View>

        
     
    </View>
    </View>
    </View>
    </KeyboardAvoidingView>
  )
}