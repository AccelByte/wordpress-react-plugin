<?php
/*
 Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 This is licensed software from AccelByte Inc, for limitations
 and restrictions contact your company contract manager.
*/

/**
 * @package AccelByteWordPressReact
 */
/*
  Plugin Name: AccelByte WordPress React
  Description: Integrate your WordPress with AccelByte Platform
  Version: 1.0.0
  Author: AccelByte. Inc
*/

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );

define( 'AB_WPR_WIDGET_PATH', plugin_dir_path( __FILE__ ) . '/widget' );
define( 'AB_WPR_ASSET_MANIFEST', AB_WPR_WIDGET_PATH . '/build/asset-manifest.json' );
define( 'AB_WPR_VERSION_JSON', plugin_dir_path( __FILE__ ) . '/version-customer.json' );
define( 'AB_WPR_INCLUDES', plugin_dir_path( __FILE__ ) . '/includes' );

require_once( AB_WPR_INCLUDES . '/enqueue.php' );
