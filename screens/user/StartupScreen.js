import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from 'react-redux'

import { authenticate, setDidTryAL } from '../../store/actions/auth'

import Colors from '../../consts/Colors'

const StartupScreen = (props) => {
  const dispatch = useDispatch()

  const tryLogin = async () => {
    const userData = await AsyncStorage.getItem('userData')
    const transformedData = JSON.parse(userData)
    if (!userData) {
      // props.navigation.navigate('Auth')
      dispatch(setDidTryAL())
      return;
    }
    const { token, userId, expiryDate } = transformedData

    const expirationDate = new Date(expiryDate)

    if (expirationDate <= new Date() || !token || !userId) {
      // props.navigation.navigate('Auth')
      dispatch(setDidTryAL())
      return;
    }

    const expirationTime = expirationDate.getTime() - new Date().getTime()

    // props.navigation.navigate('Shop')
    dispatch(authenticate(userId, token, expirationTime))
  }

  useEffect(() => {
    tryLogin()
  }, [dispatch])

  return ( 
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
   );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
 
export default StartupScreen;