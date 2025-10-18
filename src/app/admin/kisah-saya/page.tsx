
'use client';

import { useState, useEffect } from "react";
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
    
    const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
        const [currentSelection, setCurrentSelection] = useState(currentImageId);

        const handleSelect = (id: string) => {
            setCurrentSelection(id);
            onSelect(id);
        }

        return (
            <div className="space-y-2">
                <Label>Pilih Gambar</Label>
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
                <CardTitle>Kelola "Kisah Saya"</CardTitle>
                <CardDescription>Untuk halaman "Kisah Saya".</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveKisahSaya} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="title">Judul</Label><Input id="title" name="title" defaultValue={kisahSayaData.title} /></div>
                    <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Input id="description" name="description" defaultValue={kisahSayaData.description} /></div>
                    <div className="space-y-2"><Label htmlFor="paragraphs">Paragraf (pisahkan dengan baris baru)</Label><Textarea id="paragraphs" name="paragraphs" defaultValue={kisahSayaData.paragraphs.join('\n')} rows={5} /></div>
                    <ImagePicker currentImageId={kisahSayaData.imageId} onSelect={setSelectedImage} />
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
