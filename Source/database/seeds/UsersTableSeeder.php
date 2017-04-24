<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        App\User::create(array(
	        'name'     => 'Tomas Jerman',
	        'email'    => 'tomas.jerman@mrm-mccann.com',
	        'password' => Hash::make('123456'),
	    ));

	    App\User::create(array(
	        'name'     => 'Jesus Cardozo',
	        'email'    => 'jesus.cardozo@mrm-mccann.com',
	        'password' => Hash::make('123456'),
	    ));
    }
}
