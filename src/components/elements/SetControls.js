import React, { useState, useEffect, useContext } from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { 
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Add, Cancel, CheckCircle, DeleteForever, ExpandMore, Remove } from '@material-ui/icons';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';

import WorkoutContext from '../../context/WorkoutContext';


const useStyles = makeStyles(theme => ({
    bigButton: {
        height: '100%'
    },
    bigInput: {
        backgroundColor: '#fff',
        fontSize: '2rem',
        fontWeight: 500
    },
    bigInput__input: {
        padding: '24px 0',
        textAlign: 'center'
    },
    dialogTitle: {
        textAlign: 'center'
    },
    expansionPanelRoot: {
        backgroundColor: theme.palette.primary.main,
        border: 'none',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        }
    },
    expansionPanelSummaryContent: {
        flexGrow: 0
    },  
    expansionPanelSummaryContent__icon: {
        color: theme.palette.primary.contrastText
    },
    expansionPanelDetails: {
        flexWrap: 'wrap',
        padding: 0
    },
    input: {
        marginTop: '10px',
        marginBottom: '40px'
    },
    inputRow: {
        display: 'flex',
        wrap: 'nowrap',
        margin: '10px 0'
    },
    mainButton: {
        padding: '15px',
    },
    mainButton__confirm: {
        backgroundColor: '#fff',
        '&:disabled': {
            backgroundColor: theme.palette.grey[200]
        }
    },
    radioChecked: {
        color: theme.palette.secondary.light
    },
    radioLabel: {
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 700
    },
    radioRoot: {
        color: '#fff',
    },
    radioRow: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    timeInput: {
        textAlign: 'center',
        fontSize: '1.5rem'
    }
}));

