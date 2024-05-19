import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CameraView } from "expo-camera";
import { AppProvider } from "@/Context/AppContext";

export default function TabOneScreen() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const doConnection = async () => {
      const { status } = await Camera.requestPermissionsAsync();
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
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(data) => {
            console.log(data);
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
});
