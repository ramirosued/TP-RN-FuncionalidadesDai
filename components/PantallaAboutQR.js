import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function About() {
  const qrData = "DAI TP02 - 2024\nIntegrantes: Ramiro Sued, Marcos Mellevobsky";

  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState('');

  // Solicitar permisos de cámara
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScanButtonPress = () => {
    if (hasPermission === null) {
      alert('Solicitando permisos de cámara...');
    } else if (hasPermission === false) {
      alert('Permiso denegado. No se puede acceder a la cámara.');
    } else {
      setScanModalVisible(true); 
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScannedData(data);
    setScanModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acerca de</Text>
      <View style={styles.qrContainer}>
        <QRCode value={qrData} size={200} />
      </View>
      <Button title="Escanear otro QR" onPress={handleScanButtonPress} />

      <Modal
        visible={scanModalVisible}
        animationType="slide"
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Escanea el código QR</Text>
          <BarCodeScanner
            onBarCodeScanned={({ type, data }) => {
              handleBarCodeScanned({ data });
              // Aquí no cerramos el modal, solo guardamos el dato
            }}
            style={styles.scanner} 
          />
          <Button title="Cerrar" onPress={() => setScanModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        visible={!!scannedData} 
        transparent={true}
        animationType="slide"
        onRequestClose={() => setScannedData('')}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Datos escaneados</Text>
            <Text>{scannedData}</Text>
            <Button title="Cerrar" onPress={() => setScannedData('')} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanner: {
    width: '100%',
    height: '80%', 
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});
