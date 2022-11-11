import fire from "./fire";
const { v4 } = require("uuid");

//Add new transaction
export const Newtransaction = (
  email,
  { to, amount, category, date, desc, status },
  successFn,
  errorFn
) => {
  let obj = {
    from: email,
    to,
    amount,
    category,
    date,
    desc,
    status,
  };
  const db = fire.firestore();
  db.collection("allocate")
    .add(obj)
    .then((res) => successFn(res))
    .catch((err) => errorFn(err));
};

export const requestMoney = (
  { receiver_id, amount, category },
  successFn,
  errorFn
) => {
  let user = fire.auth().currentUser;
  let transactionData = {
    sender_id: user.uid,
    receiver_id: receiver_id,
    amount: amount,
    timestamp: new Date(),
    state: "Pending",
    category: category,
  };
  const db = fire.firestore();
  db.collection("transactions")
    .add(transactionData)
    .then((res) => successFn(res))
    .catch((err) => errorFn(err));
};

export const allocateMoney = async (childrenIds, amount, category) => {
  const db = fire.firestore();
  console.log(fire,"-=-=-=-=-=-=-=-=-=-=");
  let user = fire.auth().currentUser; 
  user = "FznmidkiCVNOMWuqmZn42JrNrVt1";
  console.log(user,"-0-0-0-0-0-0-0-0-0-0-");
  const currUser = await db.collection("users")
  .doc(user)
  .get();

  console.log(currUser,"-------------------==============-=-=-==-=-=-=-=-=-=-=-=-");

};

//Get Vasooli's by Filter
export const getVasooliByFilter = (email, filter, successFn, errorFn) => {
  //email : Logged in USER email
  const db = fire.firestore();
  //Setting if else as per filter
  if (filter === "PAY") {
    db.collection("vasooli")
      .where("to", "==", email)
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else if (filter === "ASK") {
    db.collection("vasooli")
      .where("from", "==", email)
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else {
    let Arr = [];
    db.collection("vasooli")
      .where("from", "==", email)
      .get()
      .then((res1) => {
        res1.forEach((item) => {
          if (item.exists) Arr.push(item.data());
        });
        db.collection("vasooli")
          .where("to", "==", email)
          .get()
          .then((res2) => {
            res2.forEach((item) => {
              if (item.exists) Arr.push(item.data());
            });
            //console.log(Arr);
            successFn(Arr);
          })
          .catch((err) => errorFn(err));
      })
      .catch((err) => errorFn(err));
  }
};

//Add new transaction
export const updateVasooliStatus = (id, { status }, successFn, errorFn) => {
  let obj = {
    status,
  };
  const db = fire.firestore();
  //  console.log(id);
  db.collection("vasooli")
    .doc(id)
    .set(obj, {
      merge: true,
    })
    .then((res) => successFn(res))
    .catch((err) => errorFn(err));
};
