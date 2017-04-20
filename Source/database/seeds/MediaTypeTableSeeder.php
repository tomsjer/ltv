<?php

use Illuminate\Database\Seeder;

class MediaTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        App\MediaType::create(array(
	        'description'     => 'Imagen',
	    ));

	    App\MediaType::create(array(
	        'description'     => 'Video',
	    ));

	    App\MediaType::create(array(
	        'description'     => 'Pronóstico',
	    ));
    }
}
