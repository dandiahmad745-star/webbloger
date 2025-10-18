
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Coffee, Feather, Globe, Wind } from "lucide-react";
import Link from "next/link";
import { staticData as initialStaticData, type CoffeeRecipe } from "../../data-statis";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function RecipeDetailPage() {
    const params = useParams();
    const [recipe, setRecipe] = useState<CoffeeRecipe | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
    const id = params.id as string;

    useEffect(() => {
        setIsClient(true);
        if(!id) return;
        
        try {
            const savedRecipes = localStorage.getItem('resepKopiData');
            const savedUserImages = localStorage.getItem('userImages');
            
            const currentAllImages = [...PlaceHolderImages];
            if (savedUserImages) {
                currentAllImages.push(...JSON.parse(savedUserImages));
            }
            setAllImages(currentAllImages);

            const allRecipes = savedRecipes ? JSON.parse(savedRecipes) : initialStaticData.resepKopi;
            const currentRecipe = allRecipes.find((r: CoffeeRecipe) => r.id === id);
            setRecipe(currentRecipe || null);

        } catch (error) {
            console.error("Failed to parse from localStorage", error);
            const currentRecipe = initialStaticData.resepKopi.find(r => r.id === id);
            setRecipe(currentRecipe || null);
        }
    }, [id]);

    if (!isClient) {
        // You can return a loading skeleton here
        return <div className="min-h-screen bg-background" />;
    }

    if (!recipe) {
        notFound();
    }

    const recipeImage: ImagePlaceholder | undefined = allImages.find(p => p.id === recipe.imageId);

    const infoItems = [
        { icon: Wind, label: "Rasa", value: recipe.taste },
        { icon: Feather, label: "Aroma", value: recipe.aroma },
        { icon: Globe, label: "Asal", value: recipe.category },
        { icon: Coffee, label: "Biji Kopi", value: recipe.beansUsed },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground fade-in">
            <div className="relative h-96 w-full">
                {recipeImage && (
                    <Image
                        src={recipeImage.imageUrl}
                        alt={recipe.name}
                        data-ai-hint={recipeImage.imageHint}
                        fill
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/resep-kopi" passHref>
                        <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <Badge variant="secondary" className="mb-2 backdrop-blur-sm">{recipe.category}</Badge>
                        <h1 className="font-headline text-4xl md:text-6xl text-white">{recipe.name}</h1>
                        <p className="font-body text-base md:text-lg text-white/80 mt-2 max-w-2xl">
                            {recipe.description}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-8 md:p-12 -mt-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="lg:col-span-2">
                        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg rounded-2xl">
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl text-primary">Langkah-langkah</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-6">
                                    {recipe.instructions.map((step, index) => (
                                        <li key={index} className="flex gap-4">
                                            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <p className="font-body text-foreground/90 mt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                         <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg rounded-2xl p-6 space-y-4">
                            {infoItems.map((item, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 text-accent"><item.icon className="h-5 w-5" /></div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                            <p className="font-semibold text-primary">{item.value}</p>
                                        </div>
                                    </div>
                                    {index < infoItems.length - 1 && <Separator className="mt-4 bg-primary/10"/>}
                                </div>
                            ))}
                         </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
