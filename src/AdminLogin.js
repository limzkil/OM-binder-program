import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#ffcc33'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    fontFamily: 'Open Sans'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#339999',
    fontFamily: 'Open Sans',
    '&:hover': {
      backgroundColor: '#2c8080'
    }
  },
}));

export default function AdminLogin() {
  const classes = useStyles();

  const [authToken, setAuthToken] = useState("")
  const [isError, setIsError] = useState(null)

  useEffect(() => {
    setAuthToken(Cookies.get("auth"))
    if(authToken === undefined){
      setIsError(false)
    } else if(authToken.includes("null")){
      setIsError(true)
    } else {
      setIsError(false)
    }
  }, [authToken, isError])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        <form className={classes.form} noValidate method="POST" action="/login">
          <TextField
            variant="outlined"
            margin="normal"
            helperText={isError ? "Invalid username or password." : null}
            error = {authToken === null ? false : isError}
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            error = {authToken === null ? false : isError}
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}