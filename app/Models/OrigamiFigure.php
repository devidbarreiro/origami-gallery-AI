<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrigamiFigure extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'nivel_de_dificultad',
        'imagen_url'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Validación de nivel de dificultad
    public static function nivelesDificultad(): array
    {
        return ['fácil', 'medio', 'difícil'];
    }
}