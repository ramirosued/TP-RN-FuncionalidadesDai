import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 

export default function PantallaPrincipal({navigation}) {
  const [subscription, setSubscription] = useState(null);
  const [numeroEmergencia, setNumeroEmergencia] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const obtenerNumeroEmergencia = async () => {
        const numero = await AsyncStorage.getItem('numeroEmergencia');
        setNumeroEmergencia(numero);
        console.log(numero); 
      };

      obtenerNumeroEmergencia();

      const startListening = () => {
        const sub = Accelerometer.addListener(accelerometerData => {
          const { x, y, z } = accelerometerData;
          const shakeThreshold = 1.5; // Ajusta el umbral según tus necesidades

          if (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold || Math.abs(z) > shakeThreshold) {
            handleEmergency(); 
          }
        });

        setSubscription(sub);
      };

      startListening();

      // Limpiar suscripción al desmontar el componente
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }, []) 
  );

  const handleEmergency = async () => {
    const numero = await AsyncStorage.getItem('numeroEmergencia'); 
    if (!numero) {
      Alert.alert('Error', 'No se ha configurado un número de emergencia.');
      return;
    }

    const message = '¡Necesito ayuda! Aquí está mi ubicación:';
    const location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    const fullMessage = `${message} https://www.google.com/maps?q=${lat},${lon}`;

    if (await SMS.isAvailableAsync()) {
      await SMS.sendSMSAsync([numero], fullMessage);
      Alert.alert('Mensaje enviado', 'El mensaje de emergencia ha sido enviado.');
    } else {
      Alert.alert('Error', 'SMS no disponible en este dispositivo.');
    }
  };

  const acercaDe = async () => {
    navigation.navigate('PantallaAboutQR'); 
  
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla Principal</Text>
      <Button title="About" onPress={acercaDe} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
