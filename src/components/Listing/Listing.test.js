import React from 'react'
import Listing from './Listing'
import {shallow, mount} from 'enzyme'

it('renders without crashing', () => {
    shallow(<Listing />)
})

it('calls onClick event', () => {
    // const clickCarSpy = jest.fn()
    // const listing = shallow(<Listing />)
})
