
'use client';

import { useState, useEffect, useRef } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type CoffeeRecipe } from "../../data-statis";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Download, UploadCloud, FileJson } from "lucide-react";
import { ImagePicker } from "@/components/image-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { worldRegions, allCountries, type City } from "@/lib/world-regions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetcher, postData } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

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


export default function AdminResepKopiPage() {
    const { toast } = useToast();
    const { data: recipesData, error, mutate, isLoading } = useSWR<CoffeeRecipe[]>('/api/data?key=resepKopiData', fetcher);
    
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [availableCities, setAvailableCities] = useState<City[]>([]);
    const importFileInputRef = useRef<HTMLInputElement>(null);
    const [jsonInput, setJsonInput] = useState('');
    const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);

    const handleCountryChange = (countryName: string) => {
        setSelectedCountry(countryName);
        const countryData = allCountries.find(c => c.name === countryName);
        setAvailableCities(countryData?.cities || []);
        setSelectedCity('');
    };

    const resetCategorySelection = () => {
        setSelectedCountry('');
        setSelectedCity('');
        setAvailableCities([]);
    }

    const handleSaveRecipe = async (e: React.FormEvent<HTMLFormElement>, recipeId?: string) => {
        e.preventDefault();
        if (!recipesData) return;
        const formData = new FormData(e.currentTarget);
        
        let category = '';
        if(selectedCountry){
            category = selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry;
        }

        const newRecipeData: Omit<CoffeeRecipe, 'id'> & { id: string } = {
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
             if (recipesData.some(recipe => recipe.name.toLowerCase() === newRecipeData.name.toLowerCase())) {
                toast({ variant: "destructive", title: "Gagal", description: `Resep dengan nama "${newRecipeData.name}" sudah ada.` });
                return;
            }
            updatedRecipes = [...recipesData, newRecipeData];
        }

        try {
            await postData('resepKopiData', updatedRecipes);
            mutate(updatedRecipes, false);
            toast({ title: "Sukses!", description: `Resep ${newRecipeData.name} telah disimpan.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
        
        const closeBtnId = recipeId ? `close-recipe-${recipeId}-dialog` : 'close-recipe-new-dialog';
        document.getElementById(closeBtnId)?.click();
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        if (!recipesData) return;
        const updatedRecipes = recipesData.filter(recipe => recipe.id !== recipeId);
        try {
            await postData('resepKopiData', updatedRecipes);
            mutate(updatedRecipes, false);
            toast({ title: "Dihapus!", description: "Resep kopi telah dihapus." });
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Tidak dapat menghapus data dari server." });
        }
    };

    const handleExport = () => {
        if (!recipesData) return;
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

    const processImportedRecipes = async (importedRecipes: any[]) => {
        if (!recipesData) return false;
        if (!Array.isArray(importedRecipes) || !importedRecipes.every(item => 'id' in item && 'name' in item)) {
            throw new Error("Invalid JSON format.");
        }
        
        const currentRecipes = [...recipesData];
        let newRecipesCount = 0;
        let skippedCount = 0;

        importedRecipes.forEach((newRecipe: CoffeeRecipe) => {
            const isDuplicate = currentRecipes.some(existingRecipe => 
                existingRecipe.id === newRecipe.id || existingRecipe.name.toLowerCase() === newRecipe.name.toLowerCase()
            );

            if (!isDuplicate) {
                currentRecipes.push(newRecipe);
                newRecipesCount++;
            } else {
                skippedCount++;
            }
        });
        
        try {
            await postData('resepKopiData', currentRecipes);
            mutate(currentRecipes, false);
            if (newRecipesCount > 0) {
                toast({ title: "Impor Berhasil", description: `${newRecipesCount} resep baru ditambahkan. ${skippedCount} resep duplikat dilewati.` });
            } else {
                toast({ title: "Tidak Ada Resep Baru", description: "Semua resep dalam file sudah ada di koleksi Anda." });
            }
            return true;
        } catch(e) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data impor ke server." });
            return false;
        }
    };


    const handleImportFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const text = e.target?.result as string;
                    const importedRecipes = JSON.parse(text);
                    await processImportedRecipes(importedRecipes);
                } catch (error) {
                    toast({ variant: "destructive", title: "Impor Gagal", description: "File JSON tidak valid atau formatnya salah." });
                }
            };
            reader.readAsText(file);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleImportFromJsonText = async () => {
        if (!jsonInput.trim()) {
            toast({ variant: "destructive", title: "Input Kosong", description: "Silakan tempel konten JSON." });
            return;
        }
        try {
            const importedRecipes = JSON.parse(jsonInput);
            if (await processImportedRecipes(importedRecipes)) {
                setJsonInput('');
                setIsPasteImportOpen(false);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Impor Gagal", description: "Teks JSON tidak valid atau formatnya salah." });
        }
    };

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

    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Kelola Resep Kopi</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus resep untuk halaman "Resep Kopi".</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon"><UploadCloud className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                             <DropdownMenuItem onSelect={handleImportClick}>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Impor dari File...
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setIsPasteImportOpen(true)}>
                                <FileJson className="mr-2 h-4 w-4" />
                                Impor dari Teks...
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleExport} disabled={!recipesData}>
                                <Download className="mr-2 h-4 w-4" />
                                Ekspor ke JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <input type="file" ref={importFileInputRef} className="hidden" accept=".json" onChange={handleImportFromFile} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading && Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                {recipesData && recipesData.map(recipe => (
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
                {recipesData && recipesData.length === 0 && !isLoading && (
                    <p className="text-center text-muted-foreground py-8">Belum ada resep.</p>
                )}
            </CardContent>
            <Dialog open={isPasteImportOpen} onOpenChange={setIsPasteImportOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Impor Resep dari Teks</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="json-paste-area-recipe">Tempel konten JSON di sini:</Label>
                        <Textarea id="json-paste-area-recipe" className="mt-2 font-mono h-64" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
                    </div>
                    <DialogFooter><Button onClick={handleImportFromJsonText}>Impor Sekarang</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
