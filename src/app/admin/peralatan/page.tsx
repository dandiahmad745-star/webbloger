
'use client';

import { useState, useEffect, useRef } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Utensil, type UtensilsData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Download, UploadCloud, FileJson } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/image-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetcher, postData } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

const UtensilForm = ({ item, onSubmit, closeBtnId }: { item?: Utensil, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, closeBtnId: string }) => (
     <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" name="name" defaultValue={item?.name} required /></div>
        <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" name="description" defaultValue={item?.description} required /></div>
        <div className="space-y-2"><Label htmlFor="icon">Ikon (e.g., Wind, Coffee, Droplets)</Label><Input id="icon" name="icon" defaultValue={item?.icon} placeholder="Nama ikon dari Lucide React" required /></div>
        <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
            </DialogTrigger>
        </DialogFooter>
    </form>
);


export default function AdminPeralatanPage() {
    const { toast } = useToast();
    const { data: utensilsData, error, mutate, isLoading } = useSWR<UtensilsData>('/api/data?key=utensilsData', fetcher);
    
    const [selectedImage, setSelectedImage] = useState('');
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);

    useEffect(() => {
        if(utensilsData) {
            setSelectedImage(utensilsData.imageId);
        }
    }, [utensilsData]);

    const handleSaveUtensilsInfo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!utensilsData) return;
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            ...utensilsData,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageId: selectedImage,
        };

        try {
            await postData('utensilsData', updatedData);
            mutate(updatedData, false);
            toast({ title: "Sukses!", description: "Informasi umum 'Coffee Utensils' telah diperbarui." });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
    };

    const handleSaveUtensilItem = async (e: React.FormEvent<HTMLFormElement>, itemName?: string) => {
        e.preventDefault();
        if(!utensilsData) return;
        const formData = new FormData(e.currentTarget);
        const newItemData: Utensil = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            icon: formData.get('icon') as string,
        };

        let updatedItems;
        if (itemName) {
            updatedItems = utensilsData.items.map(item => item.name === itemName ? newItemData : item);
        } else {
            if (utensilsData.items.some(item => item.name.toLowerCase() === newItemData.name.toLowerCase())) {
                toast({ variant: "destructive", title: "Gagal", description: `Peralatan dengan nama "${newItemData.name}" sudah ada.` });
                return;
            }
            updatedItems = [...utensilsData.items, newItemData];
        }

        const updatedData = { ...utensilsData, items: updatedItems };
        
        try {
            await postData('utensilsData', updatedData);
            mutate(updatedData, false);
            toast({ title: "Sukses!", description: `Peralatan ${newItemData.name} telah disimpan.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
        
        const closeBtnId = itemName ? `close-utensil-${itemName.replace(/\s+/g, '-')}-dialog` : 'close-utensil-new-dialog';
        document.getElementById(closeBtnId)?.click();
    };

    const handleDeleteUtensilItem = async (itemName: string) => {
        if(!utensilsData) return;
        const updatedItems = utensilsData.items.filter(item => item.name !== itemName);
        const updatedData = { ...utensilsData, items: updatedItems };

        try {
            await postData('utensilsData', updatedData);
            mutate(updatedData, false);
            toast({ title: "Dihapus!", description: `Peralatan ${itemName} telah dihapus.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Tidak dapat menghapus data dari server." });
        }
    };

    const handleExport = () => {
        if(!utensilsData) return;
        const dataStr = JSON.stringify(utensilsData.items, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'peralatan.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast({ title: "Ekspor Berhasil", description: "File peralatan.json telah diunduh." });
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const processImportedData = async (importedItems: any[]) => {
        if (!utensilsData) return false;
        if (Array.isArray(importedItems) && importedItems.every(item => 'name' in item && 'description' in item && 'icon' in item)) {
            const currentItems = [...utensilsData.items];
            let newItemsCount = 0;
            let skippedCount = 0;

            importedItems.forEach((newItem: Utensil) => {
                const isDuplicate = currentItems.some(existingItem => existingItem.name.toLowerCase() === newItem.name.toLowerCase());
                if (!isDuplicate) {
                    currentItems.push(newItem);
                    newItemsCount++;
                } else {
                    skippedCount++;
                }
            });
            const updatedData = { ...utensilsData, items: currentItems };
            try {
                await postData('utensilsData', updatedData);
                mutate(updatedData, false);
                if (newItemsCount > 0) {
                    toast({ title: "Impor Berhasil", description: `${newItemsCount} item peralatan baru ditambahkan. ${skippedCount} duplikat dilewati.` });
                } else {
                    toast({ title: "Tidak Ada Item Baru", description: "Semua peralatan dalam file sudah ada di koleksi Anda." });
                }
                return true;
            } catch (e) {
                toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Gagal menyimpan data impor ke server." });
                return false;
            }
        } else {
            throw new Error("Invalid JSON format.");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Info Halaman</CardTitle>
                    <CardDescription>Ubah judul, deskripsi, dan gambar latar untuk halaman peralatan.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <Skeleton className="h-64 w-full" />}
                    {utensilsData && (
                        <form onSubmit={handleSaveUtensilsInfo} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="utensils-title">Judul Halaman</Label><Input id="utensils-title" name="title" defaultValue={utensilsData.title} /></div>
                            <div className="space-y-2"><Label htmlFor="utensils-description">Deskripsi Halaman</Label><Input id="utensils-description" name="description" defaultValue={utensilsData.description} /></div>
                            <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />
                            <div className="flex justify-end pt-2">
                                <Button type="submit">Simpan Info Umum</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                     <div>
                        <CardTitle>Kelola Item Peralatan</CardTitle>
                        <CardDescription>Tambah, edit, atau hapus item individual.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <Dialog>
                            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah</Button></DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader><DialogTitle>Tambah Peralatan Baru</DialogTitle></DialogHeader>
                                <UtensilForm onSubmit={(e) => handleSaveUtensilItem(e)} closeBtnId="close-utensil-new-dialog" />
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
                                <DropdownMenuItem onSelect={handleExport} disabled={!utensilsData}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Ekspor ke JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImportFromFile} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                    {utensilsData && utensilsData.items.map(item => (
                         <div key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                    <DialogContent className="max-w-lg">
                                        <DialogHeader><DialogTitle>Edit {item.name}</DialogTitle></DialogHeader>
                                        <UtensilForm item={item} onSubmit={(e) => handleSaveUtensilItem(e, item.name)} closeBtnId={`close-utensil-${item.name.replace(/\s+/g, '-')}-dialog`} />
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteUtensilItem(item.name)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isPasteImportOpen} onOpenChange={setIsPasteImportOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Impor Peralatan dari Teks</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="json-paste-area-utensil">Tempel konten JSON di sini:</Label>
                        <Textarea id="json-paste-area-utensil" className="mt-2 font-mono h-64" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
                    </div>
                    <DialogFooter><Button onClick={handleImportFromJsonText}>Impor Sekarang</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
