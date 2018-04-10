import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default (Btn = props => (
  <TouchableOpacity style={props.containerStyle} onPress={props.onPress}>
    <Text style={props.txtStyle}>{props.txt}</Text>
    {props.renderRightIcon}
  </TouchableOpacity>
));
