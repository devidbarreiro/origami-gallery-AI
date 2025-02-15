import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/App';
import { Button } from '@/Components/ui/button';  
import { PlusCircle, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
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

const getDifficultyStyles = (difficulty) => {
  const styles = {
    'fácil': {
      text: 'Fácil',
      icon: '/images/facil.png',
      color: 'text-green-600 bg-green-50'
    },
    'medio': {
      text: 'Medio',
      icon: '/images/medio.png',
      color: 'text-yellow-600 bg-yellow-50'
    },
    'difícil': {
      text: 'Difícil',
      icon: '/images/dificil.png',
      color: 'text-red-600 bg-red-50'
    }
  };
  return styles[difficulty] || { text: 'N/A', icon: '', color: 'text-gray-600 bg-gray-50' };
};

const Index = ({ figures }) => {
  const [figureToDelete, setFigureToDelete] = useState(null);

  const handleDelete = () => {
    if (figureToDelete) {
      // Genera la URL usando el helper "route" (por ejemplo, con Ziggy)
      const deleteUrl = route('origami.destroy', figureToDelete.id);
      console.log("URL de eliminación:", deleteUrl);

      router.delete(deleteUrl, {
        onSuccess: () => {
          console.log('Figura eliminada correctamente');
        },
        onError: (errors) => {
          console.error('Error al eliminar:', errors);
          alert('Error al eliminar la figura');
        }
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Galería de Origami" />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-gray-500" />
            Galería de Origami
          </h1>
          <Link href={route('origami.create')}>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Nueva Figura
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures.map((figure) => {
            const difficultyInfo = getDifficultyStyles(figure.nivel_de_dificultad);
            
            return (
              <Card 
                key={figure.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-gray-100"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      {figure.nombre}
                    </CardTitle>
                    <div 
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.color}`}
                    >
                      <img 
                        src={difficultyInfo.icon} 
                        alt={difficultyInfo.text} 
                        className="w-4 h-4" 
                      />
                      {difficultyInfo.text}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {figure.imagen_url ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md group">
                      <img
                        src={figure.imagen_url}
                        alt={figure.nombre}
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">Vista previa</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-gray-500">Sin imagen</p>
                    </div>
                  )}
                  
                  <p className="mt-4 text-gray-600 line-clamp-2">
                    {figure.descripcion}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    asChild
                    className="hover:bg-gray-50"
                  >
                    <Link href={route('origami.show', figure.id)} className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => setFigureToDelete(figure)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar "{figure.nombre}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente la figura de origami 
                          "{figure.nombre}" con su imagen y descripción.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar Definitivamente
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {figures.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="mt-2 text-xl font-semibold text-gray-900">Tu galería de origami está vacía</h3>
            <p className="mt-2 text-sm text-gray-600">
              Comienza tu colección creando tu primera figura de origami
            </p>
            <div className="mt-6">
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href={route('origami.create')} className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Crear Primera Figura
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
