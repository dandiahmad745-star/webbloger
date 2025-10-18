
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData, type Utensil } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Upload, Download, UploadCloud, FileJson } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
    const [currentSelection, setCurrentSelection] = useState(currentImageId);
    const [userImages, setUserImages] = useState<ImagePlaceholder[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadImages = () => {
                try {
                    const savedUserImages = localStorage.getItem('userImages');
                    if (savedUserImages) {
                        setUserImages(JSON.parse(savedUserImages));
                    }
                } catch (error) {
                    console.error("Failed to parse user images from localStorage", error);
                }
            };
            loadImages();
            window.addEventListener('storage', loadImages);
            return () => window.removeEventListener('storage', loadImages);
        }
    }, []);
    
    useEffect(() => {
        setCurrentSelection(currentImageId);
    }, [currentImageId]);

    const handleSelect = (id: string) => {
        setCurrentSelection(id);
        onSelect(id);
    }

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                toast({
                    variant: "destructive",
                    title: "Ukuran file terlalu besar",
                    description: "Ukuran gambar tidak boleh melebihi 500KB untuk menghemat ruang penyimpanan browser.",
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const newImageId = `user-img-${Date.now()}`;
                const newImage: ImagePlaceholder = { id: newImageId, imageUrl: dataUrl, description: file.name, imageHint: 'custom upload' };
                
                try {
                    const existingImagesRaw = localStorage.getItem('userImages');
                    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
                    const updatedUserImages = [...existingImages, newImage];

                    setUserImages(updatedUserImages);
                    localStorage.setItem('userImages', JSON.stringify(updatedUserImages));
                    handleSelect(newImageId);
                    
                    toast({ title: "Gambar Diunggah", description: "Gambar telah disimpan secara lokal." });

                    window.dispatchEvent(new Event('storage'));
                } catch (error) {
                     toast({
                        variant: "destructive",
                        title: "Penyimpanan Penuh",
                        description: "Gagal menyimpan gambar. Penyimpanan lokal browser mungkin penuh. Coba gunakan gambar yang lebih kecil.",
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const allImages = [...PlaceHolderImages, ...userImages];

    return (
        <div className="space-y-2">
            <Label>Pilih Gambar Latar</Label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {allImages.map(img => (
                    <div key={img.id} className={cn("relative aspect-square rounded-md overflow-hidden cursor-pointer border-2", currentSelection === img.id ? 'border-primary' : 'border-transparent')} onClick={() => handleSelect(img.id)}>
                        <Image src={img.imageUrl} alt={img.description} fill className="object-cover" />
                    </div>
                ))}
            </div>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             <Button type="button" variant="outline" className="w-full" onClick={handleUploadClick}><Upload className="h-4 w-4 mr-2" />Unggah Foto (Maks 500KB)</Button>
        </div>
    )
}

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
    const [utensilsData, setUtensilsData] = useState(initialStaticData.utensils);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState(utensilsData.imageId);
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedUtensils = localStorage.getItem('utensilsData');
            if (savedUtensils) {
                const parsedData = JSON.parse(savedUtensils);
                setUtensilsData(parsedData);
                setSelectedImage(parsedData.imageId);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const saveData = (data: typeof utensilsData) => {
        setUtensilsData(data);
        localStorage.setItem('utensilsData', JSON.stringify(data));
    }

    const handleSaveUtensilsInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            ...utensilsData,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageId: selectedImage,
        };
        saveData(updatedData);
        toast({ title: "Sukses!", description: "Informasi umum 'Coffee Utensils' telah diperbarui." });
    };

    const handleSaveUtensilItem = (e: React.FormEvent<HTMLFormElement>, itemName?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newItemData: Utensil = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            icon: formData.get('icon') as string,
        };

        let updatedItems;
        if (itemName) {
            // Editing existing item
            updatedItems = utensilsData.items.map(item => item.name === itemName ? newItemData : item);
        } else {
            // Adding new item
            // Check for duplicates before adding
            if (utensilsData.items.some(item => item.name.toLowerCase() === newItemData.name.toLowerCase())) {
                toast({ variant: "destructive", title: "Gagal", description: `Peralatan dengan nama "${newItemData.name}" sudah ada.` });
                return;
            }
            updatedItems = [...utensilsData.items, newItemData];
        }

        const updatedData = { ...utensilsData, items: updatedItems };
        saveData(updatedData);
        toast({ title: "Sukses!", description: `Peralatan ${newItemData.name} telah disimpan.` });
        
        const closeBtnId = itemName ? `close-utensil-${itemName.replace(/\s+/g, '-')}-dialog` : 'close-utensil-new-dialog';
        const closeBtn = document.getElementById(closeBtnId);
        if(closeBtn) closeBtn.click();
    };

    const handleDeleteUtensilItem = (itemName: string) => {
        const updatedItems = utensilsData.items.filter(item => item.name !== itemName);
        const updatedData = { ...utensilsData, items: updatedItems };

        saveData(updatedData);
        toast({ title: "Dihapus!", description: `Peralatan ${itemName} telah dihapus.` });
    };

    const handleExport = () => {
        // We export only the items array
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

    const processImportedData = (importedItems: any[]) => {
        if (Array.isArray(importedItems) && importedItems.every(item => 'name' in item && 'description' in item && 'icon' in item)) {
            const currentItems = [...utensilsData.items];
            let newItemsCount = 0;

            importedItems.forEach((newItem: Utensil) => {
                const isDuplicate = currentItems.some(existingItem => existingItem.name.toLowerCase() === newItem.name.toLowerCase());
                if (!isDuplicate) {
                    currentItems.push(newItem);
                    newItemsCount++;
                }
            });

            saveData({ ...utensilsData, items: currentItems });

            if (newItemsCount > 0) {
                toast({ title: "Impor Berhasil", description: `${newItemsCount} item peralatan baru telah ditambahkan.` });
            } else {
                toast({ title: "Tidak Ada Item Baru", description: "Semua peralatan dalam file sudah ada di koleksi Anda." });
            }
            return true;
        } else {
            throw new Error("Invalid JSON format.");
        }
    };
    
    const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedData = JSON.parse(text);
                    processImportedData(importedData);
                } catch (error) {
                    toast({ variant: "destructive", title: "Impor Gagal", description: "File JSON tidak valid atau formatnya salah." });
                }
            };
            reader.readAsText(file);
        }
        if (event.target) event.target.value = '';
    };

    const handleImportFromJsonText = () => {
        if (!jsonInput.trim()) {
            toast({ variant: "destructive", title: "Input Kosong", description: "Silakan tempel konten JSON." });
            return;
        }
        try {
            const importedData = JSON.parse(jsonInput);
            if (processImportedData(importedData)) {
                setJsonInput('');
                setIsPasteImportOpen(false);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Impor Gagal", description: "Teks JSON tidak valid atau formatnya salah." });
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Info Halaman</CardTitle>
                    <CardDescription>Ubah judul, deskripsi, dan gambar latar untuk halaman peralatan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveUtensilsInfo} className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="utensils-title">Judul Halaman</Label><Input id="utensils-title" name="title" defaultValue={utensilsData.title} /></div>
                        <div className="space-y-2"><Label htmlFor="utensils-description">Deskripsi Halaman</Label><Input id="utensils-description" name="description" defaultValue={utensilsData.description} /></div>
                        <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />
                        <div className="flex justify-end pt-2">
                            <Button type="submit">Simpan Info Umum</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between">
                     <div>
                        <CardTitle>Kelola Item Peralatan</CardTitle>
                        <CardDescription>Tambah, edit, atau hapus item individual.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                        <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImportFromFile} />
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline"><UploadCloud className="h-4 w-4" /></Button>
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
                                <DropdownMenuItem onSelect={handleExport}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Ekspor ke JSON
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog>
                            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah</Button></DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader><DialogTitle>Tambah Peralatan Baru</DialogTitle></DialogHeader>
                                <UtensilForm onSubmit={(e) => handleSaveUtensilItem(e)} closeBtnId="close-utensil-new-dialog" />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {utensilsData.items.map(item => (
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
