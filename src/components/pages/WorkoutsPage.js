import React, { useState, useEffect, useContext  } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Fab, Grid, Paper, Typography, Zoom } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import WorkoutCard from '../elements/cards/WorkoutCard';
import WorkoutDialog from '../elements/dialogs/WorkoutDialog';

import AuthContext from '../../context/AuthContext';
import PageContext from '../../context/PageContext';

import { db } from '../../firebase/firebase';
import moment from 'moment';


const useStyles = makeStyles(theme => ({
    container: {
        height: 'calc(100% - 56px - 56px)'
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(4),
    },
    groupHeading: {
        color: 'blue',
        padding: '10px',
        width: '100%',
    },
    paper: { 
        height: '100%', 
        padding: 20,
        overflowY: 'auto' 
    },
    toolbar: theme.mixins.toolbar
}))

const WorkoutsPage = ({ history }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { authState } = useContext(AuthContext);
    const { pageState, pageDispatch } = useContext(PageContext);
    if (pageState.currentPage !== 'WORKOUTS'){
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'WORKOUTS' });
    } 

    const [workouts, setWorkouts] = useState([]);
    const [workoutDialogOpen, setWorkoutDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [workoutToEdit, setWorkoutToEdit] = useState(undefined);

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };


    useEffect(() => {
       const unsubscribe =  db.collection(`users/${authState.uid}/workouts`).onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();
            const workouts = changes.filter((change) => (change.type === 'added' || change.type === 'modified') && change.doc );
            setWorkouts(workouts);
            
        });

        return () => {
            unsubscribe();
        }

    }, [authState.uid]);

    const addWorkout = () => {
        setWorkoutDialogOpen(true);
    }

    const editWorkout = (workout) => {
        setEditMode(true);
        setWorkoutToEdit(workout);
        setWorkoutDialogOpen(true);
    }

    const deleteWorkout = () => {

    }

    const closeWorkoutDialog = () => {
        setWorkoutDialogOpen(false);
        setEditMode(false);
        setWorkoutToEdit(undefined);
    }

    return (
        <>
            <Grid container direction='row' justify='center' alignItems='center' className={classes.container}>
                { (workouts && workouts.length > 0) 
                    ?   workouts.map((workout, index) => (
                                <Grid item xs={10} key={index}>
                                    <Typography variant='h5' align='left' className={classes.groupHeading}>
                                        {moment(workout.doc.data().date.toDate()).format('MMMM Do, YYYY')}
                                    </Typography>
                                    <WorkoutCard 
                                        workout={workout.doc} 
                                        editWorkout={editWorkout} 
                                        deleteWorkout={deleteWorkout} 
                                    />
                                </Grid>
                            )
                        )
                    :   <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                    Add your first workout journal entry!
                                </Typography>
                            </Paper>
                        </Grid>
                }
            </Grid>  
            <Zoom
                in={true}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab aria-label='Add' className={classes.fab} color='secondary' onClick={addWorkout}>
                    <Add />
                </Fab>
            </Zoom>
            <WorkoutDialog
                open={workoutDialogOpen} 
                onClose={closeWorkoutDialog}
                editMode={editMode}
                workoutToEdit={workoutToEdit}
                history={history}
            />
            
        </>
    )
};

export default WorkoutsPage;