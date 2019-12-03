import { auth } from '../firebase/firebase';

const authReducer = (state, action) => {
    
    switch (action.type){
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            };
        case 'LOGOUT':
            auth.signOut();
            return {};
        default:
            return state;
    }
}

export default authReducer;