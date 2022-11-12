import fire from "./fire";
import axios from "axios";
import firebase1 from 'firebase/app'
import { data } from "jquery";
const firebase = fire;



//Function to Login the Exsiting user
export const FBlogin = ({ email, password }, successFn, errorFn) => {
  let res;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      //console.log("User Logged In");
      res = firebase.auth().currentUser;
      successFn(res);
    })
    .catch(function (error) {
      errorFn(error);
    });
};

//Function to Logout User
export const FBlogout = (successFn, errorFn) => {
  firebase.auth().signOut().then(successFn).catch(errorFn);
};

//Function to Create New User
export const FBsignup = ({ email, password, fullName }, successFn, errorFn) => {
  const userData = {
    name: fullName,
    email: email,
    children: [],
    wallet: 0,
  };
  //Random Number Gen Logic between 1 to 9 for DP
  const db = fire.firestore();
  //Firebase Authentication Signup
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log("user created");
      let user = firebase.auth().currentUser;
      // Pushing to Firestore
      db.collection("users")
        .doc(user.uid)
        .set({ id: user.uid, ...userData })
        .then(() => {
          console.log("Pushed to Firestore");
        })
        .catch((er) => console.log(er));
    })
    .catch(function (error) {
      console.log(error);
      errorFn(error);
    });
};

export const parentResponseToChildRequest = (transactionId, toBeState, successFn, errorFn) => {

  const db = fire.firestore();

  if(toBeState == 'Accept'){
    db.collection("transactions")
      .doc(transactionId)
      .update({
        state: "Done",
      })
      .catch((err) => errorFn(err));
    successFn("Done!");
  }else{
    db.collection("transactions")
      .doc(transactionId)
      .update({
        state: "Denied",
      })
      .catch((err) => errorFn(err));
    successFn("Done!");
  }
  

};

//func to create a child for logged parent
//func need some changes, after child is created, the child gets logged in.
export const createChild = (
  { email, password, fullName, parentId },
  successFn,
  errorFn
) => {
  //Random Number Gen Logic between 1 to 9 for DP
  const db = fire.firestore();
  //Firebase Authentication Signup
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      db.collection("users")
        .doc(parentId)
        .update({
          children: firebase1.firestore.FieldValue.arrayUnion(
            firebase.auth().currentUser.uid
          ),
        })
        .then(() => {
          //add child to the collection.
          const childData = {
            name: fullName,
            email: email,
            children: [],
            wallet: 0,
          };

          db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({ id: firebase.auth().currentUser.uid, ...childData })
            .then(() => {
              console.log("Pushed to Firestore");
            })
            .catch((er) => console.log(er));
        })
        .catch((er) => console.log(er));
    })
    .catch(function (error) {
      console.log(error);
      errorFn(error);
    });
};

//Function to get all user data
export const getUserData = (uid, successFn, errorFn) => {
  const db = fire.firestore();
  db.collection("users")
    .doc(uid)
    .get()
    .then((res) => {
      successFn(res.data());
    })
    .catch((err) => errorFn(err));
};

export const getSpecificUsers = (userIDs, successFn, errorFn) => {
  const db = fire.firestore();
  console.log("senders: ", userIDs);
  db.collection("users")
    .where("id", "in", userIDs)
    .get()
    .then((res) => {
      console.log("length: ", res.docs.length);
      const data = res.docs.map((i) => {
        return i.data();
      });
      console.log("data: ", data);
      successFn(data);
    })
    .catch((err) => errorFn(err));
};

//getAllUsers
export const getAllUser = async () => {
  const db = fire.firestore();
  let allUsers = await db.collection("users").get();
  allUsers = allUsers.docs.map((i) => {
    return i.data();
  });
};
// const d1 = await getAllUser();
// console.log("===="+d1)
// getAllUser().then((data)=>{
//   console.log("===="+data)
// })

export const getParentByChildId = async (childId) => {
  const db = fire.firestore();
  let data1 = await db.collection("users").get();
  let child;
  data1.docs.forEach((i) => {
    i.data().children.forEach((c) => {
      if (c === childId) return (child = i.id);
    });
  });

  return child;
};

export const getTransactionsById = async (pId) => {
  const db = fire.firestore();
  let data = await db.collection("transactions").get();

  let res = [];
  data.docs.forEach((i) => {
    console.log("data:--------- " + pId);
    if (i.data().receiver_id === pId && i.data().state === "Pending") {
      res.push({...i.data(), id: i.id});
    }
  });
  // console.log("res", res);
  return res;
};

//Updating Document in FB Firestore
export const updateUserData = (
  uid,
  { email, fullName, profilePic, address },
  successFn,
  errorFn
) => {
  const db = fire.firestore();
  db.collection("users")
    .doc(uid)
    .set(
      {
        email,
        fullName,
        profilePic,
        address,
      },
      { merge: true }
    )
    .then(successFn)
    .catch((err) => errorFn(err));
};

//Get Current User
export const getCurrentUser = () => {
  fire.auth().onAuthStateChanged(function (user) {
    if (user) {
      return user;
    } else {
      console.log("NO user AUth Change");
    }
  });
};

//Get all the Users List
export const getUserList = (successFn, errorFn) => {
  fetch("https://us-central1-vasoolimoney.cloudfunctions.net/app")
    .then((res) => res.json())
    .then((res) => {
      //console.log(res);
      successFn(res);
    })
    .catch((err) => errorFn(err));
};