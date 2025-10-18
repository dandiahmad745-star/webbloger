

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { defaultData, type Playlist } from "../data-statis";
import { cn } from '@/lib/utils';
import { fetchServerData } from "@/lib/api";
import { PlaylistPlayer } from "./playlist-player";

async function getPlaylists() {
    const playlists = await fetchServerData('playlistSayaData', defaultData.playlistSayaData);
    const userImages = await fetchServerData('userImages', []);
    const allImages = [...PlaceHolderImages, ...userImages];

    return playlists.map((playlist: Playlist) => ({
        ...playlist,
        image: allImages.find(p => p.id === playlist.imageId)
    }));
}

export default async function PlaylistSayaPage() {
    const playlistsWithImages = await getPlaylists();
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in relative overflow-hidden">
            <PlaylistPlayer playlists={playlistsWithImages} />
            <Link href="/" passHref>
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/10">
                    <ArrowLeft />
                </Button>
            </Link>
        </main>
    );
}
