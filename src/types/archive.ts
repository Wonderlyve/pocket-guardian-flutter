
export type DocumentType = 'facture' | 'recu' | 'contrat' | 'bon_commande' | 'autre';

export interface ArchivedDocument {
  id: string;
  title: string;
  type: DocumentType;
  imageData: string; // base64 or data URL
  description?: string;
  amount?: number;
  currency?: 'USD' | 'CDF';
  date: Date;
  createdBy: string; // user id
  reminder?: DocumentReminder;
}

export interface DocumentReminder {
  id: string;
  documentId: string;
  reminderDate: Date;
  reminderType: 'payment' | 'collection'; // paiement ou récupération
  note?: string;
  completed: boolean;
}

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'facture', label: 'Facture' },
  { value: 'recu', label: 'Reçu' },
  { value: 'contrat', label: 'Contrat' },
  { value: 'bon_commande', label: 'Bon de commande' },
  { value: 'autre', label: 'Autre' },
];
