<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    protected $table = 'film';

    protected $fillable = ['name', 'rating', 'year'];

    static function change($request) {
        $film = new Film($request->all());
        return $film->store();
    }

    function modify($request) {
        $result = false;
        try {
            $result = $this->update($request->all());
        } catch(\Exception $e) {
        }
        return $result;
    }

    function store() {
        try {
            $result = $this->save();
        } catch(\Exception $e) {
            $result = false;
        }
        return $result;
    }

}