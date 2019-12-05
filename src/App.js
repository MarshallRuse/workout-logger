// React
import React, { useReducer, useEffect } from 'react';
import { createBrowserHistory }  from 'history';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/styles';
import 'typeface-roboto';

import AppRouter from './routers/AppRouter';

// Firebase
import { auth, db } from './firebase/firebase';

// Context
import AuthContext from './context/AuthContext';
import PageContext from './context/PageContext';
import ExercisesContext from './context/ExercisesContext';
import WorkoutContext from './context/WorkoutContext';

// Reducers
import authReducer from './reducers/authReducer';
import pageReducer from './reducers/pageReducer';
import exercisesReducer from './reducers/exercisesReducer';
import workoutReducer from './reducers/workoutReducer';

// Utility function
import listString from './resources/utils/listString';


// subverting BrowserRouter's own history 
// to be used with login and logout in app.js
export const history = createBrowserHistory();


const formatExerciseTitle = (exercise) => {
  const exerciseTitle = exercise.title;
  let exerciseModifier = '';
  if (exercise.modifiers && exercise.modifiers.length > 0){
    exerciseModifier += '(' + listString(exercise.modifiers) + ')';
  }
  return {exerciseTitle, exerciseModifier};
}


const styles = theme => ({
  '@global': {
    'html, body, #root': {
        height: '100%'
    }
  }
});

const App = () => {
  
  // Create Auth reducer state and dispatch
  const [authState, authDispatch] = useReducer(authReducer, {});
  
  const [pageState, pageDispatch] = useReducer(pageReducer, {});

  const [exercisesState, exercisesDispatch] = useReducer(exercisesReducer, {
    formatExerciseTitle
  });

  const [workoutState, workoutDispatch] = useReducer(workoutReducer, {
    currentWorkout: {}
  });

  useEffect(() => {

    let unsubscribe = undefined;
    async function getUserAuthStatus(){
        unsubscribe = auth.onAuthStateChanged((user) => {
          if (user){
            authDispatch({ type: 'LOGIN', uid: user.uid });
            history.push('/workouts');
          } else {
            authDispatch({type: 'LOGOUT' });
            history.push('/authenticate');
          }
        });  
    }

    getUserAuthStatus();

    return (() => {
      unsubscribe();
    });
  }, []);

  // Fetch the exercises (only when they change) for the whole app, so that they need
  // not be fetched every time a exercise instance is added
  useEffect(() => {
    const unsubscribe =  db.collection(`users/${authState.uid}/exercises`).orderBy('title').onSnapshot((snapshot) => {
        let exercisesDocs = snapshot.docs;
        const exercises = exercisesDocs.map((exDoc) => ({
          id: exDoc.id,
          ...exDoc.data()
        })); 
        exercisesDispatch({type: 'SET_EXERCISES', exercises });
         
     });

     return () => {
         unsubscribe();
     }

 }, [authState.uid]);

  return (
    <CssBaseline>
      <AuthContext.Provider value={{ authState, authDispatch }}>
        <PageContext.Provider value={{ pageState, pageDispatch }}>
          <ExercisesContext.Provider value={{ exercisesState, exercisesDispatch }}>
            <WorkoutContext.Provider value={{ workoutState, workoutDispatch }}>
              <AppRouter history={history} /> 
            </WorkoutContext.Provider>
          </ExercisesContext.Provider>
        </PageContext.Provider>
      </AuthContext.Provider>
    </CssBaseline>
  );
}

export default withStyles(styles)(App);