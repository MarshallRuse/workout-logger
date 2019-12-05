import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    ButtonBase,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Paper, 
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ExercisesContext from '../../context/ExercisesContext';

import listString from '../../resources/utils/listString';

const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Forearms'];

function getExercisesByGroup(allExercises, group){
    return allExercises.filter((exercise) => exercise.muscleGroups.indexOf(group) > -1);
}

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    container: {
        height: 'calc(100% - 56px - 56px)'
    },
    indicator: {
        height: 5,
        width: '82px'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
    },
    listItem: {
        borderBottom: `1px solid ${theme.palette.primary.light}`,
        paddingBottom: '20px',
        paddingTop: '20px'
    },
    listRoot: {
        backgroundColor: theme.palette.background.paper,
        height: 'calc(100% - 56px - 48px)',
        overflow: 'auto',
        position: 'relative',
        width: '100%',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    listSubheader: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        fontSize: '1.3rem',
        fontWeight: 400,
        paddingBottom: '10px',
        paddingTop: '10px'
    },
    paper: { 
        height: '100%', 
        padding: 20,
        overflowY: 'auto' 
    },
    tabRoot: {
        fontSize: '1.0rem',
        padding: '15px'
    },
    toolbar: theme.mixins.toolbar,
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    }
}));

const ExercisesList = ({ context, workoutID }) => {

    const classes = useStyles();

    const { exercisesState, exercisesDispatch } = useContext(ExercisesContext);

    const [muscleGroup, setMuscleGroup] = useState('');


    const index = muscleGroup
        ? muscleGroups.findIndex(group => group === muscleGroup) + 1
        // Else, its 0. ie. 'ALL'
        : 0;

    const onMuscleGroupSelect = (muscleGroup) => {
        setMuscleGroup(muscleGroup);
    }

    const handleExerciseSelect = (exercise) => {
        exercisesDispatch({ type: 'SET_SELECTED_EXERCISE', selectedExercise: exercise }); 
    } 

    const onIndexSelect = (e, index) => onMuscleGroupSelect(muscleGroups[index - 1])


    return (
        <>
        <List className={classes.listRoot} subheader={<li />}>
            {index === 0 // Tab is 'ALL'
                // Show all exercises by sticky subheader muscle group
                ? (muscleGroups && muscleGroups.length > 0) // If there are muscle groups
                    ?   muscleGroups.map((group) => (
                        <li key={`section-${group}`} className={classes.listSection}>
                            <ul className={classes.ul}>
                                <ListSubheader className={classes.listSubheader}>{group}</ListSubheader>
                                {getExercisesByGroup(exercisesState.exercises, group).map((groupedExercise, index) => {

                                    // Inline template string was getting a bit long and wasn't behaving
                                    let exerciseTitle = groupedExercise.title;
                                    if (groupedExercise.modifiers && groupedExercise.modifiers.length > 0){
                                        exerciseTitle += ' (' + listString(groupedExercise.modifiers) + ')';
                                    }

                                    // Link depends on context. If list is on Exercises page, link leads
                                    // to Exercise Page. If list is on workout page, leads to exercise instance
                                    const link = context === 'main-page' 
                                                    ? `/exercises/${groupedExercise.id}` 
                                                    : `/workouts/${workoutID}/exercise/${groupedExercise.id}`;

                                    return (
                                        <Link 
                                            to={link}
                                            key={`item-${group}-${groupedExercise.title}-${index}`}
                                            className={classes.link}
                                        >
                                            <ButtonBase 
                                                onClick={() => handleExerciseSelect(groupedExercise)}
                                                style={{ width: '100%' }}
                                            >
                                                <ListItem className={classes.listItem}>
                                                    <ListItemText 
                                                        primary={exerciseTitle}
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontSize: '1.2rem'
                                                            }
                                                        }}
                                                        secondary={groupedExercise.equipment[0] !== 'None' ? groupedExercise.equipment : 'Bodyweight'}
                                                        secondaryTypographyProps={{
                                                            style: {
                                                                fontSize: '1.0rem',
                                                            }
                                                        }}   
                                                    />
                                                </ListItem>
                                            </ButtonBase>
                                        </Link>
                                    )})
                                }
                            </ul>
                        </li>
                    ))
                    // Add an exercise message
                    :   (<Paper className={classes.paper}>
                            <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                Add your first exercise!
                            </Typography>
                        </Paper>)
                
                : getExercisesByGroup(exercisesState.exercises, muscleGroup).map((groupedExercise, index) => {
                    
                    // Inline template string was getting a bit long and wasn't behaving
                    let exerciseTitle = groupedExercise.title;
                    if (groupedExercise.modifiers && groupedExercise.modifiers.length > 0){
                        exerciseTitle += ' (' + listString(groupedExercise.modifiers) + ')';
                    }

                    // Link depends on context. If list is on Exercises page, link leads
                    // to Exercise Page. If list is on workout page, leads to exercise instance
                    const link = context === 'main-page' 
                                    ? `/exercises/${groupedExercise.id}` 
                                    : `/workouts/${workoutID}/exercise/${groupedExercise.id}`;

                    return (
                        <Link 
                            to={link} 
                            key={`item-${groupedExercise.title}-${index}`} 
                            className={classes.link}
                        >
                            <ButtonBase 
                                onClick={() => handleExerciseSelect(groupedExercise)}
                                style={{ width: '100%' }}
                            >
                                <ListItem className={classes.listItem}>
                                    <ListItemText 
                                        primary={exerciseTitle} 
                                        primaryTypographyProps={{
                                            style: {
                                                fontSize: '1.2rem'
                                            }
                                        }}
                                        secondary={groupedExercise.equipment[0] !== 'None' ? groupedExercise.equipment : 'Bodyweight'} 
                                        secondaryTypographyProps={{
                                            style: {
                                                fontSize: '1.0rem',
                                            }
                                        }}   
                                    />
                                </ListItem>
                            </ButtonBase>
                        </Link>
                    )
                })
            }
        </List>

        <AppBar position='fixed' className={classes.appBar}>
                <Tabs
                    value={index}
                    onChange={onIndexSelect}
                    indicatorColor="secondary"
                    classes={{
                        indicator: classes.indicator
                    }}
                    textColor="inherit"
                    variant='scrollable'
                >
                    <Tab 
                        label='All' 
                        key={'All'}
                        classes={{ root: classes.tabRoot }}
                    />
                    {muscleGroups.map(group => 
                        <Tab 
                            label={group} 
                            key={group}
                            classes={{ root: classes.tabRoot }}
                        />
                        )}
                </Tabs>
            </AppBar>
        </>
    )
}

export default ExercisesList;