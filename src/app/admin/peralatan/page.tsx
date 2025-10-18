
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";

export default function AdminPeralatanPage() {
    const { toast } = useToast();
    const [utensilsData, setUtensilsData] = useState(initialStaticData.utensils);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedUtensils = localStorage.getItem('utensilsData');
            if (savedUtensils) setUtensilsData(JSON.parse(savedUtensils));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSaveUtensils = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            ...utensilsData,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        setUtensilsData(updatedData);
        localStorage.setItem('utensilsData', JSON.stringify(updatedData));
        toast({ title: "Sukses!", description: "Data 'Coffee Utensils' telah diperbarui." });
    };

    if (!isClient) {
        return null;
    }

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Kelola Peralatan</CardTitle>
                <CardDescription>Untuk halaman "Coffee Utensils". Pengeditan item individu akan segera hadir.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveUtensils} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="utensils-title">Judul</Label><Input id="utensils-title" name="title" defaultValue={utensilsData.title} /></div>
                    <div className="space-y-2"><Label htmlFor="utensils-description">Deskripsi</Label><Input id="utensils-description" name="description" defaultValue={utensilsData.description} /></div>
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
