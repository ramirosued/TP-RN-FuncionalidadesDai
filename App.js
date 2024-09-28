import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import PantallaPrincipal from './components/PantallaPrincipal';
import PantallaInformacion from './components/PantallaInformacion';
import PantallaAboutQR from './components/PantallaAboutQR';
import PantallaClima from './components/PantallaClima';
import PantallaContactosList from './components/PantallaContactosList';
import PantallaEmergencia from './components/PantallaEmergencia';
import EscanearQR from './components/PantallaEscanearQR';
import PantallaLlamadoEmergencia from './components/PantallaLlamadoEmergencia';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//const API_KEY = 'b662851334fa787bd73ef826930e20eb'; 

function InicioStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Clima" component={PantallaClima} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilPrincipal" component={PantallaPrincipal} />
    </Stack.Navigator>
  );
}

function ConfiguracionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContactoPrincipal" component={PantallaContactosList} />
      
    </Stack.Navigator>
  );
}
function EmergenciaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Emergencia" component={PantallaEmergencia} />
      <Stack.Screen name="PantallaLlamadoEmergencia" component={PantallaLlamadoEmergencia} />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Clima') {
              iconName = 'cloudy';
            }  
            else if (route.name === 'Emergencia') {
              iconName = 'call';  
            }
            else if (route.name === 'Contactos') {
              iconName = 'people';
            }
            
            else if (route.name === 'Principal') {
              iconName = 'person';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Principal" component={PerfilStack} />

        <Tab.Screen name="Clima" component={InicioStack} />
        <Tab.Screen name="Emergencia" component={EmergenciaStack} />

        <Tab.Screen name="Contactos" component={ConfiguracionStack} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
