<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'media_types_id','options'
    ];

    /**
     * Get the phone record associated with the user.
     */
    public function mediaType()
    {
        return $this->belongsTo('App\MediaType','media_types_id');
    }
}
