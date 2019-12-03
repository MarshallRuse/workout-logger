import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { 
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { MoreHoriz } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    costDiv: {
        marginTop: '5px',

    },
    flags: {
        marginRight: '10px',
        marginTop: '5px',
        marginBottom: '2px'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
}));

class ExerciseInstanceCard extends Component {

    state = {
        moreActionsOpen: false,
        anchorEl: undefined,
        exercises: [],
        dateRange: '',
        numUniqueExercises: 0,
    }

    toggleMoreActionsOpen = (event) => {

        this.setAnchorEl(event);

        this.setState((prevState) => ({ 
            moreActionsOpen: !prevState.moreActionsOpen
        }))
    }

    setAnchorEl = (event) => {
        const anchorEl = this.state.anchorEl ? undefined : event.currentTarget;

        this.setState(() => ({
            anchorEl
        }))
    }

    handleEditSelection = () => {
        
    }

    handleDeleteSelection = () => {
        
    }


    render() {

        const classes = useStyles();
        const { exercise, history } = this.props;

        return (
            
                <ButtonBase 
                    focusRipple
                    style={{width: '100%'}}
                >
                <Card className={classes.card}>
                <Link to={`${history.location.pathname}/${exercise.titlePathFormat}`} className={classes.link}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {exercise.title}
                        </Typography>
                        <Typography varaint='body2' color="textSecondary">
                            <strong>Best Set: </strong> 180 lbs x 12
                            {/* { this.state.dateRange && this.state.dateRange } */}
                        </Typography>
                        <Typography variant='body2' color='primary'>
                            <strong>Completed at: </strong> 2:30pm
                        </Typography>

                    </CardContent>
                    </Link>
                    <CardActions className={classes.cardActions}>
                        <MoreHoriz onClick={this.toggleMoreActionsOpen}/>
                        <Menu
                            id="long-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.moreActionsOpen}
                            onClose={this.toggleMoreActionsOpen}
                            PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                            }}
                        >
                            <MenuItem  onClick={this.handleEditSelection}>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={this.handleDeleteSelection}>
                                Delete
                            </MenuItem> 
                        </Menu>
                    </CardActions>
                </Card>
                </ButtonBase>
        )
    }
}

export default ExerciseInstanceCard;