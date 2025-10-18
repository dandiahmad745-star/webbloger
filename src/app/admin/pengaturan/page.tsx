
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function AdminPengaturanPage() {
    const { toast } = useToast();
    const [settingsData, setSettingsData] = useState(initialStaticData.mainPage);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('mainPageData');
            if (savedSettings) {
                setSettingsData(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            tagline: formData.get('tagline') as string,
            bio: formData.get('bio') as string,
            contactEmail: formData.get('contactEmail') as string,
            chatWelcome: formData.get('chatWelcome') as string,
        };
        setSettingsData(updatedData);
        localStorage.setItem('mainPageData', JSON.stringify(updatedData));
        toast({ title: "Sukses!", description: "Pengaturan umum telah diperbarui." });
    };

    if (!isClient) {
        return null;
    }

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola konten untuk halaman utama dan kontak.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <h3 className="text-lg font-medium text-primary border-b pb-2">Halaman Utama</h3>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" name="name" defaultValue={settingsData.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" name="tagline" defaultValue={settingsData.tagline} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio Singkat</Label>
                        <Textarea id="bio" name="bio" defaultValue={settingsData.bio} rows={3} />
                    </div>
                    
                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Halaman Kontak & Ngobrol</h3>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Kontak (untuk tombol "Hubungi Saya")</Label>
                        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settingsData.contactEmail} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="chatWelcome">Pesan Selamat Datang (untuk halaman "Ngobrol")</Label>
                        <Input id="chatWelcome" name="chatWelcome" defaultValue={settingsData.chatWelcome} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
