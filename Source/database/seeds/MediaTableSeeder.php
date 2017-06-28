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
      
      $cant = 4;
      
      for ($i = 0; $i < $cant; $i++) {
        //Imagen
        App\Media::create(array(
	        'media_types_id'     => '1',
	        'options'     => '{"name" : "Imagen '. $i .'", "src" : "storage/images/full/'. $i .'_test.jpeg", "srcThumbnail" : "storage/images/thumbnail/'. $i .'_test.jpeg"}',
  	    ));
        sleep(1);
      }

      $videos = array( "Y4rhgoKvW3Y", "OYRIBJ4hTAE", "h__Jlt2Kkc4", "9BMx2E3MGZ8" );
      
      foreach ($videos as $video){
	    //Video
        App\Media::create(array(
	        'media_types_id'     => '2',
	        'options'     => '{ "name" : "Video", "id_youtube" : "'.  $video .'" }',
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
