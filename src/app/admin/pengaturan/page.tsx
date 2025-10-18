
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { themes, type Theme } from "@/lib/themes";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paintbrush, Upload } from "lucide-react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
            <Label>Pilih Gambar Profil</Label>
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
    const [settingsData, setSettingsData] = useState(initialStaticData.mainPage);
    const [isClient, setIsClient] = useState(false);
    const [activeTheme, setActiveTheme] = useState('Kopi Gayo');
    const [selectedImage, setSelectedImage] = useState(settingsData.profileImageId || 'profile-picture');


    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('mainPageData');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                if (!parsed.secretMessage) {
                    parsed.secretMessage = initialStaticData.mainPage.secretMessage;
                }
                if (!parsed.chatWelcome) {
                    parsed.chatWelcome = initialStaticData.mainPage.chatWelcome;
                }
                setSettingsData(parsed);
                setSelectedImage(parsed.profileImageId || 'profile-picture');
            }
            const savedTheme = localStorage.getItem('activeTheme');
            if (savedTheme) {
                handleThemeChange(savedTheme, false);
            } else {
                 handleThemeChange('Kopi Gayo', false);
            }

        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

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
        localStorage.setItem('activeTheme', themeName);
        if (showToast) {
            toast({ title: "Tema Diubah!", description: `Tema ${themeName} telah diterapkan.` });
        }
    }


    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            tagline: formData.get('tagline') as string,
            bio: formData.get('bio') as string,
            contactEmail: formData.get('contactEmail') as string,
            chatWelcome: formData.get('chatWelcome') as string,
            secretMessage: {
                title: formData.get('secretTitle') as string,
                content: formData.get('secretContent') as string,
            },
            profileImageId: selectedImage
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
                <CardDescription>Kelola konten untuk halaman utama, kontak, dan tema visual.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <h3 className="text-lg font-medium text-primary border-b pb-2">Tampilan & Tema</h3>
                    <ThemeSwitcher currentTheme={activeTheme} onThemeChange={(themeName) => handleThemeChange(themeName)} />
                    
                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Halaman Utama</h3>
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
                     <ImagePicker currentImageId={selectedImage} onSelect={setSelectedImage} />

                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Halaman Kontak & Ngobrol</h3>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Kontak (untuk tombol "Hubungi Saya")</Label>
                        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settingsData.contactEmail} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="chatWelcome">Pesan Selamat Datang (untuk halaman "Ngobrol")</Label>
                        <Input id="chatWelcome" name="chatWelcome" defaultValue={settingsData.chatWelcome} />
                    </div>

                    <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Pesan Tersembunyi (Halaman Utama)</h3>
                     <div className="space-y-2">
                        <Label htmlFor="secretTitle">Judul Pesan Tersembunyi</Label>
                        <Input id="secretTitle" name="secretTitle" defaultValue={settingsData.secretMessage.title} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="secretContent">Isi Pesan Tersembunyi</Label>
                        <Textarea id="secretContent" name="secretContent" defaultValue={settingsData.secretMessage.content} rows={3} />
                    </div>


                    <div className="flex justify-end pt-4">
                        <Button type="submit">Simpan Perubahan</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
