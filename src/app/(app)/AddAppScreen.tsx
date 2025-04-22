import { useState } from 'react';
import { Button, TextInput } from 'react-native';

import { supabase } from '@/services/supabase';

export default function AddAppScreen() {
  const [form, setForm] = useState({
    googleGroupLink: '',
    apkLink: '',
    webLink: '',
    googlePlayEmail: '',
  });

  const saveApp = async () => {
    const { data, error } = await supabase.from('apps').insert([form]);
    if (error) console.error(error);
    else console.log('App saved:', data);
  };

  return (
    <>
      <TextInput
        placeholder="Google Group Link"
        onChangeText={(text) => setForm({ ...form, googleGroupLink: text })}
      />
      <TextInput
        placeholder="APK Link"
        onChangeText={(text) => setForm({ ...form, apkLink: text })}
      />
      <TextInput
        placeholder="Web Link"
        onChangeText={(text) => setForm({ ...form, webLink: text })}
      />
      <TextInput
        placeholder="Google Play Email"
        onChangeText={(text) => setForm({ ...form, googlePlayEmail: text })}
      />
      <Button title="Save App" onPress={saveApp} />
    </>
  );
}
