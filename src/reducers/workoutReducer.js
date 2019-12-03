const workoutReducer = (state, action) => {
    switch(action.type){
        case 'SET_WORKOUT':
            return {
                ...state,
                currentWorkout: action.currentWorkout
            }
        case 'CLEAR_WORKOUT':
            return {
                ...state,
                currentWorkout: undefined
            }
        default:
            return state;
    }
}

export default workoutReducer;