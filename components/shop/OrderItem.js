import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import Colors from '../../consts/Colors';
import CartItem from './CartItem';
import Card from '../UI/Card'

const OrderItem = ({ amount, date, items }) => {
  const [showDetails, setShowDetails] = useState(false)

  return ( 
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${amount?.toFixed(2)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button 
        color={Colors.primary} 
        title={ showDetails ?  "Hide Details" : "Show Details" }
        onPress={() => {
          setShowDetails(prevState => !prevState)
        }} />

        {showDetails && <View style={styles.detailItems}>
          { items.map(cartItem => {
            return <CartItem 
              key={cartItem.productId}
              quantity={cartItem.quantity} 
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          }) }
        </View>}

    </Card>
   );
}

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: Colors.darkGray
  },
  detailItems: {
    width: '100%'
  }
});
 
export default OrderItem;