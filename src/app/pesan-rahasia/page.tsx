
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { pesanHarian } from '@/lib/pesan-harian';
import { fetchServerData } from "@/lib/api";

export default async function PesanRahasiaPage() {
    // Select daily message based on the date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const messageIndex = dayOfYear % pesanHarian.length;
    const dailyMessage = pesanHarian[messageIndex];
    const pageData = { title: "Pesan Hari Ini", message: dailyMessage };

    const userImages = await fetchServerData('userImages', []);
    const allImages = [...PlaceHolderImages, ...userImages];
    
    // Select image randomly based on the date as well, to keep image & message consistent for the day
    const imageIndex = dayOfYear % allImages.length;
    const backgroundImage = allImages[imageIndex];

    const { title, message } = pageData;
    
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
