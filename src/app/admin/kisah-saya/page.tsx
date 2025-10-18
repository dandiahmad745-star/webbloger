
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";

export default function AdminKisahSayaPage() {
    const { toast } = useToast();
    const [kisahSayaData, setKisahSayaData] = useState(initialStaticData.kisahSaya);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedKisahSaya = localStorage.getItem('kisahSayaData');
            if (savedKisahSaya) setKisahSayaData(JSON.parse(savedKisahSaya));
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
            imageId: kisahSayaData.imageId, // imageId is not editable for now
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
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
