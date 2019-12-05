import React, { useState, useContext } from 'react';
import moment from 'moment';
import { 
    Button,
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, DeleteForever, Forward, MoreHoriz } from '@material-ui/icons';

import AuthContext from '../../../context/AuthContext';
import ExercisesContext from '../../../context/ExercisesContext';

import { db } from '../../../firebase/firebase';


const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    cardField: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        marginRight: '5px',
        marginBottom: '10px'
    },
    costDiv: {
        marginTop: '5px',

    },
    flags: {
        marginRight: '10px',
        marginTop: '5px',
        marginBottom: '2px'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
}));

const ExerciseInstanceCard = ({ exercise, exerciseInstance, history }) => {

    const classes = useStyles();

    // Context
    const { authState } = useContext(AuthContext);
    const { exercisesState, exercisesDispatch } = useContext(ExercisesContext);

    // State 
    const [sets, setSets] = useState(undefined);
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    const exerciseInstanceRef = db.collection('users').doc(authState.uid).collection('exerciseInstances').doc(exerciseInstance.id)

    // Fetch sets on load
    if (!sets){
        exerciseInstanceRef
            .collection('sets')
            .orderBy('completedAt')
            .get()
            .then((snapshot) => {
                const fetchedSets = snapshot.docs.map((doc) => doc.data());
                setSets(fetchedSets);
            })
    }

    // Methods
    const handleExerciseInstanceSelect = () => {
        exercisesDispatch({ type: 'SET_SELECTED_EXERCISE', selectedExercise: exercise }); 
        history.push(`${history.location.pathname}/exercise/${exercise.id}`)
    }

    const handleExercisePageSelection = () => {
        history.push(`/exercises/${exercise.id}`);
    }

    const handleDeleteExercise = () => {
        handleCloseMoreActions();
        setDeleteDialogOpen(true);
    }

    const onDeleteExercise = async () => {
        handleCloseDeleteDialog();

        // Find all the sets associated with this exercise instance
        exerciseInstanceRef.collection('sets').get().then((docs) => {
            docs.forEach(doc => exerciseInstanceRef.collection('sets').doc(doc.id).delete());
        });
        exerciseInstanceRef.delete();
    }

    const handleOpenMoreActions = (event) => {
        setAnchorEl(event.currentTarget);
        setMoreActionsOpen(true);
    }

    const handleCloseMoreActions = () => {
        setAnchorEl(undefined);
        setMoreActionsOpen(false);
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    }

    const { exerciseTitle, exerciseModifier } = exercisesState.formatExerciseTitle(exercise);

    return (  
        <>
            <ButtonBase 
                focusRipple
                    style={{width: '100%'}}
                >
                <Card className={classes.card} >
                    <CardContent onClick={handleExerciseInstanceSelect}>
                        <Typography variant='h5' align='center'>
                            <strong>{exerciseTitle}</strong>
                            {exerciseModifier 
                                && (
                                    <>
                                        <br />
                                        <strong>{exerciseModifier}</strong>
                                        </>
                                    )
                            }
                        </Typography>
                        <br />
                        {!!sets && (
                            <>
                                <Typography variant='h6'>
                                    <span className={classes.cardField}>Sets completed: </span>
                                    <span className={classes.cardValue}>{!!sets ? sets.length : 0}</span>
                                </Typography>
                                {(sets && sets.length > 0) && (
                                    <Typography variant='h6'>
                                        <span className={classes.cardField}>Last Set: </span>
                                        <span className={classes.cardValue}>{moment(sets[sets.length - 1].completedAt.toDate()).format('h:mm a')}</span>
                                    </Typography>
                                )}
                                
                            </>
                        )}
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <MoreHoriz onClick={handleOpenMoreActions}/>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={moreActionsOpen}
                            onClose={handleCloseMoreActions}
                            PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                            }}
                        >
                            <MenuItem  onClick={handleExercisePageSelection}>
                                <Forward style={{marginRight: '5px'}} />
                                Exercise Page
                            </MenuItem>
                            <MenuItem onClick={handleDeleteExercise}>
                                <Delete style={{marginRight: '5px'}}/>
                                Delete
                            </MenuItem> 
                        </Menu>
                    </CardActions>
                </Card>
            </ButtonBase>

            {/* Deleteion Confirmation dialog} */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{`Delete this exercise from workout?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Deleting an exercise will delete all this exercise's set data for this days workout.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseDeleteDialog} 
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

export default ExerciseInstanceCard;