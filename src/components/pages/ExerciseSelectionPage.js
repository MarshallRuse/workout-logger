import React, { useContext  } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { 
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ArrowBack } from '@material-ui/icons';

import ExercisesList from '../elements/ExercisesList';

import PageContext from '../../context/PageContext';
import WorkoutContext from '../../context/WorkoutContext';

const useStyles = makeStyles(theme => ({
    backButtonRow: {
        backgroundColor: 'rgb(103, 103, 103)',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 400,
        padding: '20px',
        width: '100%'
    },
    link: {
        alignItems: 'center',
        display: 'flex',
        float: 'left',
        paddingTop: '5px',
        textDecoration: 'none',
    },
}))

const ExerciseSelectionPage = ({ match }) => {
    const classes = useStyles();
    const { pageState, pageDispatch } = useContext(PageContext);
    const { workoutState } = useContext(WorkoutContext);

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