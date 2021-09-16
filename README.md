# AccelByte WordPress Plugin

## Overview

The AccelByte WordPress Plugin is a ReactJS based application for integrating WordPress with AccelByte platform

### High Level Features

- Player authentication
- Item purchase button
- Document policy link for policy section

### Building the project

To build this plugin you need to set up following environments variable:

- `CLIENT_REDIRECT_URI` - URI to redirect back from AccelByte Login Website to WordPress website
- `APP_SECURITY_CLIENT_ID` - Client ID from IAM for WordPress application in browser
- `JUSTICE_PUBLISHER_NAMESPACE` - Default namespace
- `JUSTICE_BASE_URL` - Base URL of Accelbyte services
- `JUSTICE_PLAYERPORTAL_URL` - URL of AccelByte PlayerPortal URL
- `JUSTICE_LEGAL_WEBSITE_URL`- URL of AccelByte Legal website URL
- `JUSTICE_CREATE_ORDER_URL` - AccelByte Player Portal URL for order creation

And run these command under directory `/widget` to install the dependencies and build the plugin:

- `yarn install`
- `yarn build`

## WordPress integration

To integrate this plugin with your WordPress, you need to do following steps:

- Copy folder `wordpress-react` under directory `{YOUR_WORDPRESS_ROOT}/wp-content/plugins`
- Go to `{YOUR_WORDPRESS_ADMIN_URL}/wp-admin/plugins.php` and make sure plugin `AccelByte WordPress React` activated

## Managed HTML Element

This plugin will be running up on the client browser side. Once the script loaded, it will look for HTML element with a specific id or class name to be modified and managed by the plugin

Make sure you provide HTML element with following id or classname inside your WordPress template:

- Element ID `ab-wpr-root` for application root for the plugin
- Element ID `ab-wpr-login-button-root` for login button container
- Element ID `ab-wpr-login-button-root-mobile` for mobile button container
- Element ID `ab-wpr-footer-privacy-link` for footer section container
- Element classname `ab-wpr-purchase-btn` for purchase item button

## Item Purchase Button Integration

Once you published an item on AccelByte store, you will be able to embed the purchase button on any page on the WordPress site,

You can get the code snippet to be embedded on your WordPress site from Admin Portal item page on Published Store.

#### Snippet Example:

Here's the example for snippet code generated for purchase able item

#### Default Button (Plain button)

`<div class="ab-wpr-purchase-btn" data-item-id="{**ITEM_ID**}" data-btn-type="default">{**ITEM_NAME**}</div>`

#### Button With Image

`<div class="ab-wpr-purchase-btn" data-item-id="{**ITEM_ID**}" data-btn-type="large">{**ITEM_NAME**}</div>`
Note: You can change the image of the button on Admin Portal item store page at `Publishing Content` card under `Images` tab

#### Link

The purchase link is uniquely generated from Admin Portal item store page
