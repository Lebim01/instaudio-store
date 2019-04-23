import { AUTH_LOGOUT, AUTH_CHECK } from 'react-admin';
import axios from 'axios'
import { AUTH } from './routing'
import {store} from 'store'

export default (type, params) => {
    if (type === AUTH_LOGOUT) {
        return Promise.resolve();
    }
    if (type === AUTH_CHECK) {
        return new Promise(async (resolve, reject) => {
            let token = localStorage.getItem('token')
            if(token){
                try {
                    let headers = { headers: {'Content-Type': 'application/json;charset=UTF-8'} }
                    let { data } = await axios.post(AUTH, { token : token }, headers)
                    if(data.status == 200){
                        let state = store.getState()
                        if(!state.token){
                            store.dispatch({
                                type : 'LOGIN',
                                ...data
                            })
                        }

                        resolve()
                    }else{
                        reject()
                    }
                }catch(e){
                    reject()
                }
            }else{
                reject()
            }
        })
    }
    return Promise.resolve();
}