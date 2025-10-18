
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { pesanHarian } from '@/lib/pesan-harian';

export default function PesanRahasiaPage() {
    const [pageData, setPageData] = useState({ title: "Pesan Hari Ini", message: "" });
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
    const [backgroundImage, setBackgroundImage] = useState<ImagePlaceholder | undefined>();

    useEffect(() => {
        setIsClient(true);
        
        // Pilih pesan harian berdasarkan tanggal
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const messageIndex = dayOfYear % pesanHarian.length;
        const dailyMessage = pesanHarian[messageIndex];

        // Ambil data gambar dari local storage jika ada
        let currentAllImages = [...PlaceHolderImages];
        try {
            const savedUserImages = localStorage.getItem('userImages');
            if (savedUserImages) {
                currentAllImages.push(...JSON.parse(savedUserImages));
            }
        } catch (error) {
            console.error("Failed to parse user images from localStorage", error);
        }
        setAllImages(currentAllImages);

        // Pilih gambar secara acak berdasarkan tanggal juga, agar gambar & pesan konsisten seharian
        const imageIndex = dayOfYear % currentAllImages.length;
        const dailyImage = currentAllImages[imageIndex];
        
        setBackgroundImage(dailyImage);
        setPageData(prev => ({ ...prev, message: dailyMessage }));

    }, []);

    const { title, message } = pageData;
    
    if (!isClient) {
        return <div className="min-h-screen bg-background" />; // Or a loading spinner
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-2xl mx-auto relative">
                 <Link href="/" passHref>
                    <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/20">
                        <ArrowLeft />
                    </Button>
                </Link>
                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
                    <CardHeader className="p-0 relative h-72">
                         {backgroundImage && (
                            <Image
                                src={backgroundImage.imageUrl}
                                alt={backgroundImage.description}
                                data-ai-hint={backgroundImage.imageHint}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 text-center -mt-24 relative z-10">
                        <CardTitle className="font-headline text-4xl md:text-5xl text-white text-shadow-lg shadow-black/50">
                           {title}
                        </CardTitle>
                        <CardDescription className="font-body text-lg md:text-xl text-white/90 text-shadow shadow-black/50 mt-4 max-w-md mx-auto">
                           "{message}"
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
