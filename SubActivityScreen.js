import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import config from './my_con';
const SubActivityScreen = ({ navigation }) => {
  // State to store form input values
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainActivityId, setMainActivityId] = useState(null); // State for main activity ID
  const [activities, setActivities] = useState([]); // State to store activities fetched from API
  const [loading, setLoading] = useState(false); // Loading state for API call

  // Fetch main activities from the API
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.114:8082/adnya/club/get_main_activity');
        const data = await response.json();
        
        if (response.ok) {
          setActivities(data); // Store activities in state
        } else {
          Alert.alert('Error', 'Failed to fetch activities');
        }
      } catch (error) {
        Alert.alert('Error', 'There was an error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!name || !description || !mainActivityId) {
      Alert.alert('Validation Error', 'Please provide all fields.');
      return;
    }

    // Create the activity object from form input
    const activityData = {
      name: name,
      description: description,
      id: mainActivityId,  // Include selected main activity ID
    };

    // Call your API to create the activity
    try {
      const response = await fetch('http://192.168.1.114:8082/adnya/club/add_sub_activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Sub activity created successfully');
        // Reset form fields
        setName('');
        setDescription('');
        setMainActivityId(null);
      } else {
        Alert.alert('Error', 'Failed to create activity');
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

      {/* Dropdown for selecting main activity ID */}
      <Text style={styles.label}>Select Main Activity</Text>
      <Picker
        selectedValue={mainActivityId}
        onValueChange={setMainActivityId}
        style={styles.picker}
      >
        <Picker.Item label="Select an activity" value={null} />
        {activities.map((activity) => (
          <Picker.Item key={activity.id} label={activity.name} value={activity.id} />
        ))}
      </Picker>

      <Button title="Create Activity" onPress={handleSubmit} />

      {loading && <Text>Loading...</Text>}
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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default SubActivityScreen;
