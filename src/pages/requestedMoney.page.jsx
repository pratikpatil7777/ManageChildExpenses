import React, { Fragment, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, useLocation } from "react-router-dom";
import { getVasooliByFilter } from "./../firebase/vasooli";
import fire from "./../firebase/fire";
import Vasoolicard from "./../components/allocateMoney/vasoolicard";
import Empty from "./../components/general/empty.component";
import Form from "react-bootstrap/Form";

export default function RequestedMoneyV() {
  const [filter, setfilter] = useState("ALL");
  const [SendToCardFilter, setSendToCardFilter] = useState("ALL");
  const [VasooliArr, setVasooliArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState({});
  let loc = useLocation();
  const getDataFromFB = () => {
    let email = user.email;
    setloading(true);

    // setSendToCardFilter(filter);
    // getVasooliByFilter(
    //   email,
    //   filter,
    //   (res) => {
    //     let Arr = [];
    //     res.forEach((item) => {
    //       Arr.push({ ...item.data(), ["id"]: item.id });
    //     });
    //     console.log(Arr);
    //     setVasooliArr(Arr);
    //     setloading(false);
    //   },
    //   (err) => console.log(err)
    // );
  };

  useEffect(() => {
    setloading(true);
    fire.auth().onAuthStateChanged(function (user) {
      if (user) {
        setuser(user);
        getVasooliByFilter(
          user.email,
          "ALL",
          (res) => {
            //console.log(res);
            setVasooliArr(res);
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
      <div className="row" style={{ marginBottom: "7px" }}>
        <div className="col-6 col-sm-6 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Please enter receiver ID"
          ></input>
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
          <button className="btn btn-outline-info mx-1" onClick={getDataFromFB}>
            submit
          </button>
        </div>
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
