import React, { createContext, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

interface AppContextInterface {
  hasCameraPermission: boolean | null;
  qrData: string | null;
  requestCameraPermission: () => Promise<void>;
  handleBarCodeRead: ({ data }: { data: string }) => void;
}

export const AppContext = createContext<AppContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [qrData, setQrData] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasCameraPermission(true);
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleBarCodeRead = ({ data }: { data: string }) => {
    setQrData(data);
  };

  return (
    <AppContext.Provider
      value={{
        hasCameraPermission,
        qrData,
        requestCameraPermission,
        handleBarCodeRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
