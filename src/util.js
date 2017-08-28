const fetch = (url, options) => global.fetch(url, options)
  .then(response => response.json());

export default { fetch };
