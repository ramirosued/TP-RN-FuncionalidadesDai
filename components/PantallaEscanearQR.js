import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function EscanearQR() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dataQR, setDataQR] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const pedirPermiso = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    pedirPermiso();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setDataQR(data);
    setModalVisible(true);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: '100%', height: '70%' }}
      />
      {scanned && <Button title="Escanear nuevamente" onPress={() => setScanned(false)} />}
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Datos Escaneados: {dataQR}</Text>
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}
