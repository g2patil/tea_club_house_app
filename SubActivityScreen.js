import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';  // Import RadioButton from react-native-paper
import config from './my_con';

const SubActivityScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainActivityId, setMainActivityId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [roles, setRoles] = useState([]); // State to store roles
  const [rolePaidStatuses, setRolePaidStatuses] = useState({}); // Store selected paid/free status for roles
  const [loading, setLoading] = useState(false);

  // Fetch main activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.114:8082/adnya/club/get_main_activity');
        const data = await response.json();
        if (response.ok) {
          setActivities(data);
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

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://192.168.1.114:8082/adnya/club/rolelike?name=CLUB');
        const data = await response.json();
        if (response.ok) {
          setRoles(data);
          const initialRoleStatuses = {};
          data.forEach(role => {
            initialRoleStatuses[role.id] = 'paid';  // Defaulting to 'paid'
          });
          setRolePaidStatuses(initialRoleStatuses);
        } else {
          Alert.alert('Error', 'Failed to fetch roles');
        }
      } catch (error) {
        Alert.alert('Error', 'There was an error fetching roles');
      }
    };

    fetchRoles();
  }, []);

// Handle toggle change
const handleToggleChange = (roleId, isPaid) => {
  setRolePaidStatuses((prev) => ({
    ...prev,
    [roleId]: isPaid, // Toggle between true (Paid) and false (Free)
  }));
};

  // Handle role selection change (Paid/Free)
  const handleRoleChange = (roleId, value) => {
    setRolePaidStatuses((prev) => ({
      ...prev,
      [roleId]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !description || !mainActivityId) {
      Alert.alert('Validation Error', 'Please provide all fields.');
      return;
    }

    // Prepare selected roles for API
    const rolePaidStatusesArray = Object.keys(rolePaidStatuses).map((roleId) => ({
      roleId,
      paid: rolePaidStatuses[roleId] === 'paid' ? 'true' : 'false', //
    //  selected: rolePaidStatuses[roleId] == 'free',
      //paid: rolePaidStatuses[roleId] === 'paid', // Convert string to boolean
     // paid: rolePaidStatuses[roleId] === 'free', 
     // selected: rolePaidStatuses[roleId] !== 'free', 
    }));
     console.log("aaaa"+JSON.stringify(rolePaidStatusesArray));
    // return updatedStatuses; 
    const activityData = {
      name,
      description,
      id: mainActivityId,
      rolePaidStatuses: rolePaidStatusesArray,
    };

    try {
      const response = await fetch('http://192.168.1.114:8082/adnya/club/add_sub_activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });
      // console.log("|"+JSON.stringify(activityData)+"|");
      if (response.ok) {
        Alert.alert('Success', 'Sub activity created successfully');
        setName('');
        setDescription('');
        setMainActivityId(null);
        setRolePaidStatuses({});
      } else {
        Alert.alert('Error', 'Failed to create activity');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error connecting to the server');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Sub Activity</Text>

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

     {/* <Text style={styles.label}>Select Main Activity</Text>*/}
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

    {/*<Text style={styles.label}>Assign Roles</Text>*/}  

<View style={styles.table}>
  {/* Table Header */}
  <View style={styles.tableRow}>
    <Text style={styles.tableHeader}>Role</Text>
    <Text style={styles.tableHeader}>Paid</Text>
    <Text style={styles.tableHeader}>Free</Text>
  </View>

  {/* Table Data Rows */}
  {roles.map((role) => (
    <View key={role.id} style={styles.tableRow}>
      {/* Role Name */}
      <Text style={styles.tableCell}>{role.role}</Text>

      { /*Paid Radio Button*/ }
      <RadioButton.Group
        onValueChange={(value) => handleRoleChange(role.id, value)}
        value={rolePaidStatuses[role.id] || 'paid'}
      >
        <View style={styles.radioRow}>
        <Text style={styles.radioLabel}>free</Text>
          <RadioButton value="free" text="free" />
           <Text style={styles.radioLabel}>Paid</Text>
          <RadioButton value="paid" text="paid"/>
        </View>
      </RadioButton.Group>
      
      

      {/* Free Radio Button
      <RadioButton.Group
        onValueChange={(value) => handleRoleChange(role.id, value)}
        value={rolePaidStatuses[role.id] || 'free'}
      >
        <View style={styles.radioCell}>
          <RadioButton value="free" />
         
        </View>
      </RadioButton.Group>*/ }
    </View>
  ))}
</View>

      <Button title="Create Sub Activity" onPress={handleSubmit} />
      {loading && <Text>Loading...</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  radioContainer: {
    flexDirection: 'row',
  //  alignItems: 'right', // This ensures vertical alignment of text and radio buttons
 //   marginVertical: 4,
  //  justifyContent: 'flex-start', 
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'right',
   // justifyContent: 'flex-end', 
  },
  label: {
    fontSize: 14,
    marginVertical: 4,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 1,
    paddingHorizontal: 1,
    alignItems: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
  radioCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default SubActivityScreen;


/*import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import config from './my_con';

const SubActivityScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainActivityId, setMainActivityId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [roles, setRoles] = useState([]); // State to store roles
  const [selectedRoles, setSelectedRoles] = useState(new Set()); // State for selected roles
  const [loading, setLoading] = useState(false);

  // Fetch main activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.114:8082/adnya/club/get_main_activity');
        const data = await response.json();
        if (response.ok) {
          setActivities(data);
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

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://192.168.1.114:8082/adnya/club/rolelike?name=CLUB');
        const data = await response.json();
        if (response.ok) {
          setRoles(data);
        } else {
          Alert.alert('Error', 'Failed to fetch roles');
        }
      } catch (error) {
        Alert.alert('Error', 'There was an error fetching roles');
      }
    };

    fetchRoles();
  }, []);

  // Handle checkbox selection
  const toggleRole = (roleId) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !description || !mainActivityId) {
      Alert.alert('Validation Error', 'Please provide all fields.');
      return;
    }

    // Prepare selected roles for API
    const selectedRolesArray = Array.from(selectedRoles).map((roleId) => ({
      roleId,
      paid: true, // Example: Set a default value for `paid`
    }));

    const activityData = {
      name,
      description,
      id: mainActivityId,
      rolePaidStatuses: selectedRolesArray,
    };
    console.log("xxxxx - "+JSON.stringify(activityData) );

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
        setName('');
        setDescription('');
        setMainActivityId(null);
        setSelectedRoles(new Set());
      } else {
        Alert.alert('Error', 'Failed to create activity');
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error connecting to the server');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create Sub Activity</Text>

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

      <Text style={styles.label}>Assign Roles</Text>
      {roles.map((role) => (
        <View key={role.id} style={styles.checkboxContainer}>
          <Text>{role.role}</Text>
          <Button
            title={selectedRoles.has(role.id) ? 'Paid' : 'Free'}
            onPress={() => toggleRole(role.id)}
          />
        </View>
      ))}

      <Button title="Create Sub Activity" onPress={handleSubmit} />
      {loading && <Text>Loading...</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    justifyContent: 'space-between',
  },
});

export default SubActivityScreen;
*/