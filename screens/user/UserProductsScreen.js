import React from 'react';
import { View, FlatList, Platform, Button, Alert, Text, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem'
import HeaderButton from '../../components/UI/HeaderButton'

import Colors from '../../consts/Colors';

import { deleteProduct } from '../../store/actions/products'

const UserProductScreen = ({ navigation }) => {
  const userProducts = useSelector(state => state.products.userProducts)

  const dispatch = useDispatch()

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      { text: 'Yes', style: 'destructive', onPress: () => {
        dispatch(deleteProduct(id))
      }}
    ])
  }
  

  const editProductHandler = (id) => {
    navigation.navigate({
      name: 'EditProduct',
      params: {
        productId:id
      }
    })
  }

  if (userProducts.length === 0 ) {
    return (
      <View style={styles.noProducts}>
        <Text>No products found!</Text>
      </View>
    )
  }

  return ( 
    <FlatList 
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData => {
        return (
          <ProductItem 
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {}}
          >
            <Button 
            color={Colors.primary}
            title="Edit" 
            onPress={() => editProductHandler(itemData.item.id)} />

            <Button 
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)} />
          </ProductItem>
        )
      }}
    />
   );
}

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'Your products',
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
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item 
            title='Menu' 
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create' } 
            onPress={ () => {
              navigationData.navigation.navigate('EditProduct')
            } } 
          />
        </HeaderButtons>
      )
    }
  }
}
 

const styles = StyleSheet.create({
  noProducts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default UserProductScreen;