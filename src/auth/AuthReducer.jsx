import { types } from '../types/types';

// const state = {
//     name: 'Juan',
//     logged: true,
// }

const AuthReducer = (state = { }, action) => {
    switch (action.type) {
        case types.login:
            return {
                ...action.payload,
                logged: true
            }
        case types.logout:
            return {
                logged: false,
            }

        default:
            return state;

    }
}

export default AuthReducer;

