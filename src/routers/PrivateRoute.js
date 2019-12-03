import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/elements/Header';
import Footer from '../components/elements/Footer';

import AuthContext from '../context/AuthContext';
import PageContext from '../context/PageContext';

const PrivateRoute = ({
    component: Component,
    ...rest 
}) => {

    const { authState } = useContext(AuthContext);
    const { pageState } = useContext(PageContext);
    const displayFooter = pageState.currentPage !== 'EXERCISES' && pageState.currentPage !== 'EXERCISE_SELECTION';

    return (
        <Route {...rest} component={(props) => (
            !!authState.uid ? (
                <>
                    <Header />
                    <Component {...props} />
                    {displayFooter &&  <Footer />  
                    }
                </>
            ) : (
                <Redirect to='/' />
            ))
        }/>
    )
};
    

export default PrivateRoute;