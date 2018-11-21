import React from "react";
import {
  Modal,
  Popover,
  Button,
  Tooltip,
  OverlayTrigger
} from "react-bootstrap";

class ModalDetail extends React.Component {
  constructor(props){
    super(props)
    this.state ={}
  }


componentWillReceiveProps(futureProps){
  if(futureProps.car !== this.props.car){
    console.log('WILL RECEIVE:',futureProps.car.id)
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
    )
  }
}

export default ModalDetail;
