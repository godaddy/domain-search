import fetchJsonp from 'fetch-jsonp';

const fetch = (url, options) => global.fetch(url, options)
  .then(response => {
    return response.text().then( text => {
      return text ? JSON.parse(text) : {};
    });
  });

// istanbul ignore next
const fetchjsonp = url => fetchJsonp(url)
  .then(response => {
    return response.json();
  });

export default { fetch, fetchJsonp: fetchjsonp };
