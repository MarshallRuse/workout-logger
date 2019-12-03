import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div>
        <div >
            <div>
                <h1>404!</h1> 
                <h2>Where do you think you're going? .</h2>
                <Link to='/workouts'><h3>Get back on the horse</h3></Link>
            </div>
        </div>
    </div>
);

export default NotFoundPage;