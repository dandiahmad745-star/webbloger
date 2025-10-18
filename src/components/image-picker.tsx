
'use client'

import { useState, useEffect, useRef } from "react";
import useSWR from 'swr';
import Image from "next/image";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, postData } from "@/lib/api";

export const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
    const { data: userImages, error, mutate, isLoading } = useSWR<ImagePlaceholder[]>('/api/data?key=userImages', fetcher);
    const [currentSelection, setCurrentSelection] = useState(currentImageId);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        setCurrentSelection(currentImageId);
    }, [currentImageId]);

    const handleSelect = (id: string) => {
        setCurrentSelection(id);
        onSelect(id);
    }

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500KB limit
                toast({
                    variant: "destructive",
                    title: "Ukuran file terlalu besar",
                    description: "Ukuran gambar tidak boleh melebihi 500KB.",
                });
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUrl = e.target?.result as string;
                const newImageId = `user-img-${Date.now()}`;
                const newImage: ImagePlaceholder = { id: newImageId, imageUrl: dataUrl, description: file.name, imageHint: 'custom upload' };
                
                const updatedUserImages = [...(userImages || []), newImage];

                try {
                    await postData('userImages', updatedUserImages);
                    mutate(updatedUserImages, false); // Optimistic update
                    handleSelect(newImageId);
                    toast({ title: "Gambar Diunggah", description: "Gambar telah disimpan di server." });
                } catch (error) {
                     toast({
                        variant: "destructive",
                        title: "Gagal Mengunggah",
                        description: "Tidak dapat menyimpan gambar ke server.",
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const allImages = [...PlaceHolderImages, ...(userImages || [])];
    if(error) return <div className="text-destructive">Gagal memuat gambar.</div>

    return (
        <div className="space-y-2">
            <Label>Pilih Gambar</Label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {isLoading && Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
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
