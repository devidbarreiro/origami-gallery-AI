<?php

return [
    'api_key' => env('OPENAI_API_KEY'),
    'organization' => env('OPENAI_ORGANIZATION'),
    'request_options' => [
        'verify' => false,  // Cambiamos a false temporalmente
    ],
];