# Fair
A Car Listing using Fair API that implements common features for a user looking to rent a car

## Description
Create an react web app to merchandise vehicles. User can filter through common features to narrow down their choice such as Make, Mileage, etc. User can click a car they are interested in to see more information about that car. User can favorite multiple cars for later and filter them to narrow their choice even futher.

## Basic Usage
npm install
npm start

## Features
- Car Listing Page
  - Displays a list of cars from the Fair API Endpoint
  - Data shows: Make, Model, Trim, Year, Image, Start Fee, Monthly Fee
  - Implemented pagination
    - Endpoint takes page number query, but I chose not to use it because adding the query doesn't change the data. I wanted to show pagination with real data so I added a maximum number of items and created a new page if the data exceeded this maximum number. Currently the maximum number is 4 (so I could have 3 pages) but obviously in a real app this would be a larger number.
- Car Details Page
  - Data is loaded from API Endpoint
  - Error Handling
    - I chose to show an error message if the API returned a 404 response. If the image link was broken I chose to use a placeholder image.
  - Vehicle is showcased using provided reference images as a guide
  - Implemented a carousel for browsing through all images
    - Decided not to implement mileage slider to allow viewing of different prices based on mileage suggested. Endpoint response did not provide data for different prices, nor did it provide New or Used price. Considered using third party Car API (Kelley Blue Book, Cars.com, etc) to obtain different prices. Ultimately decided to implement slider as an overall filter to showcase slider itself.
- Vehicle Favoriting
  - User can favorite and unfavorite either on the Listing or Detail Page
  - Favorites are tracked and persisted locally
  - Favorites on the Lisiting and Detail Page are synced

## Testing
Tested all sorts of scenarios with the filters, favorites, etc. by clicking everything and making sure all works like its supposed to.

## Other Items of Note
- Error text shows briefly while the API is loading response on mount. This is because I'm checking if the array is empty and sending an error message and the array is briefly empty before the API response returns to me. 
- Images flicker briefly when using pagination. I believe this is because the component is re-rendering and re-mapping.
- Car Details show previous car briefly while API is loading response for the modal. 
