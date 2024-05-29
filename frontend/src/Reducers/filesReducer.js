export default function filesReducer(state, action){
    switch(action.type) {
        case 'SET_FILES': {
            return {...state, data: [...action.payload]}
        }
        case 'SET_SERVER_ERRORS': {
            return {...state, serverErrors: action.payload}
        }
        case 'ADD_FILE': {
            return {...state, data: [...state.data, action.payload]}
        }
        default: return {...state}
    }
}