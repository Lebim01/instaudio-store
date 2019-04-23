import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import axios from 'axios'
import { AUTH } from './routing'

const persistConfig = {
    key: 'root',
    storage,
}

const initialState = {
    lastAction : ''
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                lastAction : action.type,
                token : action.token,
                modulos : action.modulos
            }
        case 'LOGOUT':
            window.localStorage.removeItem('token')
            return initialState
            
    }

    return { ...state }
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer)
let persistor = persistStore(store)

export { store, persistor }