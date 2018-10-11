import React from 'react'
import { View } from 'react-native'

export default ({style,backgroundStyle, fillStyle, progress}) => <View style={[style, backgroundStyle]}>
  <View style={[fillStyle, { width: style.width * progress }]}/>
</View>

