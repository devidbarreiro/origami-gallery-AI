<?php

use App\Http\Controllers\DallEController;

Route::middleware(['web'])->group(function () {
    Route::post('/origami/generate-image', [DallEController::class, 'generateImage']);
});