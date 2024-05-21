import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { AppProvider } from "@/Context/AppContext";

export default function TabOneScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    const doConnection = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log({ status });
      setHasPermission(!!(status === "granted"));
    };

    try {
      doConnection();
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <AppProvider>
        <Text style={styles.title}>Read QR</Text>
        <View style={styles.separator} />

        {scanned ? (
          <View style={styles.scannedContainer}>
            <Text style={styles.scannedText}>Scanned Data: {data}</Text>
            <Button title="Rescan" onPress={() => setScanned(false)} />
          </View>
        ) : null}
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(data) => {
            if (!scanned) {
              setData(data.data);
              setScanned(true);
            }
          }}
        />
      </AppProvider>
    </View>
  );
}

// Your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  scannedContainer: {
    backgroundColor: "yellow",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
