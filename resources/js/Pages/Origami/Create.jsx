import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Image as ImageIcon, Plus } from 'lucide-react';

// Componente de ícono de dificultad con imágenes
const DifficultyIcon = ({ level, className }) => {
  const icons = {
    'fácil': '/images/facil.png',
    'medio': '/images/medio.png',
    'difícil': '/images/dificil.png'
  };

  return (
    <img 
      src={icons[level]} 
      alt={`Nivel de dificultad: ${level}`} 
      className={`w-6 h-6 ${className}`} 
    />
  );
};

const Create = () => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    descripcion: '',
    nivel_de_dificultad: '',
    imagen_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/origami', {
      nombre: data.nombre,
      descripcion: data.descripcion,
      nivel_de_dificultad: data.nivel_de_dificultad,
      imagen_url: data.imagen_url
    });
  };

  const generateImage = async () => {
    if (!data.nombre || !data.descripcion) return;

    setIsGeneratingImage(true);
    try {
      const response = await fetch('/origami/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al generar la imagen');
      }

      setData('imagen_url', result.imagen_url);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Función para contar caracteres de la descripción
  const getDescriptionCharCount = () => {
    return data.descripcion ? data.descripcion.length : 0;
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm border-none">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-6 h-6 text-gray-500" />
                Crear Nueva Figura de Origami
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex justify-between items-center">
                  <span>Nombre</span>
                  <span className="text-xs text-gray-400">
                    {data.nombre.length}/50
                  </span>
                </label>
                <Input
                  value={data.nombre}
                  onChange={e => setData('nombre', e.target.value.slice(0, 50))}
                  placeholder="Nombre de la figura"
                  maxLength={50}
                  className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-100"
                />
                {errors.nombre && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.nombre}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 flex justify-between items-center">
                  <span>Descripción</span>
                  <span className="text-xs text-gray-400">
                    {getDescriptionCharCount()}/500
                  </span>
                </label>
                <Textarea
                  value={data.descripcion}
                  onChange={e => setData('descripcion', e.target.value.slice(0, 500))}
                  placeholder="Describe la figura..."
                  rows={4}
                  maxLength={500}
                  className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-100"
                />
                {errors.descripcion && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.descripcion}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Nivel de Dificultad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Nivel de Dificultad</label>
                <Select
                  value={data.nivel_de_dificultad}
                  onValueChange={value => setData('nivel_de_dificultad', value)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-100">
                    {data.nivel_de_dificultad ? (
                      <div className="flex items-center gap-2">
                        <DifficultyIcon 
                          level={data.nivel_de_dificultad} 
                          className="mr-2" 
                        />
                        {data.nivel_de_dificultad}
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecciona el nivel" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fácil" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <DifficultyIcon level="fácil" className="mr-2" />
                        Fácil
                      </div>
                    </SelectItem>
                    <SelectItem value="medio" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <DifficultyIcon level="medio" className="mr-2" />
                        Medio
                      </div>
                    </SelectItem>
                    <SelectItem value="difícil" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <DifficultyIcon level="difícil" className="mr-2" />
                        Difícil
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.nivel_de_dificultad && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.nivel_de_dificultad}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Imagen</label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateImage}
                    disabled={isGeneratingImage || !data.nombre || !data.descripcion}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generar Imagen con DALL-E
                      </>
                    )}
                  </Button>
                </div>
                
                {data.imagen_url && (
                  <div className="mt-4 relative group">
                    <img 
                      src={data.imagen_url} 
                      alt={data.nombre}
                      className="w-full h-64 object-cover rounded-lg shadow-sm border border-gray-100 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <span className="text-white text-sm">Vista previa</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing || isGeneratingImage}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Figura'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Create;
