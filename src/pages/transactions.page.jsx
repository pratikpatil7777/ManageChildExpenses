import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Transactioncard from "./../components/transactions/transactioncard";
import { getTransactionByFilter } from "./../firebase/transaction";
import Spinner from "react-bootstrap/Spinner";
import Empty from "./../components/general/empty.component";

import { getCurrentUser } from "./../firebase/user";
import fire from "./../firebase/fire";
const labels = {
  ALL: "All",
  INC: "Incomes",
  EXP: "Expenses",
};

export default function TransactionsV() {
  const [filter, setfilter] = useState("ALL");
  const [TransactionsArr, setTransactionsArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState({});
  let loc = useLocation();

  const getDataFromFB = () => {
    //    console.log(filter);
    // console.log(TransactionsArr);
    let uid = user.uid;
    setloading(true);
    getTransactionByFilter(
      uid,
      filter,
      (res) => {
        let Arr = [];
        res.forEach((item) => {
          Arr.push(item.data());
        });
        setTransactionsArr(Arr);
        setloading(false);
      },
      (err) => console.log(err)
    );
  };

  useEffect(() => {
    setloading(true);
    fire.auth().onAuthStateChanged(function (user) {
      if (user) {
        setuser(user);
        getTransactionByFilter(
          user.uid,
          "ALL",
          (res) => {
            let Arr = [];
            res.forEach((item) => {
              Arr.push(item.data());
            });
            setTransactionsArr(Arr);
            setloading(false);
          },
          (err) => console.log(err)
        );
      } else {
        //console.log("NO user AUth Change");
      }
    });
  }, [loc.pathname]);

  return (
    <Fragment>
      {!loading ? (
        TransactionsArr.length > 0 ? (
          TransactionsArr.map((trans, index) => (
            <Transactioncard key={index} trans={trans} />
          ))
        ) : (
          <Empty />
        )
      ) : (
        <div className="w-100 d-flex justify-content-center">
          <Spinner
            animation="border"
            role="status"
            style={{ width: "70px", height: "70px", margin: "auto" }}
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </Fragment>
  );
}
