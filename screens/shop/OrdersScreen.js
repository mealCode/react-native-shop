import React, { useEffect, useState, useCallback } from 'react';
import { Text, FlatList, Platform, View, StyleSheet, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem';

import { fetchOrders } from '../../store/actions/orders';

import Colors from '../../consts/Colors';

const OrdersScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const orders = useSelector(state => state.orders.orders)
  const dispatch = useDispatch()

  const renderOrders = useCallback(async () => {
    setIsLoading(true)
    await dispatch(fetchOrders())
    setIsLoading(false)
  })

  useEffect(() => {
    renderOrders()
  }, [dispatch])

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (orders.length === 0 ) {
    return (
      <View style={styles.noOrders}>
        <Text>No orders found!</Text>
      </View>
    )
  }

  return ( 
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => {
        return (
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
          />
        )
      }}
    />
   );
}

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item 
            title='Menu' 
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' } 
            onPress={ () => {
              navigationData.navigation.toggleDrawer()
            } } 
          />
        </HeaderButtons>
      )
    },
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
 
export default OrdersScreen;