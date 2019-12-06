import React from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
} from '@material-ui/core';
import { FilterList } from '@material-ui/icons';


const styles = theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
       // zIndex: [theme.zIndex.modal + 10, '!important']
      },
      grow: {
        flexGrow: 1,
      },
      fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
      },
      toolbar: theme.mixins.toolbar
});

const Footer = ({ classes  }) => {

    return (
        <>
            <div className={classes.toolbar} />
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                </Toolbar>
            </AppBar>
        </>);
}

export default withStyles(styles)(Footer);