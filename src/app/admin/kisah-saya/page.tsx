
'use client';

import { useState, useEffect } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, postData } from '@/lib/api';
import { ImagePicker } from "@/components/image-picker";
import { type KisahSayaData } from '@/app/data-statis';

export default function AdminKisahSayaPage() {
    const { toast } = useToast();
    const { data: kisahSayaData, error, mutate, isLoading } = useSWR<KisahSayaData>('/api/data?key=kisahSayaData', fetcher);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [paragraphs, setParagraphs] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (kisahSayaData) {
            setTitle(kisahSayaData.title);
            setDescription(kisahSayaData.description);
            setParagraphs(kisahSayaData.paragraphs.join('\n'));
            setSelectedImage(kisahSayaData.imageId);
        }
    }, [kisahSayaData]);

    const handleSaveKisahSaya = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const updatedData: KisahSayaData = {
            title,
            description,
            imageId: selectedImage,
            paragraphs: paragraphs.split('\n'),
        };
        
        try {
            await postData('kisahSayaData', updatedData);
            mutate(updatedData, false);
            toast({ title: "Sukses!", description: "Data 'Kisah Saya' telah diperbarui." });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
    };

    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;
    if (isLoading) return <Skeleton className="w-full h-96" />;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Kelola "Kisah Saya"</CardTitle>
                <CardDescription>Untuk halaman "Kisah Saya".</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveKisahSaya} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="title">Judul</Label><Input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Input id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="paragraphs">Paragraf (pisahkan dengan baris baru)</Label><Textarea id="paragraphs" name="paragraphs" value={paragraphs} onChange={e => setParagraphs(e.target.value)} rows={5} /></div>
                    <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
