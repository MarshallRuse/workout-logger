import React, { createContext } from 'react';
import { useTheme } from '@material-ui/styles';

import AuthContext from './AuthContext';
import PageContext from './PageContext';
import ExercisesContext from './ExercisesContext';
import WorkoutContext from './WorkoutContext';

export const AppContext = createContext();

const ProvideAppContext = props => {
    const theme = useTheme();

    return (
        <AuthContext.Consumer>
            { ({ authState, authDispatch }) => (
                <PageContext.Consumer>
                    { ({ pageState, pageDispatch }) => (
                        <ExercisesContext.Consumer>
                            { ({ exercisesState, exercisesDispatch }) => (
                                <WorkoutContext.Consumer>
                                    { ({ workoutState, workoutDispatch }) => (
                                        <AppContext.Provider value={{ 
                                            authState,
                                            authDispatch,
                                            pageState,
                                            pageDispatch,
                                            exercisesState,
                                            exercisesDispatch,
                                            workoutState,
                                            workoutDispatch,
                                            theme
                                        }}>

                                        {props.children} 

                                        </AppContext.Provider>
                                    )} 
                                </WorkoutContext.Consumer>
                            )}
                        </ExercisesContext.Consumer>
                    )}
                </PageContext.Consumer>
            )}
        </AuthContext.Consumer>
    )
}

export default ProvideAppContext;