import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button, TouchableOpacity  } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Contactos({navigation}) {
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

    const cleanPhoneNumber1 = phoneNumber.replace('+54911', '').replace('+54 9 11', '') ;
    const cleanPhoneNumber2 = cleanPhoneNumber1.replace(/\D/g, '');

    const cleanEmergencyNumber = numeroEmergencia 
    ? numeroEmergencia.replace('54911', '').replace(/\D/g, '').replace('911', '') 
    : null;
    
    console.log(cleanPhoneNumber2)

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

  const acercaDe = async () => {
    navigation.navigate('PantallaAboutQR'); 
  };

  return (
    <FlatList
      data={contactos}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          
          <Text style={styles.welcome}>Tus contactos</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.aboutButton} onPress={acercaDe}>
              <Text style={styles.aboutButtonText}>About</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'flex-end',
    margin: 10,
    width: 70,
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
