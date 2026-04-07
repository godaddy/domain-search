# Domain Search

[![Tests](https://github.com/godaddy/domain-search/actions/workflows/ci.yml/badge.svg)](https://github.com/godaddy/domain-search/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/domain-search.svg)](https://www.npmjs.com/package/domain-search)

This is a React-based domain search widget used for designing and building custom GoDaddy reseller storefronts, as seen in our [WordPress Storefront Plugin](https://github.com/godaddy/wp-reseller-store).

In order to sell domains and make commission on your own custom storefront, you will need an active [GoDaddy Reseller Plan](https://www.godaddy.com/reseller-program). However, this package can be used in "demo mode", which provides full cart and purchase paths for the [Domains Priced Right](http://www.domainspricedright.com/) brand.

## Demo

You can view a demo of the domain search component at https://godaddy.github.io/domain-search/.

## Getting Started

- Make sure you have an active [GoDaddy Reseller Plan](https://www.godaddy.com/reseller-program), otherwise you will not be able to make commissions on any domain sales from your site.
- If using with the [WordPress Storefront Plugin](https://github.com/godaddy/wp-reseller-store):
  - Add `[rstore_domain_search]` to any post or page that you would like this to appear in.
- If using independently of WordPress (i.e. on your own custom storefront or site):
  - `npm i`
  - Update `data-plid` in `index.html` with your `pl_id`.
  - `npm run dev` - the app will run on port 5173 by default. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.
  - Please visit [https://www.secureserver.net/api/explore/](https://www.secureserver.net/api/explore/) for the official Storefront API documentation.

## Usage

- Add the following HTML to the page that you want the domain search component to appear on. The compiled JS is located in `dist/index.js`.

```html
<div class="rstore-domain-search" data-plid="1592">Domain Search</div>
```

Optional parameter to change number of results returned in the search

```
data-page_size="5"
```

The domain search component is internationalizable. To change any of the strings, provide the following data attributes in the `div`

```
data-text_placeholder="Find your perfect domain name"
data-text_search="Search"
data-text_available="Congrats, {domain_name} is available!"
data-text_not_available="Sorry, {domain_name} is taken."
data-text_cart="Continue to Cart"
data-text_select="Select"
data-text_selected="Selected"
data-new_tab=true
```

`data-text_available` and `data-text_not_available` fields support text substitution, {domain_name} in the provided text will be replaced by the actual domain name searched.

Example Usage

```html
<div
  class="rstore-domain-search"
  data-plid="1592"
  data-text_placeholder="Find your perfect domain name"
  data-text_search="Search"
  data-text_available="Congrats, {domain_name} is available!"
  data-text_not_available="Sorry, {domain_name} is taken."
  data-text_cart="Continue to Cart"
  data-text_select="Select"
  data-text_selected="Selected"
  data-new_tab="true"
>
  Domain Search
</div>
```

## Browser Requirements

Requires modern browsers. If you support older browsers (e.g. IE < 11), consider adding a polyfill script to the `<head>` block.

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

## Available Scripts

#### `npm run dev`

Runs the widget in development mode with hot reload.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

#### `npm test`

Runs the test suite with Vitest.

#### `npm run test:coverage`

Runs tests and generates a coverage report.

#### `npm run build`

Builds the library for production to the `dist/` folder, outputting UMD and ESM bundles along with TypeScript declaration files.

#### `npm run build:demo`

Builds the GitHub Pages demo site to the `demo/` folder.

## Contributing

This app is open source! That means we want your contributions!

1. Install it and use it in your project.
2. Log bugs, issues, and questions on [Github](https://github.com/resellers/domain-search/issues).
3. Create pull-requests and help us make it better!

## Changelog

- v5.0.0

  - Migrate to TypeScript, React 18, and Vite
  - Replace Enzyme/Sinon tests with Vitest + React Testing Library
  - Replace fetch-jsonp with native fetch (CORS supported)
  - Output UMD and ESM bundles with TypeScript declarations
  - Fix exact match domain not showing select button when available
  - Fix unavailable domains incorrectly showing select button

- v4.1.0

  - Add open in new tab option

- v3.1.0

  - Prevent page navigation when domains are selected

- v3.0.0

  - Update dependencies
  - Update api calls
  - Update CSS for responsive layout
  - Add domain disclaimers

- v2.1.6

  - Update api endpoint

- v2.1.4

  - Add continue to cart button
  - Update UX

- v2.1.3

  - Include full domain on taken search results

- v2.1.0

  - Upgrade to React 16

- v2.0.0
  - Initial Release

## Contributors

- [Chris Beresford](https://github.com/cberesford)
- [Bryan Focht](https://github.com/bfocht)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
