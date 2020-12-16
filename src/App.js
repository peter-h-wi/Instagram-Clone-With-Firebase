import React, {useEffect, useState} from "react";
import './App.css';
import Post from "./Post";
import {auth, db} from "./firebase";
import {Modal} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';
import PostRight from "./PostRight";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  // This keeps you logged in
  // useEffect is kinda frontend listener
  useEffect(() => {
    // this below is backend listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);
  // useEffect: Runs a piece of code based on a specific condition
  // when [] changes, run the code eg:[posts]
  useEffect(() => {
    // this is where the code runs
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // everytime a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
      // map is kinda for loop. when you get doc then(=>) get doc.data like caption, imageUrl...

    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className={"app_signup"}>
            <center>
              <img
                  className={"app_headerImage"}
                  src={"https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"}
                  alt={""}
              />
            </center>
            <Input
                placeholder={"username"}
                type={"text"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                placeholder={"email"}
                type={"text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                placeholder={"password"}
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type={"submit"} onClick={signUp}>Sign Up</Button>

          </form>

        </div>

      </Modal>

      <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className={"app_signup"}>
            <center>
              <img
                  className={"app_headerImage"}
                  src={"https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"}
                  alt={""}
              />
            </center>
            <Input
                placeholder={"email"}
                type={"text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                placeholder={"password"}
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type={"submit"} onClick={signIn}>Sign In</Button>

          </form>

        </div>

      </Modal>

      <div className={"app_header"}>
        <div className="app_headerContainer">
          <img
              className={"app_headerImage"}
              src={"https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"}
              alt={""}
          />
          {user ? (
              <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
              <div className={"app_loginContainer"}>
                <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
              </div>
          )}
        </div>
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        <div className="app_postsRight">
          {user && (<PostRight username={user.displayName} email={user.email}/>)}
          {/* Your Avatar */}
          {/* Your Id and Email */}
          {/*<InstagramEmbed*/}
          {/*    url='https://www.instagram.com/p/B8Hf6rJAznGY2_g06lo0E2hwZ4ZUS5AwnPGlwo0/'*/}
          {/*    clientAccessToken='324|324'*/}
          {/*    maxWidth={320}*/}
          {/*    hideCaption={false}*/}
          {/*    containerTagName='div'*/}
          {/*    protocol=''*/}
          {/*    injectScript*/}
          {/*    onLoading={() => {}}*/}
          {/*    onSuccess={() => {}}*/}
          {/*    onAfterRender={() => {}}*/}
          {/*    onFailure={() => {}}*/}
          {/*/>*/}
        </div>
      </div>
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ) : (
          <h3>Sorry you need to login to upload.</h3>
      )}

    </div>
  );
}

export default App;
