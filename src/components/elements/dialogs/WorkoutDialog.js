import React, { useContext, useState } from 'react';
import { 
    Button,
    Dialog, 
    DialogContent, 
    DialogTitle,
    Typography
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { withStyles } from '@material-ui/styles';
import { Cancel, CheckCircle } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

import AuthContext from '../../../context/AuthContext';

import { db } from '../../../firebase/firebase';


const styles = theme => ({
    input: {
        marginTop: '10px',
        marginBottom: '20px'
    },
});

const WorkoutDialog = ({ open, onClose, editMode, workoutToEdit, history, classes }) => {
    // Context
    const { authState } = useContext(AuthContext);

    // State
    const [selectedDate, setSelectedDate] = useState(editMode ? workoutToEdit.data().date.toDate() : new Date());

    // DB Reference
    const usersWorkoutsRef = db.collection(`users/${authState.uid}/workouts`);

    if (workoutToEdit){
        console.log('workoutToEdit Date: ', workoutToEdit.data().date.toDate());
    }
    
    

    const handleDateChange = (date) => {
        setSelectedDate(date.toDate()); // moment object
    }

    const onCreateWorkout = () =>{
        usersWorkoutsRef.add({ date: selectedDate });
        onClose();
        history.push(`/workouts/${moment(selectedDate).format('YYYY-MM-DD')}`);
    }

    const onEditWorkout = () => {
        usersWorkoutsRef.doc(workoutToEdit.id).update({
            date: selectedDate
        });
        onClose();
    }

    const handleCancel = () => {
        setSelectedDate(new Date());
        onClose();
    }


    return(
        <Dialog open={ open } onClose={ handleCancel }>
            <DialogTitle id="workout-form-dialog-title">{editMode ? `Edit your Workout`: `Start a New Workout`}</DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                <form>
                    <Typography variant='body2' align='center' gutterBottom className={classes.sectionTitle}>
                        <strong>Date</strong>
                    </Typography>
                    <br />
                    <DatePicker 
                        label='Date *'
                        value={selectedDate} 
                        onChange={handleDateChange} 
                        showTodayButton
                        variant='outlined'
                        className={classes.input}
                    />
                    <br />
                    <div className={[classes.input, classes.spaceApart].join(' ')}>
                        <Button 
                            style={{marginRight: '10px'}}
                            color="primary" 
                            variant='contained'
                            onClick={editMode ? onEditWorkout : onCreateWorkout}
                            disabled={!selectedDate}
                        >
                            <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                            {editMode ? 'Edit' : 'Create'}
                        </Button>
                        <Button 
                            color="secondary" 
                            variant='contained'
                            onClick={handleCancel}
                        >
                            <Cancel style={{marginRight: '5px'}} fontSize='small' />
                            Cancel
                        </Button>
                    </div>
                </form>
                </MuiPickersUtilsProvider>
            </DialogContent>
        </Dialog>)
}


export default withStyles(styles)(WorkoutDialog);