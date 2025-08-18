import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/db.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin password (in production, use environment variable)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Utility function to validate date format (dd-mm-yyyy)
function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year;
}

// POST /api/reservations - Create new reservation
app.post('/api/reservations', async (req: express.Request, res: express.Response) => {
  console.log('Received reservation request:', req.body);
  
  const { name, email, phone, guests, date, time } = req.body;
  
  // Validation
  if (!name || !email || !phone || !guests || !date || !time) {
    res.status(400).json({ error: 'Tous les champs sont requis' });
    return;
  }
  
  if (!isValidDateFormat(date)) {
    res.status(400).json({ error: 'La date doit être au format jj-mm-yyyy' });
    return;
  }
  
  if (guests < 1 || guests > 20) {
    res.status(400).json({ error: 'Le nombre de personnes doit être entre 1 et 20' });
    return;
  }
  
  try {
    const result = await db
      .insertInto('reservations')
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        guests: parseInt(guests),
        date: date.trim(),
        time: time.trim()
      })
      .execute();
    
    console.log('Reservation created successfully:', result);
    
    // Convert BigInt to number for JSON serialization
    const insertId = result[0].insertId;
    const responseId = typeof insertId === 'bigint' ? Number(insertId) : insertId;
    
    res.status(201).json({ 
      message: 'Réservation créée avec succès',
      id: responseId
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// POST /api/admin/login - Admin authentication
app.post('/api/admin/login', (req: express.Request, res: express.Response) => {
  console.log('Admin login attempt');
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Connexion réussie' });
  } else {
    res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
  }
});

// GET /api/admin/reservations - Get all reservations (requires password)
app.post('/api/admin/reservations', async (req: express.Request, res: express.Response) => {
  console.log('Admin reservations request');
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }
  
  try {
    const reservations = await db
      .selectFrom('reservations')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    
    console.log('Fetched reservations:', reservations.length);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// DELETE /api/admin/reservations/:id - Delete reservation
app.delete('/api/admin/reservations/:id', async (req: express.Request, res: express.Response) => {
  console.log('Delete reservation request:', req.params.id);
  const { password } = req.body;
  const reservationId = parseInt(req.params.id);
  
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }
  
  if (!reservationId || isNaN(reservationId)) {
    res.status(400).json({ error: 'ID de réservation invalide' });
    return;
  }
  
  try {
    const result = await db
      .deleteFrom('reservations')
      .where('id', '=', reservationId)
      .execute();
    
    if (result.length > 0 && result[0].numDeletedRows > 0) {
      console.log('Reservation deleted successfully');
      res.json({ message: 'Réservation supprimée avec succès' });
    } else {
      res.status(404).json({ error: 'Réservation introuvable' });
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`Restaurant reservation server running on port ${port}`);
      console.log(`Admin password: ${ADMIN_PASSWORD}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting restaurant reservation server...');
  startServer(process.env.PORT || 3001);
}
