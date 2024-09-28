import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function About() {
  const data = "DAI TP02 - React Native - 2024";

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text>About</Text>
      <QRCode value={data} size={200} />
    </View>
  );
}
