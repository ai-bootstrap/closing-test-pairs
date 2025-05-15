import type { ImageProps } from 'expo-image';
import { Image as NImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import ImageView from 'react-native-image-viewing';

export type ImgProps = ImageProps & {
  className?: string;
};

cssInterop(NImage, { className: 'style' });

export const Image = ({
  style,
  className,
  placeholder = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  source,
  ...props
}: ImgProps) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.8}>
        <NImage
          className={className}
          placeholder={placeholder}
          style={style}
          source={source}
          {...props}
        />
      </TouchableOpacity>

      <ImageView
        images={[{ uri: typeof source === 'object' ? source.uri : source }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </>
  );
};

export const preloadImages = (sources: string[]) => {
  NImage.prefetch(sources);
};
