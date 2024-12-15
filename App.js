// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import { UserProvider } from './UserContext';
import Logout_Button from './LogoutButton';
import Practise from './Practise';
import Quiz from './Quiz';
import Pdf_cert from './Pdf_cert';
import PDFViewer from './PDFViewer';
import Register_club_member from './Register_club_member';
import AdminScreen from './AdminScreen';
import MainActivityScreen from './MainActivityScreen';
import SubActivityScreen from './SubActivityScreen';
import Activity_view from './Activity_view';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={HomeScreen} />
        <Stack.Screen name="Logout_Button" component={Logout_Button} />
        <Stack.Screen name="Practise" component={Practise} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Pdf_cert" component={Pdf_cert} />
        <Stack.Screen name="PDFViewer" component={PDFViewer} />
        <Stack.Screen name="Register_club_member" component={Register_club_member} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="MainActivityScreen" component={MainActivityScreen} />
        <Stack.Screen name="SubActivityScreen" component={SubActivityScreen} />
        <Stack.Screen name="Activity_view" component={Activity_view} />
       
         </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
};

export default App;
