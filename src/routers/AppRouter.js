import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import LoginPage from '../components/pages/LoginPage';
import WorkoutsPage from '../components/pages/WorkoutsPage';
import WorkoutInstancePage from '../components/pages/WorkoutInstancePage';
import ExerciseSelectionPage from '../components/pages/ExerciseSelectionPage';
import ExercisesPage from '../components/pages/ExercisesPage';
import ExercisePage from '../components/pages/ExercisePage';
import ExerciseInstancePage from '../components/pages/ExerciseInstancePage';
import NotFoundPage from '../components/pages/NotFoundPage';

import PrivateRoute from './PrivateRoute';
import LoadingPage from '../components/pages/LoadingPage';


const AppRouter = ({ history }) => { 

    return (
    
    //<BrowserRouter> // not used when controlling our own history
    <Router history={history}>
        <>
            <Switch>
                <Route path='/' component={LoadingPage} exact={true} />
                <Route path='/authenticate' component={LoginPage} exact={true} />
                <PrivateRoute path='/workouts' component={WorkoutsPage} exact={true} />
                <PrivateRoute path='/workouts/:workoutID' component={WorkoutInstancePage} exact={true} />
                <PrivateRoute path='/workouts/:workoutID/exercise_selection' component={ExerciseSelectionPage} exact={true} />
                <PrivateRoute path='/workouts/:workoutID/exercise/:exerciseID' component={ExerciseInstancePage}/>
                <PrivateRoute path='/exercises' component={ExercisesPage} exact={true} />
                <PrivateRoute path='/exercises/:exerciseID' component={ExercisePage}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </>
    </Router>
)};

export default AppRouter;