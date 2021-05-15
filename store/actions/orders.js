import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {

  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    try {
      const response = await fetch(`https://shop-ba0c8-default-rtdb.firebaseio.com/orders/${userId}.json`)
      
      if (!response.ok) {
        throw new Error('Error')
      }

      const resData = await response.json()
      const loadedOrders = []
      
      for (const key in resData) {
        if (Object.hasOwnProperty.call(resData, key)) {
          const element = resData[key];
          loadedOrders.push(
            new Order(
              key,
              element.cartItems,
              element.totalAmount,
              new Date(element.date)
            )
          )

        }
      }

      dispatch({
        type: SET_ORDERS,
        orders: loadedOrders
      })

    } catch (err) {
      throw err
    }
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.userId
    const date = new Date().toISOString()
    const response = await fetch(`https://shop-ba0c8-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date
      })
    })

    const resData = await response.json()

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date
      }
    })
  }
}