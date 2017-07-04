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
    public function index($start = 0,$limit = 10)
    {
        //
        return response()->json(Media::latest()->take($limit)->offset($start)->get());
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
                $media_options->src = "storage/images/full/".$media->id."_".$name.".".$extension;
                $media_options->srcThumbnail = "storage/images/thumbnail/".$media->id."_".$name.".".$extension;
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
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        //Get the Media
        $media = Media::find($id);
        if (!$media) {
            return response()->json([
                'message' => 'Record not found',
            ]);
        }
        
        try {
            $media->delete();
             return response()->json([
                'message' => 'Delete sucessfull',
            ]);
        }
        catch(\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Could not delete a media',
                'msg' => $e
            ]);
        }
    }

    public function storeSliders(Request $request){
        $data = $request->json()->all();
        $return = true;
        if($data){
            foreach($data as $slide){
                if(isset($slide['willDelete']) && isset($slide['id'])){
                    $this->deleteSlide($slide);
                } elseif($slide['media']['media_types_id'] === 2){
                    $return = $this->slideVideo($slide);
                }elseif($slide['media']['media_types_id'] === 1){
                    $return = $this->slideImage($slide);
                }
                if(!$return){
                    return response()->json([
                        'message' => 'Ha ocurrido un error con el Slide: '.$slide['title'],
                        'code' => '1'
                    ]);
                }
            }
        }
        return response()->json([
            'message' => 'Guardado con exito',
            'code' => '0'
        ]);
    }

    public function getSliders($all){
        $slidesRaw = Slider::all();
        $slides = [];

        foreach($slidesRaw as $slide){
            if($all === 'all'){
                $slides[] = $this->getSlideData($slide);
            }else{
                if(
                    strtotime(date('Y-m-d')) > strtotime($slide->date_from) &&
                    strtotime(date('Y-m-d')) < strtotime($slide->date_until)
                ){
                    $slides[] = $this->getSlideData($slide);
                }
            }
        }
        return response()->json($slides);
    }

    private function slideImage($data){
        $rules_Image = [
            'time_interval'      => 'required',
            'date_from'      => 'required',
            'date_until'      => 'required',
        ];

        $validator = \Validator::make($data, $rules_Image);
        if ($validator->fails()) {
            return false;
        }
        try{

            $slide = (isset($data['id'])) ? Slider::find($data['id']) : new Slider();
            
            $slide->media_id         = $data['media_id'];
            $slide->title            = $data['title'];
            $slide->subtitle         = $data['subtitle'];
            $slide->description      = $data['description'];
            $slide->time_interval    = $data['time_interval'];
            $slide->date_from        = $data['date_from'];
            $slide->date_until       = $data['date_until'];

            return $slide->save();

        }catch (Exception $e) {
            \Log::info('Error update Media: '.$e);
            return false;
        }
        return true;

    }
    private function slideVideo($data){
        $rules_video = [
            'video_loop' => 'required',
            'date_from'      => 'required',
            'date_until'      => 'required',
        ];

        $validator = \Validator::make($data, $rules_video);
        if ($validator->fails()) {
            return false;
        }
        try{
            
            $slide = (isset($data['id'])) ? Slider::find($data['id']) : new Slider();

            $slide->media_id     = $data['media_id'];
            $slide->title        = $data['title'];
            $slide->subtitle     = $data['subtitle'];
            $slide->description  = $data['description'];
            $slide->video_loop   = $data['video_loop'];
            $slide->date_from    = $data['date_from'];
            $slide->date_until   = $data['date_until'];

            $slide->save();
        }catch (Exception $e) {
            \Log::info('Error update Media: '.$e);
            return false;
        }
        return true;
    }

    private function getSlideData($slide){
        $data = $slide;
        $slide->media;
        $slide->media->mediaType;

        return $data;
    }

    private function deleteSlide($slide){
        try{
            $slide = Slider::find($slide['id']);
            $slide->delete();

        }catch (Exception $e) {
            \Log::info('Error while deleting Media: '.$e);
            return false;
        }
        return true;
    }
}
