import fetchJsonp from 'fetch-jsonp';

// istanbul ignore next
const fetchjsonp = (location, params) => {
  var url = new URL(location);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetchJsonp(url.href, { timeout: 15000 })
    .then(response => {
      return response.json();
    });
  }

export default { fetchJsonp: fetchjsonp };
