import React from "react";
import axios from "axios";
import { Modal, Button, Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from "../../images/fair_alt.jpg"
import imageAlt from "../../images/nopreview.jpg";
import "./ModalDetail.css";

let notFavorite = {
  marginLeft: "85%",
  fontSize: "20px",
  color: "#ff7843",
  opacity: ".2"
};

let favorite = {
  marginLeft: "85%",
  fontSize: "20px",
  color: "#ff7843",
  opacity: "100"
};

class ModalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car: "",
      requestDidError: false
    };
  }

  componentWillReceiveProps(futureProps) {
    if (futureProps.car !== this.props.car) {
      // use the VIN to call the API
      axios({
        method: "GET",
        url: `https://private-4e19e-interviewapi3.apiary-mock.com/vehicles/${
          futureProps.car.id
        }`
      })
        .then(response => {
          this.setState({
            car: response.data.data.vehicle,
            requestDidError: false
          });
        })
        .catch(err => {
          console.log("there was an error getting car details", err);
          this.setState({
            requestDidError: true
          });
        });
    }
  }

  imageDidError = e => {
    e.target.src = imageAlt;
  };

  render() {
    let mileString =
      this.state.car &&
      this.state.car.mileage
        .toString()
        .split(/(?=(?:\d{3})+(?:\.|$))/g)
        .join(",");

    let carouselImages =
      this.state.car &&
      this.state.car.image_location_list.map((image, i) => {
        return (
          <Carousel.Item key={i}>
            <img
              width={550}
              alt="carousel"
              src={image}
              onError={this.imageDidError}
            />
          </Carousel.Item>
        );
      });

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <img id="modal-logo" src={logo} alt="logo" />
        </Modal.Header>
        <Modal.Body>
          {this.state.requestDidError ? (
            <div>
              <h3>
                Sorry, there was an error when we attempted to get additional
                data for this vehicle. :(
              </h3>
            </div>
          ) : (
            <div>
              <Carousel interval={null}>{carouselImages}</Carousel>
              <div className="modal-top-details">
                <div className="modal-icon-div">
                  <FontAwesomeIcon
                    icon="star"
                    className="modal-star-icon"
                    style={
                      this.props.favCars && this.props.favCars.includes(this.state.car.id)
                        ? favorite
                        : notFavorite
                    }
                    onClick={this.props.toggleFav}
                  />
                </div>
                <div className="modal-detail-text">
                  <span className="modal-year-make">
                    {this.state.car && this.state.car.model_year}{" "}
                    {this.state.car && this.state.car.make}
                  </span>
                  <br />
                  <span className="modal-model-trim">
                    {this.state.car && this.state.car.model}{" "}
                    {this.state.car && this.state.car.trim}
                  </span>
                  <br />
                  <span className="modal-miles">
                    {mileString && mileString} miles
                  </span>
                </div>
              </div>
              <div className="modal-center-div" />
              <div className="modal-payment-details">
                <div className="modal-monthly-div">
                  <span className="modal-payment-headers">Monthly Pymt.</span>
                  <br />
                  <span className="modal-monthly-fee">
                    $
                    {this.state.car &&
                      this.state.car.product_financials[0]
                        .monthly_payment_cents / 100}
                  </span>
                </div>
                <div className="modal-start-div">
                  <span className="modal-payment-headers">Start Pymt.</span>
                  <br />
                  <span className="modal-start-fee">
                    $
                    {this.state.car &&
                      this.state.car.product_financials[0].start_fee_cents /
                        100}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalDetail;
