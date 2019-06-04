/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/4/2.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Keyboard,
    Image
} from 'react-native';

import res from '../../res';
import { MRTextInput as TextInput } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';

const openEyeImage = res.button.open_eye;
const closeEyeImage = res.button.close_eye;

export default class PasswordInputText extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
        secureTextEntry: true,
        text: ''
    };
  }



  componentDidMount() {
  }


  render() {
      let {secureTextEntry, text} = this.state;
      let {onChangeText, placeholder, style} = this.props;
    return (
      <View style={[styles.container,style]}>
          <TextInput
              style={styles.textInput}
              placeholder={placeholder} placeholderTextColor={DesignRule.textColor_placeholder}
              onChangeText={(text) => {this.setState({ text: text }); onChangeText && onChangeText(text)}}
              value={text}
              keyboardType={'default'}
              secureTextEntry={secureTextEntry}/>
          <TouchableOpacity
              onPress={() => {
              Keyboard.dismiss();
              this.setState({ secureTextEntry: !secureTextEntry});
          }}
              style = {styles.eyeImage }
          >
              <Image
                  source={secureTextEntry ? closeEyeImage : openEyeImage}
                  style={{ height: 15, width: 20 }}/>

          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        marginHorizontal: 30,
        flexDirection: 'row',
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 1,
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        padding: 0,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 3,
        height: 35
    },
    eyeImage: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
