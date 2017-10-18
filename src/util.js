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

const postDomain = (url, domain) => {
  const form = document.createElement('form');
  form.style.visibility = 'hidden';
  form.method = 'POST';
  form.action = url;

  const input = document.createElement('input');
  input.name = 'domainToCheck';
  input.value = domain;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

export default { fetch, fetchJsonp: fetchjsonp, postDomain };
