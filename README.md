# Domain Search

This is a simple react-based domain search widget used for designing and building custom GoDaddy reseller storefronts, as seen in our [WordPress Storefront Plugin](https://github.com/godaddy/wp-reseller-store).

In order to sell domains and make commission on your own custom storefront, you will need an active [GoDaddy Reseller Plan](https://www.godaddy.com/reseller-program). However, this package can be used in "demo mode", which provides full cart and purchase paths for the [Domains Priced Right](http://www.domainspricedright.com/) brand.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Please visit their GitHub repo for additional context and advanced usage.

## Demo

You can view a demo of the domain search component at https://godaddy.github.io/domain-search/.

## Getting Started

- Make sure you have an active [GoDaddy Reseller Plan](https://www.godaddy.com/reseller-program), otherwise you will not be able to make commissions on any domain sales from your site.
- If using with the [WordPress Storefront Plugin](https://github.com/godaddy/wp-reseller-store):
  - Add `[rstore-domain-search]` to any post or page that you would like this to appear in.
- If using independently of WordPress (i.e. on your own custom storefront or site):
  - `npm i`
  - Update the global `rstore` variable in `public/index.html` with your `pl_id`. You will need to replace all occurrences of the value `1592`, otherwise all cart actions will be applied to that `pl_id` instead of yours.
  - `npm start` - the app will run on port 3000 by default. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
  - Please visit [https://storefront.api.secureserver.net/api/explore/](https://storefront.api.secureserver.net/api/explore/) for the official Storefront API documentation.

## Usage
- Add the following HTML to the page that you want the domain search component to appear on. The compiled JS is located in `dist/index.js`.

```html
<div class="rstore-domain-search"></div>
<!-- Sample data - WordPress will inject these variables into the site -->
<script type='text/javascript'>
  var rstore = {
    "pl_id": "1592",
    "urls": {
      "cart": "https:\/\/cart.secureserver.net\/?pl_id=1592",
      "cart_api": "https:\/\/storefront.api.secureserver.net\/api\/v1\/cart\/1592\/?currencyType=USD&marketId=en-US",
      "domain_api": "https:\/\/storefront.api.secureserver.net\/api\/v1\/domains\/1592\/?currencyType=USD&marketId=en-US"
    },
    "cookies": {
      "ttl": 2592000000,
      "cartCount": "rstore-cart-count"
    },
    "product": {
      "id": "plesk-ultimate"
    },
    "i18n": {
      "add_to_cart": "Add to cart",
      "available": "Congrats, your domain is available!",
      "error": "An error has occurred",
      "not_available": "Sorry, that domain is taken.",
      "placeholder": "Find your perfect domain name",
      "search": "Search",
      "view_cart": "View cart"
    }
  };
</script>
```

## Available Scripts

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any linting errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.
Run `npm test -- --coverage` to generate a code coverage report.

#### `npm run build`

Builds the app for production to the `build` folder. The compiled JavaScript will also be made available in `dist/index.js`.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run eject`

Note: this is a one-way operation. Once you eject, you can’t go back!

If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Contributing

This app is open source! That means we want your contributions!

1. Install it and use it in your project.
2. Log bugs, issues, and questions on [Github](https://github.com/resellers/domain-search/issues).
3. Create pull-requests and help us make it better!

## Contributors

- [Chris Beresford](https://github.com/cberesford)
- [Bryan Focht](https://github.com/bfocht)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
