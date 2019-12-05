import React, { useState, useContext } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, InputAdornment, TextField, Typography,  } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Cancel, CheckCircle, Email, Lock, MailOutline } from '@material-ui/icons';

// context
import AuthContext from '../../context/AuthContext';

// resources
import barbellImage from '../../resources/images/barbellLoading.jpg';
import initialExercises from '../../resources/data/initialExercisesList';

import { auth, db } from '../../firebase/firebase';

const styles = theme => ({
    button: {
        padding: '30px',
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
        
    },
    container: {
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            paddingTop: '50%'
        },
        [theme.breakpoints.up('sm')]: {
            margin: '0 auto'
        }        
    },
    contrastText: {
        color: '#fff',
        padding: '20px'
    },
    input: {
        marginTop: '10px',
        marginBottom: '20px'
    },
    loginPageBackground: {
        backgroundImage: ['linear-gradient(45deg, black, transparent)', `url(${ barbellImage })`],
        backgroundSize: 'cover',
        height: '100%'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    }
})

const LoginPage = ({ classes, history }) => {

    const { authDispatch } = useContext(AuthContext);

    const [authType, setAuthType] = useState(''); // 'signup' or 'login'
    const [authEmailDialogOpen, setAuthEmailDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignUp = () => {
        setAuthType('signup');
        setAuthEmailDialogOpen(true);
    }

    const onSignUp = async () => {
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, password);
            // initialize exercise list
            const batch = db.batch();
            const exercisesRef = db.collection('users').doc(cred.user.uid).collection('exercises');
            initialExercises.forEach((exercise) => {
                const newExerciseRef = exercisesRef.doc();
                batch.set(newExerciseRef, exercise);
            })
            await batch.commit();
            authDispatch({ type: 'LOGIN', uid: cred.user.uid });
            setEmail('');
            setPassword('');
            setAuthEmailDialogOpen(false);
        } catch(err){
            console.log('Error Signing Up');
        }
        
    }

    const handleLogin = () => {
        setAuthType('login');
        setAuthEmailDialogOpen(true);
    }

    const onLogin = async () => {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        authDispatch({ type: 'LOGIN', uid: cred.user.uid });
        setEmail('');
        setPassword('');
        setAuthEmailDialogOpen(false);
    }

    const handleCancel = () => {
        setAuthEmailDialogOpen(false);
        setEmail('');
        setPassword('');
    }

    return (
        <>
        <div className={classes.loginPageBackground}>
            <Grid container justify='center' alignItems='center' className={classes.container}>
                <Grid item xs={8} sm={12} align='center'>
                    <Button variant='contained' color='primary' className={classes.button} onClick={handleLogin}>
                        <MailOutline style={{marginRight: '10px'}} />
                        Login With Email
                    </Button>
                </Grid>
                <Grid item xs={8} sm={12} align='center'>
                    <Typography variant='body1' className={classes.contrastText}>
                        Haven't started a Journal yet? Join us!
                    </Typography>
                    <Button 
                        variant='contained' 
                        color='primary' 
                        className={classes.button}
                        onClick={handleSignUp}
                        
                    >
                        <MailOutline style={{marginRight: '10px'}} />
                        Sign Up with Email
                    </Button>
                </Grid>
            </Grid>
        </div>
        <Dialog open={ authEmailDialogOpen } onClose={handleCancel}>
            <DialogTitle>{`${authType === 'signup' ? `Sign Up` : `Login`} with Email`}</DialogTitle>
            <DialogContent>
                <TextField 
                    label='Email'
                    value={email}
                    onChange={handleEmailChange}
                    margin='normal'
                    className={classes.input}
                    variant='outlined'
                    type='email'
                    fullWidth
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                />
                <TextField 
                    label='Password'
                    value={password}
                    onChange={handlePasswordChange}
                    margin='normal'
                    className={classes.input}
                    variant='outlined'
                    type='password'
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                      }}
                    fullWidth
                />
                <div className={[classes.input, classes.spaceApart].join(' ')}>
                <Button 
                    style={{marginRight: '10px'}}
                    color="primary" 
                    variant='contained'
                    onClick={authType === 'signup' ? onSignUp : onLogin}
                    disabled={!email || password.length < 6}
                >
                    <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                    {authType === 'signup' ? 'Sign Up' : 'Login'}
                </Button>
                <Button 
                    color="secondary" 
                    variant='contained'
                    onClick={handleCancel}
                >
                    <Cancel style={{marginRight: '5px'}} fontSize='small' />
                    Cancel
                </Button>
            </div>
            </DialogContent>
        </Dialog>
        </>
    );
}

export default withStyles(styles)(LoginPage);