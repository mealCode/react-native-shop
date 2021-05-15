import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, Platform, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton'

import { addToCart } from '../../store/actions/cart' 
import { fetchProducts } from '../../store/actions/products'

import Colors from '../../consts/Colors';

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing]= useState(false)
  const [error, setError] = useState()
  const products = useSelector(state => state.products.availableProducts)
  const dispatch = useDispatch()

  const loadProducts = useCallback(async() => {
    setError(null)
    setIsRefreshing(true)
    try {
      await dispatch(fetchProducts())
    } catch (err) {
      setError(err.message)
    }
    setIsRefreshing(false)
  })

  /**
   * refetch @loadProducts on navigation revisits
   */
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = props.navigation.addListener('focus', loadProducts)
    setIsLoading(false)

    return () => {
      unsubscribe()
    }
  }, [loadProducts])

  useEffect(() => {
    loadProducts()
  }, [dispatch])

  const selectItemHandler = (id, title) => {
    props.navigation.navigate({
      name: 'ProductDetail',
      params: {
        productId: id,
        productTitle: title
      }
    })
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Something went wrong with fetching products</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products available.</Text>
      </View>
    )
  }

  const productItem = (itemData) => {
    return (
      <ProductItem
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        price={itemData.item.price}
        onViewDetail={() => selectItemHandler(itemData.item.id, itemData.item.title)}
      >
        <Button 
          color={Colors.primary}
          title="View Details" 
          onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)} />
        <Button 
          color={Colors.primary}
          title="Add To Cart"
          onPress={() => dispatch(addToCart(itemData.item))} />

      </ProductItem>
    )
  }
  return (
    <FlatList 
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={item => item.id}
      renderItem={productItem}
    />
  )
}

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'All Products',
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
            title='Cart' 
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' } 
            onPress={ () => {
              navigationData.navigation.navigate('Cart')
            } } 
          />
        </HeaderButtons>
      )
    }
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default ProductsOverviewScreen;
