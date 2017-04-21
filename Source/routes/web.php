<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index');

Auth::routes();

Route::get('/home', 'HomeController@index');

Auth::routes();

Route::get('/home', 'HomeController@index');

Route::group(['prefix' => 'api', 'middleware' => ['auth']], function () {
    //
    //Route::get('/gets', 'EmployeeController@index');

    




});

Route::group(['prefix' => 'api'], function () {
    //
    //Route::get('/gets', 'EmployeeController@index');
	Route::get('get','EmployeeController@index');
	// show a task
	Route::get('get/{id}','EmployeeController@show');
	// delete a task
	Route::delete('destroy/{id}','EmployeeController@destroy');
	// update existing task
	Route::put('put','EmployeeController@store');
	// create new task
	Route::post('store','EmployeeController@store');
   
});
