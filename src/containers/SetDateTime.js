import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import Btn from '../components/Btn';

export default (DateTimePickerTester = (props) => {
  const { setDate, date } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <DatePicker
          onDateChange={setDate}
          style={{
            width: 70,
            height: 13,
            backgroundColor: '#1da1f2',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
          date={date}
          mode="datetime"
          placeholder="select date"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              display: 'none',
            },
            dateInput: {
              height: 12,
              borderWidth: 0,
              alignSelf: 'flex-start',
            },
            dateText: {
              fontSize: 6,
              color: 'white',
            },
            placeholderText: {
              fontSize: 7,
              color: 'white',
            },
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontStyle: 'italic', fontSize: 6 }}>
          *Set Time for the match , Both Team players will be notifyed by this time*
        </Text>
      </View>
    </View>
  );
});