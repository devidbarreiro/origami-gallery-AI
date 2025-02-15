<?php

use App\Http\Controllers\OrigamiFigureController;
use App\Http\Controllers\DallEController;
use Illuminate\Support\Facades\Route;

// Ruta DELETE para eliminar una figura de origami
Route::delete('/origami/{origami}', [OrigamiFigureController::class, 'destroy'])
    ->name('origami.destroy');

// Rutas para la galería de origami
Route::get('/', [OrigamiFigureController::class, 'index'])->name('origami.index');
Route::get('/origami/create', [OrigamiFigureController::class, 'create'])->name('origami.create');
Route::post('/origami', [OrigamiFigureController::class, 'store'])->name('origami.store');
Route::get('/origami/{origami}', [OrigamiFigureController::class, 'show'])->name('origami.show');

// Rutas para generar imágenes
Route::post('/origami/generate-image', [DallEController::class, 'generateImage'])
    ->name('origami.generate-image');
Route::post('/origami/{id}/generate-image', [DallEController::class, 'generateImageForExisting'])
    ->name('origami.generate-image.existing');
