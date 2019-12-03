import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Fab,
    Grid, 
    Paper,
    Typography,
    Zoom,
    Toolbar
} from '@material-ui/core'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Add, ArrowBack } from '@material-ui/icons'; 

import moment from 'moment';

import ExerciseInstanceCard from '../elements/cards/ExerciseInstanceCard';

import AuthContext from '../../context/AuthContext';
import WorkoutContext from '../../context/WorkoutContext';

import { db } from '../../firebase/firebase';


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
    link: {
        alignItems: 'center',
        display: 'flex',
        float: 'left',
        paddingTop: '5px',
        textDecoration: 'none',
    },
    paper: { 
        height: '100%', 
        padding: 20,
        overflowY: 'auto' 
    },
    titlePaper: {
        padding: '20px',
        position: 'fixed',
    },
    titleRow: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px',
    },
    toolbar: theme.mixins.toolbar
}));


const WorkoutInstancePage = ({ match }) => {

    const classes = useStyles();
    const theme = useTheme();

    const { authState } = useContext(AuthContext);

    const [workout, setWorkout] = useState(undefined);
    const [exerciseInstances, setExerciseInstances] = useState([]);

    const { workoutState, workoutDispatch } = useContext(WorkoutContext);

    if (!!workout && !!workoutState.currentWorkout ){
        if (!workoutState.currentWorkout.id || workoutState.currentWorkout.id !== match.params.workoutID){
            workoutDispatch({ type: 'SET_WORKOUT', currentWorkout: {
                id: match.params.workoutID,
                ...workout
            }})
        }
    }

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    useEffect(() => {

        async function fetchWorkout(){
            const workoutRef = db.collection('users').doc(authState.uid).collection('workouts').doc(match.params.workoutID);
            const workout = await workoutRef.get();
            if (workout.exists){
                setWorkout(workout.data());
            }
        }

        if (!workout){
            fetchWorkout();
        }
        
        const unsubscribe = db.collection(`users/${authState.uid}/workouts/${match.params.workoutID}/exerciseInstances`).onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        const exerciseInstances = changes.filter((change) => (change.type === 'added' || change.type === 'modified') && change.doc );
        setExerciseInstances(exerciseInstances);
            
        });
        
        return () => {
            unsubscribe();
        }

    }, [authState.uid, match.params.workoutID, workout]);


    const addExerciseInstance = () => {
        
    }

    const editExerciseInstance = () => {

    }

    const deleteExerciseInstance = () => {

    }

    return (
        <>
            <Paper>
            <Grid container justify='center' alignItems='center' className={classes.titlePaper}>
                    
                <Grid item xs={12}>
                    <Link to='/workouts' className={classes.link}>
                        <ArrowBack style={{height: '100%'}} />
                    </Link>
                    {workout && (
                            <Typography variant='h6' align='center'>
                                {moment(workout.date.toDate()).format('MMMM Do, YYYY')}
                            </Typography>
                    )}
                </Grid>
            </Grid>
            </Paper>
                    
            <Grid container direction='row' justify='center' alignItems='center' className={classes.container}>
                { (exerciseInstances && exerciseInstances.length > 0) 
                    ?   exerciseInstances.map((exerciseInstance, index) => (
                                <Grid item xs={10} key={index}>
                                    <Typography variant='h5' align='left' className={classes.groupHeading}>
                                        {exerciseInstance.title}
                                    </Typography>
                                    <ExerciseInstanceCard 
                                        exerciseInstance={exerciseInstance.doc} 
                                        editWorkout={editExerciseInstance} 
                                        deleteWorkout={deleteExerciseInstance} 
                                    />
                                </Grid>
                            )
                        )
                    :   <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                    No exercises to display for this workout.  
                                    <br />Better get moving!
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
                <Link to={`/workouts/${match.params.workoutID}/exercise_selection`} >
                    <Fab aria-label='Add' className={classes.fab} color='secondary'>
                        <Add />
                    </Fab>
                </Link>
            </Zoom>
        </>
    )
}

export default WorkoutInstancePage;