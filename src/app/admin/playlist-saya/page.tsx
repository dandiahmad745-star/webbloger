
'use client';

import { useState, useEffect, useRef } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type Playlist, type Song } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Music, Download, UploadCloud, FileJson } from "lucide-react";
import { ImagePicker } from "@/components/image-picker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetcher, postData } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistForm = ({ playlist, onSubmit, onSelectImage, closeBtnId }: { playlist?: Playlist, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onSelectImage: (id: string) => void, closeBtnId: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="title">Judul Playlist</Label><Input id="title" name="title" defaultValue={playlist?.title} required /></div>
        <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" name="description" defaultValue={playlist?.description} required /></div>
        <ImagePicker currentImageId={playlist?.imageId} onSelect={onSelectImage} />
        <DialogFooter>
            <Button type="submit">Simpan Playlist</Button>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
            </DialogTrigger>
        </DialogFooter>
    </form>
);

const SongForm = ({ onSubmit, closeBtnId }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>, closeBtnId: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await onSubmit(e);
        setIsSubmitting(false);
        if (success) {
            document.getElementById(closeBtnId)?.click();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="song-title">Judul Lagu</Label><Input id="song-title" name="title" required /></div>
            <div className="space-y-2"><Label htmlFor="artist">Artis</Label><Input id="artist" name="artist" required /></div>
            <div className="space-y-2"><Label htmlFor="audio-file">File Audio (Maks 2MB)</Label><Input id="audio-file" name="audio-file" type="file" accept="audio/*" required /></div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Lagu'}</Button>
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
                </DialogTrigger>
            </DialogFooter>
        </form>
    );
};

