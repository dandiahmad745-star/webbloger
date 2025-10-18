
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Music, Plus, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Song = {
    title: string;
    artist: string;
    audioUrl: string;
};

export default function AdminPlaylistSayaPage() {
    const { toast } = useToast();
    const [playlistData, setPlaylistData] = useState(initialStaticData.playlistSaya);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState(playlistData.imageId);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = localStorage.getItem('playlistSayaData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setPlaylistData(parsedData);
                setSelectedImage(parsedData.imageId);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSaveInfo = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            ...playlistData,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            imageId: selectedImage,
        };
        setPlaylistData(updatedData);
        localStorage.setItem('playlistSayaData', JSON.stringify(updatedData));
        toast({ title: "Sukses!", description: "Informasi Playlist telah diperbarui." });
    };

    const handleSaveSong = (e: React.FormEvent<HTMLFormElement>, originalTitle?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const audioFile = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];

        const saveSongData = (audioUrl: string) => {
            const newSong: Song = {
                title: formData.get('title') as string,
                artist: formData.get('artist') as string,
                audioUrl: audioUrl
            };
    
            let updatedSongs;
            if(originalTitle) {
                updatedSongs = playlistData.songs.map(song => song.title === originalTitle ? newSong : song);
            } else {
                updatedSongs = [...playlistData.songs, newSong];
            }
            
            const updatedData = {...playlistData, songs: updatedSongs};
            setPlaylistData(updatedData);
            localStorage.setItem('playlistSayaData', JSON.stringify(updatedData));
            toast({ title: "Sukses!", description: `Lagu ${newSong.title} telah disimpan.` });
            
            const closeBtnId = originalTitle ? `close-song-${originalTitle.replace(/\s+/g, '-')}-dialog` : 'close-song-new-dialog';
            const closeBtn = document.getElementById(closeBtnId);
            if(closeBtn) closeBtn.click();
        };

        if (audioFile) {
             if (audioFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast({ variant: "destructive", title: "Ukuran file terlalu besar", description: "Ukuran file audio tidak boleh melebihi 5MB." });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                saveSongData(event.target?.result as string);
            };
            reader.readAsDataURL(audioFile);
        } else {
            // If no new file is uploaded, keep the old audioUrl
            const existingSong = playlistData.songs.find(s => s.title === originalTitle);
            if(existingSong) {
                saveSongData(existingSong.audioUrl);
            } else {
                 toast({ variant: "destructive", title: "File Audio Dibutuhkan", description: "Silakan unggah file audio." });
            }
        }
    };
    
    const handleDeleteSong = (title: string) => {
        const updatedSongs = playlistData.songs.filter(song => song.title !== title);
        const updatedData = { ...playlistData, songs: updatedSongs };
        setPlaylistData(updatedData);
        localStorage.setItem('playlistSayaData', JSON.stringify(updatedData));
        toast({ title: "Dihapus!", description: `Lagu ${title} telah dihapus.` });
    }

    if (!isClient) {
        return null;
    }
    
    const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
        const [currentSelection, setCurrentSelection] = useState(currentImageId);
        const [userImages, setUserImages] = useState<ImagePlaceholder[]>([]);
        const fileInputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (typeof window === 'undefined') return;
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
        }, []);

        const handleSelect = (id: string) => {
            setCurrentSelection(id);
            onSelect(id);
        }
        
        const handleUploadClick = () => {
            fileInputRef.current?.click();
        };

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    const newImageId = `user-img-${Date.now()}`;
                    const newImage: ImagePlaceholder = {
                        id: newImageId,
                        imageUrl: dataUrl,
                        description: file.name,
                        imageHint: 'custom upload'
                    };
                    
                    const existingImagesRaw = localStorage.getItem('userImages');
                    const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
                    const updatedUserImages = [...existingImages, newImage];

                    setUserImages(updatedUserImages);
                    localStorage.setItem('userImages', JSON.stringify(updatedUserImages));
                    handleSelect(newImageId);
                    
                    toast({ title: "Gambar Diunggah", description: "Gambar telah disimpan secara lokal." });

                    window.dispatchEvent(new Event('storage'));
                };
                reader.readAsDataURL(file);
            }
        };

        const allImages = [...PlaceHolderImages, ...userImages];

        return (
            <div className="space-y-2">
                <Label>Pilih Gambar Latar</Label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {allImages.map(img => (
                        <div key={img.id} className={cn("relative aspect-square rounded-md overflow-hidden cursor-pointer border-2", currentSelection === img.id ? 'border-primary' : 'border-transparent')} onClick={() => handleSelect(img.id)}>
                            <Image src={img.imageUrl} alt={img.description} fill className="object-cover" />
                        </div>
                    ))}
                </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                 <Button type="button" variant="outline" className="w-full" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Unggah Foto
                </Button>
            </div>
        )
    }

    const SongForm = ({ onSubmit, closeBtnId }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, closeBtnId: string }) => (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="song-title">Judul Lagu</Label><Input id="song-title" name="title" required /></div>
            <div className="space-y-2"><Label htmlFor="artist">Artis</Label><Input id="artist" name="artist" required /></div>
            <div className="space-y-2"><Label htmlFor="audio-file">File Audio (Maks 5MB)</Label><Input id="audio-file" name="audio-file" type="file" accept="audio/*" required /></div>
            <DialogFooter>
                <Button type="submit">Simpan Lagu</Button>
                 <DialogTrigger asChild>
                    <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
                </DialogTrigger>
            </DialogFooter>
        </form>
    );

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Kelola "Playlist Saya"</CardTitle>
                <CardDescription>Ubah info umum playlist dan kelola daftar lagu.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSaveInfo} className="space-y-4 p-6 border rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-primary">Informasi Umum</h3>
                    <div className="space-y-2"><Label htmlFor="title">Judul Halaman</Label><Input id="title" name="title" defaultValue={playlistData.title} /></div>
                    <div className="space-y-2"><Label htmlFor="description">Deskripsi Halaman</Label><Textarea id="description" name="description" defaultValue={playlistData.description} /></div>
                    <ImagePicker currentImageId={playlistData.imageId} onSelect={setSelectedImage} />
                    <div className="flex justify-end">
                        <Button type="submit">Simpan Info Umum</Button>
                    </div>
                </form>

                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-medium text-primary">Daftar Lagu</h3>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button><Plus className="h-4 w-4 mr-2" />Tambah Lagu</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                            <DialogHeader><DialogTitle>Tambah Lagu Baru</DialogTitle></DialogHeader>
                             <div className="overflow-y-auto -mr-6 pr-6">
                                <SongForm onSubmit={(e) => handleSaveSong(e)} closeBtnId="close-song-new-dialog" />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                 <div className="space-y-4">
                    {playlistData.songs.map(song => (
                         <div key={song.title} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Music className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">{song.title}</p>
                                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteSong(song.title)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
