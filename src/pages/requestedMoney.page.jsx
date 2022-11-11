import React, { Fragment, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, useLocation } from "react-router-dom";
import { getVasooliByFilter } from "./../firebase/vasooli";
// import fire from "./../firebase/fire";
import Vasoolicard from "./../components/allocateMoney/vasoolicard";
import Empty from "./../components/general/empty.component";
import Form from "react-bootstrap/Form";
import fire from "../firebase/fire";
import { getUserData, getParentByChildId } from "../firebase/user";
import { requestMoney } from "./../firebase/vasooli";
export default function RequestedMoneyV() {
  const [filter, setfilter] = useState("ALL");
  const [SendToCardFilter, setSendToCardFilter] = useState("ALL");
  const [VasooliArr, setVasooliArr] = useState([]);
  const [loading, setloading] = useState(true);
  // const [user, setuser] = useState({});
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  const [parentID, setParentID] = useState("");

  let loc = useLocation();
  const getDataFromFB = () => {
    setloading(true);
    let user = fire.auth().currentUser;
    getUserData(
      user?.uid,
      (s) => {
        let userD = s;
        setUserObj(userD);
        if (userD.children.length) {
          setIsParent(true);
        } else {
          setIsParent(false);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    getDataFromFB();
  }, []);

  // const handleGetParentId = (id)=> {
  //   const
  // }
  // useEffect(() => {
  //   if (isParent === true) return;
  //   if (isParent === false) {
  //     let u1 = fire.auth().currentUser;
  //     const getID = async (id) => {
  //       await getParentByChildId(id).then((data) => {
  //         console.log("iiiiiisdddddd", data);
  //         setParentID(data);
  //       });
  //     };
  //     getID(u1.uid);
  //     // await getParentByChildId(u1.uid).then((pID) => {
  //     //   console.log("ppppiiiidddd", pID);
  //     //   setParentID(pID);
  //     // });
  //   }
  // }, []);

  let u1 = fire.auth().currentUser;
  const idid = async () => {
    await getParentByChildId(u1.uid).then((data) => {
      console.log("====== " + data);
    });
  };
  idid();

  // console.log("pID------", parentID);

  return (
    <Fragment>
      <div className="row" style={{ marginBottom: "7px" }}>
        {isParent === false ? (
          <div className="col-6 col-sm-6 col-md-6">
            {/* <input
              type="text"
              className="form-control"
              placeholder="Please enter receiver ID"
            ></input> */}
            <input
              type="text"
              className="form-control"
              placeholder="Amount"
            ></input>
            <Form.Select
              className="custom-select w-100"
              value={filter}
              onChange={(e) => setfilter(e.target.value)}
              aria-label="Default select example"
            >
              <option value="">Select an Option</option>
              <option value="Food">Food</option>
              <option value="Fees">Fees</option>
              <option value="Commute">Commute</option>
              <option value="Stationary">Stationary</option>
              <option value="Medicine">Medicine</option>
              <option value="Bill">Bill</option>
              <option value="Other">Other</option>
            </Form.Select>
            <button
              className="btn btn-outline-info mx-1"
              onClick={getDataFromFB}
            >
              submit
            </button>
          </div>
        ) : (
          <div>you are a parent</div>
        )}
      </div>
      {/* {!loading ? (
        VasooliArr.length > 0 ? (
          VasooliArr.map((single, index) => (
            <Vasoolicard key={index} data={single} filter={SendToCardFilter} />
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
      )} */}
    </Fragment>
  );
}
