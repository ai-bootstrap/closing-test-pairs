import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { AppState } from 'react-native';

import { Env } from '@/lib/env';
import storage from '@/lib/storage';

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

export const uploadFileToSupabaseByUri = async (
  fileUri,
  bucket,
  contentType
) => {
  try {
    const filename = `${Date.now()}.${contentType.split('/')[1]}`;
    // 获取文件信息
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      console.error('文件不存在');
      return null;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: 'audio-file.m4a',
      type: 'audio/m4a',
    });

    // 上传文件到 Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, formData);

    if (error) {
      console.error('上传失败', error);
      return null;
    }

    const publicURL = await getPublicURL(data.path, bucket);
    console.log('文件上传成功', data, publicURL);

    return { data, publicURL };
  } catch (error) {
    console.log(error, 'error uploading to supabase');
  }
};

export async function getPublicURL(dataPath: string, bucket: string) {
  // 获取文件的公共链接
  const data = supabase.storage.from(bucket).getPublicUrl(dataPath);

  if (data.data.publicUrl) {
    return data.data.publicUrl;
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
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]); // 只保留 base64 部分
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  // 将 blob 数据转换为 base64 字符串并写入文件
  await FileSystem.writeAsStringAsync(
    fileUri,
    await blobToBase64(response.data),
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  return fileUri;
}
