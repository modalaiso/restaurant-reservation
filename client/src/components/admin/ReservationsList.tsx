import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, RefreshCw } from 'lucide-react';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  created_at: string;
}

const ReservationsList = () => {
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordSet, setIsPasswordSet] = React.useState(false);

  const fetchReservations = async () => {
    if (!password) {
      setError('Mot de passe requis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
        setIsPasswordSet(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement');
        setIsPasswordSet(false);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Erreur de connexion au serveur');
      setIsPasswordSet(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReservation = async (id: number) => {
    if (!password) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setReservations(prev => prev.filter(r => r.id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  React.useEffect(() => {
    if (isPasswordSet) {
      fetchReservations();
    }
  }, []);

  return (
    <div className="space-y-6">
      {!isPasswordSet && (
        <Card>
          <CardHeader>
            <CardTitle>Authentification requise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="password"
                placeholder="Mot de passe administrateur"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchReservations}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isLoading ? 'Chargement...' : 'Charger'}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 mt-2">{error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {isPasswordSet && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
            </p>
            <Button 
              onClick={fetchReservations}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-amber-600 text-amber-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {reservations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Aucune réservation trouvée</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Personnes</TableHead>
                        <TableHead>Date/Heure</TableHead>
                        <TableHead>Réservé le</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">
                            {reservation.name}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{reservation.email}</div>
                              <div className="text-gray-500">{reservation.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {reservation.guests} personne{reservation.guests !== 1 ? 's' : ''}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{reservation.date}</div>
                              <div className="text-gray-500">{reservation.time}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(reservation.created_at)}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => deleteReservation(reservation.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ReservationsList;
