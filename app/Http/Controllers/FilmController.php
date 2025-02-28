<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FilmController extends Controller {

    function main() {
        return view('main');
    }

    public function index(Request $request) {
        return response()->json([
            'films' => Film::orderBy('name')->paginate(10),
            'user' => Auth::user()
        ]);
    }

    public function index1() {
        return response()->json([
            'films' => Film::orderBy('name')->get()
        ]);
    }

    public function store(Request $request) {
        $films = [];
        $validator = Validator::make($request->all(), [
            'name'  => 'required|unique:film|max:100|min:2',
            'rating' => 'required|numeric|gte:0',
            'year' => 'required|integer|gte:1886',
        ]);
        if ($validator->passes()) {
            $message = '';
            $result = Film::change($request);
            if($result) {
                $films = Film::orderBy('name')->paginate(10)->setPath(url('film'));
            } else {
                $message = 'Message film has not been saved.';
            }
        } else {
            $result = false;
            $message = $validator->getMessageBag();
        }
        return response()->json(['result' => $result, 'message' => $message, 'films' => $films]);
    }

    public function show($id) {
        $film = Film::find($id);
        $message = '';
        if($film === null) {
            $message = 'Film not found.';
        }
        return response()->json([
            'message' => $message,
            'film' => $film
        ]);
    }

    public function update(Request $request, $id) {
        $message = '';
        $film = Film::find($id);
        $films = [];
        $result = false;
        if($film != null) {
            $validator = Validator::make($request->all(), [
                'name'  => 'required|max:100|min:2|unique:film,name,' . $film->id,
                'rating' => 'required|numeric|gte:0|lte:100000',
                'year' => 'required|integer|gte:1886',

            ]);
            if($validator->passes()) {
                $result = $film->modify($request);
                if($result) {
                    $films = Film::orderBy('name')->paginate(10)->setPath(url('film'));
                } else {
                    $message = 'Film has not been updated.';
                }
            } else {
                $message = $validator->getMessageBag();
            }
        } else {
            $message = 'Film not found';
        }
        return response()->json(['result' => $result, 'message' => $message, 'films' => $films]);
    }

    public function destroy(Request $request, $id) {
        $message = '';
        $films = [];
        $film = Film::find($id);
        $result = false;
        if($film != null) {
            try {
                $result = $film->delete();
                $films = Film::orderBy('name')->paginate(10)->setPath(url('film'));
                if($films->isEmpty()) {
                    $page = $films->lastPage();//$page - 1;
                    $request->merge(['page' => $page]);
                    $films = Film::orderBy('name')->paginate(10)->setPath(url('film'));
                }
            } catch(\Exception $e) {
                $message = $e->getMessage();
            }
        } else {
            $message = 'Film not found';
        }
        return response()->json([
            'message' => $message,
            'films' => $films,
            'result' => $result
        ]);
    }
}