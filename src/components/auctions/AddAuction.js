import { Button, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import createItem from "../../Backend/Interaction/createItem"
import {ethers} from "ethers";

import Web3 from "web3"; // Import the Web3 library
let web3 = new Web3(window.ethereum);
// let web3 = new Web3('http://127.0.0.1:8545');
const artifacts = require("../../Backend/build/contracts/Auction.json");
const auctionAbi = artifacts.abi;

export const AddAuction = ({ setAuction }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const itemTitle = useRef();
  const itemDesc = useRef();
  const startPrice = useRef();
  const itemDuration = useRef();
  const itemImage = useRef();

  const { currentUser } = useContext(AuthContext);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

  const requestEthereumAccess = async (e) => {
    e.preventDefault();
    try {

      
      if (typeof window.ethereum !== "undefined") {
        // Request Ethereum access and get the accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const selectedAccount = accounts[0];


        const balanceWei = await web3.eth.getBalance(selectedAccount);
        const balanceEther = web3.utils.fromWei(balanceWei, "ether");
        console.log(balanceEther);

        console.log(selectedAccount);

         let createItemResult = await createItem(
          selectedAccount,
          itemTitle.current.value,
          itemDuration.current.value
        );

        if (createItemResult === "success") {
          // Only execute submitForm if createItem was successful
          submitForm();
        } else {
          // Handle the error from createItem here, if needed
          console.error("createItem failed");
        }
       
      
      }
    } catch (error) {
      // Handle errors or user rejection
      console.error(error);
    }
  };

  const submitForm = async () => {
    setError("");

    if (!imgTypes.includes(itemImage.current.files[0].type)) {
      return setError("Please use a valid image");
    }

    let currentDate = new Date();
    let durationInMillis = itemDuration.current.value * 60 * 1000; // Convert hours to milliseconds
    let dueDate = currentDate.getTime() + durationInMillis;

    let newAuction = {
      email: currentUser.email,
      title: itemTitle.current.value,
      desc: itemDesc.current.value,
      curPrice: startPrice.current.value,
      duration: dueDate,
      itemImage: itemImage.current.files[0],
    };

    setAuction(newAuction);
    closeForm();
  };

  return (
    <>
      <div className="col d-flex justify-content-center my-3">
        <div onClick={openForm} className="btn btn-outline-secondary mx-2">
          + Auction
        </div>
      </div>
      <Modal centered show={showForm} onHide={closeForm}>
        <form onSubmit={requestEthereumAccess}>
          <Modal.Header>
            <Modal.Title>Create Auction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Item Title</Form.Label>
                  <Form.Control type="text" required ref={itemTitle} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Item Description</Form.Label>
                  <Form.Control type="text" required ref={itemDesc} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Start Price</Form.Label>
                  <Form.Control type="number" required ref={startPrice} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Item Duration in minutes</Form.Label>
                  <Form.Control type="number" required ref={itemDuration} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Seller</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentUser.email}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Item Image</Form.Label>
                  <Form.File
                    label="Select Item Image"
                    custom
                    required
                    ref={itemImage}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
