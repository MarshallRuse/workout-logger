import React from 'react';
import { withStyles } from '@material-ui/styles';

import LoadingGif from '../../resources/images/loader.gif';

const styles = theme => ({
    loader: {
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        width: '100vw'
    },
    loaderImage: {
        height: '6rem',
        width: '6rem',
        [theme.breakpoints.up('sm')]: {
            height: '10rem',
            width: '10rem'
        }
    }
})


const LoadingPage = ({ classes }) => (
    <div className={classes.loader}>
        <img className={classes.loaderImage}  src={LoadingGif} alt='loading gif'/>
    </div>
)

export default withStyles(styles)(LoadingPage);