
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Music, SkipForward, SkipBack } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { staticData as initialStaticData, type Playlist, type Song } from "../data-statis";
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

export default function PlaylistSayaPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>(initialStaticData.playlistSaya);
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
    
    const [api, setApi] = useState<CarouselApi>()
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>();
    const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Load data from localStorage
    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = localStorage.getItem('playlistSayaData');
            const savedUserImages = localStorage.getItem('userImages');
            
            const currentAllImages = [...PlaceHolderImages];
            if (savedUserImages) {
                currentAllImages.push(...JSON.parse(savedUserImages));
            }
            setAllImages(currentAllImages);

            if (savedData) {
                const parsedPlaylists = JSON.parse(savedData);
                setPlaylists(parsedPlaylists);
                if (parsedPlaylists.length > 0) {
                    setCurrentPlaylist(parsedPlaylists[0]);
                }
            } else if (initialStaticData.playlistSaya.length > 0) {
                 setCurrentPlaylist(initialStaticData.playlistSaya[0]);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    // Carousel API effect
    useEffect(() => {
        if (!api) return;
        
        const handleSelect = (api: CarouselApi) => {
            const selectedPlaylist = playlists[api.selectedScrollSnap()];
            setCurrentPlaylist(selectedPlaylist);
            setIsPlaying(false);
            setCurrentSongIndex(null);
            if(audioRef.current) audioRef.current.src = "";
        };

        api.on("select", handleSelect);
        return () => { api.off("select", handleSelect) };
    }, [api, playlists]);

    // Audio player effect
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && currentSongIndex !== null && currentPlaylist) {
                const song = currentPlaylist.songs[currentSongIndex];
                if (audioRef.current.src !== song.audioUrl) {
                    audioRef.current.src = song.audioUrl;
                }
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex, currentPlaylist]);

    const handlePlayPause = (index: number) => {
        if (currentSongIndex === index) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSongIndex(index);
            setIsPlaying(true);
        }
    };

    const handleNextSong = () => {
        if (currentPlaylist && currentSongIndex !== null) {
            const nextIndex = (currentSongIndex + 1) % currentPlaylist.songs.length;
            setCurrentSongIndex(nextIndex);
            setIsPlaying(true);
        } else if (currentPlaylist && currentPlaylist.songs.length > 0) {
            setCurrentSongIndex(0);
            setIsPlaying(true);
        }
    };
    
    const handlePrevSong = () => {
        if (currentPlaylist && currentSongIndex !== null) {
            const prevIndex = (currentSongIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
            setCurrentSongIndex(prevIndex);
            setIsPlaying(true);
        }
    };

    const currentSong = currentPlaylist && currentSongIndex !== null ? currentPlaylist.songs[currentSongIndex] : null;
    const backgroundImage: ImagePlaceholder | undefined = allImages.find(p => p.id === currentPlaylist?.imageId);

    if (!isClient) {
        return <div className='min-h-screen bg-background'/>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in relative overflow-hidden">
             {backgroundImage && (
                <Image
                    src={backgroundImage.imageUrl}
                    alt={backgroundImage.description}
                    data-ai-hint={backgroundImage.imageHint}
                    fill
                    className={cn(
                        "object-cover -z-10 transition-all duration-1000 ease-in-out",
                        isPlaying ? 'scale-110 blur-sm' : 'scale-100 blur-none'
                    )}
                />
            )}
            <div className="absolute inset-0 bg-black/50 -z-10" />
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/10">
                    <ArrowLeft />
                </Button>
            </Link>

            <div className="w-full max-w-md mx-auto">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {playlists.map((playlist) => (
                            <CarouselItem key={playlist.id}>
                                <Card className="bg-transparent border-none shadow-none text-white">
                                    <CardHeader className="text-center">
                                        <CardTitle className="font-headline text-4xl">{playlist.title}</CardTitle>
                                        <CardDescription className="font-body text-base text-white/80 pt-2">{playlist.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
                                        {playlist.songs.length > 0 ? playlist.songs.map((song, index) => (
                                            <div 
                                                key={song.title} 
                                                className={cn(
                                                    "flex items-center p-3 rounded-lg justify-between transition-colors cursor-pointer",
                                                    currentSong?.title === song.title ? "bg-accent/30" : "bg-black/20 hover:bg-black/40"
                                                )}
                                                onClick={() => handlePlayPause(index)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Music className="h-5 w-5 text-accent" />
                                                    <div>
                                                        <p className="font-bold">{song.title}</p>
                                                        <p className="text-sm text-white/70">{song.artist}</p>
                                                    </div>
                                                </div>
                                                {currentSong?.title === song.title && isPlaying && <Pause className="h-5 w-5" />}
                                                {currentSong?.title === song.title && !isPlaying && <Play className="h-5 w-5" />}
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-white/70">
                                                <p>Belum ada lagu di playlist ini.</p>
                                                <p className='text-sm mt-2'>Kelola playlist di Halaman Admin.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {playlists.length > 1 && (
                        <>
                           <CarouselPrevious className="left-2 text-white bg-white/10 border-white/20 hover:bg-white/20" />
                           <CarouselNext className="right-2 text-white bg-white/10 border-white/20 hover:bg-white/20" />
                        </>
                    )}
                </Carousel>
                {currentPlaylist && currentPlaylist.songs.length > 0 && (
                    <div className='text-center mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg text-white'>
                         <p className="font-bold text-lg truncate">{currentSong?.title || "Pilih sebuah lagu"}</p>
                         <p className="text-sm text-white/70">{currentSong?.artist || ""}</p>
                        <div className="flex justify-center items-center gap-4 mt-4">
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={handlePrevSong} disabled={!currentSong}>
                                <SkipBack />
                            </Button>
                             <Button size="icon" className="h-14 w-14 bg-white/20 text-white hover:bg-white/30" onClick={() => currentSongIndex !== null && handlePlayPause(currentSongIndex)} disabled={!currentPlaylist.songs.length}>
                                {isPlaying ? <Pause size={28}/> : <Play size={28}/>}
                            </Button>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={handleNextSong} disabled={!currentSong}>
                                <SkipForward />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <audio ref={audioRef} onEnded={handleNextSong} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </main>
    );
}
