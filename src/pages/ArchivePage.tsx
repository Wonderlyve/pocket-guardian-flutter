
import { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { useArchive } from '@/contexts/ArchiveContext';
import { useAuth } from '@/contexts/AuthContext';
import { DOCUMENT_TYPES, DocumentType, ArchivedDocument } from '@/types/archive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Camera, FileText, Upload, Bell, BellRing, Trash2, 
  Calendar, DollarSign, Image, CheckCircle, Clock,
  ScanLine, Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ArchivePage = () => {
  const { currentUser, isAdmin } = useAuth();
  const { documents, addDocument, deleteDocument, addReminder, completeReminder, getDocumentsByUser, getUpcomingReminders } = useArchive();

  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('facture');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [imageData, setImageData] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState<'payment' | 'collection'>('payment');
  const [reminderNote, setReminderNote] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [selectedDoc, setSelectedDoc] = useState<ArchivedDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const userDocs = currentUser 
    ? (isAdmin ? documents : getDocumentsByUser(currentUser.id))
    : [];
  
  const upcomingReminders = getUpcomingReminders();

  const compressImage = (dataUrl: string, maxWidth = 800, quality = 0.5): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const compressed = await compressImage(reader.result as string);
      setImageData(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageData) return;
    addDocument({
      title,
      type: docType,
      imageData,
      description: description || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      currency: amount ? currency : undefined,
    });
    setTitle(''); setDescription(''); setAmount(''); setImageData(null);
    setActiveTab('documents');
  };

  const handleAddReminder = (docId: string) => {
    if (!reminderDate) return;
    addReminder(docId, {
      reminderDate: new Date(reminderDate),
      reminderType,
      note: reminderNote || undefined,
    });
    setReminderDate(''); setReminderNote(''); setSelectedDoc(null);
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Archive className="h-6 w-6 text-primary" />
          Archivage
        </h1>
        <p className="text-sm text-muted-foreground">Numérisez et conservez vos documents</p>
      </div>

      {/* Upcoming reminders banner */}
      {upcomingReminders.length > 0 && (
        <Card className="mb-4 rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <BellRing className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">
                {upcomingReminders.length} rappel(s) en attente
              </span>
            </div>
            <div className="space-y-1">
              {upcomingReminders.slice(0, 3).map(doc => (
                <div key={doc.id} className="flex items-center justify-between text-xs bg-card rounded-xl p-2">
                  <div>
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-muted-foreground ml-2">
                      {doc.reminder?.reminderType === 'payment' ? '💳 Paiement' : '📥 Récupération'}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => completeReminder(doc.id)}>
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-accent p-1 mb-4">
          <TabsTrigger value="scan" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1 text-xs">
            <ScanLine className="h-3.5 w-3.5" /> Scanner
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1 text-xs">
            <FileText className="h-3.5 w-3.5" /> Documents
          </TabsTrigger>
          <TabsTrigger value="reminders" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1 text-xs">
            <Bell className="h-3.5 w-3.5" /> Rappels
          </TabsTrigger>
        </TabsList>

        {/* SCAN TAB */}
        <TabsContent value="scan">
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center gap-2">
                <Camera className="h-4 w-4" /> Numériser un document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Image capture */}
                <div className="space-y-2">
                  {imageData ? (
                    <div className="relative rounded-xl overflow-hidden border border-border">
                      <img src={imageData} alt="Document" className="w-full max-h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageData(null)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Camera className="h-8 w-8 text-primary" />
                        <span className="text-xs font-medium text-primary">Caméra</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Galerie</span>
                      </button>
                    </div>
                  )}
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Document info */}
                <div className="space-y-1">
                  <Label className="text-xs">Titre du document</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Facture électricité" className="rounded-xl h-9 text-sm" required />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Type de document</Label>
                  <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
                    <SelectTrigger className="rounded-xl h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Description (optionnel)</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails..." className="rounded-xl h-9 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Montant (optionnel)</Label>
                    <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="rounded-xl h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Devise</Label>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'CDF')}>
                      <SelectTrigger className="rounded-xl h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="CDF">CDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional immediate reminder */}
                <div className="p-3 rounded-xl bg-accent/50 space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <Bell className="h-3 w-3" /> Ajouter un rappel (optionnel)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="rounded-xl h-9 text-xs" />
                    <Select value={reminderType} onValueChange={(v) => setReminderType(v as 'payment' | 'collection')}>
                      <SelectTrigger className="rounded-xl h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Paiement</SelectItem>
                        <SelectItem value="collection">Récupération</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl" disabled={!title || !imageData}>
                  <ScanLine className="h-4 w-4 mr-1" /> Archiver le document
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents">
          {userDocs.length === 0 ? (
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Aucun document archivé</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {userDocs.map(doc => (
                <Card key={doc.id} className="rounded-2xl border-border/50 overflow-hidden">
                  <div className="flex">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img src={doc.imageData} alt={doc.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-3 flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{doc.title}</p>
                          <span className="inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-0.5">
                            {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {!doc.reminder && (
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setSelectedDoc(doc)}>
                              <Bell className="h-3.5 w-3.5 text-primary" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => deleteDocument(doc.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {doc.amount && (
                        <p className="text-xs font-medium text-primary mt-1">
                          {doc.amount.toLocaleString()} {doc.currency}
                        </p>
                      )}
                      {doc.reminder && (
                        <div className={cn(
                          "flex items-center gap-1 mt-1 text-[10px]",
                          doc.reminder.completed ? "text-muted-foreground" : "text-primary"
                        )}>
                          <Clock className="h-3 w-3" />
                          {doc.reminder.completed ? 'Rappel terminé' : 
                            `${doc.reminder.reminderType === 'payment' ? 'Paiement' : 'Récupération'} - ${new Date(doc.reminder.reminderDate).toLocaleDateString('fr-FR')}`
                          }
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* REMINDERS TAB */}
        <TabsContent value="reminders">
          {upcomingReminders.length === 0 ? (
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Aucun rappel en attente</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map(doc => (
                <Card key={doc.id} className="rounded-2xl border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full",
                            doc.reminder?.reminderType === 'payment'
                              ? "bg-destructive/10 text-destructive"
                              : "bg-primary/10 text-primary"
                          )}>
                            {doc.reminder?.reminderType === 'payment' ? '💳 Paiement' : '📥 Récupération'}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.reminder && new Date(doc.reminder.reminderDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {doc.reminder?.note && (
                          <p className="text-xs text-muted-foreground mt-1">{doc.reminder.note}</p>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs" onClick={() => completeReminder(doc.id)}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Fait
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reminder dialog for a document */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setSelectedDoc(null)}>
          <div className="bg-card rounded-t-2xl w-full max-w-md p-4 space-y-3 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-sm">Ajouter un rappel pour "{selectedDoc.title}"</h3>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Date du rappel</Label>
                <Input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="rounded-xl h-9 text-sm" required />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={reminderType} onValueChange={(v) => setReminderType(v as 'payment' | 'collection')}>
                  <SelectTrigger className="rounded-xl h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Paiement à effectuer</SelectItem>
                    <SelectItem value="collection">Paiement à récupérer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Note (optionnel)</Label>
                <Input value={reminderNote} onChange={e => setReminderNote(e.target.value)} placeholder="Détails du rappel..." className="rounded-xl h-9 text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedDoc(null)}>Annuler</Button>
              <Button className="flex-1 rounded-xl" onClick={() => handleAddReminder(selectedDoc.id)} disabled={!reminderDate}>
                <Bell className="h-4 w-4 mr-1" /> Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ArchivePage;
