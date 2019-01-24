import React from 'react'
import { Image } from 'react-native'
import ImageLoad from '@mr/image-placeholder'
import res from '../../comm/res'

export default ({style, source, borderRadius}) =>  <ImageLoad
  style={style}
  source={source}
  borderRadius={borderRadius}
  renderPlaceholder={()=><Image style={style} source={res.placeholder.defaultAvator}/>}
/>
