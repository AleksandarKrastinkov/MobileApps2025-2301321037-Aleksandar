import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import LoadingOverlay from '../components/LoadingOverlay';
import { identifyPlant } from '../services/plantIdentification';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const analyzePlant = async () => {
    if (!capturedImage) return;

    setLoading(true);
    try {
      const result = await identifyPlant(capturedImage);
      navigation.navigate('ScanResult', {
        imageUri: capturedImage,
        plantData: result,
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to identify plant. Please try again.',
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
    }
  };

  if (!permission) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <Text style={styles.text}>Requesting camera permission...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (!permission.granted) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <Ionicons name="camera-outline" size={64} color="#ff4444" />
            <Text style={styles.text}>No access to camera</Text>
            <Text style={styles.subtext}>
              Please enable camera permissions
            </Text>
            <TouchableOpacity
              onPress={requestPermission}
              style={styles.permissionButton}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {loading && <LoadingOverlay message="Analyzing plant..." />}
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Plant</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Camera Preview or Captured Image */}
        <View style={styles.cameraWrapper}>
          {capturedImage ? (
            <Image source={{ uri: capturedImage }} style={styles.preview} />
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
              />
              <View style={styles.overlay}>
                <View style={styles.scanFrame} />
              </View>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {capturedImage ? (
            <>
              <TouchableOpacity
                onPress={retakePicture}
                style={styles.controlButton}
              >
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.controlText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={analyzePlant}
                style={styles.analyzeButton}
              >
                <Ionicons name="sparkles" size={32} color="#fff" />
                <Text style={styles.analyzeText}>Analyze</Text>
              </TouchableOpacity>
              <View style={styles.placeholder} />
            </>
          ) : (
            <>
              <View style={styles.placeholder} />
              <TouchableOpacity
                onPress={takePicture}
                style={styles.captureButton}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setFacing(facing === 'back' ? 'front' : 'back')
                }
                style={styles.flipButton}
              >
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  subtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  cameraWrapper: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 3,
    borderColor: '#00ff88',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  analyzeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  analyzeText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  flipButton: {
    padding: 12,
  },
  permissionButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00ff88',
    borderRadius: 15,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CameraScreen;

