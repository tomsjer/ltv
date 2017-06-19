<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'description',
    ];

    /**
     * Get the phone record associated with the user.
     */
    public function media()
    {
        return $this->belongsTo('App\Media');
    }
}
