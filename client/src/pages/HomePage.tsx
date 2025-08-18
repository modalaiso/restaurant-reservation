import * as React from 'react';
import ReservationForm from '@/components/reservation/ReservationForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
          Nom du restaurant
        </h1>
        <p className="text-lg text-amber-700 max-w-2xl mx-auto">
          Réservez votre table dans notre restaurant et découvrez une cuisine raffinée 
          dans une ambiance chaleureuse.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-amber-200">
          <CardHeader className="bg-amber-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">
              Réserver une table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ReservationForm />
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-8">
        <a 
          href="/admin" 
          className="text-amber-600 hover:text-amber-800 text-sm underline"
        >
          Accès administration
        </a>
      </div>
    </div>
  );
};

export default HomePage;
