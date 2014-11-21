<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the Closure to execute when that URI is requested.
  |
 */

Route::get('/', function() {
    return View::make('hello');
});

Route::get('makeplan', array(
    'as' => 'make-plan',
    'uses' => 'PlanController@make'
));

Route::post('yelp-search-businesses', array(
    'as' => 'yelp-search-businesses',
    'uses' => 'YelpController@searchLocalBusinesses'
));

Route::post('yelp-business-detail', array(
    'as' => 'yelp-business-detail',
    'uses' => 'YelpController@getBusinessDetail'
));
