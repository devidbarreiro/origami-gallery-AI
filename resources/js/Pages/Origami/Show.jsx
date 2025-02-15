import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Trash2, Image as ImageIcon, Paperclip } from 'lucide-react';
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { delete: destroy } = useForm();

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
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al generar la imagen');
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

  return (
    <AppLayout>
      <Head title={figure.nombre} />
      
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
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {figure.nombre}
                    </h1>
                    <DifficultyBadge difficulty={figure.nivel_de_dificultad} />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Show;