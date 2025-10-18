
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Music } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { staticData as initialStaticData } from "../data-statis";
import { cn } from '@/lib/utils';

type Song = {
    title: string;
    artist: string;
    audioUrl: string;
};

export default function PlaylistSayaPage() {
    const [pageData, setPageData] = useState(initialStaticData.playlistSaya);
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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
                setPageData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    const handlePlayPause = (song: Song) => {
        if (currentSong?.title === song.title) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            if(audioRef.current) {
                audioRef.current.src = song.audioUrl;
            }
        }
    };
    
    const { title, description, imageId, songs } = pageData;
    const backgroundImage: ImagePlaceholder | undefined = allImages.find(p => p.id === imageId);

    if (!isClient) {
        return null;
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

            <div className="w-full max-w-md mx-auto">
                <Card className="bg-card/30 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden">
                    <CardHeader className="p-6">
                        <div className="flex items-start justify-between">
                             <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                             <div className="text-center flex-grow">
                                <CardTitle className="font-headline text-4xl text-white">
                                    {title}
                                </CardTitle>
                                <CardDescription className="font-body text-base text-white/80 pt-2">
                                    {description}
                                </CardDescription>
                            </div>
                            <div className="w-10"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        {songs.length > 0 ? songs.map((song) => (
                            <div key={song.title} className="flex items-center p-3 bg-black/20 rounded-lg justify-between hover:bg-black/40 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Music className="h-5 w-5 text-accent" />
                                    <div>
                                        <p className="font-bold text-white">{song.title}</p>
                                        <p className="text-sm text-white/70">{song.artist}</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => handlePlayPause(song)}>
                                    {currentSong?.title === song.title && isPlaying ? <Pause /> : <Play />}
                                </Button>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-white/70">
                                <p>Belum ada lagu ditambahkan.</p>
                                <p className='text-sm mt-2'>Kelola playlist di Halaman Admin.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {<audio ref={audioRef} onEnded={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}/>}
        </main>
    );
}
