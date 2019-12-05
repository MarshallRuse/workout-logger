import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { flatten } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { 
    Button,
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { Edit, Delete, DeleteForever, MoreHoriz } from '@material-ui/icons';

import ExercisesContext from '../../../context/ExercisesContext';

import listString from '../../../resources/utils/listString';

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
    cardMuscles: {
        fontWeight: 500,
        marginBottom: '10px'
    },
    cardValue: {
        
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
}))

const WorkoutCard = ({ workout, exerciseInstances, editWorkout, deleteWorkout }) => {
    const classes = useStyles();

    // context
    const { exercisesState } = useContext(ExercisesContext);

    // State
    const [moreActionsOpen, setMoreActionsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleOpenMoreActions = (event) => {
        setAnchorEl(event.currentTarget);
        setMoreActionsOpen(true);
    }

    const handleCloseMoreActions = () => {
        setAnchorEl(undefined);
        setMoreActionsOpen(false);
    }

    const handleEditWorkout = () => {
        editWorkout(workout);
        handleCloseMoreActions();
    }

    const handleDeleteWorkout = () => {
        deleteWorkout(workout.id);
        handleCloseDeleteDialog();
        handleCloseMoreActions();
    }

    const handleOpenDeleteDialog = () => {
        setDeleteDialogOpen(true);
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    }

    const getMuscleGroupsList = () => {
        const groups = exerciseInstances.map((inst) => {
            
            const exercise = exercisesState.exercises.find((ex) => ex.id === inst.exerciseInstance.exerciseID);
            return exercise.muscleGroups;
        });
        const flattenedGroups = flatten(groups);
        const uniqueGroups = flattenedGroups.filter((group, index, self) => self.indexOf(group) === index)
        return listString(uniqueGroups)
    }

    const getWorkoutDuration = () => {
        const completionTimes = exerciseInstances.map((inst) => {
            const setTimes = inst.sets.map(set => moment(set.set.completedAt.toDate()));
            return setTimes;
        })

        const flattenedTimes = flatten(completionTimes);
        const earliest = moment.min(flattenedTimes);
        const latest = moment.max(flattenedTimes);
        const diff = latest.diff(earliest, 'minutes');
        let mins = diff % 60;
        mins = mins < 10 ? `0${mins}` : `${mins}`;
        return `${Math.floor(diff / 60)}:${mins}`
    }


    return (
        <>
        <ButtonBase 
            focusRipple
            style={{width: '100%'}}
        >
            <Card className={classes.card}>
                <Link to={`/workouts/${workout.id}`} className={classes.link}>
                    <CardContent>
                        <Typography variant="h5" className={classes.cardMuscles}>
                            {exerciseInstances && getMuscleGroupsList()}
                        </Typography>
                        <Typography variant='h6'>
                            <span className={classes.cardField}>Exercises performed:</span>
                            <span className={classes.cardValue}>{exerciseInstances ? exerciseInstances.length : 0}</span>
                        </Typography>
                        <Typography variant='h6'>
                            <span className={classes.cardField}>Duration:</span>
                            <span className={classes.cardValue}>{exerciseInstances ? getWorkoutDuration() : '00:00'}</span>
                        </Typography>

                    </CardContent>
                </Link>
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
                        <MenuItem  onClick={handleEditWorkout}>
                            <Edit style={{marginRight: '5px'}} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={handleOpenDeleteDialog}>
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
            classes={{ paper: classes.deleteDialogPaper }}
        >
            <DialogTitle id="delete-dialog-title">Delete this workout?</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Deleting a workout will delete all this workout's exercise data.
                    Do you wish to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions classes={{ root: classes.deleteDialogActions }}>
                <Button 
                    onClick={handleCloseDeleteDialog} 
                    color="primary"
                    variant='contained'
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleDeleteWorkout} 
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

export default WorkoutCard;