import React, { Component } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import { 
    Fab, 
    Grid, 
    Paper, 
    Typography, 
    Zoom } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import WorkoutCard from '../elements/cards/WorkoutCard';
import WorkoutDialog from '../elements/dialogs/WorkoutDialog';

import ProvideAppContext, { AppContext } from '../../context/ProvideAppContext';

import { db } from '../../firebase/firebase';


const styles = theme => ({
    cardGridItem: {
        width: '100%'
    },
    container: {
        height: 'auto',
        marginTop: '20px'
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(4),
    },
    groupHeading: {
        color: theme.palette.secondary.dark,
        padding: '10px',
        width: '100%',
    },
    paper: { 
        height: '100%', 
        padding: 20,
        overflowY: 'auto' 
    },
    toolbar: theme.mixins.toolbar
})

class WorkoutsPage extends Component {
    static contextType = AppContext;

    state = {
        workouts: undefined,
        exerciseInstances: [],
        exerciseInstancesFetched: false,
        workoutDialogOpen: false,
        editMode: false,
        workoutToEdit: undefined,
        unsubscribe: undefined
    }
    
    componentDidMount(){
        const unsubscribe =  db.collection('users')
                                .doc(this.context.authState.uid)
                                .collection('workouts')
                                .orderBy('date')
                                .onSnapshot((snapshot) => {
                                    let workoutsDocs = snapshot.docs;
                                    const workouts = workoutsDocs.map((doc) => ({
                                        id: doc.id,
                                        ...doc.data()
                                    }));

                                    this.setState(() => ({ workouts }))
                                });

        this.setState(() => ({ unsubscribe }));

        // To prevent state updates while component is unmounted, dont dispatch until
        // firebase listener established 
        if (this.state.unsubscribe){
            if (this.context.pageState.currentPage !== 'WORKOUTS'){
                this.context.pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'WORKOUTS' });
            } 
        }
    }

    async componentDidUpdate(){
        if (this.state.workouts && !this.state.exerciseInstancesFetched){
            this.fetchExerciseInstances();
            this.setState(() => ({ exerciseInstancesFetched: true }));
        }
    }

    componentWillUnmount(){
        if (this.state.unsubscribe){
            this.state.unsubscribe();
        }
    }

    fetchExerciseInstances = async () => {
        const exInstRef = db.collection('users').doc(this.context.authState.uid).collection('exerciseInstances');
        const exerciseInstances = await Promise.all(this.state.workouts.map(async (workout) => {
            let workoutsExerciseInstances = await exInstRef
                                            .where('workoutID', '==', workout.id)
                                            .get()
                                            .then((snapshot) => {
                                                return snapshot.docs.map((doc) => ({
                                                    id: doc.id,
                                                    exerciseInstance: {...doc.data()}
                                                }))
                                            });

            workoutsExerciseInstances = await Promise.all(workoutsExerciseInstances.map(async (inst) => {
                const sets = await exInstRef.doc(inst.id)
                            .collection('sets')
                            .get()
                            .then((snapshot) => {
                                return snapshot.docs.map((doc) => ({
                                    id: doc.id,
                                    set: {...doc.data()} 
                                }));
                            })
                return {
                    ...inst,
                    sets
                }
            }));   
                
            return {
                workoutID: workout.id,
                exerciseInstances: workoutsExerciseInstances
            };        
        }));
        this.setState(() => ({ exerciseInstances }));
    }

    
    handleAddWorkout = () => {
        this.setState(() => ({ workoutDialogOpen: true }));
    }

    onAddWorkout = (workoutRef) => {
        if (this.state.workouts){
            this.setState((prevState) => ({
                workouts: [
                    ...prevState.workouts, 
                    {  
                        id: workoutRef.id, 
                        ...workoutRef.data()
                    }
                ]}),
                () => {
                    this.fetchExerciseInstances();
                    this.props.history.push(`/workouts/${workoutRef.id}`);
                }
            );
        } else {
            this.setState(() => ({
                workouts: [{
                    id: workoutRef.id,
                    ...workoutRef.data()
                }]
            }), 
            () => {
                this.fetchExerciseInstances();
                this.props.history.push(`/workouts/${workoutRef.id}`);
            })
        }
    
    }

    editWorkout = (workout) => {
        this.setState(() => ({
            editMode: true,
            workoutToEdit: workout,
            workoutDialogOpen: true
        }));
    }

    deleteWorkout = (workoutID) => {
        // Have to manually delete everything
        // Delete all subcollections associated with this workouts exercises
        if (this.state.exerciseInstances){
            const instances = this.state.exerciseInstances.find((inst) => inst.workoutID === workoutID).exerciseInstances;
            if (instances && instances.length > 0){
                instances.forEach(inst => {

                    // Delete all sets associated with each instance
                    const sets = inst.sets;
                    if (sets && sets.length > 0){
                        sets.forEach(set => {
                            db.collection('users')
                            .doc(this.context.authState.uid)
                            .collection('exerciseInstances')
                            .doc(inst.id)
                            .collection('sets')
                            .doc(set.id)
                            .delete()
                        }) 
                    }

                    db.collection('users')
                    .doc(this.context.authState.uid)
                    .collection('exerciseInstances')
                    .doc(inst.id)
                    .delete();
                })
            }
        } 

        db.collection('users')
        .doc(this.context.authState.uid)
        .collection('workouts')
        .doc(workoutID)
        .delete();
    }

    closeWorkoutDialog = () => {
        this.setState(() => ({
            workoutDialogOpen: false,
            editMode: false,
            workoutToEdit: undefined
        }));
    }

    getExerciseInstances = (workout) => {
        let result;
        if (this.state.exerciseInstances && this.state.exerciseInstances.length > 0){
            const thisWorkoutsExerciseInstances = this.state.exerciseInstances.find(inst => inst.workoutID === workout.id);
            if (thisWorkoutsExerciseInstances){
                result = thisWorkoutsExerciseInstances.exerciseInstances;
            } else {
                result = [];
            }
        } else {
            result = [];
        }
        return result;
    }

    render(){
        const { history, classes } = this.props;

        const transitionDuration = {
            enter: this.context.theme.transitions.duration.enteringScreen,
            exit: this.context.theme.transitions.duration.leavingScreen,
        };


        return (
            <>
                <Grid 
                    container 
                    direction='column' 
                    justify='center' 
                    alignItems='center' 
                    className={classes.container}
                >
                    { (this.state.workouts && this.state.workouts.length > 0) 
                        ?   this.state.workouts.map((workout, index) => (
                                    <Grid item xs={10} key={index} className={classes.cardGridItem}>
                                        <Typography variant='h5' align='left' className={classes.groupHeading}>
                                            {moment(workout.date.toDate()).format('MMMM Do, YYYY')}
                                        </Typography>
                                        <WorkoutCard 
                                            workout={workout}
                                            exerciseInstances={this.getExerciseInstances(workout)} 
                                            editWorkout={this.editWorkout} 
                                            deleteWorkout={this.deleteWorkout} 
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
                    <Fab aria-label='Add' className={classes.fab} color='secondary' onClick={this.handleAddWorkout}>
                        <Add />
                    </Fab>
                </Zoom>

                <WorkoutDialog
                    open={this.state.workoutDialogOpen} 
                    onClose={this.closeWorkoutDialog}
                    onAddWorkout={this.onAddWorkout}
                    editMode={this.state.editMode}
                    workoutToEdit={this.state.workoutToEdit}
                    history={history}
                /> 
            </>
        )
    }
    
};

const WorkoutsPageWithContext = props => (
    <ProvideAppContext>
        <WorkoutsPage {...props} />
    </ProvideAppContext>
)

export default withStyles(styles)(WorkoutsPageWithContext);