
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Globe, Star } from "lucide-react";
import Link from "next/link";
import { defaultData } from "../data-statis";
import { type CoffeeBean } from "./coffee-data";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { fetchServerData } from "@/lib/api";

export default async function LearnCoffeePage() {
    const beans = await fetchServerData('coffeeBeansData', defaultData.coffeeBeansData);
    const userImages = await fetchServerData('userImages', []);
    const allImages = [...PlaceHolderImages, ...userImages];
    const coffeeJourneyImage: ImagePlaceholder | undefined = allImages.find(p => p.id === 'coffee-journey-alt');

    return (
        <main className="min-h-screen w-full bg-background text-foreground fade-in">
            <div className="relative h-80 w-full">
                 {coffeeJourneyImage && (
                    <Image
                        src={coffeeJourneyImage.imageUrl}
                        alt={coffeeJourneyImage.description}
                        data-ai-hint={coffeeJourneyImage.imageHint}
                        fill
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/" passHref>
                        <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="font-headline text-4xl md:text-6xl text-white">Jelajahi Dunia Kopi</h1>
                        <p className="font-body text-base md:text-lg text-white/80 mt-2 max-w-2xl">
                            Temukan cerita dan karakteristik unik di balik setiap biji kopi dari berbagai penjuru dunia.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 -mt-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {beans.map((bean: CoffeeBean) => {
                         const beanImage = allImages.find(p => p.id === bean.imageId);
                        return(
                        <Card key={bean.id} className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/10 transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col">
                           {beanImage && (
                             <CardHeader className="p-0 relative h-48">
                                <Image
                                    src={beanImage.imageUrl}
                                    alt={bean.name}
                                    data-ai-hint={beanImage.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </CardHeader>
                           )}
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <Badge variant="secondary" className="w-fit mb-2">{bean.type}</Badge>
                                <CardTitle className="font-headline text-2xl text-primary mb-2">{bean.name}</CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                    <Globe className="w-4 h-4 mr-2" />
                                    <span>{bean.origin}</span>
                                </div>
                                <CardDescription className="font-body text-foreground/80 flex-grow">{bean.description}</CardDescription>
                                <div className="flex items-center mt-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < bean.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )})}
                </div>
            </div>
        </main>
    );
}
