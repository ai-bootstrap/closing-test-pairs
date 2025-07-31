import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import { AppState } from 'react-native';

import { SUPABASE_BUCKET_NAME } from '@/constants';
import { Env } from '@/lib/env';
import storage from '@/lib/storage';
import { getMD5Hash } from '@/utils/crypto';

export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getCurrentUserAnnoAuthorization = async () => {
  const u = await supabase.auth.getSession();
  return u.data.session?.access_token;
};

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type UploadResult = {
  path: string;
  publicURL: string;
} | null;

export const uploadFileToSupabaseByUri = async (
  fileUri: string,
  bucket: string,
  contentType: string,
  originalFilename?: string
): Promise<UploadResult> => {
  try {
    // 1. Validate file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error(`File not found at URI: ${fileUri}`);
    }

    // 2. Generate filename preserving original extension when possible
    const fileInfoArr = originalFilename?.split('.') || [];
    const fileExtension =
      fileInfoArr[fileInfoArr.length - 1] || contentType.split('/')[1] || 'bin';
    const fileRawName = fileInfoArr[0];
    const md5 = await getMD5Hash(fileUri);
    const filename = `/audit/${fileRawName}_${md5}_${dayjs().toISOString()}.${fileExtension}`; // audit is folder

    // 3. Create FormData with proper file metadata
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: contentType,
    } as any); // Type assertion for React Native FormData

    // 4. Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, formData);

    if (error || !data) {
      throw error || new Error('Upload failed: No data returned');
    }

    // 5. Get public URL
    const publicUrl = await getPublicURL(data.path, bucket);
    if (!publicUrl) {
      throw new Error('Failed to generate public URL');
    }

    return {
      path: data.path,
      publicURL: publicUrl,
    };
  } catch (error) {
    console.error(`Upload failed for ${fileUri}:`, error);
    throw error; // Re-throw to allow caller to handle
  }
};

export async function getPublicURL(dataPath: string, bucket: string) {
  // 获取文件的公共链接
  const resp = supabase.storage.from(bucket).getPublicUrl(dataPath);

  if (resp.data.publicUrl) {
    return resp.data.publicUrl;
  } else {
    console.error('获取公共链接失败');
    return null;
  }
}

export async function downloadWmaFile(dataPath: string) {
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET_NAME)
    .download(dataPath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  // 获取文件的 blob URL
  const url = URL.createObjectURL(data);
  // 使用 axios 下载文件
  const response = await axios.get(url, { responseType: 'blob' });
  console.log(11111, data, response.data);

  // 定义临时文件路径
  const fileUri = `${FileSystem.cacheDirectory}${dataPath}`;
  // 将 blob 数据转换为 base64 字符串
  const blobToBase64 = (blob: any) => {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result?.split(',')[1]); // 只保留 base64 部分
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  // 将 blob 数据转换为 base64 字符串并写入文件
  await FileSystem.writeAsStringAsync(
    fileUri,
    (await blobToBase64(response.data)) as string,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  return fileUri;
}
