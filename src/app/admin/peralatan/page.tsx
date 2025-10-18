
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData, type Utensil } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminPeralatanPage() {
    const { toast } = useToast();
    const [utensilsData, setUtensilsData] = useState(initialStaticData.utensils);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState(utensilsData.imageId);


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

    const handleSaveUtensilsInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            ...utensilsData,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageId: selectedImage,
        };
        setUtensilsData(updatedData);
        localStorage.setItem('utensilsData', JSON.stringify(updatedData));
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
            updatedItems = [...utensilsData.items, newItemData];
        }

        const updatedData = { ...utensilsData, items: updatedItems };
        setUtensilsData(updatedData);
        localStorage.setItem('utensilsData', JSON.stringify(updatedData));
        toast({ title: "Sukses!", description: `Peralatan ${newItemData.name} telah disimpan.` });
        
        const closeBtnId = itemName ? `close-utensil-${itemName.replace(/\s+/g, '-')}-dialog` : 'close-utensil-new-dialog';
        const closeBtn = document.getElementById(closeBtnId);
        if(closeBtn) closeBtn.click();
    };

    const handleDeleteUtensilItem = (itemName: string) => {
        const updatedItems = utensilsData.items.filter(item => item.name !== itemName);
        const updatedData = { ...utensilsData, items: updatedItems };

        setUtensilsData(updatedData);
        localStorage.setItem('utensilsData', JSON.stringify(updatedData));
        toast({ title: "Dihapus!", description: `Peralatan ${itemName} telah dihapus.` });
    };

    if (!isClient) {
        return null;
    }

    const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
        const [currentSelection, setCurrentSelection] = useState(currentImageId);

        const handleSelect = (id: string) => {
            setCurrentSelection(id);
            onSelect(id);
        }

        return (
            <div className="space-y-2">
                <Label>Pilih Gambar Latar</Label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {PlaceHolderImages.map(img => (
                        <div key={img.id} className={cn("relative aspect-square rounded-md overflow-hidden cursor-pointer border-2", currentSelection === img.id ? 'border-primary' : 'border-transparent')} onClick={() => handleSelect(img.id)}>
                            <Image src={img.imageUrl} alt={img.description} fill className="object-cover" />
                        </div>
                    ))}
                </div>
                 <Button type="button" variant="outline" className="w-full" onClick={() => alert('Fungsionalitas unggah foto akan segera hadir!')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Unggah Foto (Segera Hadir)
                </Button>
            </div>
        )
    }

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Kelola Peralatan Kopi</CardTitle>
                <CardDescription>Untuk halaman "Coffee Utensils".</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveUtensilsInfo} className="space-y-4 p-6 border rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-primary">Informasi Umum</h3>
                    <div className="space-y-2"><Label htmlFor="utensils-title">Judul Halaman</Label><Input id="utensils-title" name="title" defaultValue={utensilsData.title} /></div>
                    <div className="space-y-2"><Label htmlFor="utensils-description">Deskripsi Halaman</Label><Input id="utensils-description" name="description" defaultValue={utensilsData.description} /></div>
                    <ImagePicker currentImageId={utensilsData.imageId} onSelect={setSelectedImage} />
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Info Umum</Button>
                    </div>
                </form>

                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium text-primary">Item Peralatan</h3>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Tambah Peralatan Baru</DialogTitle></DialogHeader>
                            <form onSubmit={(e) => handleSaveUtensilItem(e)} className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" name="name" required /></div>
                                <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" name="description" required /></div>
                                <div className="space-y-2"><Label htmlFor="icon">Ikon (e.g., Wind, Coffee, Droplets)</Label><Input id="icon" name="icon" placeholder="Nama ikon dari Lucide React" required /></div>
                                <DialogFooter>
                                    <Button type="submit">Simpan</Button>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="ghost" id="close-utensil-new-dialog">Batal</Button>
                                    </DialogTrigger>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {utensilsData.items.map(item => (
                         <div key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Edit {item.name}</DialogTitle></DialogHeader>
                                        <form onSubmit={(e) => handleSaveUtensilItem(e, item.name)} className="space-y-4">
                                            <div className="space-y-2"><Label htmlFor={`name-${item.name}`}>Nama</Label><Input id={`name-${item.name}`} name="name" defaultValue={item.name} required /></div>
                                            <div className="space-y-2"><Label htmlFor={`description-${item.name}`}>Deskripsi</Label><Textarea id={`description-${item.name}`} name="description" defaultValue={item.description} required /></div>
                                            <div className="space-y-2"><Label htmlFor={`icon-${item.name}`}>Ikon</Label><Input id={`icon-${item.name}`} name="icon" defaultValue={item.icon} placeholder="Nama ikon dari Lucide React" required /></div>
                                            <DialogFooter>
                                                <Button type="submit">Simpan Perubahan</Button>
                                                <DialogTrigger asChild>
                                                    <Button type="button" variant="ghost" id={`close-utensil-${item.name.replace(/\s+/g, '-')}-dialog`}>Batal</Button>
                                                </DialogTrigger>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteUtensilItem(item.name)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
