import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import Colors from '../../consts/Colors'

import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card'

import { removeFromCart } from '../../store/actions/cart'
import { addOrder } from '../../store/actions/orders'

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const cartTotalAmount = useSelector(state => state.cart.totalAmount)
  const cartItems = useSelector(state => {
    const transformedCartItems = []
    for (const key in state.cart.items) {
      if (Object.hasOwnProperty.call(state.cart.items, key)) {
        const element = state.cart.items[key];
        transformedCartItems.push({
          productId: key,
          productTitle: element.productTitle,
          productPrice: element.productPrice,
          quantity: element.quantity,
          sum: element.sum
        })
      }
    }
    return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1)
  })

  const dispatch = useDispatch()

  const sendOrderHandler = async () => {
    setIsLoading(true)
    await dispatch(addOrder(cartItems, cartTotalAmount))
    setIsLoading(false)
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>${Math.round(cartTotalAmount?.toFixed(2) * 100) / 100}</Text> 
        </Text>
        { isLoading ? <ActivityIndicator size="small" color={Colors.primary}/> : (
          <Button 
            color={Colors.accent} 
            title="Order Now" 
            disabled={cartItems.length === 0} 
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <View>
        <FlatList
          data={cartItems}
          keyExtractor={item => item.productId}
          renderItem={itemData => {
            return (
              <CartItem 
               quantity={itemData.item.quantity}
               title={itemData.item.productTitle}
               amount={itemData.item.sum}
               deletable
               onRemove={() => {
                dispatch(removeFromCart(itemData.item.productId))
               }}
              />
            )
          }}
        />
      </View>
    </View>
  )
}

export const screenOptions = {
  headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;