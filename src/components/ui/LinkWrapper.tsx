// LinkWrapper.tsx
import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';

import { Modal, useModal } from '@/components/ui'; // 导入自定义的 useModal 钩子

interface LinkWrapperProps {
  src: string; // 链接
  children: React.ReactNode; // 显示的文本
  style?: StyleProp<TextStyle>; // 可选的样式
}

const LinkWrapper: React.FC<LinkWrapperProps> = ({ src, children, style }) => {
  const modal = useModal(); // 使用自定义的 useModal 钩子

  // 点击时展示模态
  const handlePress = () => {
    modal.present();
  };

  return (
    <>
      <Text
        style={[{ color: 'blue' }, style]} // 超链接样式
        onPress={handlePress} // 点击事件
      >
        {children}
      </Text>
      <Modal ref={modal.ref} snapPoints={['80%']}>
        <WebView source={{ uri: src }} className="flex-1" />
      </Modal>
    </>
  );
};

export default LinkWrapper;
