import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Transactioncard from "./../components/transactions/transactioncard";
import { getTransactionByFilter } from "./../firebase/transaction";
import Spinner from "react-bootstrap/Spinner";
import Empty from "./../components/general/empty.component";
import { Button, Table } from "react-bootstrap";
import { getCurrentUser, getAllTransactions } from "./../firebase/user";
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
  const [allTrans, setAllTrans] = useState([]);
  const graphData = [];
  useEffect(() => {
    async function getmyTransactions() {
      let user = fire.auth().currentUser;
      let pd = await getAllTransactions(user.uid);
      pd.forEach((element) => {
        const dateFormat = new Date(1970, 0, 1);
        dateFormat.setSeconds(element.timestamp.seconds);
        const myDate =
          dateFormat.getMonth() +
          1 +
          "/" +
          dateFormat.getDate() +
          "/" +
          dateFormat.getFullYear();
        graphData.push({
          Date: myDate,
          category: element.category,
          Amount: element.amount,
          Child: element.sender_id,
          State: element.state,
        });
      });
      setAllTrans(graphData);
      // setParentID(pd);
      // setReqM((prev) => {
      //   return {
      //     ...prev,
      //     receiver_id: pd,
      //   };
      // });
    }
    getmyTransactions();
  }, []);
  // console.log(graphData);
  // const getDataFromFB = () => {
  //   //    console.log(filter);
  //   // console.log(TransactionsArr);
  //   let uid = user.uid;
  //   setloading(true);
  //   getTransactionByFilter(
  //     uid,
  //     filter,
  //     (res) => {
  //       let Arr = [];
  //       res.forEach((item) => {
  //         Arr.push(item.data());
  //       });
  //       setTransactionsArr(Arr);
  //       setloading(false);
  //     },
  //     (err) => console.log(err)
  //   );
  // };

  // useEffect(() => {
  //   setloading(true);
  //   fire.auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       setuser(user);
  //       getTransactionByFilter(
  //         user.uid,
  //         "ALL",
  //         (res) => {
  //           let Arr = [];
  //           res.forEach((item) => {
  //             Arr.push(item.data());
  //           });
  //           setTransactionsArr(Arr);
  //           setloading(false);
  //         },
  //         (err) => console.log(err)
  //       );
  //     } else {
  //       //console.log("NO user AUth Change");
  //     }
  //   });
  // }, [loc.pathname]);

  return (
    <Fragment>
      <h1>All Transactions</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Child ID</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>State</th>
          </tr>
        </thead>
        {allTrans && allTrans.length > 0 ? (
          <tbody>
            {allTrans.map((reqq, idx) => (
              <tr key={idx}>
                <td>{reqq.Child}</td>
                <td>{reqq.Amount}</td>
                <td>{reqq.category}</td>
                <td>{reqq.Date}</td>
                <td>{reqq.State}</td>
                {/* <td>{reqq.buttonState === false ? reqq.amount : "-"}</td>
                      <td>
                        {reqq.buttonState === false ? reqq.state : "Done ✅"}
                      </td> */}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody></tbody>
        )}
      </Table>
    </Fragment>
  );
}
