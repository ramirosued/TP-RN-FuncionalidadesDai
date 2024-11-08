import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity } from 'react-native';

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
      setNumeroGuardado(numero); 
    }
  };

  const acercaDe = async () => {
      navigation.navigate('PantallaAboutQR'); 
    
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
        {numeroGuardado && ( 
          <Text style={styles.numeroGuardadoText}>
            Número de emergencia actual: {numeroGuardado}
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.aboutButton} onPress={acercaDe}>
              <Text style={styles.aboutButtonText}>About</Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
    width: 160,
    padding: 4,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    color: '#fff',
  },
  aboutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
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
