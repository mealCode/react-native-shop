import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableNativeFeedback, 
  Platform 
} from 'react-native';

import Card from '../UI/Card'

import Colors from '../../consts/Colors';

const ProductItem = ({
  image,
  title,
  price,
  onViewDetail,
  children
}) => {

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={onViewDetail} useForeground >
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.price}>{price?.toFixed(2)}</Text>
            </View>
            <View style={styles.actions}>
              {children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  )
}



const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20
  },
  touchable: {
    overflow: 'hidden',
    borderRadius: 10
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
    fontFamily: 'open-sans-bold'
  },
  price: {
    fontSize: 14,
    color: Colors.darkGray,
    fontFamily: 'open-sans'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10
  }
});

export default ProductItem;