import React, { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import SideDrawer from './SideDrawer';


const styles = theme => ({
    flex: {
        flex: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        backgroundColor: '#fafafa',
        marginBottom: '15px',
        paddingBottom: '10px',
        position: 'fixed',
        width: '100%'
    },
    toolbar: theme.mixins.toolbar
})

const Header = ({ classes }) => {

    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const toggleSideDrawer = () => {
        setDrawerOpen((prevState) => !prevState);
    }

    return (
        <Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h5" className={classes.flex}>
                        Workout Logger
                    </Typography>
                    <IconButton 
                        color="inherit" 
                        aria-label="menu"
                        onClick={toggleSideDrawer}
                    >
                        <Menu />
                    </IconButton>
                </Toolbar>
                
            </AppBar>
            <div className={classes.toolbar} /> 
            <SideDrawer open={drawerOpen} close={toggleSideDrawer}/>       
        </Fragment>
    );
}

export default withStyles(styles)(Header);