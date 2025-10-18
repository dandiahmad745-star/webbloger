
'use client';

import { useState, useEffect } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { themes } from "@/lib/themes";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush } from "lucide-react";
import { ImagePicker } from "@/components/image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, postData } from '@/lib/api';
import { type MainPageData } from '@/app/data-statis';

const ThemeSwitcher = ({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (themeName: string) => void }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="theme-switcher" className="flex items-center gap-2"><Paintbrush className="w-4 h-4"/> Tema Warna</Label>
      <Select onValueChange={onThemeChange} value={currentTheme}>
        <SelectTrigger id="theme-switcher">
          <SelectValue placeholder="Pilih sebuah tema..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {themes.map(theme => (
              <SelectItem key={theme.name} value={theme.name}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${theme.light.primary})` }} />
                  {theme.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};


export default function AdminPengaturanPage() {
    const { toast } = useToast();
    const { data: settingsData, error, mutate, isLoading } = useSWR<MainPageData>('/api/data?key=mainPageData', fetcher);
    
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [bio, setBio] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [chatWelcome, setChatWelcome] = useState('');
    const [secretTitle, setSecretTitle] = useState('');
    const [secretContent, setSecretContent] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [activeTheme, setActiveTheme] = useState('Kopi Gayo');

    useEffect(() => {
        if(settingsData) {
            setName(settingsData.name);
            setTagline(settingsData.tagline);
            setBio(settingsData.bio);
            setContactEmail(settingsData.contactEmail);
            setChatWelcome(settingsData.chatWelcome);
            setSecretTitle(settingsData.secretMessage.title);
            setSecretContent(settingsData.secretMessage.content);
            setSelectedImage(settingsData.profileImageId);
        }
    }, [settingsData]);

    useEffect(() => {
      const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('activeTheme') : null;
      if (savedTheme) {
          handleThemeChange(savedTheme, false);
      } else {
            handleThemeChange('Kopi Gayo', false);
      }
    }, [])

    const handleThemeChange = (themeName: string, showToast = true) => {
        const theme = themes.find(t => t.name === themeName);
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme.light).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });
        Object.entries(theme.dark).forEach(([key, value]) => {
            root.style.setProperty(`--${key}-dark`, value);
        });
        
        const darkTheme = document.querySelector('.dark');
        if (darkTheme) {
             Object.entries(theme.dark).forEach(([key, value]) => {
                (darkTheme as HTMLElement).style.setProperty(`--${key}`, value);
            });
        }

        setActiveTheme(themeName);
        localStorage.setItem('activeTheme', themeName); // Save theme client-side
        if (showToast) {
            toast({ title: "Tema Diubah!", description: `Tema ${themeName} telah diterapkan.` });
        }
    }


    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedData: MainPageData = {
            name,
            tagline,
            bio,
            contactEmail,
            chatWelcome,
            secretMessage: {
                title: secretTitle,
                content: secretContent,
            },
            profileImageId: selectedImage
        };
        
        try {
            await postData('mainPageData', updatedData);
            mutate(updatedData, false);
            toast({ title: "Sukses!", description: "Pengaturan umum telah diperbarui." });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
    };

    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;
    if (isLoading) return <Skeleton className="w-full h-96" />;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Pengaturan Umum</CardTitle>
                <CardDescription>Kelola konten untuk halaman utama, kontak, dan tema visual.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <h3 className="text-lg font-medium text-primary border-b pb-2">Tampilan & Tema</h3>
                    <ThemeSwitcher currentTheme={activeTheme} onThemeChange={(themeName) => handleThemeChange(themeName)} />
                    
                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Halaman Utama</h3>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" name="tagline" value={tagline} onChange={e => setTagline(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio Singkat</Label>
                        <Textarea id="bio" name="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
                    </div>
                     <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />

                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Halaman Kontak & Ngobrol</h3>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Kontak (untuk tombol "Hubungi Saya")</Label>
                        <Input id="contactEmail" name="contactEmail" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="chatWelcome">Pesan Selamat Datang (untuk halaman "Ngobrol")</Label>
                        <Input id="chatWelcome" name="chatWelcome" value={chatWelcome} onChange={e => setChatWelcome(e.target.value)} />
                    </div>

                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Pesan Tersembunyi (Halaman Utama)</h3>
                     <div className="space-y-2">
                        <Label htmlFor="secretTitle">Judul Pesan Tersembunyi</Label>
                        <Input id="secretTitle" name="secretTitle" value={secretTitle} onChange={e => setSecretTitle(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="secretContent">Isi Pesan Tersembunyi</Label>
                        <Textarea id="secretContent" name="secretContent" value={secretContent} onChange={e => setSecretContent(e.target.value)} rows={3} />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
