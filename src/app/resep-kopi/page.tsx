
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import { defaultData, type CoffeeRecipe } from "../data-statis";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Badge } from '@/components/ui/badge';
import { RecipeFilterProvider, RecipeFilterDropdown, useFilter } from './recipe-filter';
import { fetchServerData } from "@/lib/api";
import React, { Suspense, useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { fetcher } from "@/lib/api";

function RecipePageClient({ initialRecipes, initialImages, initialMainPageData }: { initialRecipes: CoffeeRecipe[], initialImages: ImagePlaceholder[], initialMainPageData: any }) {
    const { data: allRecipes, error: recipesError } = useSWR('/api/data?key=resepKopiData', fetcher, { fallbackData: initialRecipes });
    const { data: userImages, error: imagesError } = useSWR('/api/data?key=userImages', fetcher, { fallbackData: initialImages.filter(img => img.id.startsWith('user-')) });
    const { data: mainPageData, error: mainPageError } = useSWR('/api/data?key=mainPageData', fetcher, { fallbackData: initialMainPageData });
    const { filter } = useFilter();

    const allImages = React.useMemo(() => [...PlaceHolderImages, ...(userImages || [])], [userImages]);

    const filteredRecipes = React.useMemo(() => {
        if (!allRecipes) return [];
        return filter === 'Semua'
            ? allRecipes
            : allRecipes.filter(recipe => recipe.category.includes(filter));
    }, [allRecipes, filter]);

    if (!allRecipes || !mainPageData) return <div className="text-center p-12">Memuat resep...</div>;
    if (recipesError || imagesError || mainPageError) return <div className="text-center p-12 text-destructive">Gagal memuat resep.</div>;
    
    return (
        <div className="p-8 md:p-12 -mt-16">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => {
                    const recipeImage = allImages.find(p => p.id === recipe.imageId);
                    return <RecipeCard key={recipe.id} recipe={recipe} image={recipeImage} authorName={mainPageData.name} />;
                })}
                {filteredRecipes.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                        <p className="text-lg text-muted-foreground">Tidak ada resep yang cocok dengan filter "{filter}".</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const RecipeCard = ({ recipe, image, authorName }: { recipe: CoffeeRecipe, image?: ImagePlaceholder, authorName: string }) => (
    <Link href={`/resep-kopi/${recipe.id}`} passHref>
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1">
            {image ? (
                <CardHeader className="p-0 relative h-48">
                    <Image
                        src={image.imageUrl}
                        alt={recipe.name}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </CardHeader>
            ) : <Skeleton className="h-48 w-full"/>}
            <CardContent className="p-6 flex flex-col flex-grow">
                <Badge variant="secondary" className="w-fit mb-2">{recipe.category}</Badge>
                <CardTitle className="font-headline text-2xl text-primary mb-2">{recipe.name}</CardTitle>
                <CardDescription className="font-body text-foreground/80 flex-grow line-clamp-3">{recipe.description}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <ChefHat className="w-4 h-4 mr-2" />
                    <span>Resep oleh {authorName}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
);


// This is the main Server Component for the page.
// It fetches data and sets up the Suspense boundaries.
export default function ResepKopiPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full bg-background text-center p-12">Memuat halaman resep...</div>}>
            <RecipeFilterProvider>
                <ResepKopiPage />
            </RecipeFilterProvider>
        </Suspense>
    );
}

function ResepKopiPage() {
    const { data: allRecipes, error: recipesError } = useSWR('/api/data?key=resepKopiData', fetcher, { fallbackData: defaultData.resepKopiData });
    const { data: userImages, error: imagesError } = useSWR('/api/data?key=userImages', fetcher, { fallbackData: [] });
    const { data: mainPageData, error: mainPageError } = useSWR('/api/data?key=mainPageData', fetcher, { fallbackData: defaultData.mainPageData });

    const pageImage: ImagePlaceholder | undefined = PlaceHolderImages.find(p => p.id === 'coffee-journey-alt');

    if (recipesError || imagesError || mainPageError) {
        return <div>Gagal memuat data awal.</div>
    }
     if (!allRecipes || !userImages || !mainPageData) {
        return <div className="min-h-screen w-full bg-background text-center p-12">Memuat...</div>
    }


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
                            <RecipeFilterDropdown />
                        </div>
                    </div>
                </div>
            </div>
            
            <RecipePageClient 
                initialRecipes={allRecipes} 
                initialImages={userImages}
                initialMainPageData={mainPageData}
            />
        </main>
    );
};
