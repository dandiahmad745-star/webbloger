
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { staticData as initialStaticData, type CoffeeRecipe } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Upload, Download, UploadCloud } from "lucide-react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { worldRegions, allCountries, type City } from "@/lib/world-regions";


const RecipeForm = ({ recipe, onSubmit, closeBtnId, onSelectImage, onCountryChange, onCityChange, selectedCountry, selectedCity, availableCities }: { 
    recipe?: CoffeeRecipe, 
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, 
    closeBtnId: string,
    onSelectImage: (id: string) => void,
    onCountryChange: (countryName: string) => void,
    onCityChange: (cityName: string) => void,
    selectedCountry: string,
    selectedCity: string,
    availableCities: City[],
}) => {
    return (
    <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1"><Label htmlFor="name">Nama Resep</Label><Input id="name" name="name" defaultValue={recipe?.name} required /></div>
        <div className="space-y-1"><Label htmlFor="description">Deskripsi Singkat</Label><Textarea id="description" name="description" defaultValue={recipe?.description} required rows={2} /></div>
        
         <div className="space-y-2">
            <Label>Asal / Kategori</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select onValueChange={onCountryChange} value={selectedCountry}>
                    <SelectTrigger><SelectValue placeholder="Pilih negara..." /></SelectTrigger>
                    <SelectContent>
                        {worldRegions.map(continent => (
                            <SelectGroup key={continent.name}>
                                <SelectLabel>{continent.name}</SelectLabel>
                                {continent.countries.map(country => (
                                    <SelectItem key={country.name} value={country.name}>{country.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={onCityChange} value={selectedCity} disabled={availableCities.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Pilih kota/wilayah..." /></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Kota/Wilayah di {selectedCountry}</SelectLabel>
                            {availableCities.map(city => (
                                <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label htmlFor="taste">Rasa</Label><Input id="taste" name="taste" defaultValue={recipe?.taste} required /></div>
            <div className="space-y-1"><Label htmlFor="aroma">Aroma</Label><Input id="aroma" name="aroma" defaultValue={recipe?.aroma} required /></div>
        </div>
        <div className="space-y-1"><Label htmlFor="beansUsed">Biji Kopi</Label><Input id="beansUsed" name="beansUsed" defaultValue={recipe?.beansUsed} required /></div>
        <div className="space-y-1"><Label htmlFor="instructions">Langkah-langkah (pisahkan dengan baris baru)</Label><Textarea id="instructions" name="instructions" defaultValue={recipe?.instructions.join('\n')} required rows={5} /></div>
        <ImagePicker currentImageId={recipe?.imageId} onSelect={onSelectImage} />
        <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 pb-1">
            <Button type="submit">{recipe ? 'Simpan Perubahan' : 'Simpan Resep'}</Button>
            <DialogTrigger asChild><Button type="button" variant="ghost" id={closeBtnId}>Batal</Button></DialogTrigger>
        </DialogFooter>
    </form>
)};

const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
    const [currentSelection, setCurrentSelection] = useState(currentImageId);
    const [userImages, setUserImages] = useState<ImagePlaceholder[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadImages = () => {
                try {
                    const savedUserImages = localStorage.getItem('userImages');
                    if (savedUserImages) {
                        setUserImages(JSON.parse(savedUserImages));
                    }
                } catch (error) {
                    console.error("Failed to parse user images from localStorage", error);
                }
            };
            loadImages();
            window.addEventListener('storage', loadImages);
            return () => window.removeEventListener('storage', loadImages);
        }
    }, []);
    
    useEffect(() => {
        setCurrentSelection(currentImageId);
    }, [currentImageId]);

    const handleSelect = (id: string) => {
        setCurrentSelection(id);
        onSelect(id);
    }

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const newImageId = `user-img-${Date.now()}`;
                const newImage: ImagePlaceholder = { id: newImageId, imageUrl: dataUrl, description: file.name, imageHint: 'custom upload' };
                
                const existingImagesRaw = localStorage.getItem('userImages');
                const existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
                const updatedUserImages = [...existingImages, newImage];

                setUserImages(updatedUserImages);
                localStorage.setItem('userImages', JSON.stringify(updatedUserImages));
                handleSelect(newImageId);
                
                toast({ title: "Gambar Diunggah", description: "Gambar telah disimpan secara lokal." });

                window.dispatchEvent(new Event('storage'));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const allImages = [...PlaceHolderImages, ...userImages];

    return (
        <div className="space-y-2">
            <Label>Pilih Gambar</Label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {allImages.map(img => (
                    <div key={img.id} className={cn("relative aspect-square rounded-md overflow-hidden cursor-pointer border-2", currentSelection === img.id ? 'border-primary' : 'border-transparent')} onClick={() => handleSelect(img.id)}>
                        <Image src={img.imageUrl} alt={img.description} fill className="object-cover" />
                    </div>
                ))}
            </div>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             <Button type="button" variant="outline" className="w-full" onClick={handleUploadClick}><Upload className="h-4 w-4 mr-2" />Unggah Foto</Button>
        </div>
    )
}

export default function AdminResepKopiPage() {
    const { toast } = useToast();
    const [recipesData, setRecipesData] = useState<CoffeeRecipe[]>(initialStaticData.resepKopi);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [availableCities, setAvailableCities] = useState<City[]>([]);
    const importFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedRecipes = localStorage.getItem('resepKopiData');
            if (savedRecipes) setRecipesData(JSON.parse(savedRecipes));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleCountryChange = (countryName: string) => {
        setSelectedCountry(countryName);
        const countryData = allCountries.find(c => c.name === countryName);
        setAvailableCities(countryData?.cities || []);
        setSelectedCity(''); // Reset kota saat negara berubah
    };

    const resetCategorySelection = () => {
        setSelectedCountry('');
        setSelectedCity('');
        setAvailableCities([]);
    }

    const handleSaveRecipe = (e: React.FormEvent<HTMLFormElement>, recipeId?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        let category = '';
        if(selectedCountry){
            category = selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry;
        }

        const newRecipeData: CoffeeRecipe = {
            id: recipeId || `resep-${Date.now()}`,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            taste: formData.get('taste') as string,
            aroma: formData.get('aroma') as string,
            category: category,
            beansUsed: formData.get('beansUsed') as string,
            instructions: (formData.get('instructions') as string).split('\n'),
            imageId: selectedImage || (recipeId ? recipesData.find(r => r.id === recipeId)?.imageId || '' : ''),
        };

        let updatedRecipes;
        if (recipeId) {
            updatedRecipes = recipesData.map(recipe => recipe.id === recipeId ? newRecipeData : recipe);
        } else {
            updatedRecipes = [...recipesData, newRecipeData];
        }

        setRecipesData(updatedRecipes);
        localStorage.setItem('resepKopiData', JSON.stringify(updatedRecipes));
        toast({ title: "Sukses!", description: `Resep ${newRecipeData.name} telah disimpan.` });
        
        const closeBtnId = recipeId ? `close-recipe-${recipeId}-dialog` : 'close-recipe-new-dialog';
        document.getElementById(closeBtnId)?.click();
    };

    const handleDeleteRecipe = (recipeId: string) => {
        const updatedRecipes = recipesData.filter(recipe => recipe.id !== recipeId);
        setRecipesData(updatedRecipes);
        localStorage.setItem('resepKopiData', JSON.stringify(updatedRecipes));
        toast({ title: "Dihapus!", description: "Resep kopi telah dihapus." });
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(recipesData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'resep-kopi.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast({ title: "Ekspor Berhasil", description: "File resep-kopi.json telah diunduh." });
    };

    const handleImportClick = () => {
        importFileInputRef.current?.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedData = JSON.parse(text);
                    // Simple validation
                    if (Array.isArray(importedData) && importedData.every(item => 'id' in item && 'name' in item)) {
                        setRecipesData(importedData);
                        localStorage.setItem('resepKopiData', JSON.stringify(importedData));
                        toast({ title: "Impor Berhasil", description: "Data resep telah diperbarui." });
                    } else {
                        throw new Error("Invalid JSON format.");
                    }
                } catch (error) {
                    toast({ variant: "destructive", title: "Impor Gagal", description: "File JSON tidak valid atau formatnya salah." });
                }
            };
            reader.readAsText(file);
        }
        // Reset file input
        if(event.target) event.target.value = '';
    };

    if (!isClient) {
        return null;
    }

    const handleDialogOpening = (open: boolean, recipe?: CoffeeRecipe) => {
        if (!open) {
             resetCategorySelection();
             setSelectedImage('');
        } else if (recipe) {
             setSelectedImage(recipe.imageId);
             if (recipe.category) {
                const parts = recipe.category.split(', ');
                const countryName = parts.length > 1 ? parts[1] : parts[0];
                const cityName = parts.length > 1 ? parts[0] : '';
                const countryData = allCountries.find(c => c.name === countryName);
                if (countryData) {
                    setSelectedCountry(countryName);
                    setAvailableCities(countryData.cities || []);
                    if (cityName && countryData.cities.some(c => c.name === cityName)) {
                        setSelectedCity(cityName);
                    } else {
                        setSelectedCity('');
                    }
                }
             } else {
                 resetCategorySelection();
             }
        } else {
             resetCategorySelection();
             setSelectedImage('');
        }
    }


    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Resep Kopi</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus resep untuk halaman "Resep Kopi".</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImport} />
                    <Button variant="outline" onClick={handleImportClick}><UploadCloud className="h-4 w-4 mr-2" />Impor</Button>
                    <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Ekspor</Button>
                    <Dialog onOpenChange={(open) => handleDialogOpening(open)}>
                        <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Resep</Button></DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col"><DialogHeader><DialogTitle>Tambah Resep Baru</DialogTitle></DialogHeader><div className="overflow-y-auto -mr-6 pr-6">
                            <RecipeForm 
                                onSubmit={(e) => handleSaveRecipe(e)} 
                                closeBtnId="close-recipe-new-dialog" 
                                onSelectImage={setSelectedImage}
                                onCountryChange={handleCountryChange}
                                onCityChange={setSelectedCity}
                                selectedCountry={selectedCountry}
                                selectedCity={selectedCity}
                                availableCities={availableCities}
                            />
                        </div></DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {recipesData.map(recipe => (
                    <div key={recipe.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <p className="font-medium">{recipe.name}</p>
                            <p className="text-sm text-muted-foreground">{recipe.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog onOpenChange={(open) => handleDialogOpening(open, recipe)}>
                                <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col"><DialogHeader><DialogTitle>Edit {recipe.name}</DialogTitle></DialogHeader><div className="overflow-y-auto -mr-6 pr-6">
                                    <RecipeForm 
                                        recipe={recipe} 
                                        onSubmit={(e) => handleSaveRecipe(e, recipe.id)} 
                                        closeBtnId={`close-recipe-${recipe.id}-dialog`}
                                        onSelectImage={setSelectedImage}
                                        onCountryChange={handleCountryChange}
                                        onCityChange={setSelectedCity}
                                        selectedCountry={selectedCountry}
                                        selectedCity={selectedCity}
                                        availableCities={availableCities}
                                    />
                                </div></DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteRecipe(recipe.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

    