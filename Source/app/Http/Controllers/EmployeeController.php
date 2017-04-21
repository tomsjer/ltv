<?php

namespace App\Http\Controllers;
use Validator;
use App\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
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
 
           Employee::all()
 
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
        if (!is_array($request->all())) {
            return response()->json(['error' => 'request must be an array']);
        }
        // Creamos las reglas de validación
        $rules = [
            'dni' => 'required',
            'name'      => 'required',
            'lastname'     => 'required',
            'email'  => 'required|email',
            'birth_date' => 'required'
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
            Employee::create($request->all());
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
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        //Get the Employee
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json([
                'message' => 'Record not found',
            ], 404);
        }
        // Return a single Employee
        return response()->json($employee);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Employee  $employee
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //Get the employee
        $employee = Employee::find($id);
        if (!$employee) {
            return response()->json([
                'message' => 'Record not found',
            ], 404);
        }
 
        if($employee->delete()) {
             return response()->json([
                'message' => 'Delete sucessfull',
            ]);
        } else {
            return response()->json([
                'message' => 'Could not delete a employee',
            ], 404);
        }
    }
}