export default function AdminPlaylistSayaPage() {
    const { toast } = useToast();
    const { data: playlistsData, error, mutate, isLoading } = useSWR<Playlist[]>('/api/data?key=playlistSayaData', fetcher);

    const [selectedImage, setSelectedImage] = useState('');
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);

    const saveData = async (data: Playlist[]) => {
        try {
            await postData('playlistSayaData', data);
            mutate(data, false);
            return true;
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
            return false;
        }
    };

    const handleSavePlaylist = async (e: React.FormEvent<HTMLFormElement>, playlistId?: string) => {
        e.preventDefault();
        if (!playlistsData) return;
        const formData = new FormData(e.currentTarget);
        
        let updatedPlaylists;
        if (playlistId) {
            updatedPlaylists = playlistsData.map(pl => pl.id === playlistId ? {
                ...pl,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                imageId: selectedImage || pl.imageId
            } : pl);
            toast({ title: "Sukses!", description: "Playlist telah diperbarui." });
        } else {
            const newPlaylist: Playlist = {
                id: `playlist-${Date.now()}`,
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                imageId: selectedImage,
                songs: []
            };
            if (playlistsData.some(p => p.title.toLowerCase() === newPlaylist.title.toLowerCase())) {
                toast({ variant: 'destructive', title: 'Gagal', description: 'Playlist dengan judul yang sama sudah ada.' });
                return;
            }
            updatedPlaylists = [...playlistsData, newPlaylist];
            toast({ title: "Sukses!", description: "Playlist baru telah ditambahkan." });
        }
        
        if (await saveData(updatedPlaylists)) {
            const closeBtnId = playlistId ? `close-playlist-${playlistId}-dialog` : 'close-playlist-new-dialog';
            document.getElementById(closeBtnId)?.click();
        }
    };

    const handleDeletePlaylist = async (playlistId: string) => {
        if (!playlistsData) return;
        const updatedPlaylists = playlistsData.filter(pl => pl.id !== playlistId);
        if (await saveData(updatedPlaylists)) {
            toast({ title: "Dihapus!", description: "Playlist telah dihapus." });
        }
    };

    const handleSaveSong = async (e: React.FormEvent<HTMLFormElement>, playlistId: string): Promise<boolean> => {
        if (!playlistsData) return false;
        const formData = new FormData(e.currentTarget);
        const audioFile = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];

        if (!audioFile) {
            toast({ variant: "destructive", title: "File Audio Dibutuhkan", description: "Silakan unggah file audio." });
            return false;
        }

        if (audioFile.size > 2 * 1024 * 1024) { // 2MB limit
            toast({ variant: "destructive", title: "Ukuran file terlalu besar", description: "Ukuran file audio tidak boleh melebihi 2MB." });
            return false;
        }
        
        const audioUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(audioFile);
        });
        
        const newSong: Song = {
            title: formData.get('title') as string,
            artist: formData.get('artist') as string,
            audioUrl: audioUrl
        };
        
        let success = false;
        const updatedPlaylists = playlistsData.map(pl => {
            if (pl.id === playlistId) {
                if (pl.songs.some(s => s.title.toLowerCase() === newSong.title.toLowerCase())) {
                    toast({ variant: 'destructive', title: 'Gagal', description: `Lagu "${newSong.title}" sudah ada di playlist ini.` });
                    success = false;
                    return pl;
                }
                success = true;
                return { ...pl, songs: [...pl.songs, newSong] };
            }
            return pl;
        });

        if (success && await saveData(updatedPlaylists)) {
            toast({ title: "Sukses!", description: `Lagu ${newSong.title} telah ditambahkan.` });
            return true;
        }
        
        if (!success) {
             toast({
                variant: "destructive",
                title: "Gagal Menyimpan",
                description: "Terjadi kesalahan saat validasi lagu.",
            });
        }
        return false;
    };
    
    const handleDeleteSong = async (playlistId: string, songTitle: string) => {
        if (!playlistsData) return;
        const updatedPlaylists = playlistsData.map(pl => {
            if (pl.id === playlistId) {
                return { ...pl, songs: pl.songs.filter(song => song.title !== songTitle) };
            }
            return pl;
        });
        if(await saveData(updatedPlaylists)) {
            toast({ title: "Dihapus!", description: `Lagu ${songTitle} telah dihapus.` });
        }
    };

    const handleExport = () => {
        if(!playlistsData) return;
        const dataStr = JSON.stringify(playlistsData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'playlist.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast({ title: "Ekspor Berhasil", description: "File playlist.json telah diunduh." });
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const processImportedData = async (importedData: any[]) => {
        if (!playlistsData) return false;
        if (Array.isArray(importedData) && importedData.every(item => 'id' in item && 'title' in item && 'songs' in item)) {
            const currentData = [...playlistsData];
            let newItemsCount = 0;
            let skippedCount = 0;

            importedData.forEach((newItem: Playlist) => {
                const isDuplicate = currentData.some(existingItem => existingItem.id === newItem.id || existingItem.title.toLowerCase() === newItem.title.toLowerCase());
                if (!isDuplicate) {
                    currentData.push(newItem);
                    newItemsCount++;
                } else {
                    skippedCount++;
                }
            });

            if (await saveData(currentData)) {
                 if (newItemsCount > 0) {
                    toast({ title: "Impor Berhasil", description: `${newItemsCount} playlist baru ditambahkan. ${skippedCount} duplikat dilewati.` });
                } else {
                    toast({ title: "Tidak Ada Playlist Baru", description: "Semua playlist dalam file sudah ada di koleksi Anda." });
                }
                return true;
            }
            return false;
        } else {
            throw new Error("Invalid JSON format.");
        }
    };

    const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedData = JSON.parse(text);
                    await processImportedData(importedData);
                } catch (error) {
                    toast({ variant: "destructive", title: "Impor Gagal", description: "File JSON tidak valid atau formatnya salah." });
                }
            };
            reader.readAsText(file);
        }
        if (event.target) event.target.value = '';
    };

    const handleImportFromJsonText = async () => {
        if (!jsonInput.trim()) {
            toast({ variant: "destructive", title: "Input Kosong", description: "Silakan tempel konten JSON." });
            return;
        }
        try {
            const importedData = JSON.parse(jsonInput);
            if (await processImportedData(importedData)) {
                setJsonInput('');
                setIsPasteImportOpen(false);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Impor Gagal", description: "Teks JSON tidak valid atau formatnya salah." });
        }
    };

    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;
    
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Kelola "Playlist Saya"</CardTitle>
                    <CardDescription>Ubah info umum playlist dan kelola daftar lagu.</CardDescription>
                </div>
                 <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog onOpenChange={(open) => !open && setSelectedImage('')}>
                        <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Playlist</Button></DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                            <DialogHeader><DialogTitle>Tambah Playlist Baru</DialogTitle></DialogHeader>
                            <div className="overflow-y-auto -mr-6 pr-6">
                                <PlaylistForm onSubmit={(e) => handleSavePlaylist(e)} onSelectImage={setSelectedImage} closeBtnId="close-playlist-new-dialog" />
                            </div>
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon"><UploadCloud className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={handleImportClick}>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Impor dari File...
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => setIsPasteImportOpen(true)}>
                                <FileJson className="mr-2 h-4 w-4" />
                                Impor dari Teks...
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={handleExport} disabled={!playlistsData}>
                                <Download className="mr-2 h-4 w-4" />
                                Ekspor ke JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImportFromFile} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && <Skeleton className="w-full h-48" />}
                {playlistsData && (
                <Accordion type="single" collapsible className="w-full">
                    {playlistsData.map(playlist => (
                        <AccordionItem value={playlist.id} key={playlist.id} className="bg-muted/50 rounded-lg px-4 mb-2 border-b-0">
                            <div className="flex items-center justify-between w-full hover:no-underline py-3">
                                <AccordionTrigger>
                                    <p className="font-medium text-lg pr-4">{playlist.title}</p>
                                </AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Dialog onOpenChange={(open) => { if (!open) setSelectedImage(''); else setSelectedImage(playlist.imageId)}}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}><Edit className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                                            <DialogHeader><DialogTitle>Edit {playlist.title}</DialogTitle></DialogHeader>
                                            <div className="overflow-y-auto -mr-6 pr-6">
                                                <PlaylistForm playlist={playlist} onSubmit={(e) => handleSavePlaylist(e, playlist.id)} onSelectImage={setSelectedImage} closeBtnId={`close-playlist-${playlist.id}-dialog`} />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" size="icon" onClick={(e) => {e.stopPropagation(); handleDeletePlaylist(playlist.id)}}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <AccordionContent className="pt-2">
                                <div className="border-t border-primary/10 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-semibold">Daftar Lagu ({playlist.songs.length})</h4>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Tambah Lagu</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg">
                                                <DialogHeader><DialogTitle>Tambah Lagu ke {playlist.title}</DialogTitle></DialogHeader>
                                                <SongForm onSubmit={(e) => handleSaveSong(e, playlist.id)} closeBtnId={`close-song-new-${playlist.id}-dialog`} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                        {playlist.songs.length > 0 ? playlist.songs.map(song => (
                                            <div key={song.title} className="flex items-center justify-between p-2 bg-background rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <Music className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium">{song.title}</p>
                                                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                                                    </div>
                                                </div>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteSong(playlist.id, song.title)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        )) : <p className="text-sm text-center text-muted-foreground py-4">Belum ada lagu di playlist ini.</p>}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                )}
                 {playlistsData && playlistsData.length === 0 && !isLoading && (
                    <p className="text-center text-muted-foreground py-8">Belum ada playlist.</p>
                )}
            </CardContent>
             <Dialog open={isPasteImportOpen} onOpenChange={setIsPasteImportOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Impor Playlist dari Teks</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="json-paste-area">Tempel konten JSON di sini:</Label>
                        <Textarea id="json-paste-area" className="mt-2 font-mono h-64" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
                    </div>
                    <DialogFooter><Button onClick={handleImportFromJsonText}>Impor Sekarang</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
