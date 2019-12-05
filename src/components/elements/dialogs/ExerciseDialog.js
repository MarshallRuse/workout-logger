import React, { useContext, useState } from 'react';
import { 
    Button,
    Checkbox,
    Chip,
    Dialog, 
    DialogContent, 
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Cancel, CheckCircle } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import AuthContext from '../../../context/AuthContext';

import { db } from '../../../firebase/firebase';

// TODO: Retrieve these from the user's custom arrays
const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Legs', 'Forearms'];
const equipmentList = ['None', 'Barbell', 'Dumbbell', 'Cables', 'Resistance Band', 'Machine'];
const exerciseModifiers = ['Incline', 'Decline', 'Standing', 'Seated', 'Lying', 'Close-Grip', 'Wide-Grip'];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 * ITEM_PADDING_TOP,
            width: 250
        },
    },
};

const useStyles = makeStyles(theme => ({
    chip: {
        margin: 2
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    input: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-between'
    },
}));

function getStyles(muscleGroup, selectedMuscleGroups, theme){
    return {
        fontWeight: 
            selectedMuscleGroups.indexOf(muscleGroup) === -1
            ?   theme.typography.fontWeightRegular
            :   theme.typography.fontWeightMedium
    };
}

// Exercise Dialog is an Exercise creation dialog with the following fields:
//      Exercise Title (TextField)
//      The Muscle Group(s) the exercise belongs with (List of Checkboxes)
//      The Equipment the exercise uses (List of Checkboxes)
//      Whether the exercise is bilateral or not (radio button)

