
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ArchivedDocument, DocumentReminder, DocumentType } from '@/types/archive';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ArchiveContextType {
  documents: ArchivedDocument[];
  addDocument: (doc: Omit<ArchivedDocument, 'id' | 'date' | 'createdBy'>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByUser: (userId: string) => ArchivedDocument[];
  addReminder: (documentId: string, reminder: Omit<DocumentReminder, 'id' | 'documentId' | 'completed'>) => void;
  completeReminder: (documentId: string) => void;
  getUpcomingReminders: () => ArchivedDocument[];
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<ArchivedDocument[]>(() => {
    const saved = localStorage.getItem('archived_documents');
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        if (key === 'date' || key === 'reminderDate') return new Date(value);
        return value;
      });
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('archived_documents', JSON.stringify(documents));
  }, [documents]);

  // Check for due reminders
  useEffect(() => {
    const now = new Date();
    documents.forEach(doc => {
      if (doc.reminder && !doc.reminder.completed) {
        const reminderDate = new Date(doc.reminder.reminderDate);
        if (reminderDate <= now) {
          toast({
            title: '⏰ Rappel',
            description: `${doc.reminder.reminderType === 'payment' ? 'Paiement' : 'Récupération'}: ${doc.title}`,
          });
        }
      }
    });
  }, []);

  const addDocument = (doc: Omit<ArchivedDocument, 'id' | 'date' | 'createdBy'>) => {
    if (!currentUser) return;
    const newDoc: ArchivedDocument = {
      ...doc,
      id: Date.now().toString(),
      date: new Date(),
      createdBy: currentUser.id,
    };
    setDocuments(prev => [newDoc, ...prev]);
    toast({ title: 'Document archivé', description: `"${doc.title}" a été enregistré.` });
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({ title: 'Document supprimé' });
  };

  const getDocumentsByUser = (userId: string) => documents.filter(d => d.createdBy === userId);

  const addReminder = (documentId: string, reminder: Omit<DocumentReminder, 'id' | 'documentId' | 'completed'>) => {
    setDocuments(prev => prev.map(d =>
      d.id === documentId
        ? {
            ...d,
            reminder: {
              ...reminder,
              id: Date.now().toString(),
              documentId,
              completed: false,
            }
          }
        : d
    ));
    toast({ title: 'Rappel ajouté', description: `Rappel programmé avec succès.` });
  };

  const completeReminder = (documentId: string) => {
    setDocuments(prev => prev.map(d =>
      d.id === documentId && d.reminder
        ? { ...d, reminder: { ...d.reminder, completed: true } }
        : d
    ));
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return documents.filter(d => d.reminder && !d.reminder.completed);
  };

  return (
    <ArchiveContext.Provider value={{
      documents, addDocument, deleteDocument, getDocumentsByUser,
      addReminder, completeReminder, getUpcomingReminders,
    }}>
      {children}
    </ArchiveContext.Provider>
  );
}

export const useArchive = () => {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error('useArchive must be used within ArchiveProvider');
  return ctx;
};
