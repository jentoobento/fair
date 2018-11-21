import React, { Component } from "react";
import {
  Table,
  Pagination,
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  FormGroup,
  Checkbox
} from "react-bootstrap";
import ModalDetail from "./ModalDetail";
import {Footer} from './Footer'
import axios from "axios";

import logo from "../images/FAIR_LOGO.png";

// the max number of items shown on each page
const MAX_ITEMS_PER_PAGE = 4;

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: [],
      makes: [],
      selectedMakes: [],
      selectedMileage: "No Limit",
      selectedMileageInteger: 999999,
      currPageNum: 1
    };
  }

  componentDidMount() {
    axios({
      method: "GET",
      url: "https://private-4e19e-interviewapi3.apiary-mock.com/vehicles?page="
    })
      .then(response => {
        // populate makes with the ones coming from data
        let makes = [];

        // populate vehicles with html table row containing all data
        let vehicles =
          response.data.data.vehicles &&
          response.data.data.vehicles.map((car, i) => {
            if (!makes.includes(car.make)) {
              makes.push(car.make);
            }
            return (
              <tr
                key={i}
                onClick={() => this.openModalDetail(car)}
                style={{ cursor: "pointer" }}
                data={car}
              >
                <td>
                  <img width="300px" src={car.chrome_image_url} alt="car" />
                </td>
                <td>{car.make}</td>
                <td>{car.model}</td>
                <td>{car.trim}</td>
                <td>{car.model_year}</td>
                <td>
                  $
                  {(car.product_financials[0].start_fee_cents / 100)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </td>
                <td>
                  $
                  {(car.product_financials[0].monthly_payment_cents / 100)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </td>
              </tr>
            );
          }); // end map
        this.setState({
          listing: vehicles,
          makes: makes
        });
      })
      .catch(err => {
        console.log("there was an error getting the listing:", err);
      });
  }

  // open the modal, set state to currently selected car
  openModalDetail = car => {
    this.setState({
      showModal: true,
      currentCar: car
    });
  };

  // close modal
  closeModalDetail = () => {
    this.setState({
      showModal: false
    });
  };

  // set the state to the active page in the paginator
  nextPage = currentPage => {
    this.setState({
      currPageNum: currentPage
    });
  };

  // set the state based on checkbox status filter
  checkboxChange = e => {
    let checked = e.target.checked;
    let id = e.target.id;

    this.setState(prevState => {
      if (checked) {
        prevState.selectedMakes.push(id);
      } else {
        prevState.selectedMakes.splice(prevState.selectedMakes.indexOf(id), 1);
      }

      return {
        ...prevState,
        selectedMakes: prevState.selectedMakes,
        currPageNum: 1
      };
    });
  };

  // change the state to the selected mileage filter
  changeMileage = (eventKey, event) => {
    this.setState({
      selectedMileage: eventKey,
      selectedMileageInteger: Number.parseInt(event.target.id)
    });
  };

  render() {
    // reset the index to -1
    let index = -1;

    // split the data into smaller arrays which represent a portion of data shown on any single page
    let splitListing = this.state.listing.reduce((finalArr, currItem) => {
      if (
        this.state.selectedMakes.includes(currItem.props.data.make) ||
        (this.state.selectedMakes.length === 0 &&
          currItem.props.data.mileage <= this.state.selectedMileageInteger)
      ) {
        // the index determines whether the paginator should add a new page or not
        index++;
        const pageIndex = Math.floor(index / MAX_ITEMS_PER_PAGE);

        // if the page is full, create a new page
        if (!finalArr[pageIndex]) {
          finalArr[pageIndex] = [];
        }
        finalArr[pageIndex].push(currItem);
      }
      return finalArr;
    }, []);

    // determine how many numbers appear in pagination based on length of splitListing
    let items = [];
    for (let number = 1; number <= splitListing.length; number++) {
      items.push(
        <Pagination.Item
          active={number === this.state.currPageNum}
          onClick={() => this.nextPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    const pagination = (
      <div>
        <Pagination bsSize="large">{items}</Pagination>
      </div>
    );

    // html for the checkboxes
    let checkboxMakes =
      this.state.makes &&
      this.state.makes.map(make => {
        return (
          <Checkbox onChange={this.checkboxChange} id={make}>
            {make}
          </Checkbox>
        );
      });

    return (
      <React.Fragment>
        <img
          src={logo}
          alt=""
          width="200px"
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "10px"
          }}
        />
        <div className="container" style={{'display':'flex','minHeight':'100vh','flexDirection':'row'}}>
          <div className="col-md-3" style={{'flex':1}}>
            <Table>
              <thead>
                <tr>
                  <th>Make</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FormGroup>{checkboxMakes && checkboxMakes}</FormGroup>
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ButtonToolbar>
                      <DropdownButton title="From" id="dropdown-size-medium">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Separated link</MenuItem>
                      </DropdownButton>
                      <DropdownButton title="To" id="dropdown-size-medium">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Separated link</MenuItem>
                      </DropdownButton>
                    </ButtonToolbar>
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>Mileage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ButtonToolbar>
                      <DropdownButton
                        title={
                          this.state.selectedMileage &&
                          this.state.selectedMileage
                        }
                        id="dropdown-size-medium"
                        onSelect={this.changeMileage}
                      >
                        <MenuItem eventKey="10K or Less" id="10000">
                          10K or Less
                        </MenuItem>
                        <MenuItem eventKey="20K or Less" id="20000">
                          20K or Less
                        </MenuItem>
                        <MenuItem eventKey="30K or Less" id="30000">
                          30K or Less
                        </MenuItem>
                        <MenuItem eventKey="40K or Less" id="40000">
                          40K or Less
                        </MenuItem>
                        <MenuItem eventKey="50K or Less" id="50000">
                          50K or Less
                        </MenuItem>
                        <MenuItem eventKey="No Limit" id="999999">
                          No Limit
                        </MenuItem>
                      </DropdownButton>
                    </ButtonToolbar>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="col-md-8" style={{'flex':2}}>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Trim</th>
                  <th>Year</th>
                  <th>Start Fee</th>
                  <th>Monthly Fee</th>
                </tr>
              </thead>
              <tbody>
                {splitListing[this.state.currPageNum - 1] &&
                  splitListing[this.state.currPageNum - 1]}
              </tbody>
            </Table>
            <div style={{'fontWeight':'bold'}}>{splitListing.length === 0
              ? "Sorry, we couldn't find a match. :("
              : ""}</div>
            {pagination}
            <ModalDetail
              show={this.state.showModal}
              onHide={this.closeModalDetail}
              car={this.state.currentCar}
            />
          </div>
        </div>
        <Footer/>
      </React.Fragment>
    );
  }
}

export default Listing;
