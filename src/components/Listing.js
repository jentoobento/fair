import React, { Component } from "react";
import Slider from "react-rangeslider";
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
import { Footer } from "./Footer";
import axios from "axios";

import logo from "../images/FAIR_LOGO.png";
import "./Listing.css";

// the max number of items shown on each page
const MAX_ITEMS_PER_PAGE = 4;
// the max amount the starting price slider can be set to
const MAX_STARTING_PRICE_FOR_SLIDER = 1000;
// the max amount the monthly fee slider can be set to
const MAX_MONTHLY_FEE_FOR_SLIDER = 500;

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: [],
      makes: [],
      selectedMakes: [],
      selectedMileage: "No Limit",
      selectedMileageInteger: 999999,
      startPriceSliderValue: 900,
      monthlyFeeSliderValue: 400,
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
                className="car-listing"
                data={car}
              >
                <td className="td-car-image">
                  <img
                    src={car.chrome_image_url}
                    alt="car"
                    className="car-listing-image"
                  />
                </td>
                <td>
                  <div className="car-header">
                    {car.model_year} {car.make} {car.model} {car.trim}
                  </div>
                  <span className="car-listing-details">
                    MILES: {car.mileage}
                    <br />
                    START: $
                    {(car.product_financials[0].start_fee_cents / 100)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                    <br />
                    MONTHLY: $
                    {(car.product_financials[0].monthly_payment_cents / 100)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                  </span>
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
    console.log(car.id)
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

  // record the value of the starting price slider
  handleStartSliderChange = value => {
    this.setState({
      startPriceSliderValue: value
    });
  };

  // record the value of the monthly fee slider
  handleMonthlySliderChange = value => {
    this.setState({
      monthlyFeeSliderValue: value
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
    // reset the index to -1 (this causes paginator bug if left out)
    let index = -1;

    // split the data into smaller arrays which represent a portion of data shown on any single page
    let splitListing = this.state.listing.reduce((finalArr, currItem) => {
      if (
        this.state.selectedMakes.includes(currItem.props.data.make) ||
        (this.state.selectedMakes.length === 0 &&
          currItem.props.data.mileage <= this.state.selectedMileageInteger &&
          currItem.props.data.product_financials[0].start_fee_cents / 100 <=
            this.state.startPriceSliderValue &&
          currItem.props.data.product_financials[0].monthly_payment_cents /
            100 <=
            this.state.monthlyFeeSliderValue)
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
        <img src={logo} alt="logo" id="logo-top" />
        <div className="container listing-body">
          <div className="col-md-3 listing-filters">
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
                  <th>Starting Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Slider
                      min={0}
                      max={MAX_STARTING_PRICE_FOR_SLIDER}
                      step={50}
                      value={this.state.startPriceSliderValue}
                      onChangeStart={this.handleSliderChangeStart}
                      onChange={this.handleStartSliderChange}
                      onChangeComplete={this.handleStartSliderChangeComplete}
                    />
                    <div>
                      $
                      {this.state.startPriceSliderValue
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
                      or Less
                    </div>
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th>Monthly Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Slider
                      min={0}
                      max={MAX_MONTHLY_FEE_FOR_SLIDER}
                      step={10}
                      value={this.state.monthlyFeeSliderValue}
                      onChangeStart={this.handleSliderChangeStart}
                      onChange={this.handleMonthlySliderChange}
                      onChangeComplete={this.handleSliderChangeComplete}
                    />
                    <div>
                      $
                      {this.state.monthlyFeeSliderValue
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
                      or Less
                    </div>
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
          <div className="col-md-8 listing-cars">
            <Table condensed hover>
              <tbody>
                {splitListing[this.state.currPageNum - 1] &&
                  splitListing[this.state.currPageNum - 1]}
              </tbody>
            </Table>
            <div id="listing-sorry-text">
              {splitListing.length === 0 && "Sorry, we couldn't find a match. :("}
            </div>
            {pagination}
            <ModalDetail
              show={this.state.showModal}
              onHide={this.closeModalDetail}
              car={this.state.currentCar}
            />
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Listing;