const ExerciseDialog = ({ open, onClose, editMode, exerciseToEdit, history }) => {
    const { authState } = useContext(AuthContext);
    const classes = useStyles();
    const theme = useTheme();


    const [title, setTitle] = useState(editMode ? exerciseToEdit.title : '');
    const [selectedModifiers, setSelectedModifiers] = useState(editMode ? exerciseToEdit.modifiers : [])
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState(editMode ? exerciseToEdit.muscleGroups : []);
    const [selectedEquipment, setSelectedEquipment] = useState(editMode ? exerciseToEdit.equipment : []);
    const [laterality, setLaterality] = useState(editMode ? exerciseToEdit.laterality : 'unilateral');

    // The Exercises collection
    const exercisesRef = db.collection('users').doc(authState.uid).collection('exercises');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleModifiersChange = (e) => {
        setSelectedModifiers(e.target.value);
    }

    const handleMuscleGroupChange = (e) => {
        setSelectedMuscleGroups(e.target.value);
    }

    const handleEquipmentChange = (e) => {
        console.log('Selected Equipment: ', e.target.value)
        // If other equipment has been selected, unselect None
        let equipments = [];
        if (e.target.value.length > 1 
            && e.target.value.indexOf('None') !== -1){
            equipments = e.target.value.filter(eq => eq !== 'None');
        } else if (e.target.value.length === 0) {
            // If nothing has been selected, enforce selection of None
            equipments = ['None'];
        } else {
            equipments = e.target.value;
        } 


        setSelectedEquipment(equipments);
    }

    const handleLateralityChange = (e) => {
        setLaterality(e.target.value);
    }

    const onCreateExercise = () =>{
        onClose();
        const exercise = {
            title,
            modifiers: selectedModifiers,
            muscleGroups: selectedMuscleGroups,
            equipment: selectedEquipment,
            laterality
        }
        exercisesRef.add(exercise);

        setTitle('');
        setSelectedModifiers([]);
        setSelectedMuscleGroups([]);
        setSelectedEquipment([]);
        setLaterality('unilateral');
    }

    const onEditExercise = () => {
        onClose();
        const exercise = {
            title,
            modifiers: selectedModifiers,
            muscleGroups: selectedMuscleGroups,
            equipment: selectedEquipment,
            laterality
        }
        exercisesRef.doc(exerciseToEdit.id).set(exercise);
        setTitle('');
        setSelectedModifiers([]);
        setSelectedMuscleGroups([]);
        setSelectedEquipment([]);
        setLaterality('unilateral');

    }

    const handleCancel = () => {
        onClose();
    }


    return(
        <Dialog open={ open } onClose={ handleCancel }>
            <DialogTitle id="workout-form-dialog-title">{editMode ? `Edit your Exercise`: `Create a New Exercise`}</DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                <form>
                    <TextField
                        label='Exercise Title *'
                        value={title}
                        onChange={handleTitleChange}
                        margin='normal'
                        variant='outlined'
                        className={classes.input}
                        fullWidth
                    />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor='muscleGroup'>Modifier</InputLabel>
                        <Select
                            multiple
                            value={selectedModifiers}
                            onChange={handleModifiersChange}
                            className={classes.input}
                            renderValue={selected => (
                                <div className={classes.chips}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} className={classes.chip} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {exerciseModifiers 
                                ? exerciseModifiers.map((mod) => 
                                    <MenuItem 
                                        value={mod}
                                        key={mod}
                                        style={getStyles(mod, selectedModifiers, theme)}
                                    >
                                        <Checkbox checked={selectedModifiers.indexOf(mod) > -1} />
                                        <ListItemText primary={mod} />
                                    </MenuItem>
                                )
                                : []
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor='muscleGroup'>Muscle Group *</InputLabel>
                        <Select
                            multiple
                            value={selectedMuscleGroups}
                            onChange={handleMuscleGroupChange}
                            className={classes.input}
                            renderValue={selected => (
                                <div className={classes.chips}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} className={classes.chip} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {muscleGroups 
                                ? muscleGroups.map((group) => 
                                    <MenuItem 
                                        value={group}
                                        key={group}
                                        style={getStyles(group, selectedMuscleGroups, theme)}
                                    >
                                        <Checkbox checked={selectedMuscleGroups.indexOf(group) > -1} />
                                        <ListItemText primary={group} />
                                    </MenuItem>
                                )
                                : []
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor='muscleGroup'>Equipment *</InputLabel>
                        <Select
                            multiple
                            value={selectedEquipment}
                            onChange={handleEquipmentChange}
                            className={classes.input}
                            renderValue={selected => (
                                <div className={classes.chips}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} className={classes.chip} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {equipmentList 
                                ? equipmentList.map((equipment) => 
                                    <MenuItem 
                                        value={equipment}
                                        key={equipment}
                                        style={getStyles(equipment, selectedEquipment, theme)}
                                    >
                                        <Checkbox checked={selectedEquipment.indexOf(equipment) > -1} />
                                        <ListItemText primary={equipment} />
                                    </MenuItem>
                                )
                                :   <MenuItem
                                        value='None'
                                        key='None'
                                    >
                                        <Checkbox checked/>
                                        <ListItemText primary={'None'} />
                                    </MenuItem>
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <FormControl component="fieldset" className={[classes.formControl, classes.input].join(' ')}>
                        <FormLabel component="legend" style={{marginBottom: '15px'}}>Laterality</FormLabel>
                        <RadioGroup row aria-label="select-laterality" name="laterality" value={laterality} onChange={handleLateralityChange}>
                            <FormControlLabel
                                value="unilateral"
                                control={<Radio color="secondary" />}
                                label="Unilateral"
                            />
                            <FormControlLabel
                                value="bilateral"
                                control={<Radio color="secondary" />}
                                label="Bilateral"
                            />
                        </RadioGroup>
                    </FormControl>
                    <br />
                    <div className={[classes.input, classes.spaceApart].join(' ')}>
                        <Button 
                            style={{marginRight: '10px'}}
                            color="primary" 
                            variant='contained'
                            onClick={editMode ? onEditExercise : onCreateExercise}
                            disabled={!title && !selectedMuscleGroups && !selectedEquipment && !laterality}
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


export default ExerciseDialog;