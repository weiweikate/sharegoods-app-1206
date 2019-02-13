import React from 'react';
import ImageLoad from '@mr/image-placeholder';

export default ({ style, source, borderRadius }) => <ImageLoad
    style={style}
    source={source}
    borderRadius={borderRadius}
    isAvatar={true}
/>
