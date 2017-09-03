const fetch = (url, options) => global.fetch(url, options)
  .then(response => {
    return response.text().then( text => {
      return text ? JSON.parse(text) : {};
    });
  });

export default { fetch };
