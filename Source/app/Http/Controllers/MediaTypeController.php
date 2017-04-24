<?php

namespace App\Http\Controllers;

use App\MediaType;
use Illuminate\Http\Request;

class MediaTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return response()->json(
 
           MediaType::all()
 
       );
    }
}
