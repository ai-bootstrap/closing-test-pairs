import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type FileUploaderProps = {
  onFileSelected: (file: {
    uri: string;
    type: string;
    name: string;
    size: number;
  }) => void;
  subtitle?: string;
  disabled?: boolean;
};

// MIME type mapping for common image extensions
const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  subtitle = 'Select an image to upload',
  disabled = false,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getMimeType = (uri: string, fileName?: string): string => {
    // First try to get from filename extension
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext && MIME_TYPES[ext]) {
        return MIME_TYPES[ext];
      }
    }

    // Fallback to URI extension
    const uriExt = uri.split('.').pop()?.split('?')[0].toLowerCase();
    if (uriExt && MIME_TYPES[uriExt]) {
      return MIME_TYPES[uriExt];
    }

    // Default to jpeg if unknown
    return 'image/jpeg';
  };

  const pickImage = async () => {
    if (disabled) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: undefined,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset: any = result.assets[0];
        setSelectedImage(asset.uri);

        // Get proper MIME type
        const mimeType = getMimeType(asset.uri, asset.fileName);

        // Get file size
        const fileInfo: any = await FileSystem.getInfoAsync(asset.uri);
        const fileSize = fileInfo.size || 0;

        onFileSelected({
          uri: asset.uri,
          type: mimeType,
          name:
            asset.fileName ||
            `image-${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`,
          size: fileSize,
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    onFileSelected({ uri: '', type: '', name: '', size: 0 });
  };

  return (
    <View className="w-full">
      {selectedImage ? (
        <View className="relative">
          <Image
            source={{ uri: selectedImage as unknown as string }}
            className="h-64 w-full rounded-lg"
            resizeMode="contain"
          />
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              {selectedImage.type?.startsWith('image/')
                ? 'Image selected'
                : 'File selected'}
            </Text>
            <TouchableOpacity
              onPress={removeImage}
              className="rounded-full bg-red-50 p-2"
            >
              <Feather name="x" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          disabled={disabled || isLoading}
          className={`items-center justify-center rounded-lg border-2 border-dashed p-6 ${
            disabled
              ? 'border-gray-200 bg-gray-100'
              : 'border-gray-300 bg-gray-50'
          } ${isLoading && 'opacity-70'}`}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4361ee" />
          ) : (
            <>
              <MaterialIcons
                name="add-photo-alternate"
                size={32}
                color={disabled ? '#9ca3af' : '#4361ee'}
              />
              <Text
                className={`mt-3 text-sm font-medium ${
                  disabled ? 'text-gray-400' : 'text-gray-800'
                }`}
              >
                Select Image
              </Text>
              <Text
                className={`mt-1 text-xs ${
                  disabled ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {subtitle}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
