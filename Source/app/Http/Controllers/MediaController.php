<?php

namespace App\Http\Controllers;

use App\Media;
use App\Slider;
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
    public function index($start = 0,$limit = 20)
    {
        //
        return response()->json(Media::take($limit)->offset($start)->get());
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
        $rules = [
            'media_types_id' => 'required',
            'options'      => 'required',
            ];
 
        try {
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'created' => false,
                    'errors'  => $validator->errors()->all()
                ]);
            }

            $media = Media::create($request->all());

            if ($request->hasFile('image')) {
                $media_options = json_decode($request->options);
                $name = $media_options->name;
                $extension = $request->image->extension();
                $img = \Image::make($request->image)->resize(100,100);
                $path = $img->save(storage_path('app/public/images/thumbnail/'.$media->id."_".$name.".".$extension));
                $path = $request->image->storeAs('public/images/full/', $media->id."_".$name.".".$extension);
                $media_options->src = "images/full/".$media->id."_".$name.".".$extension;
                $media_options->srcThumnail = "images/thumbnail/".$media->id."_".$name.".".$extension;
                $media->options = json_encode($media_options);
                
                $media->save();
            }

            return response()->json(['created' => true, 'media' => $media]);

        } catch (Exception $e) {
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
        $media = Media::find($request->id);
        
        if (!$media) {
            return response()->json([
                'message' => 'Record not found',
            ]);
        }

        if (!is_array($request->all())) {
            return response()->json(['error' => 'request must be an array']);
        }
        $rules = [
            'id' => 'required',
            'media_types_id' => 'required',
            'options'      => 'required',
            ];

        try {
            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'created' => false,
                    'errors'  => $validator->errors()->all()
                ]);
            }   

            if ($request->hasFile('image')) {
                //Delete img
                $BDmedia_options = json_decode($media->options);
                $src = explode("/", $BDmedia_options->src);
                \Storage::delete("public/images/".$src[count($src) - 1]);            

                
                $media_options = json_decode($request->options);
                $name = $media_options->name;
                $extension = $request->image->extension();
                $path = $request->image->storeAs('public/images', $media->id."_".$name.".".$extension);
                $media_options->src = "storage/images/".$media->id."_".$media_options->name.".".$request->image->extension();
                $media->options = json_encode($media_options);
            }

            $media->media_types_id = $request->media_types_id;
            $media->options = $media->options;
            $media->save();

            return response()->json(['update' => true]);
        } catch (Exception $e) {
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

    public function storeSliders(Request $request){
        $data = $request->json()->all();

        if($data['sliders']) {
            foreach($data['sliders'] as $slide){
                switch ($slide['tipo']){
                    case 1: //Imagenes
                        $this->slideImage($slide);
                    break;
                    case 2: //video
                        $this->slideVideo($slide);
                    break;
                    default:
                    break;
                }
            }
        }

        return response()->json([
            'message' => 'saved',
        ]);
    }

    public function getSliders($all){
        $slidesRaw = Slider::all();
        $slides = [];

        if($all === 'all'){
            $slides = $slidesRaw;
        }else{
            foreach($slidesRaw as $slide){
                if(
                    strtotime(date('Y-m-d')) > strtotime($slide->date_from) &&
                    strtotime(date('Y-m-d')) < strtotime($slide->date_until)
                ){
                    $slides[] = $slide;
                }
            }
        }
        return response()->json($slides);
    }

    private function slideImage($data){
        $rules_Image = [
            'src' => 'required',
            'srcThumbnail' => 'required',
            'intervalo'      => 'required',
            'desde'      => 'required',
            'hasta'      => 'required',
        ];

        $validator = \Validator::make($data, $rules_Image);
        if ($validator->fails()) {
            return false;
        }
        try{
            $newSlide = new Slider();

            $newSlide->media_type_id    = $data['tipo'];
            $newSlide->media_id         = $data['media_id'];
            $newSlide->title            = $data['titulo'];
            $newSlide->subtitle         = $data['subtitulo'];
            $newSlide->description      = $data['descripcion'];
            $newSlide->img_src          = $data['src'];
            $newSlide->thumbnail_src    = $data['srcThumbnail'];
            $newSlide->time_interval    = $data['intervalo'];
            $newSlide->date_from        = $data['desde'];
            $newSlide->date_until       = $data['hasta'];

            $newSlide->save();
        }catch (Exception $e) {
            \Log::info('Error update Media: '.$e);
            return false;
        }
        return true;

    }
    private function slideVideo($data){
        $rules_video = [
            'id_youtube' => 'required',
            'loop' => 'required',
            'desde'      => 'required',
            'hasta'      => 'required',
        ];

        $validator = \Validator::make($data, $rules_video);
        if ($validator->fails()) {
            return false;
        }
        try{
            $newSlide = new Slider();

            $newSlide->media_type_id= $data['tipo'];
            $newSlide->media_id     = $data['media_id'];
            $newSlide->title        = $data['titulo'];
            $newSlide->subtitle     = $data['subtitulo'];
            $newSlide->description  = $data['descripcion'];
            $newSlide->video_id     = $data['id_youtube'];
            $newSlide->video_loop   = $data['loop'];
            $newSlide->date_from    = $data['desde'];
            $newSlide->date_until   = $data['hasta'];

            $newSlide->save();
        }catch (Exception $e) {
            \Log::info('Error update Media: '.$e);
            return false;
        }
        return true;
    }

}
