import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface KeyboardAvoidingComponentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
// Using KeyboardAwareScrollView, the children will be wrapper with ScrollView from "react-native-gesture-handler"
export default function KeyboardAvoidingComponent({
  children,
  style,
}: KeyboardAvoidingComponentProps) {
  return (
    <KeyboardAwareScrollView
      className="h-full flex-1 overflow-y-scroll"
      style={style}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