const SetControls = ({ 
    laterality, 
    editMode, 
    setToEdit, 
    prevSetStats,
    onCreateSet, 
    onEditSet, 
    onDeleteSet 
}) => {
    const classes = useStyles();

    //Context
    const { workoutState } = useContext(WorkoutContext);

    // State
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [side, setSide] = useState('');
    const [units, setUnits] = useState('lbs');
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [timeWasSelected, setTimeWasSelected] = useState(false);
    const [editValuesFilled, setEditValuesFilled] = useState(false);


    useEffect(() => {
        if (!editValuesFilled && editMode && setToEdit){
            const setToEditWeight = setToEdit.units === 'lbs' ? setToEdit.weightLbs : setToEdit.weightKg;
            setWeight(setToEditWeight);
            setReps(setToEdit.reps);
            setSide(setToEdit.side);
            setUnits(setToEdit.units);
            setSelectedTime(setToEdit.completedAt.toDate());

            setEditValuesFilled(true);
        }
    }, [editValuesFilled, editMode, setToEdit])

    useEffect(() => {
        if (prevSetStats){
            setWeight(prevSetStats.weight);
            setReps(prevSetStats.reps);
            setUnits(prevSetStats.units);
            setSelectedTime(new Date());
        }
    }, [prevSetStats]);


    // methods
    const handleWeightChange = (e) => {
        const weight = e.target.value;
        if (!weight || weight.match(/^\d{1,4}(\.\d{0,1})?$/)){
            setWeight(weight ? Number.parseFloat(weight) : '');
        }
    }

    const handleDecrementWeight = () => {
        if (!weight){
            setWeight(0);
        } else {
            const currentWeight = Number.parseFloat(weight);
            const newWeight = currentWeight - 5;
            setWeight(newWeight < 0 ? 0 : newWeight);
        }
    }

    const handleIncrementWeight = () => {
        if (!weight){
            setWeight(5);
        } else {
            const currentWeight = Number.parseFloat(weight);
            const newWeight = currentWeight + 5;
            setWeight(newWeight > 9999 ? 9999 : newWeight);
        }
    }

    const handleRepsChange = (e) => {
        const reps = e.target.value;
        if (!reps || reps.match(/^\d{1,4}(\.\d{0,1})?$/)){
            setReps(reps ? Number.parseFloat(reps) : '');
        }
    }

    const handleDecrementReps = () => {
        if (!reps){
            setReps(0);
        } else {
            const currentReps = Number.parseFloat(reps);
            const newReps = currentReps - 1;
            setReps(newReps < 0 ? 0 : newReps);
        }
    }

    const handleIncrementReps = () => {
        if (!reps){
            setReps(1);
        } else {
            const currentReps = Number.parseFloat(reps);
            const newReps = currentReps + 1;
            setReps(newReps > 9999 ? 9999 : newReps);
        }
    }

    const handleSideChange = (e) => {
        setSide(e.target.value);
    }

    const handleUnitsChange = (e) => {
        setUnits(e.target.value);
    }

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        setTimeWasSelected(true);
    }

    const addSet = () =>{

        let weightLbs, weightKg
        if (units === 'kg'){
            weightLbs = kgToLbs(weight);
            weightKg = formatWeight(weight);
        } else {
            weightKg = lbsToKg(weight);
            weightLbs = formatWeight(weight);
        }

        let timeCompleted = selectedTime;
        if (!timeWasSelected){
            timeCompleted = moment(new Date());
        }
        const date = moment(workoutState.currentWorkout.date.toDate());
        const dateCorrectTime = moment().set({
            year: date.get('year'),
            month: date.get('month'), 
            date: date.get('date'), 
            hour: timeCompleted.get('hour'),
            minute: timeCompleted.get('minute')
        });
        
        const setObj = {
            weightLbs,
            weightKg,
            reps,
            units,
            side,
            completedAt: dateCorrectTime.toDate()
        }

        onCreateSet(setObj);
        setWeight('');
        setReps('');
        setUnits('lbs');
        setSide('');
        setSelectedTime('');
    }

    const editSet = () => {
        let weightLbs, weightKg
        if (units === 'kg'){
            weightLbs = kgToLbs(weight);
            weightKg = formatWeight(weight);
        } else {
            weightKg = lbsToKg(weight);
            weightLbs = formatWeight(weight);
        }

        let timeCompleted = selectedTime;
        if (!timeWasSelected){
            timeCompleted = moment(new Date());
        }

        const date = moment(workoutState.currentWorkout.date.toDate());
        const dateCorrectTime = moment().set({
            year: date.get('year'),
            month: date.get('month'), 
            date: date.get('date'), 
            hour: timeCompleted.get('hour'),
            minute: timeCompleted.get('minute')
        });
        
        const setObj = {
            id: setToEdit.id,
            weightLbs,
            weightKg,
            reps,
            units,
            side,
            completedAt: dateCorrectTime.toDate()
        }

        onEditSet(setObj);
        setWeight('');
        setReps('');
        setUnits('lbs');
        setSide('');
        setSelectedTime('');
    }

    const handleDelete = () => {
        onDeleteSet(setToEdit);
    }

    const handleCancel = () => {
        setWeight('');
        setReps('');
        setUnits('lbs');
        setSide('');
        setSelectedTime('');
    }

    const lbsToKg = weight => formatWeight(weight * 0.453592);
    const kgToLbs = weight => formatWeight(weight * 2.20462);

    const formatWeight = w =>  Number.parseFloat(Number.parseFloat(w).toFixed(1))

    return (
        <form>
            <Grid container>
                <Grid item xs={12} className={classes.inputRow}>
                    <Grid item xs={3}>
                        <Button 
                            variant='contained' 
                            color='default'
                            className={classes.bigButton}
                            onClick={handleDecrementWeight}
                            fullWidth
                        >
                            <Remove fontSize='large' />
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            placeholder='Weight *'
                            value={weight}
                            onChange={handleWeightChange}
                            type='tel'
                            variant='outlined'
                            InputLabelProps={{ classes: { root: classes.bigLabel } }}
                            InputProps={{ classes: { input: classes.bigInput} }}
                            inputProps={{ className: classes.bigInput__input }}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button 
                            variant='contained' 
                            color='default'
                            className={classes.bigButton}
                            onClick={handleIncrementWeight}
                            fullWidth
                        >
                            <Add fontSize='large' />
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='body1' style={{color: '#fff', width: '100%' }} align='center'>
                    {units}
                </Typography>
            </Grid>
            <br />
            <Grid item xs={12} className={classes.inputRow}>
                <Grid item xs={3}>
                    <Button 
                        variant='contained' 
                        color='default'
                        className={classes.bigButton}
                        onClick={handleDecrementReps}
                        fullWidth
                        autoFocus={true}
                    >
                        <Remove fontSize='large' />
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <TextField 
                        placeholder='Reps *'
                        value={reps}
                        onChange={handleRepsChange}
                        type='tel'
                        variant='outlined'
                        InputLabelProps={{ classes: { root: classes.bigLabel } }}
                        InputProps={{ classes: { input: classes.bigInput } }}
                        inputProps={{ className: classes.bigInput__input }}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button 
                        variant='contained' 
                        color='default'
                        className={classes.bigButton}
                        onClick={handleIncrementReps}
                        fullWidth
                    >
                        <Add fontSize='large' />
                    </Button>
                </Grid>
            </Grid>
            <br />
            {laterality === 'unilateral' && (
                <>
                <FormControl component="fieldset" className={classes.input} fullWidth>
                    <FormLabel component="legend" style={{color: '#fff', marginBottom: '15px'}}>Side</FormLabel>
                    <RadioGroup 
                        row aria-label="select-side" 
                        name="side" 
                        value={side} 
                        onChange={handleSideChange}
                        className={classes.radioRow}
                    >
                        <FormControlLabel
                            value="left"
                            control={
                                <Radio 
                                    color="secondary"
                                    classes={{
                                        checked: classes.radioChecked,
                                        root: classes.radioRoot,
                                    }} 
                                />}
                            classes={{
                                label: classes.radioLabel
                            }}
                            label="Left"
                        />
                        <FormControlLabel
                            value="right"
                            control={
                                <Radio 
                                    color="secondary"
                                    classes={{
                                        checked: classes.radioChecked,
                                        root: classes.radioRoot,
                                    }} 
                                />}
                            classes={{
                                label: classes.radioLabel
                            }}
                            label="Right"
                        />
                    </RadioGroup>
                </FormControl>
                <br />
                </>
            )}
            <ExpansionPanel 
                classes={{ root: classes.expansionPanelRoot }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    classes={{ content: classes.expansionPanelSummaryContent }}
                    IconButtonProps={{
                        size: 'medium',
                        classes: {
                            root: classes.expansionPanelSummaryContent__icon
                        }
                    }}
                />
                <ExpansionPanelDetails classes={{ root: classes.expansionPanelDetails }}>
                    <Paper style={{padding: '20px'}}>
                    <FormControl component="fieldset" className={classes.input} fullWidth>
                        <FormLabel component="legend" style={{marginBottom: '15px'}}>Units</FormLabel>
                        <RadioGroup 
                            row aria-label="select-units" 
                            name="units" 
                            value={units} 
                            onChange={handleUnitsChange}
                            className={classes.radioRow}
                        >
                            <FormControlLabel
                                value="lbs"
                                control={<Radio color="secondary" />}
                                classes={{
                                    label: classes.radioLabel
                                }}
                                label="lbs"
                            />
                            <FormControlLabel
                                value="kg"
                                control={<Radio color="secondary" />}
                                classes={{
                                    label: classes.radioLabel
                                }}
                                label="kg"
                            />
                        </RadioGroup>
                    </FormControl>
                    <br />
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <TimePicker 
                            autoOk 
                            label="Completion Time" 
                            value={selectedTime} 
                            onChange={handleTimeChange} 
                            inputVariant='outlined'
                            openTo='minutes'
                            InputProps={{
                                classes: {
                                    input: classes.timeInput
                                }
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    <br />
                    {editMode && (
                        <Button 
                            color="secondary" 
                            variant='contained'
                            onClick={handleDelete}
                            className={classes.mainButton}
                            style={{marginTop: '50px'}}
                            fullWidth
                        >
                            <DeleteForever style={{marginRight: '5px'}} fontSize='small' />
                            Delete Set
                        </Button>
                    )}
                    </Paper>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <br />
            <Grid container className={[classes.input, classes.spaceApart].join(' ')}>
                <Grid item xs={5}>
                    <Button 
                        color="secondary" 
                        variant='contained'
                        onClick={handleCancel}
                        className={classes.mainButton}
                        fullWidth
                    >
                        <Cancel style={{marginRight: '5px'}} fontSize='small' />
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={5}>
                    <Button 
                        variant='contained'
                        onClick={editMode ? editSet : addSet}
                        disabled={!weight || !reps}
                        className={[classes.mainButton, classes.mainButton__confirm].join(' ')}
                        fullWidth
                    >
                        <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                        {editMode ? 'Edit' : 'Add'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}


export default SetControls;