import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input'
import Colors from '../../consts/Colors';

import { createProduct, updateProduct } from '../../store/actions/products'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const prodId = props.route.params ? props.route.params.productId : null
  const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId))

  const dispatch = useDispatch()
  
  const [formState, dispatchFormState] = useReducer(formReducer, { 
  inputValues: {
    title: editedProduct ? editedProduct.title : '',
    imageUrl: editedProduct ? editedProduct.imageUrl : '',
    description: editedProduct ? editedProduct.description : '',
    price: ''
  }, 
  inputValidities: {
    title: editedProduct ? true : false,
    imageUrl: editedProduct ? true : false,
    description: editedProduct ? true : false,
    price: editedProduct ? true : false
  }, 
  formIsValid: editedProduct ? true : false 
})



  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Invalid input', 'All fields are required.', [
        { 'text': 'Ok'}
      ])
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      if (editedProduct) {
        await dispatch(
          updateProduct(
            prodId, 
            formState.inputValues.title, 
            formState.inputValues.description, 
            formState.inputValues.imageUrl
          )
        )
      } else {
        await dispatch(
          createProduct(
            formState.inputValues.title, 
            formState.inputValues.description, 
            formState.inputValues.imageUrl, 
            +formState.inputValues.price
          )
        )
      }
    props.navigation.goBack()
    } catch (err) {
      setError(err.message)
    }

    setIsLoading(false)
  }, [editedProduct, dispatch, prodId, formState])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () =>  (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item 
            title='Save' 
            iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark' } 
            onPress={submitHandler} 
          />
        </HeaderButtons>
      )
    })
  }, [submitHandler])

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [
        { text: 'Ok' }
      ])
    }
  }, [error])

  /**
   * 
   * @param {field} inputIdentifier 
   * @param {value} text 
   * 
   */
  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({ 
      type: FORM_INPUT_UPDATE, 
      value: inputValue, 
      isValid: inputValidity, 
      input: inputIdentifier
    })
  }, [dispatchFormState])

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return ( 
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : null} 
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input 
            id="title"
            label="Title"
            placeholder="product title"
            errorText="Product title is required!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required

          />
          <Input  
            id="imageUrl"
            label="Image Url"
            placeholder="product image url"
            errorText="Product image url is required!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
          />
          { editedProduct ? null : (
              <Input 
                id="price"
                label="Price"
                placeholder="product price"
                errorText="Product price is required!"
                keyboardType="decimal-pad"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                required
                min={0}
              />
            )
          }
          <Input 
            id="description"
            label="Description"
            placeholder="product price"
            errorText="Product description is required!"
            keyboardType="default"
            returnKeyType="done"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
   );
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const screenOptions = (navigationData) => {
  const routeParams = navigationData.route.params ? navigationData.route.params : {}
  return {
    headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product'
  }
}
 
export default EditProductScreen;