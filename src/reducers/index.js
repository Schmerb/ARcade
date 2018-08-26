import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import config from 'config/development'

import {
  loginIsOpen
} from 'reducers/display'

const middleware = [ thunk ]
const { enabled, type } = config.logging
console.log({enabled, type})
if (enabled && type.redux) {
  console.log('logging')
  let logger = require('redux-logger').logger
  middleware.push(logger)
}

const store = createStore(
  combineReducers({
    loginIsOpen
  }),
  applyMiddleware(thunk)
)

// Hydrate the authToken from localStorage if it exist
// const authToken = loadAuthToken()
// if (authToken) {
//   const token = authToken
//   store.dispatch(setAuthToken(token))
// }

export default store
