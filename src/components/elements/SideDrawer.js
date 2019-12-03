import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FitnessCenter, Info, Subject } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import PageContext from '../../context/PageContext';
import AuthContext from '../../context/AuthContext';

const useStyles = makeStyles(theme => ({
    drawer: {
        flexShrink: 0, 
        zIndex: [theme.zIndex.appBar - 10, '!important']
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    },
    listIcon: {
        minWidth: '40px'
    },
    listText: {
        minWidth: '60px',
        textDecoration: 'none'
    },
    paper: {
        background: theme.palette.primary.light,
        zIndex: [theme.zIndex.appBar - 10, '!important']
    },
    toolbar: theme.mixins.toolbar
}))

const SideDrawer = ({ open, close }) => {
    const classes = useStyles();

    const { authDispatch } = useContext(AuthContext);
    const { pageState } = useContext(PageContext);

    const closeSideDrawer = () => {
        close();
    }

    const handleLogout = () => {
        authDispatch({ type: 'LOGOUT' });
        closeSideDrawer();
    }

    return (
        <Drawer 
            anchor='right'
            open={open} 
            onClose={closeSideDrawer} 
            className={[classes.drawer, classes.paper].join(' ')}
        >
            <div className={classes.toolbar} />
            <List>
                <Link to='/workouts' className={classes.link}>
                    <ListItem button selected={pageState.currentPage === 'WORKOUTS'} onClick={closeSideDrawer}>
                        <ListItemIcon className={classes.listIcon} >
                            <FitnessCenter />
                        </ListItemIcon>
                        <ListItemText primary='Workouts' className={classes.listText} />
                    </ListItem>
                </Link>
                <Link to='/exercises' className={classes.link}>
                    <ListItem button selected={pageState.currentPage === 'EXERCISES'} onClick={closeSideDrawer}>
                        <ListItemIcon className={classes.listIcon} >
                            <Subject />
                        </ListItemIcon>
                        <ListItemText primary='Exercises' className={classes.listText} />
                    </ListItem>
                </Link>
                <Link to='/about' className={classes.link}>
                    <ListItem button selected={pageState.currentPage === 'ABOUT'} onClick={closeSideDrawer}>
                        <ListItemIcon className={classes.listIcon}>
                            <Info />
                        </ListItemIcon>
                        <ListItemText primary='About' className={classes.listText} />
                    </ListItem>
                </Link>
                
                <ListItem button selected={pageState.currentPage === 'ABOUT'} onClick={handleLogout}>
                    <ListItemText primary='Logout' className={classes.listText} />
                </ListItem>
            
            </List>
        </Drawer>
    )
}

export default SideDrawer;