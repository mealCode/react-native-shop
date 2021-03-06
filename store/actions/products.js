import Product from '../../models/product'

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = (param) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    try {
      const response = await fetch('https://shop-ba0c8-default-rtdb.firebaseio.com/products.json')
      
      if (!response.ok) {
        throw new Error('Error')
      }

      const resData = await response.json()
      const loadedProducts = []
      
      for (const key in resData) {
        if (Object.hasOwnProperty.call(resData, key)) {
          const element = resData[key];
          loadedProducts.push(
            new Product(
              key,
              element.owerId,
              element.title,
              element.imageUrl,
              element.description,
              element.price
            )
          )

        }
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      })
    } catch (err) {
      // send to anyletics
      throw err;
    }
  }

}


export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(`https://shop-ba0c8-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Something went wrong!')
    }

    dispatch({
      type: DELETE_PRODUCT,
      pid: productId
    })
  }
}

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.userId
    const response = await fetch(`https://shop-ba0c8-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
        owerId: userId
      })
    })

    const resData = await response.json()

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    })
    
  }
}

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const response = await fetch(`https://shop-ba0c8-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl
      })
    })

    if (!response.ok) {
      throw new Error('Something went wrong!')
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    })
  }
}
