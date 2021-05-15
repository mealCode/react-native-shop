import React from 'react';
import { Text, View, ScrollView, Image, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../consts/Colors';

import { addToCart } from '../../store/actions/cart' 

const ProductDetailScreen = (props) => {
  const productId = props.route.params.productId
  const selectedProduct = useSelector(state => state.products.availableProducts.find(product => product.id === productId))
  const dispatch = useDispatch()

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title="Add to Cart" onPress={() => {
          dispatch(addToCart(selectedProduct))
        }} />
      </View>
      <Text style={styles.price}>${selectedProduct.price?.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  )
}

export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.productTitle
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  price: {
    fontSize: 20,
    color: Colors.darkGray,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans'
  },
  actions: {
    marginVertical: 20,
    alignItems: 'center'
  }
});

export default ProductDetailScreen;