import React from "react";
import axios from "axios";
import {
  Modal,
  Popover,
  Button,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";

class ModalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      car: ''
    };
  }

  componentWillReceiveProps(futureProps) {
    if (futureProps.car !== this.props.car) {
      console.log("WILL RECEIVE:", futureProps.car.id);

      // use the VIN to call the API
      axios({
        method: "GET",
        url: `https://private-4e19e-interviewapi3.apiary-mock.com/vehicles/${futureProps.car.id}`
      })
        .then(response => {
          console.log(response.data.data.vehicle);
this.setState({
  car: response.data.data.vehicle
})
        })
        .catch(err => {
          console.log("there was an error getting car details", err);
        });
    }
  }

  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.car && this.props.car.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
          <p>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>

          <h4>Popover in a modal</h4>
          <p>
            there is a{" "}
            <OverlayTrigger overlay={popover}>
              <a href="#popover">popover</a>
            </OverlayTrigger>{" "}
            here
          </p>

          <h4>Tooltips in a modal</h4>
          <p>
            there is a{" "}
            <OverlayTrigger overlay={tooltip}>
              <a href="#tooltip">tooltip</a>
            </OverlayTrigger>{" "}
            here
          </p>

          <hr />
          <h4>Overflowing text to show scroll behavior</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalDetail;
