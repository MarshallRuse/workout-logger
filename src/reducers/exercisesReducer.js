const exercisesReducer = (state, action) => {
    switch (action.type){
        case 'SET_EXERCISES':
            return {
                ...state,
                exercises: action.exercises
            }
        case 'SET_SELECTED_EXERCISE':
            return {
                ...state,
                selectedExercise: action.selectedExercise
            }
        default:
            return state;
    }
}

export default exercisesReducer;