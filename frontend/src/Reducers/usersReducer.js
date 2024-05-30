export default function usersReducer(state, action){
    switch(action.type) {
        case 'SET_USER': {
            return { ...action.payload }
        }
        case 'HANDLE_LOGOUT': {
            return null
        }
        default: return {...state}
    }
}