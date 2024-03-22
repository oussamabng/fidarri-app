import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { CameraType, Camera, FlashMode } from "expo-camera";

import { Entypo } from "@expo/vector-icons";

import { primary } from "@/constants/Colors";
import { useRegisterStore } from "@/store/useRegisterStore";
import Loading from "@/components/loading";

const ScanId = () => {
  const router = useRouter();

  const { addImage } = useRegisterStore((state: any) => ({
    addImage: state.addImage,
  }));

  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);

  const cameraRef = useRef<any>(null);

  const getPermissions = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === "granted");
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current?.takePictureAsync();
        setImage(data.uri);
      } catch (error) {}
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  if (hasCameraPermission === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loading size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        paddingBottom: 80,
      }}
    >
      <StatusBar barStyle="light-content" />

      {!image ? (
        <Camera
          ref={cameraRef}
          style={{
            flex: 1,
            borderRadius: 20,
          }}
          type={type}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
              paddingVertical: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            >
              <Entypo name="retweet" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFlash(
                  flash === FlashMode.off ? FlashMode.torch : FlashMode.off
                );
              }}
            >
              <Entypo
                name="flash"
                size={28}
                color={flash === FlashMode.off ? "#F1F1F1" : "gold"}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Image
          source={{ uri: image }}
          style={{
            flex: 1,
          }}
        />
      )}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 30,
        }}
      >
        {image ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={{
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 99999999,
                padding: 10,
                backgroundColor: "#D76262",
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="cross" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                addImage(image);
                router.replace("/freelancer/(auth)/idChecked");
              }}
              style={{
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 99999999,
                padding: 10,
                backgroundColor: "#46A56B",
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="check" size={28} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={takePicture}
            style={{
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 99999999,
              padding: 10,
              backgroundColor: primary,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="camera" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ScanId;
