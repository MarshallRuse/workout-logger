import React, { useContext  } from 'react';

import ExercisesList from '../elements/ExercisesList';

import PageContext from '../../context/PageContext';

const ExerciseSelectionPage = ({ match }) => {
    const { pageState, pageDispatch } = useContext(PageContext);

    if (pageState.currentPage !== 'EXERCISE_SELECTION'){
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'EXERCISE_SELECTION' });
    } 

    return (
        <>
            <ExercisesList context={'selection'} workoutID={match.params.workoutID} />
        </>
    )
};

export default ExerciseSelectionPage;