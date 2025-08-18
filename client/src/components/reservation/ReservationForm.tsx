import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReservationForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    time: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'success' | 'error'>('success');

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const validateDateFormat = (dateString: string): boolean => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year &&
           date >= new Date();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!validateDateFormat(formData.date)) {
      setMessage('La date doit être au format jj-mm-aaaa et ne peut pas être dans le passé');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Réservation créée avec succès !');
        setMessageType('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '',
          date: '',
          time: ''
        });
      } else {
        setMessage(data.error || 'Erreur lors de la création de la réservation');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Erreur de connexion au serveur');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          className="mt-1"
          placeholder="Votre nom complet"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          className="mt-1"
          placeholder="votre.email@exemple.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
          className="mt-1"
          placeholder="06 12 34 56 78"
        />
      </div>

      <div>
        <Label htmlFor="guests">Nombre de personnes</Label>
        <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choisir le nombre" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(20)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1} personne{i > 0 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="text"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          required
          className="mt-1"
          placeholder="18-08-2025"
          pattern="\d{2}-\d{2}-\d{4}"
        />
        <p className="text-xs text-gray-600 mt-1">
          Format : jj-mm-aaaa
        </p>
      </div>

      <div>
        <Label htmlFor="time">Heure</Label>
        <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choisir l'heure" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {message && (
        <div className={`p-3 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        {isLoading ? 'Création en cours...' : 'Réserver'}
      </Button>
    </form>
  );
};

export default ReservationForm;
