<?php

namespace App\Http\Controllers;

use App\Media;
use Validator;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        //
        return response()->json(
 
           Media::all()
 
       );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        if (!is_array($request->all())) {
            return response()->json(['error' => 'request must be an array']);
        }
        // Creamos las reglas de validación
        $rules = [
            'media_types_id' => 'required',
            'options'      => 'required',
            ];
 
        try {
            // Ejecutamos el validador y en caso de que falle devolvemos la respuesta
            // con los errores
            $validator = Validator::make($request->all(), $rules);
            //Preguntar por dni existe DNI

            if ($validator->fails()) {
                return response()->json([
                    'created' => false,
                    'errors'  => $validator->errors()->all()
                ]);
            }
            // Si el validador pasa, almacenamos el usuario
            Media::create($request->all());
            return response()->json(['created' => true]);
        } catch (Exception $e) {
            // Si algo sale mal devolvemos un error.
            \Log::info('Error creating user: '.$e);
            return response()->json(['created' => false], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        //Get the Media
        $media = Media::find($id);

        if (!$media) {
            return response()->json([
                'message' => 'Record not found',
            ], 404);
        }
        // Return a single Media
        return response()->json($media);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Media $media)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Media  $media
     * @return \Illuminate\Http\Response
     */
    public function destroy(Media $media)
    {
        //
        //Get the Media
        $media = Media::find($id);
        if (!$media) {
            return response()->json([
                'message' => 'Record not found',
            ], 404);
        }
 
        if($media->delete()) {
             return response()->json([
                'message' => 'Delete sucessfull',
            ]);
        } else {
            return response()->json([
                'message' => 'Could not delete a media',
            ], 404);
        }
    }
}
