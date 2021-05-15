import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, Button, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'

import { signup, login } from '../../store/actions/auth'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../consts/Colors';

export const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      if (Object.hasOwnProperty.call(updatedValidities, key)) {
        const element = updatedValidities[key];
        updatedFormIsValid = updatedFormIsValid && element //both should be true
      }
    }
    /**
     * i didn't copy @state here
     * bec. in this case, i replace the entire state
     * other you should copy @state by ...state
     */
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    }
  }
  return state;
}

const AuthScreen = (props) => {
  const dispatch = useDispatch()
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const [formState, dispatchFormState] = useReducer(formReducer, { 
    inputValues: {
     email: '',
     password: ''
    }, 
    inputValidities: {
      email: false,
      password: false
    }, 
    formIsValid: false 
  })

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'Ok'}
      ])
    }
  }, [error])
  
  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = signup(formState.inputValues.email, formState.inputValues.password)
    } else {
      action = login(formState.inputValues.email, formState.inputValues.password)
    }

    setError(null)
    setIsLoading(true)
    try {
      await dispatch(action)
      // props.navigation.navigate('Shop')
    } catch (err) {
      setError(err.message)
      setIsLoading(false) 
    }
  }
  

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({ 
      type: FORM_INPUT_UPDATE, 
      value: inputValue, 
      isValid: inputValidity, 
      input: inputIdentifier
    })
  }, [dispatchFormState])

  return ( 
    <KeyboardAvoidingView
      behavior={(Platform.OS === 'ios')? "padding" : null}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input 
              id="email" 
              label="Email" 
              placeholder="your email" 
              required 
              email 
              errorText="Invalid email" 
              autoCapitalize="none"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input 
              id="password" 
              label="Password" 
              placeholder="your password" 
              secureTextEntry
              required 
              autoCapitalize="none"
              minLength={5}
              errorText="Invalid password" 
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              { isLoading ? <ActivityIndicator size="small" color={Colors.primary} /> : (
                <Button
                title={isSignup ? "Sign Up" : "Login"}
                color={Colors.primary}
                onPress={authHandler}
              />
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState)
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10
  }
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "Login"
  }
}
 
export default AuthScreen;