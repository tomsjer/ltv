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

//Route::group(['prefix' => 'api', 'middleware' => ['auth']], function () {
Route::group(['prefix' => 'api'], function () { 
	//
    //Employee
    //Route::get('/gets', 'EmployeeController@index');
	Route::get('employee/get','EmployeeController@index');
	// show a task
	Route::get('employee/get/{id}','EmployeeController@show');
	// delete a task
	Route::delete('employee/destroy/{id}','EmployeeController@destroy');
	// update existing task
	//Route::put('employee/put','EmployeeController@update'); //Falta Programar
	// create new task
	//{"dni":1234562,"name":"Jerrold Bogisich","lastname":"Bogisich","email":"chelsea20@example.net","birth_date":"2013-07-10"}
	Route::post('employee/store','EmployeeController@store');

	//MediType
	Route::get('mediatype/get','MediaTypeController@index');

	//Media
	Route::get('media/get/{start?}/{limit?}','MediaController@index');

	Route::get('media/get/{id}','MediaController@show');
	//{ "media_types_id" : "1", "options": "{\"name\" : \"Imagen3\", \"src\" : \"storage/images/imagen.png\"}"}
	Route::post('media/store','MediaController@store');	
	//{"id" : "6", "media_types_id" : "1", "options": "{\"name\":\"Imagen6\", \"src\" : \"storage/images/imagen.png\"}"}
	Route::put('media/put','MediaController@update'); 

	Route::delete('media/destroy/{id}','MediaController@destroy');

	Route::post('sliders','MediaController@storeSliders');

	Route::get('sliders/{all}','MediaController@getSliders');

});

Route::group(['middleware' => ['auth']], function () {

	Route::get('/home', 'HomeController@index');

});


