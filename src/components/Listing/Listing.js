import React, { Component } from "react";
import Slider from "react-rangeslider";
import {
  Table,
  Pagination,
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  FormGroup,
  Checkbox,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalDetail from "../ModalDetail/ModalDetail";
import { Footer } from "../Footer/Footer";

import logo from "../../images/FAIR_LOGO.png";
import * as ListingService from "../../services/Listing.service";
import "./Listing.css";

let styles = {
  notFavorite: {
    marginLeft: "85%",
    fontSize: "20px",
    color: "#ff7843",
    opacity: ".2"
  },
  favorite: {
    marginLeft: "85%",
    fontSize: "20px",
    color: "#ff7843",
    opacity: "100"
  }
};

const MAX_ITEMS_PER_PAGE = 4;
const MAX_STARTING_PRICE_FOR_SLIDER = 1000;
const MAX_MONTHLY_FEE_FOR_SLIDER = 500;

class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allCars: [],
      makes: [],
      selectedMakes: [],
      favoritedCars: [],
      selectedMileage: "No Limit",
      selectedMileageInteger: 999999,
      startPriceSliderValue: 900,
      monthlyFeeSliderValue: 400,
      showFavoritesOnly: false,
      currPageNum: 1
    };
  }

  componentDidMount() {
    ListingService.getAll()
      .then(response => {
        // populate makes with the ones coming from data
        let makes = [];
        for (let i = 0; i < response.data.vehicles.length; i++) {
          if (!makes.includes(response.data.vehicles[i].make)) {
            makes.push(response.data.vehicles[i].make);
          }
        }

        // get information from local storage if any
        let localStorageFavorites = [];
        if (
          localStorage.fairFavorites &&
          JSON.parse(localStorage.fairFavorites).length > 0
        ) {
          localStorageFavorites = JSON.parse(localStorage.fairFavorites);
        }

        this.setState({
          allCars: response.data.vehicles,
          makes: makes,
          favoritedCars: localStorageFavorites
        });
      })
      .catch(err => {
        console.log("there was an error getting the listing:", err);
      });
  }

  // change appearance of star and update local storage
  toggleFavorite = (e, car) => {
    // do not call onClick event to open the modal
    e.stopPropagation();

    // update the state of favoritedCars
    let arr = this.state.favoritedCars;
    if (arr.includes(car.id)) {
      arr.splice(arr.indexOf(car.id), 1);
    } else {
      arr.push(car.id);
    }

    // update local storage
    localStorage.setItem(
      "fairFavorites",
      arr === [] ? null : JSON.stringify(arr)
    );

    this.setState({
      favoritedCars: arr
    });
  };

  // set the filter for favorites
  favoriteCheckboxOnChange = e => {
    let flag = e.target.checked;
    this.setState({
      showFavoritesOnly: flag
    });
  };

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
    // populate vehiclesHtml with html table row containing all data
    let vehiclesHtml =
      this.state.allCars &&
      this.state.allCars.map((car, i) => {
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
              <FontAwesomeIcon
                icon="star"
                style={
                  this.state.favoritedCars &&
                  this.state.favoritedCars.includes(car.id)
                    ? styles.favorite
                    : styles.notFavorite
                }
                onClick={e => {
                  this.toggleFavorite(e, car);
                }}
              />
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
      });

    // reset the index to -1 (this causes paginator bug if left out)
    let index = -1;

    // split the data into smaller arrays which represent a portion of data shown on any single page
    let splitListing = vehiclesHtml.reduce((finalArr, currItem) => {
      if (this.state.showFavoritesOnly) {
        if (
          this.state.favoritedCars.includes(currItem.props.data.id) &&
          (this.state.selectedMakes.includes(currItem.props.data.make) ||
            this.state.selectedMakes.length === 0) &&
          (currItem.props.data.mileage <= this.state.selectedMileageInteger &&
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
      } else if (
        (this.state.selectedMakes.includes(currItem.props.data.make) ||
          this.state.selectedMakes.length === 0) &&
        (currItem.props.data.mileage <= this.state.selectedMileageInteger &&
          currItem.props.data.product_financials[0].start_fee_cents / 100 <=
            this.state.startPriceSliderValue &&
          currItem.props.data.product_financials[0].monthly_payment_cents /
            100 <=
            this.state.monthlyFeeSliderValue)
      ) {
        index++;
        const pageIndex = Math.floor(index / MAX_ITEMS_PER_PAGE);
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
          key={number}
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
          <Checkbox key={make} onChange={this.checkboxChange} id={make}>
            {make}
          </Checkbox>
        );
      });

    const tooltipText = (
      <Tooltip id="tooltip-favorite-cars">
        Don't see any favorites? You probably haven't favorited anything yet!
        Click the star next to a vehicle to add or delete that vehicle from your
        favorites.
      </Tooltip>
    );

    return (
      <React.Fragment>
        <img src={logo} alt="logo" id="logo-top" />
        <div className="container listing-body">
          <div className="col-md-3 listing-filters">
            <Table>
              <thead>
                <tr>
                  <th>Favorited</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <FormGroup>
                      <Checkbox onChange={this.favoriteCheckboxOnChange}>
                        Show Favorites{" "}
                        <OverlayTrigger overlay={tooltipText}>
                          <FontAwesomeIcon icon="question-circle" />
                        </OverlayTrigger>
                      </Checkbox>
                    </FormGroup>
                  </td>
                </tr>
              </tbody>
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
              {splitListing.length === 0 &&
                "Sorry, we couldn't find a match. :("}
            </div>
            {pagination}
            <ModalDetail
              show={this.state.showModal}
              onHide={this.closeModalDetail}
              car={this.state.currentCar}
              favCars={this.state.favoritedCars}
              toggleFav={e => this.toggleFavorite(e, this.state.currentCar)}
            />
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Listing;
