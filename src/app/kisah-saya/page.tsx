
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { staticData as initialStaticData } from "../data-statis";

export default function KisahSayaPage() {
    const [pageData, setPageData] = useState(initialStaticData.kisahSaya);
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = localStorage.getItem('kisahSayaData');
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

    const { title, description, imageId, paragraphs } = pageData;
    const myStoryImage: ImagePlaceholder | undefined = allImages.find(p => p.id === imageId);
    
    if (!isClient) {
        return null; // Or a loading spinner
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 md:p-8 relative h-64">
                         {myStoryImage && (
                            <Image
                                src={myStoryImage.imageUrl}
                                alt={myStoryImage.description}
                                data-ai-hint={myStoryImage.imageHint}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        <div className="relative z-10 flex flex-col justify-end h-full">
                             <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                            <CardTitle className="font-headline text-4xl md:text-5xl text-white text-left">
                                {title}
                            </CardTitle>
                            <CardDescription className="font-body text-base md:text-lg text-white/80 text-left pt-2">
                                {description}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 text-lg font-body text-foreground/90 space-y-6">
                        {paragraphs.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
