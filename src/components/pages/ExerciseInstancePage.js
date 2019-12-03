import React, { Component } from 'react';
import moment from 'moment';
import {
    Button,
    ButtonBase,
    Dialog, 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Grid, 
    Paper,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { AddCircle, DeleteForever } from '@material-ui/icons';

// import AuthContext from '../../context/AuthContext';
// import WorkoutContext from '../../context/WorkoutContext';
// import ExercisesContext from '../../context/ExercisesContext';
// import PageContext from '../../context/PageContext';
import ProvideAppContext, { AppContext } from '../../context/ProvideAppContext';

import { db } from '../../firebase/firebase';
import SetControls from '../elements/SetControls';

const styles = theme => ({
    addSetButton: {
        fontSize: '3em',
    },
    background: {
        backgroundColor: theme.palette.secondary.dark,
        minHeight: 'calc(100% - 56px - 56px)'
    },
    deleteDialogActions: {
        justifyContent: 'space-evenly'
    },
    deleteDialogPaper: {
        padding: '10px',
        width: '80%'
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(10),
        right: theme.spacing(4),
        zIndex: 100
    },
    greyText: {
        color: theme.palette.text.secondary
    },
    setPanelButtonBase: {
        height: '100%',
        paddingTop: '20px',
        width: '100%'
    },
    setPanelDetailsRoot: {
        backgroundColor: theme.palette.primary.main,
        boxShadow: 'inset -11px 10px 20px -2px rgba(0,0,0,0.5)',
        padding: '30px'
    },
    setPanelRoot: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        margin: '10px 0',
        width: '100%',

        '&:last-of-type': {
            marginBottom: '20px'
        }
    },
    setPanelRounded: {
        '&:first-child': {
            marginBottom: 0
        },
        '&:last-child': {
            marginTop: 0,
            marginBottom: '30px'
        }
    },
    setPanelSummaryContent: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    setPanelSummaryRoot: {
        width: '100%'
    },
    setPaper: {
        backgroundColor: '#ececec',
        marginBottom: '30px'
    },
    setsTitleText: {
        color: theme.palette.secondary.contrastText,
    },
    sideIndicator: {
        color: theme.palette.secondary.dark,
        fontSize: 'x-large',
        fontWeight: 'bold'
    },
    titleText: {
        padding: '20px 0',
    },
    toolbar: theme.mixins.toolbar
});

class ExerciseInstancePage extends Component {

    static contextType = AppContext;

    transitionDuration = {
        enter: this.context.theme.transitions.duration.enteringScreen,
        exit: this.context.theme.transitions.duration.leavingScreen,
    };

    // DB Reference
    exerciseInstancesRef = db.collection('users').doc(this.context.authState.uid).collection('exerciseInstances');

    // State
    state = {
        exerciseInstanceID: '',
        sets: [],
        expandedSet: 'setPanel_0',
        editMode: false,
        setToEdit: undefined,
        deleteDialogOpen: false,
        setToDelete: undefined,
        unsubscribe: undefined
    }

