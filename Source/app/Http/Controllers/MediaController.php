<?php

namespace App\Http\Controllers;

use App\Media;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;

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

            if ($validator->fails()) {
                return response()->json([
                    'created' => false,
                    'errors'  => $validator->errors()->all()
                ]);
            }
            $media = Media::create($request->all());

            // Si el validador pasa, almacenamos el media
            if ($request->hasFile('image')) {
                $media_options = json_decode($request->options);
                $name = $media_options->name;
                $extension = $request->image->extension();
                $path = $request->image->storeAs('public/images', $media->id."_".$name.".".$extension);
                $media_options->src = "storage/images/".$media->id."_".$media_options->name.".".$request->image->extension();
                $media->options = json_encode($media_options);
                $media->save();

            }
            return response()->json(['created' => true]);
            
        } catch (Exception $e) {
            // Si algo sale mal devolvemos un error.
            \Log::info('Error creating Media: '.$e);
            return response()->json(['created' => false]);
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
            ]);
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
        //Get the Media
        $media = Media::find($request->id);
        
        if (!$media) {
            return response()->json([
                'message' => 'Record not found',
            ]);
        }

        if (!is_array($request->all())) {
            return response()->json(['error' => 'request must be an array']);
        }
        // Creamos las reglas de validación
        $rules = [
            'id' => 'required',
            'media_types_id' => 'required',
            'options'      => 'required',
            ];

        try {
            // Ejecutamos el validador y en caso de que falle devolvemos la respuesta
            // con los errores
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'created' => false,
                    'errors'  => $validator->errors()->all()
                ]);
            }
            // Si el validador pasa, actualizamos la media
            $media->media_types_id = $request->media_types_id;
            $media->options = $request->options;
            $media->save();
            return response()->json(['update' => true]);
        } catch (Exception $e) {
            // Si algo sale mal devolvemos un error.
            \Log::info('Error update Media: '.$e);
            return response()->json(['created' => false]);
        }


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
            ]);
        }
 
        if($media->delete()) {
             return response()->json([
                'message' => 'Delete sucessfull',
            ]);
        } else {
            return response()->json([
                'message' => 'Could not delete a media',
            ]);
        }
    }

}
