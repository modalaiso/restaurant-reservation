export interface ReservationsTable {
  id: number;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  created_at: string;
}

export interface DatabaseSchema {
  reservations: ReservationsTable;
}
