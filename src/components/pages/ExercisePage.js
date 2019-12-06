import React, { useContext, useState } from 'react';
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
import { DeleteForever, Edit } from '@material-ui/icons';

import ExerciseDialog from '../elements/dialogs/ExerciseDialog';

import AuthContext from '../../context/AuthContext';
import ExercisesContext from '../../context/ExercisesContext';

import { db } from '../../firebase/firebase';

import listString from '../../resources/utils/listString';


const useStyles = makeStyles(theme => ({
    buttonsRow: {
        paddingTop: '30px',
        paddingBottom: '30px'
    },
    deleteDialogPaper: {
        padding: '10px'
    },
    link: {
        alignItems: 'center',
        display: 'flex',
        textDecoration: 'none',
        width: '100%'
    },
    titleRow: {
        alignItems: 'center',
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
    const [ exercise ] = useState(exercisesState.exercises.find(exercise => exercise.id === match.params.exerciseID) || {
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

            // Delete all exercise instances associated with this exercise, as well as their sets
            db.collection('users')
            .doc(authState.uid)
            .collection('exerciseInstances')
            .where('exerciseID', '==', exercise.id)
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                                    id: doc.id,
                                    ref: doc.ref,
                                    ...doc.data()
                                }));
            })
            .then((exerciseInstances) => {
                exerciseInstances.forEach(inst => {
                    db.collection('users')
                    .doc(authState.uid)
                    .collection('exerciseInstances')
                    .doc(inst.id)
                    .collection('sets')
                    .get()
                    .then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            doc.ref.delete();
                        });
                    });
                    inst.ref.delete();
                });
                return;
            })
            .then(() => {
                db.collection('users').doc(authState.uid).collection('exercises').doc(exercise.id).delete();
                history.replace('/exercises');
            });
            
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


    // Inline template string was getting a bit long and wasn't behaving
    let exerciseTitle = exercise.title
    if (exercise.modifiers && exercise.modifiers.length > 0){
        exerciseTitle += ' (' + listString(exercise.modifiers) + ')';
    }

    return (
        <>
            <Grid container justify='center'>
                <Grid item xs={12} className={classes.titleRow}>
                    <Typography variant='h4' align='center'>
                        {exerciseTitle}
                    </Typography>
                </Grid>
                <Grid item xs={10} className={classes.buttonsRow} >
                    <Grid container justify='space-between'>
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
                classes={{ paper: classes.deleteDialogPaper }}
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