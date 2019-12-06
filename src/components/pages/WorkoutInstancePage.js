import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Fab,
    Grid, 
    Paper,
    Typography,
    Zoom,
} from '@material-ui/core'; 
import { withStyles } from '@material-ui/core/styles';
import { Add, ArrowBack } from '@material-ui/icons'; 

import moment from 'moment';

import ExerciseInstanceCard from '../elements/cards/ExerciseInstanceCard';

import ProvideAppContext, { AppContext } from '../../context/ProvideAppContext';

import { db } from '../../firebase/firebase';


const styles = theme => ({
    cardGridItem: {
        width: '100%',
        '&:last-of-type': {
            marginBottom: '70%'
        }
    },
    container: {
        marginTop: '80px',
        height: 'auto'
    },
    dateRow: {
        backgroundColor: '#fafafa',
        padding: '20px',
        position: 'fixed',
        zIndex: 1000
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(12),
        right: theme.spacing(5),
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
    titleRow: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px',
    },
    toolbar: theme.mixins.toolbar
});


class WorkoutInstancePage extends Component {

    static contextType = AppContext;

    state = {
        workout: undefined,
        exerciseInstances: [],
        unsubscribe: undefined
    }

    transitionDuration = {
        enter: this.context.theme.transitions.duration.enteringScreen,
        exit: this.context.theme.transitions.duration.leavingScreen,
    };
    
    async componentDidMount(){
        // Set the current page
        if (this.context.pageState.currentPage !== 'WORKOUT_INSTANCE'){
            this.context.pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'WORKOUT_INSTANCE' });
        }

        // Fetch the workout data, if any
        const workoutRef = db.collection('users')
                            .doc(this.context.authState.uid)
                            .collection('workouts')
                            .doc(this.props.match.params.workoutID);
        const workout = await workoutRef.get();
        if (workout.exists){
            this.setState(() => ({ workout: workout.data() }));
        } 

        // Subscribe to the exercise instances associated with this workout
        const unsubscribe = db.collection('users')
                            .doc(this.context.authState.uid)
                            .collection('exerciseInstances')
                            .where('workoutID', '==', this.props.match.params.workoutID)
                            .onSnapshot((snapshot) => {
                                const exerciseInstanceDocs = snapshot.docs;
                                const exerciseInstances = exerciseInstanceDocs.map(doc => ({
                                    id: doc.id,
                                    ...doc.data()
                                }));
                                this.setState(() => ({ exerciseInstances }));                
                            });
        this.setState(() => ({ unsubscribe }));

        
    }

    componentDidUpdate(){
        // Once the workout has been obtained, set the current workout
        if (!!this.state.workout && !!this.context.workoutState.currentWorkout ){
            if (!this.context.workoutState.currentWorkout.id || this.context.workoutState.currentWorkout.id !== this.props.match.params.workoutID){
                this.context.workoutDispatch({ type: 'SET_WORKOUT', currentWorkout: {
                    id: this.props.match.params.workoutID,
                    ...this.state.workout
                }})
            }
        }

        
        
    }
   
    componentWillUnmount(){
        if (this.state.unsubscribe){
            this.state.unsubscribe();
        }
    }

    // Methods
    addExerciseInstance = () => {
        
    }

    editExerciseInstance = () => {

    }

    deleteExerciseInstance = () => {

    }

    render(){
        const { history, match, classes } = this.props;
        return (
            <>
                <Paper>
                <Grid 
                    container 
                    justify='center' 
                    alignItems='center' 
                    className={classes.dateRow}
                >
                    <Grid item xs={12}>
                        <Link to='/workouts' className={classes.link}>
                            <ArrowBack style={{height: '100%'}} />
                        </Link>
                        {this.state.workout && (
                                <Typography variant='h6' align='center'>
                                    {moment(this.state.workout.date.toDate()).format('MMMM Do, YYYY')}
                                </Typography>
                        )}
                    </Grid>
                </Grid>
                </Paper>
                        
                <Grid 
                    container 
                    direction='column'
                    justify='center' 
                    alignItems='center' 
                    className={classes.container}
                >
                    { (this.state.exerciseInstances && this.state.exerciseInstances.length > 0) 
                        ?   this.state.exerciseInstances.map((exerciseInstance, index) => {
                                    const exercise = this.context.exercisesState.exercises.find(ex => ex.id === exerciseInstance.exerciseID);
                                    return (
                                        <Grid item xs={10} key={index} className={classes.cardGridItem}>
                                            <ExerciseInstanceCard 
                                                exercise={exercise} 
                                                exerciseInstance={exerciseInstance}
                                                history={history}
                                            />
                                        </Grid>
                                )
                            })
    
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
                    timeout={this.transitionDuration}
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
}   

const WorkoutInstancePageWithContext = props => (
    <ProvideAppContext>
        <WorkoutInstancePage {...props} />
    </ProvideAppContext>
);

export default withStyles(styles)(WorkoutInstancePageWithContext);