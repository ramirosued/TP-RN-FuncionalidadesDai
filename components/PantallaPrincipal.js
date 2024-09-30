import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  // Asegúrate de importarlo

export default function PantallaPrincipal() {
  const [subscription, setSubscription] = useState(null);
  const [numeroEmergencia, setNumeroEmergencia] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      console.log("Pantalla enfocada");

      // Obtener el número de emergencia guardado
      const obtenerNumeroEmergencia = async () => {
        const numero = await AsyncStorage.getItem('numeroEmergencia');
        console.log(`Número: ${numero}`);
        setNumeroEmergencia(numero);
      };

      obtenerNumeroEmergencia();

      // Activar el acelerómetro
      const startListening = () => {
        const sub = Accelerometer.addListener(accelerometerData => {
          const { x, y, z } = accelerometerData;
          const shakeThreshold = 1.5; // Ajusta el umbral según tus necesidades

          if (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold || Math.abs(z) > shakeThreshold) {
            handleEmergency(); // Llamar a la función de emergencia
          }
        });

        setSubscription(sub);
      };

      startListening();

      return () => {
        console.log("Pantalla desenfocada");
        subscription && subscription.remove();
        setSubscription(null);
      };
    }, [subscription])
  );

  const handleEmergency = async () => {
    if (!numeroEmergencia) {
      Alert.alert('Error', 'No se ha configurado un número de emergencia.');
      return;
    }

    // Mensaje de emergencia
    const message = '¡Necesito ayuda! Aquí está mi ubicación:';

    // Obtener ubicación
    const location = await Location.getCurrentPositionAsync({});
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    const fullMessage = `${message} https://www.google.com/maps?q=${lat},${lon}`;

    // Enviar SMS
    if (await SMS.isAvailableAsync()) {
      SMS.sendSMSAsync([numeroEmergencia], fullMessage)
        .then(() => Alert.alert('Mensaje enviado', 'El mensaje de emergencia ha sido enviado.'))
        .catch(() => Alert.alert('Error', 'No se pudo enviar el mensaje.'));
    } else {
      Alert.alert('Error', 'SMS no disponible en este dispositivo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla Principal</Text>
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
