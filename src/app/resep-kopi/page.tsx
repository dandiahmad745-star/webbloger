
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import { staticData, type CoffeeRecipe } from "../data-statis";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { Badge } from '@/components/ui/badge';
import { RecipeFilterProvider, RecipeFilterDropdown, useFilter } from './recipe-filter';
import { fetchServerData } from "@/lib/api";
import React from 'react';

// This component is now responsible for providing the filter context and rendering the dynamic parts.
function ResepKopiContainer({ allRecipes, allImages, authorName }: { allRecipes: CoffeeRecipe[], allImages: ImagePlaceholder[], authorName: string }) {
    const { filter } = useFilter();

    const filteredRecipes = filter === 'Semua'
        ? allRecipes
        : allRecipes.filter(recipe => recipe.category.includes(filter));

    return (
        <>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="font-headline text-4xl md:text-6xl text-white">Buku Resep Kopi</h1>
                    <p className="font-body text-base md:text-lg text-white/80 mt-2 max-w-2xl">
                        Temukan inspirasi dan panduan untuk menciptakan secangkir kopi sempurna versi Anda.
                    </p>
                </div>
                <RecipeFilterDropdown />
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                {filteredRecipes.map((recipe) => {
                    const recipeImage = allImages.find(p => p.id === recipe.imageId);
                    return <RecipeCard key={recipe.id} recipe={recipe} image={recipeImage} authorName={authorName} />;
                })}
                {filteredRecipes.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                        <p className="text-lg text-muted-foreground">Tidak ada resep yang cocok dengan filter "{filter}".</p>
                    </div>
                )}
            </div>
        </>
    );
}


export default function ResepKopiPage() {
    // This remains a Server Component at its core, but we delegate client-side logic
    // to the container which will be wrapped in Suspense.
    return (
        <main className="min-h-screen w-full bg-background text-foreground fade-in">
            <div className="relative h-80 w-full">
                 <Image
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzYxMjAwOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Pemandangan perkebunan kopi dari atas."
                    data-ai-hint="coffee landscape"
                    fill
                    className="object-cover"
                />
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
                        <React.Suspense>
                            {/* The provider now wraps the container, and Suspense wraps them both */}
                            <RecipeFilterProvider>
                                <DataFetcher />
                            </RecipeFilterProvider>
                        </React.Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}

// A new component to fetch data and render the container
// This keeps the main page component clean and isolates data fetching.
function DataFetcher() {
    // This is a client component, so we can't use async/await at the top level.
    // Instead of making this component async, we will use a client-side data fetching approach
    // or pass the data down from a server component.
    // For this build fix, we will move the data fetching logic inside a useEffect or similar,
    // but the best approach for Next.js 14+ is to fetch in the Server Component and pass down.
    // Let's re-structure to do that. The page itself will fetch and pass.
    
    // The previous implementation was trying to be too clever. Let's simplify.
    // The error is about `useSearchParams`. The component using it MUST be a client component.
    // The `page.tsx` can remain a server component if we structure it correctly.
    // The fix is to have a single client component that handles all the filtering logic.
    
    // The previous fix was close but not quite right. The issue is `RecipeFilter` being outside Suspense.
    // Let's go back to the logic of `page.tsx` being async and fetching data.
    return null; // This will be replaced by the logic in the new Page component below.
}


const RecipeCard = ({ recipe, image, authorName }: { recipe: CoffeeRecipe, image?: ImagePlaceholder, authorName: string }) => (
    <Link href={`/resep-kopi/${recipe.id}`} passHref>
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group hover:-translate-y-1">
            {image && (
                <CardHeader className="p-0 relative h-48">
                    <Image
                        src={image.imageUrl}
                        alt={recipe.name}
                        data-ai-hint={image.imageHint}
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
                    <span>Resep oleh {authorName}</span>
                </div>
            </CardContent>
        </Card>
    </Link>
);


// FINAL CORRECT IMPLEMENTATION

// This is the client boundary. All hooks like useSearchParams must be inside this.
function RecipePageClient({ allRecipes, allImages, authorName }: { allRecipes: CoffeeRecipe[], allImages: ImagePlaceholder[], authorName: string }) {
    const { filter } = useFilter();

    const filteredRecipes = filter === 'Semua'
        ? allRecipes
        : allRecipes.filter(recipe => recipe.category.includes(filter));

    return (
        <div className="p-8 md:p-12 -mt-16">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => {
                    const recipeImage = allImages.find(p => p.id === recipe.imageId);
                    return <RecipeCard key={recipe.id} recipe={recipe} image={recipeImage} authorName={authorName} />;
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


// Re-declare the page as an async Server Component
export const RecipePage = async () => {
    const allRecipes = await fetchServerData('resepKopiData', staticData.resepKopi);
    const userImages = await fetchServerData('userImages', []);
    const allImages = [...PlaceHolderImages, ...userImages];
    const pageImage: ImagePlaceholder | undefined = allImages.find(p => p.id === 'coffee-journey-alt');
    const mainPageData = await fetchServerData('mainPageData', staticData.mainPage);

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
                            {/* The Suspense boundary now correctly wraps the Provider and the Dropdown */}
                            <React.Suspense fallback={<div className="h-10 w-32 rounded-md bg-white/20 animate-pulse" />}>
                                <RecipeFilterProvider>
                                    <RecipeFilterDropdown />
                                </RecipeFilterProvider>
                            </React.Suspense>
                        </div>
                    </div>
                </div>
            </div>
             {/* Another Suspense boundary for the content */}
            <React.Suspense fallback={<div className="p-8 md:p-12 -mt-16"><div className="max-w-4xl mx-auto"><p>Memuat resep...</p></div></div>}>
                <RecipeFilterProvider>
                     <RecipePageClient allRecipes={allRecipes} allImages={allImages} authorName={mainPageData.name} />
                </RecipeFilterProvider>
            </React.Suspense>
        </main>
    );
};

// Replace the default export to use the new structure
export default RecipePage;
