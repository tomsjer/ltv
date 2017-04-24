<?php

use Illuminate\Database\Seeder;

class MediaTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        //Imagen
        App\Media::create(array(
	        'media_types_id'     => '1',
	        'options'     => '{"name" : "Test1", "src" : "storage/images/imagen1.png"}',
	    ));

	    //Imagen2
        App\Media::create(array(
	        'media_types_id'     => '1',
	        'options'     => '{"name" : "Test2", "src" : "storage/images/imagen2.png"}',
	    ));

	    //Video
        App\Media::create(array(
	        'media_types_id'     => '2',
	        'options'     => '{ "name" : "Video1", "id_youtube" : "YQHsXMglC9A" }',
	    ));

	    //Video2
        App\Media::create(array(
	        'media_types_id'     => '2',
	        'options'     => '{ "name" : "Video2", "id_youtube" : "FLjMeoUBWVo" }',
	    ));

	   	//Pronóstico
        App\Media::create(array(
	        'media_types_id'     => '3',
	        'options'     => '{"bg" : "storage/forecast/bg1.png" }',
	    ));
    }
}
