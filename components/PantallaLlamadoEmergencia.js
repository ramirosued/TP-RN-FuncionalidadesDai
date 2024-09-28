import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';

export default function LlamadoEmergencia() {
  const [numeroEmergencia, setNumeroEmergencia] = useState(null);

  useEffect(() => {
    const obtenerNumero = async () => {
      const numero = await AsyncStorage.getItem('numeroEmergencia');
      setNumeroEmergencia(numero);
    };
    obtenerNumero();
  }, []);

  const enviarMensajeEmergencia = async () => {
    if (!numeroEmergencia) {
      Alert.alert('Número de emergencia no configurado');
      return;
    }

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [numeroEmergencia],
        '¡Emergencia! Necesito ayuda.'
      );
      console.log(result);
    } else {
      Alert.alert('No se puede enviar SMS en este dispositivo.');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={100} color="tomato" />
      <Text style={styles.numeroText}>
        Mensaje será enviado a: {numeroEmergencia ? numeroEmergencia : 'Cargando...'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={enviarMensajeEmergencia}>
        <Text style={styles.buttonText}>Enviar mensaje de emergencia</Text>
      </TouchableOpacity>
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
  numeroText: {
    fontSize: 20,
    color: 'tomato',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
