import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Trash2, Image as ImageIcon, Paperclip, Edit2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    'fácil': {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: '/images/facil.png'
    },
    'medio': {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      icon: '/images/medio.png'
    },
    'difícil': {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: '/images/dificil.png'
    }
  };

  const difficultyStyle = styles[difficulty] || styles['medio'];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${difficultyStyle.bg} ${difficultyStyle.text}`}>
      <img 
        src={difficultyStyle.icon} 
        alt={difficulty} 
        className="w-4 h-4" 
      />
      {difficulty}
    </div>
  );
};

const Show = ({ figure }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { data, setData, put, delete: destroy, processing, errors, reset } = useForm({
    nombre: figure.nombre,
    descripcion: figure.descripcion
  });

  const handleEdit = () => {
    setData({
      nombre: figure.nombre,
      descripcion: figure.descripcion
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('origami.update', figure.id), {
      preserveScroll: true, // Mantiene la posición del scroll
      onSuccess: (page) => {
        setIsEditing(false); // Sale del modo edición
        setData({ // Actualiza los datos del formulario con los nuevos valores
          nombre: page.props.figure.nombre,
          descripcion: page.props.figure.descripcion
        });
      }
    });
};

  const handleDelete = () => {
    destroy(route('origami.destroy', figure.id));
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch(`/origami/${figure.id}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json'
        }
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al generar la imagen');
      }
  
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Resto del JSX es igual que antes...
  return (
    <AppLayout>
      <Head title={isEditing ? `Editando ${figure.nombre}` : figure.nombre} />
      
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href={route('origami.index')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a la galería
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {figure.imagen_url && (
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg group">
              <img
                src={figure.imagen_url}
                alt={figure.nombre}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}

          <Card className="border-none shadow-lg">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-2">
                      {isEditing ? (
                        <div className="w-full space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600 flex justify-between">
                              <span>Nombre</span>
                              <span className="text-xs text-gray-400">
                                {data.nombre.length}/50
                              </span>
                            </label>
                            <Input
                              value={data.nombre}
                              onChange={e => setData('nombre', e.target.value.slice(0, 50))}
                              className="mt-1"
                              maxLength={50}
                            />
                            {errors.nombre && (
                              <Alert variant="destructive" className="mt-2">
                                <AlertDescription>{errors.nombre}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 flex justify-between">
                              <span>Descripción</span>
                              <span className="text-xs text-gray-400">
                                {data.descripcion.length}/500
                              </span>
                            </label>
                            <Textarea
                              value={data.descripcion}
                              onChange={e => setData('descripcion', e.target.value.slice(0, 500))}
                              className="mt-1"
                              rows={4}
                              maxLength={500}
                            />
                            {errors.descripcion && (
                              <Alert variant="destructive" className="mt-2">
                                <AlertDescription>{errors.descripcion}</AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <h1 className="text-3xl font-bold text-gray-800">
                            {figure.nombre}
                          </h1>
                          <DifficultyBadge difficulty={figure.nivel_de_dificultad} />
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              type="submit"
                              disabled={processing}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              {processing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Guardando...
                                </>
                              ) : (
                                'Guardar Cambios'
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleEdit}
                              className="hover:bg-gray-50"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGenerateImage}
                              disabled={isGeneratingImage}
                              className="hover:bg-gray-50"
                            >
                              {isGeneratingImage ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generando...
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="mr-2 h-4 w-4" />
                                  {figure.imagen_url ? 'Regenerar' : 'Generar'}
                                </>
                              )}
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar {figure.nombre}?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente la figura de origami 
                                    con toda su información. No podrás recuperarla después.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDelete} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <div className="space-y-4 mt-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                        Descripción
                      </h2>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {figure.descripcion}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="block text-xs font-medium text-gray-500 mb-1">Creación</span>
                        <span className="text-sm text-gray-800">
                          {formatDate(figure.created_at)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-gray-500 mb-1">Última actualización</span>
                        <span className="text-sm text-gray-800">
                          {formatDate(figure.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;