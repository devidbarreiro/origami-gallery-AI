<?php

namespace App\Http\Controllers;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\OrigamiFigure;
use GuzzleHttp\Client;
use Exception;

class DallEController extends Controller
{
    /**
     * Genera una imagen para una nueva figura de origami
     */
    public function generateImage(Request $request)
    {
        try {
            $request->validate([
                'nombre' => 'required|string',
                'descripcion' => 'required|string|min:10',
                'nivel_de_dificultad' => 'required|string|in:fácil,medio,difícil'
            ]);

            // Generar el prompt
            $prompt = $this->generatePrompt($request->nombre, $request->descripcion, $request->nivel_de_dificultad);
            
            Log::channel('daily')->info('Generando imagen para nueva figura', [
                'nombre' => $request->nombre,
                'prompt' => $prompt
            ]);

            // Crear imagen con OpenAI
            $result = $this->createDallEImage($prompt);

            Log::channel('daily')->info('Resultado de generación de imagen para nueva figura', [
                'imagen_url' => $result['imagen_url'] ?? 'No generada',
                'original_url' => $result['original_url'] ?? 'No disponible',
                'nombre' => $request->nombre
            ]);

            return response()->json([
                'imagen_url' => $result['imagen_url'],
                'original_url' => $result['original_url']
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('daily')->warning('Validación fallida para generación de imagen', [
                'errors' => $e->errors(),
                'nombre' => $request->nombre
            ]);

            return response()->json([
                'error' => 'Error de validación',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::channel('daily')->error('Error en generación de imagen', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al generar la imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Genera una imagen para una figura existente
     */
    public function generateImageForExisting($id)
    {
    try {
        // Buscar la figura de origami
        $figure = OrigamiFigure::findOrFail($id);
        
        // Generar el prompt
        $prompt = $this->generatePrompt($figure->nombre, $figure->descripcion, $figure->nivel_de_dificultad);
        
        Log::channel('daily')->info('Generando imagen para figura', [
            'figure_id' => $id,
            'prompt' => $prompt
        ]);

        // Crear imagen con OpenAI
        $result = $this->createDallEImage($prompt);

        // Actualizar la URL de la imagen en la base de datos
        $figure->imagen_url = $result['imagen_url'];
        $figure->save();

        return response()->json($result);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        Log::channel('daily')->error('Figura no encontrada', [
            'figure_id' => $id,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'error' => 'Figura no encontrada',
            'message' => $e->getMessage()
        ], 404);
    } catch (\Exception $e) {
        Log::channel('daily')->error('Error crítico en generación de imagen', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);

        return response()->json([
            'error' => 'Error al generar la imagen',
            'message' => $e->getMessage(),
            'details' => method_exists($e, 'getErrors') ? $e->getErrors() : null
        ], 500);
    }
 }

    /**
     * Genera el prompt para DALL-E
     */
    private function generatePrompt(string $nombre, string $descripcion, string $nivel_de_dificultad): string
{
    switch ($nivel_de_dificultad) {
        case 'fácil':
            return 
                "A simple origami {$nombre}, focused on basic folds and a clean design. " .
                "{$descripcion}. " .
                "Difficulty level: easy. " .
                "Beginner-friendly with minimal steps, emphasizing clear lines and straightforward folds. " .
                "Soft lighting, clean background, and a gentle focus on the paper texture.";

        case 'medio':
            return 
                "A moderately complex origami {$nombre}, balancing elegant folds and manageable complexity. " .
                "{$descripcion}. " .
                "Difficulty level: medium. " .
                "Some intricate details while remaining accessible for those with intermediate skills. " .
                "Professional lighting, clean background, and a clear display of the folded structure.";

        case 'difícil':
        default:
            return 
                "A master-level origami {$nombre} showcasing intricate and highly sophisticated folds. " .
                "{$descripcion}. " .
                "Difficulty level: hard. " .
                "Demands precision and advanced techniques, resulting in a stunning, complex design. " .
                "High-quality lighting, clean background, and sharp focus to highlight each meticulous fold.";
    }
}



    /**
 * Crea la imagen usando DALL-E
 */
private function createDallEImage(string $prompt)
{
    try {
        // Diagnóstico de configuración de certificados
        Log::channel('daily')->info('Configuración de certificados', [
            'ini_curl_cainfo' => ini_get('curl.cainfo'),
            'configured_path' => 'C:/php-certs/cacert.pem',
            'php_config_files' => php_ini_loaded_file(),
            'additional_php_ini_files' => php_ini_scanned_files()
        ]);

        // Obtener la clave API correctamente
        $apiKey = config('services.openai.key');
        
        ini_set('curl.cainfo', 'C:/php-certs/cacert.pem');

        // Establecer explícitamente la ruta del certificado
        putenv('CURL_CA_BUNDLE=C:/php-certs/cacert.pem');
        ini_set('curl.cainfo', 'C:/php-certs/cacert.pem');
        
        // Configuración de Guzzle
        $client = new Client([
            'verify' => 'C:/php-certs/cacert.pem'
        ]);

        $response = \OpenAI\Laravel\Facades\OpenAI::images()->create([
            'model' => 'dall-e-3',
            'prompt' => $prompt,
            'n' => 1,
            'size' => '1024x1024',
            'quality' => 'standard',
            'response_format' => 'url'
        ]);


        $imageUrl = $response->data[0]->url;

        Log::channel('daily')->info('Imagen generada', [
            'image_url' => $imageUrl
        ]);


        $imageResponse = $client->get($imageUrl);
        $imageContent = $imageResponse->getBody()->getContents();

        // Generar nombre de archivo
        $filename = 'origami/' . Str::random(40) . '.png';
        
        // Guardar imagen
        Storage::disk('public')->put($filename, $imageContent);
        $localUrl = Storage::disk('public')->url($filename);

        Log::channel('daily')->info('Imagen guardada', [
            'local_url' => $localUrl
        ]);
        // Log de depuración
        Log::channel('daily')->info('Detalles de generación de imagen', [
            'filename' => $filename,
            'storage_path' => storage_path('app/public/' . $filename),
            'public_path' => public_path('storage/' . $filename),
            'url' => asset('storage/' . $filename)
        ]);


        return [
            'imagen_url' => asset('storage/' . $filename),
            'original_url' => $imageUrl
        ];

    } catch (\Exception $e) {
        Log::channel('daily')->error('Error crítico al crear imagen DALL-E', [
            'error_message' => $e->getMessage(),
            'error_trace' => $e->getTraceAsString(),
            'error_class' => get_class($e),
            'prompt_length' => strlen($prompt)
        ]);

        throw $e;
    }
 }
}