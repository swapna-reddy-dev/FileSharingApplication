export default function sharedFilesReducer(state, action){
    switch(action.type) {
        case 'SET_SHARED_FILES': {
            return {...state, data: [...action.payload]}
        }
        case 'SET_SERVER_ERRORS': {
            return {...state, serverErrors: action.payload}
        }
        default: return {...state}
    }
}