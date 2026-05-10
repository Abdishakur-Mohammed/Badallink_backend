
import { 
    View,
    ScrollView,
    Text, 
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform } from 'react-native'

import { useState } from 'react'
import {Link} from 'expo-router'
import { Image } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import styles from '../../assets/styles/login.styles'
import COLORS from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'


export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const {login, isLoading} = useAuthStore()

  const hadleLogin = async () => {
    const result = await login(email, password)
    if(!result) Alert.alert('Error', result.error)

  }


  return (
    <KeyboardAvoidingView style={{flex: 1}}
     behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <View>
      <View style={styles.topIllustration}>
        <Image 
          source={require("../../assets/images/Badallink.png")}
          style={styles.illustrationImage}
          resizeMode='contain'
        
        />

      </View>

    <View style={styles.card}>
      <View style={styles.formContainer}>

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
        {/* Login Button*/}
        <TouchableOpacity style={styles.button} onPress={hadleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}

        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/signup" asChild >
            <TouchableOpacity>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          
          </Link>
          </View>


       
       
      </View>
        
     
     </View>
    </View>
    </KeyboardAvoidingView>
    
    
  )
}
