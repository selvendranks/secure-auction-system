import React, { useContext } from "react";
import Countdown from "react-countdown";
import { AuthContext } from "../../context/AuthContext";

const renderer = ({ days, hours, minutes, seconds, completed, props }) => {
  if (completed) {
    return (
      <div className="col">
        <div className="card shadow-sm">
          <div
            style={{
              height: "320px",
              backgroundImage: `url(${props.item.imgUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="w-100"
          />

          <div className="card-body">
            <p className="lead display-6">{props.item.title}</p>
            <div className="d-flex jsutify-content-between align-item-center">
              <h5>Auction Ended</h5>
            </div>
            <p className="card-text">{props.item.desc}</p>
            <div className="d-flex justify-content-between align-item-center">
              <p className="display-6">${props.item.curPrice}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col">
      <div className="card shadow-sm">
        <div
          style={{
            height: "320px",
            backgroundImage: `url(${props.item.imgUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="w-100"
        />

        <div className="card-body">
          <p className="lead display-6">{props.item.title}</p>
          <div className="d-flex jsutify-content-between align-item-center">
            <h5>
              {days * 24 + hours} hr: {minutes} min: {seconds} sec
            </h5>
          </div>
          <p className="card-text">{props.item.desc}</p>
          <div className="d-flex justify-content-between align-item-center">
            <div>
              {!props.owner ? (
                <div
                  onClick={() => props.bidAuction()}
                  className="btn btn-outline-secondary"
                >
                  Bid
                </div>
              ) : props.owner.email === props.item.email ? (
                <div onClick={() => props.endAuction(props.item.id)}></div>
              ) : props.owner.email === props.item.curWinner ? (
                <p className="display-6">Winner</p>
              ) : (
                <div>
                  <div>
                    { 
                    props.item.bidders &&
                    props.item.bidders[props.owner.email] !== undefined ? (
                      <div>
                        Your previous Bid :
                        {props.item.bidders[props.owner.email]}
                      </div>
                    ) : (
                      <div> {}</div>
                    )}
                  </div>

                  <div
                    onClick={() =>
                      props.bidAuction(props.item.id, props.item.curPrice)
                    }
                    className="btn btn-outline-secondary"
                  >
                    Bid
                  </div>
                </div>
              )}
            </div>
            <p className="display-6">${props.item.curPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuctionCard = ({ item }) => {
  let expiredDate = item.duration;
  const { currentUser, bidAuction, endAuction, endedAuctions,  } =
    useContext(AuthContext);

  const isAuctionEnded = endedAuctions.includes(item.id);
  

  return (
    <Countdown
      
      owner={currentUser}
      date={expiredDate}
      bidAuction={bidAuction}
      endAuction={endAuction}
      item={item}
      renderer={renderer}
    />
  );
};
