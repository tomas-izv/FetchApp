<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $films = [
            ['name' => 'A view to Kill', 'rating' => 6.3, 'year' => 1985],
            ['name' => 'Alien', 'rating' => 8.5, 'year' => 1976],
            ['name' => 'Alien Resurrection', 'rating' => 6.2, 'year' => 1997],
            ['name' => 'Alien: Covenant', 'rating' => 6.4, 'year' => 2017],
            ['name' => 'Alien3', 'rating' => 6.4, 'year' => 1992],
            ['name' => 'Aliens', 'rating' => 8.4, 'year' => 1986],
            ['name' => 'AVP: Alien vs. Predator', 'rating' => 5.7, 'year' => 2004],
            ['name' => 'AVPR: Aliens vs Predator - Requiem', 'rating' => 4.6, 'year' => 2007],
            ['name' => 'Casino Royale', 'rating' => 8, 'year' => 2006],
        ];

        DB::table('film')->insert($films);
    }
}
