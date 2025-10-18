
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat, Filter } from "lucide-react";
import Link from "next/link";
import { staticData as initialStaticData, type CoffeeRecipe } from "../data-statis";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { aseanRegions } from '@/lib/asean-regions';

export default function ResepKopiPage() {
    const [allRecipes, setAllRecipes] = useState<CoffeeRecipe[]>(initialStaticData.resepKopi);
    const [filteredRecipes, setFilteredRecipes] = useState<CoffeeRecipe[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [allImages, setAllImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
    const [filter, setFilter] = useState('Semua');

    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = localStorage.getItem('resepKopiData');
            const savedUserImages = localStorage.getItem('userImages');

            const currentAllImages = [...PlaceHolderImages];
            if (savedUserImages) {
                currentAllImages.push(...JSON.parse(savedUserImages));
            }
            setAllImages(currentAllImages);

            const recipes = savedData ? JSON.parse(savedData) : initialStaticData.resepKopi;
            setAllRecipes(recipes);

        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (filter === 'Semua') {
            setFilteredRecipes(allRecipes);
        } else {
            setFilteredRecipes(allRecipes.filter(recipe => recipe.category === filter));
        }
    }, [filter, allRecipes]);

    const pageImage: ImagePlaceholder | undefined = allImages.find(p => p.id === 'coffee-journey-alt');

    if (!isClient) {
        return null; // Or a loading spinner
    }

    const uniqueCategories = ['Semua', ...Array.from(new Set(allRecipes.map(r => r.category)))];

    return (
        <main className="min-h-screen w-full bg-background text-foreground fade-in">
            <div className="relative h-80 w-full">
                 {pageImage && (
                    <Image
                        src={pageImage.imageUrl}
                        alt={pageImage.description}
                        data-ai-hint={pageImage.imageHint}
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
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="font-headline text-4xl md:text-6xl text-white">Buku Resep Kopi</h1>
                                <p className="font-body text-base md:text-lg text-white/80 mt-2 max-w-2xl">
                                    Temukan inspirasi dan panduan untuk menciptakan secangkir kopi sempurna versi Anda.
                                </p>
                            </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filter: {filter}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Filter berdasarkan Wilayah</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {uniqueCategories.map(cat => (
                                        <DropdownMenuItem key={cat} onSelect={() => setFilter(cat)}>
                                            {cat}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 -mt-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map((recipe) => {
                         const recipeImage = allImages.find(p => p.id === recipe.imageId);
                        return(
                        <Link href={`/resep-kopi/${recipe.id}`} key={recipe.id} passHref>
                            <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1">
                            {recipeImage && (
                                <CardHeader className="p-0 relative h-48">
                                    <Image
                                        src={recipeImage.imageUrl}
                                        alt={recipe.name}
                                        data-ai-hint={recipeImage.imageHint}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </CardHeader>
                            )}
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <Badge variant="secondary" className="w-fit mb-2">{recipe.category}</Badge>
                                    <CardTitle className="font-headline text-2xl text-primary mb-2">{recipe.name}</CardTitle>
                                    <CardDescription className="font-body text-foreground/80 flex-grow line-clamp-3">{recipe.description}</CardDescription>
                                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                                        <ChefHat className="w-4 h-4 mr-2" />
                                        <span>Resep oleh {initialStaticData.mainPage.name}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )})}
                     {filteredRecipes.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                            <p className="text-lg text-muted-foreground">Tidak ada resep yang cocok dengan filter "{filter}".</p>
                            <Button variant="link" onClick={() => setFilter('Semua')}>Tampilkan semua resep</Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
