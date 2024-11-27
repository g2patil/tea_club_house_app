import React, { useContext, useState } from "react";
import config from './my_con';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import {Image, TouchableOpacity, ImageBackground, StyleSheet, View, Text, TextInput} from 'react-native';
import { UserContext } from './UserContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser_id, setSession_Id } = useContext(UserContext);
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/adnya/club/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const sessionId = data.sessionId;
  
        await AsyncStorage.setItem('sessionId', sessionId);
  
        const cookies = await CookieManager.get(config.BASE_URL);
        console.log('Cookies:', cookies.JSESSIONID);
  
        const userResponse = await fetch(`${config.BASE_URL}/adnya/club/users/find/${email}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser_id(userData.id);
          setSession_Id(sessionId);
          navigation.navigate("Menu");
        } else {
          alert("Failed to fetch user data.");
        }
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('./assets/tea_group.png')} style={styles.backgroundImage}>
      <StatusBar style="auto" />
      
      {/* Content View with separate opacity */}
      <View style={styles.contentContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}	
            placeholder="Username"
            placeholderTextColor="#f8c471"
            onChangeText={(text) => setEmail(text)}
          />
        </View> 
        
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password."
            placeholderTextColor="#f8c471"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

    
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity> 



      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // This ensures the image takes up the whole screen
    justifyContent: 'center', // Optional: to center content
    alignItems: 'center', // Optional: to center content
    backgroundColor: '#c9e3fe',
  },
  contentContainer: {
    flex: 1, // Ensure it takes up the full height
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
 //   backgroundColor: '84bdfa', //'rgba(255, 255, 255, 0.7)', // Optional: Add a semi-transparent overlay to the content
    borderRadius: 10, // Optional: to give rounded corners to the form area
  },
  inputView: {
    //backgroundColor: "#f8c471",
     borderWidth: 1, // Width of the border
    borderColor: "#f39c12", // Border color
    borderRadius: 10,
    width: "70%",
    height: 45,
    marginBottom: 20,
    paddingLeft: 20,
  },
  TextInput: {
    height: 50,
  },
  forgot_button: {
    height: 30,
    marginTop: 120,
  marginBottom: 10,
  fontWeight: "bold", // Makes the text bold
  fontSize: 24,       // Adjust font size
  color: "#f39c12",   // Sets the text color
  textAlign: "center", // Optional: centers the text horizontally
  },
  loginBtn: {
    width: "40%",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    borderWidth: 5, // Width of the border
    borderColor: "#f39c12", // Border color
    
   // backgroundColor: "#f39c12",
  },
  loginText: {
   // color: '#fff',
   
    fontWeight: "bold", // Makes the text bold
  fontSize: 24,       // Adjust font size
  color: "#731201",   // Sets the text color
  textAlign: "center", // Optional: centers the text horizontally
  }
});

export default LoginScreen;
