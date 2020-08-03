<?php
/*
 Copyright (c) 2019 AccelByte Inc. All Rights Reserved.
 This is licensed software from AccelByte Inc, for limitations
 and restrictions contact your company contract manager.
*/

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );


add_action( 'init', function() {
  $siteUrl = get_site_url();
  $versionJson = json_decode(file_get_contents(AB_WPR_VERSION_JSON));
  $pluginVersion = $versionJson->version;

  add_filter( 'script_loader_tag', function( $tag, $handle ) {
    if ( ! preg_match( '/^ab-wpr-/', $handle ) ) { return $tag; }
    return str_replace( ' src', ' async defer src', $tag );
  }, 10, 2 );

  add_action( 'wp_enqueue_scripts', function() {
    $asset_manifest = json_decode( file_get_contents( AB_WPR_ASSET_MANIFEST ), true )['files'];
    if ( isset( $asset_manifest[ 'main.css' ] ) ) {
      wp_enqueue_style( 'ab-wpr', $siteUrl . $asset_manifest[ 'main.css' ] );
    }
    wp_enqueue_script( 'ab-wpr-runtime', $siteUrl . $asset_manifest[ 'runtime-main.js' ], array(), $pluginVersion, true );
    wp_enqueue_script( 'ab-wpr-main', $siteUrl . $asset_manifest[ 'main.js' ], array('ab-wpr-runtime'), $pluginVersion, true );
    foreach ( $asset_manifest as $key => $value ) {
      if ( preg_match( '@static/js/(.*)\.chunk\.js@', $key, $matches ) ) {
        if ( $matches && is_array( $matches ) && count( $matches ) === 2 ) {
          $name = "ab-wpr-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
          wp_enqueue_script( $name, $siteUrl . $value, array( 'ab-wpr-main' ), $pluginVersion, true );
        }
      }
      if ( preg_match( '@static/css/(.*)\.chunk\.css@', $key, $matches ) ) {
        if ( $matches && is_array( $matches ) && count( $matches ) == 2 ) {
          $name = "ab-wpr-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
          wp_enqueue_style( $name, $siteUrl . $value, array( 'ab-wpr' ), $pluginVersion );
        }
      }
    }
  });
});
