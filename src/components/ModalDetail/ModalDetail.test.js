import React from "react";
import ModalDetail from "./ModalDetail";
import axios from 'axios';
import { shallow } from "enzyme";

jest.mock('axios')

it("testing mock axios call", () => {
  const testCar = {
    id: "19XFC2F59GE2276732016",
    make: "Honda",
    mileage: 35292,
    model: "Civic Sedan",
    model_year: "2016",
    product_financials: [
      {
        monthly_payment_cents: 29000,
        start_fee_cents: 90000
      }
    ],
    trim: "LX"
  };

  const testFavCars = ["19XFC2F59GE2276732016"];


  const modalDetail = shallow(
    <ModalDetail
      show={true}
      onHide={() => null}
      car={testCar}
      favCars={testFavCars}
      toggleFav={() => null}
    />
  );

    axios.get.mockResolvedValue(testCar)

    
// expect(modalDetail.find('.modal-year-make').text()).toBe('2016 Honda')


});
