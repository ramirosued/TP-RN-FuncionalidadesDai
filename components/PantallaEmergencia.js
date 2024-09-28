import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

export default function ConfigurarEmergencia({ navigation }) {
  const [numero, setNumero] = useState('');
  const [numeroGuardado, setNumeroGuardado] = useState(null);

  useEffect(() => {
    const obtenerNumero = async () => {
      const numeroGuardado = await AsyncStorage.getItem('numeroEmergencia');
      if (numeroGuardado) {
        setNumeroGuardado(numeroGuardado); // Mostrar número guardado
      }
    };
    obtenerNumero();
  }, []);

  const validarNumero = () => {
    // Permitir números de al menos 3 dígitos (para emergencias como 911) y números telefónicos de 7 dígitos o más.
    const regex = /^[0-9]{3,}$/; 
  
    if (!regex.test(numero)) {
      Alert.alert('Error', 'Por favor ingresa un número de emergencia válido de al menos 3 dígitos.');
      return false;
    }
  
    return true;
  };

  const guardarNumero = async () => {
    if (validarNumero()) {
      await AsyncStorage.setItem('numeroEmergencia', numero);
      setNumeroGuardado(numero); // Actualizar el número mostrado
      navigation.navigate('PantallaLlamadoEmergencia'); 
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Número de emergencia"
          keyboardType="phone-pad"
          value={numero}
          onChangeText={setNumero}
        />
        <Button title="Guardar número" onPress={guardarNumero} />
        
        {numeroGuardado && ( // Si ya hay un número guardado, mostrarlo
          <Text style={styles.numeroGuardadoText}>
            Número de emergencia actual: {numeroGuardado}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
  },
  numeroGuardadoText: {
    marginTop: 20,
    fontSize: 18,
    color: 'tomato',
  },
});
