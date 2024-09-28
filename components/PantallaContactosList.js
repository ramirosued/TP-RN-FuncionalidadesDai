import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importa useFocusEffect
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [numeroEmergencia, setNumeroEmergencia] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const obtenerNumeroEmergencia = async () => {
        const numero = await AsyncStorage.getItem('numeroEmergencia');
        console.log('Número de emergencia:', numero);
        setNumeroEmergencia(numero);
      };

      const obtenerContactos = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          });

          if (data.length > 0) {
            setContactos(data);
          } else {
            Alert.alert('No se encontraron contactos');
          }
        } else {
          Alert.alert('Permiso denegado', 'No se puede acceder a los contactos');
        }
      };

      obtenerNumeroEmergencia(); 
      obtenerContactos(); 
    }, []) 
  );

  const renderItem = ({ item }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'Sin número';

    // Remover el prefijo +54911 para la comparación
    const cleanPhoneNumber1 = phoneNumber.replace('+54911', '').replace('+54 9 11', '') ;
    const cleanPhoneNumber2 = cleanPhoneNumber1.replace(/\D/g, '');

    const cleanEmergencyNumber = numeroEmergencia 
    ? numeroEmergencia.replace('54911', '').replace(/\D/g, '').replace('911', '') 
    : null;
    
    console.log(cleanPhoneNumber2)
    // Verificar si los números son igualess
    const isEmergencyNumber = cleanEmergencyNumber && cleanPhoneNumber2.includes(cleanEmergencyNumber);
    console.log(isEmergencyNumber)

    return (
      <View style={styles.contacto}>
        <Text>{item.firstName} {item.lastName}</Text>
        <View style={styles.numeroContainer}>
          <Text>{phoneNumber}</Text>
          {isEmergencyNumber && (
            <Ionicons name="checkmark-circle" size={20} color="green" />
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={contactos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.welcome}>Tus contactos</Text>}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contacto: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  numeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
