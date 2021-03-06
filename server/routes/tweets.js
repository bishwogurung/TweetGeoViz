import validator from 'validator';
import Promise from 'promise';
import uuid from 'node-uuid';
import * as tweetsStore from '../store/tweetsStore';

// process db results
function getResults(values = []) {
  let features = [];

  //chew up each database entry into geoJSON;
  //render the page with the data overlay once we reach the end of the list of matches.
  values.forEach((cursor = []) => {
    cursor.forEach(item => {
      if (!item) {
        return;
      }

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.tln, item.tlt]
        },
        timeStamp: item.cr,
        text: item.t,
        _id: item._id
      });
    });
  });

  return {
    type: 'FeatureCollection',    // empty geojson blob
    features: features,
    uuid: uuid.v1()
  };
}

export function getTweets(req, res, next) {
  const {
    searchString,
    startDate,
    endDate
  } = req.query;

  if (!searchString) {
    return res.json({
      type: 'FeatureCollection',
      features: [],
      uuid: uuid.v1()
    });
  }

  let queryParts = searchString.split(',');
  let queries = [];

  // multiple find statements for searching multiple keywords
  queryParts.forEach(value => {
    const searchQuery = validator.trim(validator.escape(value));
    const promise = tweetsStore.getTweets({
      searchQuery,
      startDate,
      endDate
    });
    queries.push(promise);
  });

  // getting all results
  Promise
    .all(queries)
    .then(values => res.json(getResults(values)))
    .catch(next);
}
