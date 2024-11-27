import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

const MainActivityScreen = ({ navigation }) => {
  // State to store form input values
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!name || !description) {
      Alert.alert('Validation Error', 'Please provide both name and description.');
      return;
    }

    // Create the activity object from form input
    const activityData =[ {
      name: name,
      description: description,
    }];

    // Call your API to create the activity
    try {
      const response = await fetch('http://192.168.1.114:8082/adnya/club/add_main_activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });
        // console.log("$$$"+JSON.stringify(activityData));
        //console.log("$$$"+response.status);
        //console.log("$$$"+response.ok);
      //const responseData = await response.json();
      //name.setName('');
      //description.setName(''); 
      if (response.ok) {
        Alert.alert('Success', 'Main activity created successfully');
        // Optionally, navigate to another screen (e.g., activity list)
        setName('');
        setDescription(''); 
      // navigation.goBack();
      } else {
        Alert.alert('Error',  'Failed to create activity');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error connecting to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Main Activity</Text>

      <TextInput
        style={styles.input}
        placeholder="Activity Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Activity Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Create Activity" onPress={handleSubmit} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default MainActivityScreen;
