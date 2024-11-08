import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = 'b662851334fa787bd73ef826930e20eb'; 

export default function ClimaYHora({navigation}) {
  const [horaActual, setHoraActual] = useState('');
  const [fechaActual, setFechaActual] = useState('');
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUbicacionYClima = async () => {
      try {
        // Solicitar permiso de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permiso de ubicación denegado');
          return;
        }

        // Obtener ubicación actual
        const ubicacion = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = ubicacion.coords;

        // Obtener clima usando la API
        const respuesta = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        
        setClima(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerUbicacionYClima();

    // Función para actualizar la hora y la fecha
    const actualizarHoraYFecha = () => {
      const ahora = new Date();
      setHoraActual(ahora.toLocaleTimeString());
      setFechaActual(ahora.toLocaleDateString()); 
    };

    const intervalo = setInterval(actualizarHoraYFecha, 1000); 
    return () => clearInterval(intervalo); 
  }, []);

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const acercaDe = async () => {
    navigation.navigate('PantallaAboutQR'); 
  
};
  return (
    <View style={styles.container}>
        <Text style={styles.fecha}>Dia: {fechaActual}</Text>
        <Text style={styles.hora}>Hora: {horaActual}</Text>
        <Text style={styles.clima}>Cielo: {clima.weather[0].description}</Text>
        <Text style={styles.temperatura}>Temperatura: {clima.main.temp} °C</Text>
        <Text style={styles.ubicacion}>Ubicación: {clima.name}</Text>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.aboutButton} onPress={acercaDe}>
            <Text style={styles.aboutButtonText}>About</Text>
          </TouchableOpacity>
      </View>

    </View>
    
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
    backgroundColor: '#f0f8ff',
  },
  fecha: {
    fontSize: 24,
    marginBottom: 10,
  },
  hora: {
    fontSize: 24,
    marginBottom: 10,
  },
  clima: {
    fontSize: 18,
  },
  temperatura: {
    fontSize: 18,
  },
  ubicacion: {
    fontSize: 18,
    marginTop: 10,
  },
});
