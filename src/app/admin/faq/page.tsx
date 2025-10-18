
'use client';

import { useState, useRef } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type FAQItem } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Download, UploadCloud, FileJson } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, postData } from '@/lib/api';

const FAQForm = ({ item, onSubmit, closeBtnId }: { item?: FAQItem, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, closeBtnId: string }) => (
     <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan</Label>
            <Textarea id="question" name="question" defaultValue={item?.question} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="answer">Jawaban</Label>
            <Textarea id="answer" name="answer" defaultValue={item?.answer} required rows={5} />
        </div>
        <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
            </DialogTrigger>
        </DialogFooter>
    </form>
);


export default function AdminFAQPage() {
    const { toast } = useToast();
    const { data: faqData, error, mutate, isLoading } = useSWR<FAQItem[]>('/api/data?key=faqData', fetcher);
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);

    const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>, itemId?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItemData: Omit<FAQItem, 'id'> = {
            question: formData.get('question') as string,
            answer: formData.get('answer') as string,
        };

        let updatedItems;
        if (itemId) {
            updatedItems = faqData!.map(item => item.id === itemId ? { ...item, ...newItemData } : item);
        } else {
            if (faqData?.some(item => item.question.toLowerCase() === newItemData.question.toLowerCase())) {
                toast({ variant: "destructive", title: "Gagal", description: `Pertanyaan "${newItemData.question}" sudah ada.` });
                return;
            }
            const newId = `faq-${Date.now()}`;
            updatedItems = [...(faqData || []), {id: newId, ...newItemData}];
        }
        
        try {
            await postData('faqData', updatedItems);
            mutate(updatedItems, false);
            toast({ title: "Sukses!", description: `Item FAQ telah disimpan.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
        
        const closeBtnId = itemId ? `close-faq-${itemId}-dialog` : 'close-faq-new-dialog';
        document.getElementById(closeBtnId)?.click();
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!faqData) return;
        const updatedItems = faqData.filter(item => item.id !== itemId);
        try {
            await postData('faqData', updatedItems);
            mutate(updatedItems, false);
            toast({ title: "Dihapus!", description: `Item FAQ telah dihapus.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Tidak dapat menghapus data dari server." });
        }
    };

    const handleExport = () => {
        if (!faqData) return;
        const dataStr = JSON.stringify(faqData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'faq.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast({ title: "Ekspor Berhasil", description: "File faq.json telah diunduh." });
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const processImportedData = async (importedItems: any[]) => {
        if (!Array.isArray(importedItems) || !importedItems.every(item => 'question' in item && 'answer' in item)) {
            throw new Error("Invalid JSON format.");
        }
        
        const currentItems = [...(faqData || [])];
        let newItemsCount = 0;
        let skippedCount = 0;

        importedItems.forEach((newItem: Partial<FAQItem>) => {
            const isDuplicate = currentItems.some(existingItem => 
                (newItem.id && existingItem.id === newItem.id) || 
                existingItem.question.toLowerCase() === newItem.question?.toLowerCase()
            );

            if (!isDuplicate) {
                const newId = newItem.id || `faq-${Date.now()}-${Math.random()}`;
                currentItems.push({ ...newItem, id: newId, question: newItem.question!, answer: newItem.answer! });
                newItemsCount++;
            } else {
                skippedCount++;
            }
        });

        try {
            await postData('faqData', currentItems);
            mutate(currentItems, false);

            if (newItemsCount > 0) {
                toast({ title: "Impor Berhasil", description: `${newItemsCount} item baru ditambahkan. ${skippedCount} item duplikat dilewati.` });
            } else {
                toast({ title: "Tidak Ada Item Baru", description: "Semua item dalam file sudah ada di koleksi Anda." });
            }
            return true;

        } catch (error) {
             toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data impor ke server." });
             return false;
        }
    };
    
    const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedData = JSON.parse(text);
                    await processImportedData(importedData);
                } catch (error) {
                    toast({ variant: "destructive", title: "Impor Gagal", description: "File JSON tidak valid atau formatnya salah." });
                }
            };
            reader.readAsText(file);
        }
        if (event.target) event.target.value = '';
    };

    const handleImportFromJsonText = async () => {
        if (!jsonInput.trim()) {
            toast({ variant: "destructive", title: "Input Kosong", description: "Silakan tempel konten JSON." });
            return;
        }
        try {
            const importedData = JSON.parse(jsonInput);
            if (await processImportedData(importedData)) {
                setJsonInput('');
                setIsPasteImportOpen(false);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Impor Gagal", description: "Teks JSON tidak valid atau formatnya salah." });
        }
    };

    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;

    return (
        <>
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                     <div>
                        <CardTitle>Kelola Tanya Jawab (FAQ)</CardTitle>
                        <CardDescription>Tambah, edit, atau hapus pertanyaan dan jawaban.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <Dialog>
                            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah</Button></DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader><DialogTitle>Tambah Item FAQ Baru</DialogTitle></DialogHeader>
                                <FAQForm onSubmit={(e) => handleSaveItem(e)} closeBtnId="close-faq-new-dialog" />
                            </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon"><UploadCloud className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={handleImportClick}>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    Impor dari File...
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setIsPasteImportOpen(true)}>
                                    <FileJson className="mr-2 h-4 w-4" />
                                    Impor dari Teks...
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onSelect={handleExport} disabled={!faqData || faqData.length === 0}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Ekspor ke JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImportFromFile} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                    {faqData && faqData.map(item => (
                         <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium truncate pr-4">{item.question}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                    <DialogContent className="max-w-lg">
                                        <DialogHeader><DialogTitle>Edit Item FAQ</DialogTitle></DialogHeader>
                                        <FAQForm item={item} onSubmit={(e) => handleSaveItem(e, item.id)} closeBtnId={`close-faq-${item.id}-dialog`} />
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                     {faqData && faqData.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Belum ada data FAQ.</p>
                     )}
                </CardContent>
            </Card>

            <Dialog open={isPasteImportOpen} onOpenChange={setIsPasteImportOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Impor FAQ dari Teks</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="json-paste-area-faq">Tempel konten JSON di sini:</Label>
                        <Textarea id="json-paste-area-faq" className="mt-2 font-mono h-64" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
                    </div>
                    <DialogFooter><Button onClick={handleImportFromJsonText}>Impor Sekarang</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
