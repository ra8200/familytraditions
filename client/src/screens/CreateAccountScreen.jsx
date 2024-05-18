import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet,Text, TextInput, View, Button, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomAlert from '../components/ui/CustomAlert';
import { useSignUp, useUser } from '@clerk/clerk-expo';

const CreateAccountScreen = ({ navigation }) => {
  const { signUp } = useSignUp();
  const { isSignedIn } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create an Account",
      headerBackTitle: 'Login',
    });
  }, [navigation]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  const handleCreateAccount = async () => {
    if (!validateInput()) {
      return; // Stops the function if the validation fails
    }
  
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          firstName: firstName,
          lastName: lastName,
          profileImageUrl: profileImage
        })
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create user');
      }
  
      navigation.navigate('Home'); // Or handle successful sign up differently
    } catch (error) {
      setAlertMessage("An unexpected error occurred: " + error.message);
      setShowAlert(true);
    }
  };

  const validateInput = () => {
    // Add all validation checks here
  if (username.trim() === "") {
    setAlertMessage("Username is required.");
    setShowAlert(true);
    return false;
  }
  if (email.trim() === "" || !email.includes('@')) { // Basic email format check
    setAlertMessage("Valid email is required.");
    setShowAlert(true);
    return false;
  }
  // Password strength check
  if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) {
    setAlertMessage("Password must include at least 8 characters with upper, lower, number, and special char.");
    setShowAlert(true);
    return false;
  }
  if (password !== confirmPassword) {
    setAlertMessage("Passwords do not match.");
    setShowAlert(true);
    return false;
  }
  return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <Button title="Pick an Image" onPress={pickImage} />
      {profileImage && <Image source={{ uri: profileImage }} style={styles.image} />}
      <Button title="Create Account" onPress={handleCreateAccount} />
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account?</Text>
      </Pressable>
      <CustomAlert
        isVisible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  linkText: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default CreateAccountScreen;