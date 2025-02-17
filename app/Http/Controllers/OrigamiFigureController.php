<?php

namespace App\Http\Controllers;

use App\Models\OrigamiFigure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrigamiFigureController extends Controller
{
    public function index()
    {
        return Inertia::render('Origami/Index', [
            'figures' => OrigamiFigure::all()
        ]);
    }

    public function update(Request $request, OrigamiFigure $origami)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50|unique:origami_figures,nombre,' . $origami->id,
            'descripcion' => 'required|string|min:10|max:500',
        ]);

        $origami->update($validated);

        return back();
    }

    public function store(Request $request)
    {
        Log::channel('daily')->info('Datos recibidos para crear figura', [
            'datos_completos' => $request->all(),
            'imagen_url' => $request->input('imagen_url')
        ]);

        // Validar los datos
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'nivel_de_dificultad' => 'required|in:fácil,medio,difícil',
            'imagen_url' => 'nullable|url'
        ]);

        Log::channel('daily')->info('Datos validados', [
            'datos_validados' => $validatedData
        ]);

        // Crear la figura de origami
        $figure = new OrigamiFigure();
        $figure->nombre = $validatedData['nombre'];
        $figure->descripcion = $validatedData['descripcion'];
        $figure->nivel_de_dificultad = $validatedData['nivel_de_dificultad'];

        // Guardar la URL de la imagen si está presente
        if (isset($validatedData['imagen_url'])) {
            $figure->imagen_url = $validatedData['imagen_url'];
            Log::channel('daily')->info('Imagen URL guardada', [
                'imagen_url' => $figure->imagen_url
            ]);
        }

        $figure->save();

        Log::channel('daily')->info('Figura creada', [
            'figura_id' => $figure->id,
            'imagen_url_guardada' => $figure->imagen_url
        ]);

        // Redirigir a la galería de origami
        return redirect()->route('origami.index');
    }

    public function show(OrigamiFigure $origami)
    {
        return Inertia::render('Origami/Show', [
            'figure' => $origami
        ]);
    }

    public function create()
    {
        return Inertia::render('Origami/Create');
    }

    public function destroy(OrigamiFigure $origami)
    {
        try {
            // Eliminar la imagen del almacenamiento si existe
            if ($origami->imagen_url) {
                $path = str_replace('/storage/', '', parse_url($origami->imagen_url, PHP_URL_PATH));
                Storage::disk('public')->delete($path);
            }

            $origami->delete();

            return redirect()->route('origami.index')
                ->setStatusCode(303)
                ->with('success', 'Figura eliminada correctamente');
        
        } catch (\Exception $e) {
            Log::error('Error al eliminar figura', [
                'id' => $origami->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'No se pudo eliminar la figura']);
        }
    }


    // API Endpoints (opcional)

    public function apiIndex()
    {
        return response()->json(OrigamiFigure::all());
    }

    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|unique:origami_figures|string|max:255',
            'descripcion' => 'required|string|min:10',
            'nivel_de_dificultad' => 'required|in:fácil,medio,difícil'
        ]);

        $figure = OrigamiFigure::create($validated);
        return response()->json($figure, 201);
    }

    public function apiShow(OrigamiFigure $origami)
    {
        return response()->json($origami);
    }

    public function apiDestroy(OrigamiFigure $origami)
    {
        $origami->delete();
        return response()->json(null, 204);
    }
}
