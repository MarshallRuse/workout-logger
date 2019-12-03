import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import { 
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';


const styles = theme => ({
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
})

class WorkoutCard extends Component {

    state = {
        moreActionsOpen: false,
        anchorEl: undefined,
        exercises: [],
        dateRange: '',
        numUniqueExercises: 0,
    }

    async componentDidMount(){
        this.fetchAndSetExercisesData();
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.workout !== this.props.workout){
            this.fetchAndSetExercisesData();
        }
    }

    async fetchAndSetExercisesData(){
        try {
            
            // this.setState(() => ({
            //     expenses,
            //     dateRange,
            //     numUniqueCities,
            //     uniqueCountries,
            //     totalCost
            // }));
        } catch (err){
            console.log('Could not find exercises for WorkoutCard,', err);
        }
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
        this.props.editWorkout(this.props.workout);
        this.toggleMoreActionsOpen();
    }

    handleDeleteSelection = () => {
        this.props.deleteWorkout(this.props.workout._id);
        this.toggleMoreActionsOpen();
    }


    render() {

        const { classes, workout } = this.props;

        return (
            
                <ButtonBase 
                    focusRipple
                    style={{width: '100%'}}
                >
                <Card className={classes.card}>
                <Link to={`/workouts/${workout.id}`} className={classes.link}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Title
                        </Typography>
                        <Typography varaint='body2' color="textSecondary">
                            {moment(workout.data().date.toDate()).format('MMM DD, YYYY')}
                        </Typography>
                        <Typography variant='body2' color='primary'>
                            Duration: 2h 10m
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

export default withStyles(styles)(WorkoutCard);