    componentDidMount(){
        if (this.context.pageState.currentPage !== 'EXERCISE_INSTANCE'){
            this.context.pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'EXERCISE_INSTANCE' });
        }
        this.exerciseInstancesRef
            .where('workoutID', '==', this.context.workoutState.currentWorkout.id)
            .where('exerciseID', '==', this.context.exercisesState.selectedExercise.id)
            .get()
            .then((snapshot) => {
                let exerciseInstanceID = undefined;
                if (snapshot.docs.length > 0){ // Presumably only one if any
                    snapshot.forEach((exerciseInstanceDoc) => 
                        exerciseInstanceID = exerciseInstanceDoc.id
                
                )
                }
                this.setState(() => ({ exerciseInstanceID }));
            })
    }

    componentDidUpdate(prevProps, prevState){

        if (this.state.exerciseInstanceID 
            && this.state.exerciseInstanceID !== prevState.exerciseInstanceID){
                const unsubscribe = this.exerciseInstancesRef
                                        .doc(this.state.exerciseInstanceID)
                                        .collection('sets')
                                        .orderBy('completedAt')
                                        .onSnapshot((snapshot) => {
                                            const setDocs = snapshot.docs;
                                            let sets = setDocs.map((setDoc) => ({
                                                id: setDoc.id,
                                                ...setDoc.data()
                                            }));

                                            // if exercise is unilateral (ie. has left and right sets),
                                            // divide the sets by left and right, and then zip them together
                                            // by time.

                                            if (sets.length > 0 
                                                && this.context.exercisesState.selectedExercise.laterality === 'unilateral'){
                                                
                                                sets = this.zipSetsBySide(sets);
                                            }

                                            console.log('Sets are: ', sets)
                                            this.setState(() => ({
                                                sets,
                                                expandedSet: `setPanel_${sets.length + 1}`
                                            }));
                })
                this.setState(() => ({
                    unsubscribe
                }));
        }
    }

    componentWillUnmount(){
        if (!!this.state.unsubscribe){
            this.state.unsubscribe();
        }
    }

    // Methods 
    zipSetsBySide = (sets) => {
        // start alternating pattern dependent on which side selected first
        const initialSide = sets[0].side;
        const subsequentSide = ['left', 'right'].filter((side) => side !== initialSide)[0];

        const initialSideSets = sets.filter((set) => set.side === initialSide);
        const subsequentSideSets = sets.filter((set) => set.side === subsequentSide);
        
        // determine which sides longer
        let unequalLengths = initialSideSets.length !== subsequentSideSets.length;
        let longerSide;
        let shortestLength = initialSideSets.length; // set b/c used in map below, use this length if not reassigned

        if (unequalLengths){
            longerSide = initialSideSets.length > subsequentSideSets.length ? 'initial' : 'subsequent';
            shortestLength = longerSide === 'initial' ? subsequentSideSets.length : initialSideSets.length;
        }

        // zip
        let zippedSets = initialSideSets.slice(0, shortestLength).map((initialSideSet, index) => {
            if (index < subsequentSideSets.length){
                return {
                    initialSide: initialSideSet,
                    subsequentSide: subsequentSideSets[index]
                }
            }
        });

        // Append longer side, if any
        if (unequalLengths){
            let remainingSetsZipped = [];

            if (longerSide === 'initial'){
                const remainingSets = initialSideSets.slice(shortestLength);
                remainingSetsZipped = remainingSets.map((set) => ({initialSide: set, subsequentSide: undefined }));
            } else {
                const remainingSets = subsequentSideSets.slice(shortestLength + 1);
                remainingSetsZipped = remainingSets.map(set => ({ initialSide: undefined, subsequentSide: set }));
            }

            zippedSets = zippedSets.concat(remainingSetsZipped);
        }

        return zippedSets;
        
    }

    handleSetPanelSelection = (panelNum, side) => {

        // Bilateral
        if (this.context.exercisesState.selectedExercise.laterality === 'bilateral'){
            if (panelNum == this.state.expandedSet.split('_')[1]){ // ie. close the same setPanel
                this.setState(() => ({ expandedSet: '' }));
            } else if (panelNum !== this.state.sets.length + 1){ // ie. is not the create-panel
                this.setState((prevState) => ({
                    editMode: true,
                    setToEdit: prevState.sets[panelNum],
                    expandedSet: `setPanel_${panelNum}`
                }))
            } else {
                this.setState(() => ({ expandedSet: `setPanel_${panelNum}` }));
            }
        } else {
            // Unilateral
            if (panelNum == this.state.expandedSet.split('_')[1]
                && side === this.state.expandedSet.split('_')[2]){ // ie. close the same setPanel
                this.setState(() => ({ expandedSet: '' }));

            } else if (panelNum !== this.state.sets.length + 1){ // ie. is not the create-panel
                this.setState((prevState) => ({
                    editMode: true,
                    setToEdit: prevState.sets[panelNum][side],
                    expandedSet: `setPanel_${panelNum}_${side}`
                }))
            } else {
                this.setState(() => ({ expandedSet: `setPanel_${panelNum}` }));
            }
        }

        
    }

    handleOpenSetDialog = () => {
        this.setState(() => ({ setDialogOpen: true }));
    }

    handleEditSet = (set) => {

        this.setState(() => ({
            editMode: true,
            setToEdit: set,
            setDialogOpen: true
        }));
    }

    handleDeleteSet = (setData) => {

        this.setState(() => ({ 
            setToDelete: setData.id,
            deleteDialogOpen: true 
        }));
    }

    onCreateSet = (setData) => {

        // Slightly different procedures if the exercise instance has been 
        // created already (ie. has at least once set)
        if (this.state.exerciseInstanceID){
            this.exerciseInstancesRef.doc(this.state.exerciseInstanceID).collection('sets').add(setData);
        } else {
            const newRef = this.exerciseInstancesRef.doc();
            newRef.set({
                workoutID: this.context.workoutState.currentWorkout.id,
                exerciseID: this.context.exercisesState.selectedExercise.id
            });
            newRef.collection('sets').add(setData);
            this.setState(() => ({ exerciseInstanceID: newRef.id }));
        }
    }

    onEditSet = (setData) => {
        const setObj = {...setData};
        delete setObj.id;

        this.exerciseInstancesRef
            .doc(this.state.exerciseInstanceID)
            .collection('sets')
            .doc(setData.id)
            .set(setObj);
    }

    onDeleteSet = () => {
        this.exerciseInstancesRef
            .doc(this.state.exerciseInstanceID)
            .collection('sets')
            .doc(this.state.setToDelete)
            .delete();
        this.setState(() => ({ 
            deleteDialogOpen: false,
            setToDelete: undefined
        }))
    }

    closeDeleteDialog = () => {
        this.setState(() => ({ 
            deleteDialogOpen: false,
            setToDelete: undefined
        }))
    }
 
    listString = (list) => {
        let listString = '';

        if (!list || list.length === 0){
            return '';
        } else if (list.length === 1){
            return list[0];
        } else {
            list.forEach((item, index) => {
                if (index === list.length - 1){
                    listString = listString + item;
                } else {
                    listString = listString + item + ', ';
                }
            })
        }
        return listString
    }
    


    render(){

        const { classes } = this.props;
        const exerciseTitle = this.context.exercisesState.selectedExercise.title;
        let exerciseModifier = '';
        if (this.context.exercisesState.selectedExercise.modifiers && this.context.exercisesState.selectedExercise.modifiers.length > 0){
            exerciseModifier += '(' + this.listString(this.context.exercisesState.selectedExercise.modifiers) + ')';
        }

        let initialSide, subsequentSide;
        if (this.state.sets.length > 0 && this.context.exercisesState.selectedExercise.laterality === 'unilateral'){
            initialSide = ['left', 'right'].filter(side => side === this.state.sets[0].initialSide.side)[0];
            subsequentSide = ['left', 'right'].filter(side => side !== initialSide)[0];
        }
        

        return (
            <>
            <Grid container justify='center' alignItems='center' className={classes.background} >
                    <Grid item xs={11} className={classes.titleText}>
                        <Paper elevation={5} style={{padding: '10px'}}>
                            <Grid item xs={12}>
                                <Typography variant='body1' align='center'>
                                    {moment(this.context.workoutState.currentWorkout.date.toDate()).format('MMMM Do, YYYY')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.titleText}>
                                <Typography variant='h4' align='center'>
                                    <strong>{exerciseTitle}</strong>
                                    {exerciseModifier && (
                                        <>
                                            <br />
                                            <strong>{exerciseModifier}</strong>
                                        </>
                                    )}
                                </Typography>
                            </Grid>
                        </Paper>
                    </Grid>
                <Grid item xs={11}>
                    <Paper elevation={5} className={classes.setPaper} >
                        <Grid container justify='center' style={{paddingBottom: '10px'}}>
                            {this.context.exercisesState.selectedExercise.laterality === 'bilateral'
                                ?   this.state.sets.map((set, index) => (
                                        <Grid key={set.id} item xs={11}>
                                            <ExpansionPanel 
                                                expanded={this.state.expandedSet === `setPanel_${index}`} 
                                                onChange={() => this.handleSetPanelSelection(index)}
                                                classes={{ root: classes.setPanelRoot }}
                                                TransitionProps={{ unmountOnExit: true }}
                                            >
                                                <ButtonBase className={classes.setPanelButtonBase}>
                                                    <ExpansionPanelSummary
                                                        aria-controls={`panel${index}bh-content`}
                                                        id={`panel${index}bh-header`}
                                                        classes={{ 
                                                            root: classes.setPanelSummaryRoot, 
                                                            content: classes.setPanelSummaryContent }}
                                                    >
                                                        <Typography variant='body2'>
                                                            {moment(set.completedAt.toDate()).format('hh:mm a')}
                                                        </Typography>
                                                        <Typography variant='h6'>
                                                            {set.units === 'lbs' ? set.weightLbs : set.weightKg}
                                                            <span className={classes.greyText}>{` ${set.units}`}</span>
                                                        </Typography>
                                                        <Typography variant='h6'>
                                                            {set.reps} <span className={classes.greyText}>reps</span>
                                                        </Typography>
                                                    </ExpansionPanelSummary>
                                                </ButtonBase>
                                                <ExpansionPanelDetails classes={{ root: classes.setPanelDetailsRoot }}>
                                                    <SetControls
                                                        laterality={this.context.exercisesState.selectedExercise.laterality}
                                                        editMode={this.state.editMode}
                                                        setToEdit={this.state.setToEdit}
                                                        onCreateSet={this.onCreateSet}
                                                        onEditSet={this.onEditSet}
                                                        onDeleteSet={this.handleDeleteSet}
                                                    /> 
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </Grid>
                                    ))
                                // Unilateral Mapping
                                :   this.state.sets.map((set, index) => (
                                        <Grid key={index} item xs={11}>
                                            <ExpansionPanel 
                                                expanded={this.state.expandedSet === `setPanel_${index}_initialSide`} 
                                                onChange={() => this.handleSetPanelSelection(index, 'initialSide')}
                                                classes={{ root: classes.setPanelRoot, rounded: classes.setPanelRounded }}
                                                TransitionProps={{ unmountOnExit: true }}
                                            >
                                                <ButtonBase className={classes.setPanelButtonBase}>
                                                    <ExpansionPanelSummary
                                                        aria-controls={`panel${index}initialSide-bh-content`}
                                                        id={`panel${index}initialSide-bh-header`}
                                                        classes={{ 
                                                            root: classes.setPanelSummaryRoot, 
                                                            content: classes.setPanelSummaryContent }}
                                                    >
                                                        {console.log('SET INITIAL SIDE: ', set.initialSide)}
                                                        {set.initialSide 
                                                            ?   (
                                                                <>
                                                                    <Typography variant='h6' className={classes.sideIndicator}>
                                                                        {initialSide === 'right' ? 'R' : 'L' }
                                                                    </Typography>
                                                                    <Typography variant='body2'>
                                                                        {moment(set.initialSide.completedAt.toDate()).format('hh:mm a')}
                                                                    </Typography>
                                                                    <Typography variant='h6'>
                                                                        {set.initialSide.units === 'lbs' ? set.initialSide.weightLbs : set.initialSide.weightKg}
                                                                        <span className={classes.greyText}>{` ${set.initialSide.units}`}</span>
                                                                    </Typography>
                                                                    <Typography variant='h6'>
                                                                        {set.initialSide.reps} <span className={classes.greyText}>reps</span>
                                                                    </Typography>
                                                                </>
                                                            )
                                                            :   (
                                                                <Typography variant='h6'>
                                                                    <span className={classes.greyText}>{`Do a ${initialSide} side set!`}</span>
                                                                </Typography>
                                                            )
                                                        }
                                                        
                                                    </ExpansionPanelSummary>
                                                </ButtonBase>
                                                {set.initialSide && (
                                                    <ExpansionPanelDetails classes={{ root: classes.setPanelDetailsRoot }}>
                                                        <SetControls
                                                            laterality={this.context.exercisesState.selectedExercise.laterality}
                                                            editMode={this.state.editMode}
                                                            setToEdit={this.state.setToEdit}
                                                            onCreateSet={this.onCreateSet}
                                                            onEditSet={this.onEditSet}
                                                            onDeleteSet={this.handleDeleteSet}
                                                        /> 
                                                    </ExpansionPanelDetails>
                                                )}
                                            </ExpansionPanel>

                                            {/* Subsequent Side */}

                                            <ExpansionPanel 
                                                expanded={this.state.expandedSet === `setPanel_${index}_subsequentSide`} 
                                                onChange={() => this.handleSetPanelSelection(index, 'subsequentSide')}
                                                classes={{ root: classes.setPanelRoot, rounded: classes.setPanelRounded }}
                                                TransitionProps={{ unmountOnExit: true }}
                                            >
                                                <ButtonBase className={classes.setPanelButtonBase}>
                                                    <ExpansionPanelSummary
                                                        aria-controls={`panel${index}subsequentSide-bh-content`}
                                                        id={`panel${index}subsequentSide-bh-header`}
                                                        classes={{ 
                                                            root: classes.setPanelSummaryRoot, 
                                                            content: classes.setPanelSummaryContent }}
                                                    >
                                                        {console.log('SET SUBSEQUENT SIDE: ', set.subsequentSide)}
                                                        {set.subsequentSide 
                                                            ?   (
                                                                <>
                                                                    <Typography variant='h6' className={classes.sideIndicator}>
                                                                        {subsequentSide === 'right' ? 'R' : 'L' }
                                                                    </Typography>
                                                                    <Typography variant='body2'>
                                                                        {moment(set.subsequentSide.completedAt.toDate()).format('hh:mm a')}
                                                                    </Typography>
                                                                    <Typography variant='h6'>
                                                                        {set.subsequentSide.units === 'lbs' ? set.subsequentSide.weightLbs : set.subsequentSide.weightKg}
                                                                        <span className={classes.greyText}>{` ${set.subsequentSide.units}`}</span>
                                                                    </Typography>
                                                                    <Typography variant='h6'>
                                                                        {set.subsequentSide.reps} <span className={classes.greyText}>reps</span>
                                                                    </Typography>
                                                                </>
                                                            )
                                                            : (
                                                                <Typography variant='h6'>
                                                                    <span className={classes.greyText}>{`Do a ${subsequentSide} side set!`}</span>
                                                                </Typography>
                                                            )
                                                        }
                                                    </ExpansionPanelSummary>
                                                </ButtonBase>
                                                {set.subsequentSide && (
                                                    <ExpansionPanelDetails classes={{ root: classes.setPanelDetailsRoot }}>
                                                        <SetControls
                                                            laterality={this.context.exercisesState.selectedExercise.laterality}
                                                            editMode={this.state.editMode}
                                                            setToEdit={this.state.setToEdit}
                                                            onCreateSet={this.onCreateSet}
                                                            onEditSet={this.onEditSet}
                                                            onDeleteSet={this.handleDeleteSet}
                                                        /> 
                                                    </ExpansionPanelDetails>
                                                )}
                                            </ExpansionPanel>
                                        </Grid>
                                    ))
                            } 
                            <Grid item xs={11}>
                                <ExpansionPanel 
                                    expanded={this.state.expandedSet === `setPanel_${this.state.sets.length + 1}`} 
                                    onChange={() => this.handleSetPanelSelection(this.state.sets.length + 1)}
                                    classes={{ root: classes.setPanelRoot }}
                                >
                                    <ButtonBase className={classes.setPanelButtonBase}>
                                        <ExpansionPanelSummary
                                            aria-controls={`panel${this.state.sets.length + 1}bh-content`}
                                            id={`panel${this.state.sets.length + 1}bh-header`}
                                            classes={{ 
                                                root: classes.setPanelSummaryRoot, 
                                                content: classes.setPanelSummaryContent }}
                                        >
                                            <Typography variant='h6'>
                                                <AddCircle className={classes.addSetButton} color='secondary' />
                                            </Typography>
                                        </ExpansionPanelSummary>
                                    </ButtonBase>
                                    <ExpansionPanelDetails classes={{ root: classes.setPanelDetailsRoot }}>
                                        <SetControls
                                            laterality={this.context.exercisesState.selectedExercise.laterality}
                                            editMode={false}
                                            onCreateSet={this.onCreateSet}
                                        /> 
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <div className={classes.toolbar} />
            </Grid>

            {/* Deleteion Confirmation dialog} */}
            <Dialog
                open={this.state.deleteDialogOpen}
                onClose={this.closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                classes={{ paper: classes.deleteDialogPaper }}
            >
                <DialogTitle id="delete-dialog-title">Delete this set?</DialogTitle>
                <DialogActions classes={{ root: classes.deleteDialogActions }}>
                    <Button 
                        onClick={this.closeDeleteDialog} 
                        color="primary"
                        variant='contained'
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={this.onDeleteSet} 
                        color="secondary" 
                        variant='contained'
                    >
                        <DeleteForever style={{marginRight: '5px'}}/>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        );
    }
}

const ExerciseInstancePageWithContext = props => (
    <ProvideAppContext>
        <ExerciseInstancePage {...props} />
    </ProvideAppContext>
);

export default withStyles(styles)(ExerciseInstancePageWithContext);