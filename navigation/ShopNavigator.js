import React from 'react';
import { Platform, Button, SafeAreaView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'

import ProductsOverviewScreen, { screenOptions as productOverviewScreenOptions } from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen, { screenOptions as prodDetailScreenOptions } from '../screens/shop/ProductDetailScreen';
import CartScreen, { screenOptions as cartScreenOptions } from '../screens/shop/CartScreen'
import OrdersScreen, { screenOptions as ordersScreenOptions } from '../screens/shop/OrdersScreen';
import UserProductScreen, { screenOptions as userProductScreenOptions } from '../screens/user/UserProductsScreen';
import EditProductScreen, { screenOptions as editProductScreenOptions } from '../screens/user/EditProductScreen'
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/user/AuthScreen'

import Colors from '../consts/Colors';

import { logout } from '../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTintColor: Platform.OS === 'android' ? Colors.white : Colors.primary,
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  }
}

const ProductsStackNavigator = createStackNavigator()
const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen 
        name="ProductsOverview" 
        component={ProductsOverviewScreen} 
        options={productOverviewScreenOptions}
      />
      <ProductsStackNavigator.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={prodDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen 
        name="Cart" 
        component={CartScreen} 
        options={cartScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  )
}

const OrdersStackNavigator = createStackNavigator()
export const OrdersNavigator = () => {
  return (
    <OrdersStackNavigator.Navigator>
      <OrdersStackNavigator.Screen 
        name="Orders"
        component={OrdersScreen} 
        options={ordersScreenOptions}
      />
    </OrdersStackNavigator.Navigator>
  )
}

const AdminStackNavigator = createStackNavigator()
const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen 
        name="UserProducts"
        component={UserProductScreen}
        options={userProductScreenOptions}
      />
       <AdminStackNavigator.Screen 
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
    </AdminStackNavigator.Navigator>
  )
}

const ShopDrawerNavigator = createDrawerNavigator()
export const ShopNavigator = () => {
  const dispatch = useDispatch()

  return (
    <ShopDrawerNavigator.Navigator 
      drawerContent={ props => {
        return (
          <View style={{ flex: 1, paddingTop: 20}}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never'}}>
              <DrawerItemList {...props} />
              <Button title="Logout" color={Colors.primary} onPress={() => {
                dispatch(logout())
                // props.navigation.navigate('Auth')
              }} />
            </SafeAreaView>
          </View>
        )
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <ShopDrawerNavigator.Screen 
        name="Products"
        component={ProductsNavigator}
        options={{
          // side drawer icons
          drawerIcon: props => (
            <Ionicons 
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' } 
              size={23}
              color={props.color}  
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen 
        name="Orders"
        component={OrdersNavigator}
        options={{
          // side drawer icons
          drawerIcon: props => (
            <Ionicons 
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list' } 
              size={23}
              color={props.color}  
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen 
        name="Admin"
        component={AdminNavigator}
        options={{
          // side drawer icons
          drawerIcon: props => (
            <Ionicons 
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create' } 
              size={23}
              color={props.color}  
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  )
}

const AuthStackNavigator = createStackNavigator()
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen 
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  )
}