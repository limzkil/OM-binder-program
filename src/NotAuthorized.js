import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import React from "react"
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },
  avatar: {
    backgroundColor: "#f00",
    width: theme.spacing(11),
    height: theme.spacing(11)
  },
  icon: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  text: {
    fontSize: "2em",
    textAlign: "center"
  }
}))

function NotAuthorized() {

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Avatar className={classes.avatar}>
        <NotInterestedIcon className={classes.icon}/>
      </Avatar>
      <p className={classes.text}>It doesn't appear you are supposed to be here, at least yet.</p>
      <p className={classes.text}>Please go back and log in, thanks!</p>
    </Container>
  )
}

export default NotAuthorized
