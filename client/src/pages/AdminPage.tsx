import * as React from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import ReservationsList from '@/components/admin/ReservationsList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radius } from 'lucide-react';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          Administration Restaurant
        </h1>
        <a 
          href="/" 
          className="text-amber-600 hover:text-amber-800 underline"
        >
          Retour à l'accueil
        </a>
      </div>

      {!isAuthenticated ? (
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-amber-600 text-white">
              <CardTitle className="text-center">Connexion Admin</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminLogin onLogin={() => setIsAuthenticated(true)} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-900">
              Gestion des réservations
            </h2>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
            >
              Déconnexion
            </Button>
          </div>
          <ReservationsList />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
