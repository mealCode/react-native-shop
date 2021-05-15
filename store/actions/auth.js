import AsyncStorage from "@react-native-community/async-storage";

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const setDidTryAL = () => {
  return {
    type: SET_DID_TRY_AL
  }
}

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token,
    userId,
    expiryDate: expiryDate.toISOString()
  }))
}

const clearLogoutTimer = () => {
  if (timer) {
    // build in js code
    clearTimeout(timer)
  }
}

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout())
    }, expirationTime)
  }
}

export const authenticate = (userId, token, expirtyTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expirtyTime))
    dispatch({
      type: AUTHENTICATE,
      userId,
      token
    })
  }
}


export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAO7_1dwQ4kLMVDBoQutzoddryY2Sr792A`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    })

    if (!response.ok) {
      const erroResData = await response.json()
      const errorId = erroResData.error.message;

      let message = 'Something went wrong'
      if (errorId === 'EMAIL_EXISTS') {
        message = 'Email already exists.'
      }
      throw new Error(message)
    }

    const resData = await response.json()

    const milliseconds = 1000
    const expiresIn = parseInt(resData.expiresIn) * milliseconds
    const expirationDate = new Date(new Date().getTime() + expiresIn)

    dispatch(authenticate(resData.localId, resData.idToken, expiresIn))

    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }
}

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAO7_1dwQ4kLMVDBoQutzoddryY2Sr792A`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    })

    if (!response.ok) {
      const erroResData = await response.json()
      const errorId = erroResData.error.message;

      let message = 'Something went wrong'
      if (errorId === 'EMAIL_NOT_FOUND' || errorId === 'INVALID_PASSWORD') {
        message = 'Invalid email or password.'
      }
      throw new Error(message)
    }

    const resData = await response.json()

    const milliseconds = 1000
    const expiresIn = parseInt(resData.expiresIn) * milliseconds
    const expirationDate = new Date(new Date().getTime() + expiresIn)

    dispatch(authenticate(resData.localId, resData.idToken, expiresIn))

    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
  }

}

export const logout = () => {
  clearLogoutTimer()
  AsyncStorage.removeItem('userData')
  return {
    type: LOGOUT
  }
}