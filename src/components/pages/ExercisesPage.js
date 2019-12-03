import React, { useState, useContext  } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import { 
    Fab, 
    Zoom, 
    } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import ExercisesList from '../elements/ExercisesList';
import ExerciseDialog from '../elements/dialogs/ExerciseDialog';

import PageContext from '../../context/PageContext';


const useStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(4),
        zIndex: 100
    },
}));

const ExercisesPage = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { pageState, pageDispatch } = useContext(PageContext);

    if (pageState.currentPage !== 'EXERCISES'){
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'EXERCISES' });
    } 

    const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);


    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const addExercise = () => {
        setExerciseDialogOpen(true);
    }

    const closeExerciseDialog = () => {
        setExerciseDialogOpen(false);
    }

    return (
        <>
            <ExercisesList context='main-page' />

            <Zoom
                in={true}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab aria-label='Add' className={classes.fab} color='secondary' onClick={addExercise}>
                    <Add />
                </Fab>
            </Zoom>

            <ExerciseDialog
                open={exerciseDialogOpen} 
                onClose={closeExerciseDialog}
                editMode={false}
            />
        </>
    )
};

export default ExercisesPage;