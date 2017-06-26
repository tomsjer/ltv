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
      
      $cant = 20;
      
      for ($i = 0; $i < $cant / 2; $i++) {
        //Imagen
          App\Media::create(array(
  	        'media_types_id'     => '1',
  	        'options'     => '{"name" : "Imagen '. $i .'", "src" : "storage/images/imagen'. $i .'.png"}',
  	    ));
        sleep(1);
      }

      for ($j = 0; $j < $cant / 2; $j++) {
	    //Video
        App\Media::create(array(
	        'media_types_id'     => '2',
	        'options'     => '{ "name" : "Video '. $j .'", "id_youtube" : "OYRIBJ4hTAE" }',
	      ));
        sleep(1);
      }

	   	// TBD
      // Pronóstico
      //    App\Media::create(array(
	    //     'media_types_id'     => '3',
	    //     'options'     => '{"bg" : "storage/forecast/bg1.png" }',
	    // ));
    }
}
