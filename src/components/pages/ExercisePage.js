import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Button, 
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ArrowBack, DeleteForever, Edit } from '@material-ui/icons';

import ExerciseDialog from '../elements/dialogs/ExerciseDialog';

import AuthContext from '../../context/AuthContext';
import ExercisesContext from '../../context/ExercisesContext';

import { db } from '../../firebase/firebase';




const useStyles = makeStyles(theme => ({
    buttonsRow: {
        paddingTop: '30px',
        paddingBottom: '30px'
    },
    link: {
        alignItems: 'center',
        display: 'flex',
        textDecoration: 'none',
        width: '100%'
    },
    titleRow: {
        alignItems: 'center',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px',
    }
}));

const ExercisePage = ({ match, history }) => {

    const classes = useStyles();
    const { authState } = useContext(AuthContext); 
    const { exercisesState } = useContext(ExercisesContext);
    // Set default object to stop page crashing on rerender after delete and before history.replace
    const [exercise, setExercise] = useState(exercisesState.exercises.find(exercise => exercise.id === match.params.exerciseID) || {
        title: '',
        modifiers: [],
        muscleGroups: [],
        equipment: [],
        laterality: 'unilateral'
    });
    const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleEditExercise = () => {
        setExerciseDialogOpen(true);
    }

    const handleDeleteExercise = () => {
        setDeleteDialogOpen(true);
    }

    const onDeleteExercise = () => {
        try {
            db.collection('users').doc(authState.uid).collection('exercises').doc(exercise.id).delete();
            history.replace('/exercises');
        } catch(err){
            alert('Error deleting exercise: ', err);
        }
        
    }

    const closeExerciseDialog = () => {
        setExerciseDialogOpen(false);
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    }

    const listString = (list) => {
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

    // Inline template string was getting a bit long and wasn't behaving
    let exerciseTitle = exercise.title
    if (exercise.modifiers && exercise.modifiers.length > 0){
        exerciseTitle += ' (' + listString(exercise.modifiers) + ')';
    }

    return (
        <>
            <Grid container justify='center'>
                <Grid item xs={12} className={classes.titleRow}>
                    <Link to='/exercises' className={classes.link} >
                        <ArrowBack />
                        <Typography variant='body1'>  
                            All Exercises
                        </Typography>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h4' align='center'>
                        {exerciseTitle}
                    </Typography>
                </Grid>
                <Grid item xs={10} className={classes.buttonsRow} >
                    <Grid container justify='space-between'>
                        <Grid item xs={5}>
                            <Button 
                                color='primary' 
                                variant='contained' 
                                onClick={handleEditExercise}
                                fullWidth
                            >
                                <Edit style={{marginRight: '5px'}} />
                                Edit
                            </Button>
                        </Grid>
                        <Grid item xs={5}>
                            <Button 
                                color='secondary' 
                                variant='contained' 
                                onClick={handleDeleteExercise}
                                fullWidth
                            >
                                <DeleteForever style={{marginRight: '5px'}}/>
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                
            </Grid>

            <ExerciseDialog
                open={exerciseDialogOpen} 
                onClose={closeExerciseDialog}
                exerciseToEdit={exercise}
                editMode={true}
            />

            {/* Deleteion Confirmation dialog} */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{`Delete ${exerciseTitle}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Deleting an exercise will delete all associated exercise data and history.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeDeleteDialog} 
                        color="primary"
                        variant='contained'
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={onDeleteExercise} 
                        color="secondary" 
                        variant='contained'
                    >
                        <DeleteForever style={{marginRight: '5px'}}/>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ExercisePage;