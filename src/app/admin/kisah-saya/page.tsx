
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

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
            <Label>Pilih Gambar</Label>
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

export default function AdminKisahSayaPage() {
    const { toast } = useToast();
    const [kisahSayaData, setKisahSayaData] = useState(initialStaticData.kisahSaya);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState(kisahSayaData.imageId);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedKisahSaya = localStorage.getItem('kisahSayaData');
            if (savedKisahSaya) {
                const parsedData = JSON.parse(savedKisahSaya);
                setKisahSayaData(parsedData);
                setSelectedImage(parsedData.imageId);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSaveKisahSaya = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageId: selectedImage,
            paragraphs: (formData.get('paragraphs') as string).split('\n'),
        };
        setKisahSayaData(updatedData);
        localStorage.setItem('kisahSayaData', JSON.stringify(updatedData));
        toast({ title: "Sukses!", description: "Data 'Kisah Saya' telah diperbarui." });
    };

    if (!isClient) {
        return null;
    }

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Kelola "Kisah Saya"</CardTitle>
                <CardDescription>Untuk halaman "Kisah Saya".</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveKisahSaya} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="title">Judul</Label><Input id="title" name="title" defaultValue={kisahSayaData.title} /></div>
                    <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Input id="description" name="description" defaultValue={kisahSayaData.description} /></div>
                    <div className="space-y-2"><Label htmlFor="paragraphs">Paragraf (pisahkan dengan baris baru)</Label><Textarea id="paragraphs" name="paragraphs" defaultValue={kisahSayaData.paragraphs.join('\n')} rows={5} /></div>
                    <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

    