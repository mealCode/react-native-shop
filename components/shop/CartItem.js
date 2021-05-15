import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler'

import Colors from '../../consts/Colors'

const CartItem = ({ onRemove, title, quantity, amount, deletable }) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback
  }
  console.log(quantity)
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{quantity} </Text>
        <Text styles={styles.mainText}>{title}</Text>
      </View>
      <View style={styles.wrapper}>
        <View styles={styles.itemData}>
          <Text styles={styles.mainText}>${amount?.toFixed(2)}</Text>
        </View>
        <View>
          { deletable && <TouchableComponent onPress={onRemove} style={styles.deleteButton}>
            <Ionicons
              name="md-trash"
              size={16}
              color={Colors.primary}
            />
          </TouchableComponent>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16
  },
  mainText: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  deleteButton: {
    marginLeft: 20
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})

export default CartItem;