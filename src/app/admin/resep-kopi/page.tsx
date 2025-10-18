
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
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminResepKopiPage() {
    const { toast } = useToast();
    const [recipesData, setRecipesData] = useState<CoffeeRecipe[]>(initialStaticData.resepKopi);
    const [isClient, setIsClient] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        setIsClient(true);
        try {
            const savedRecipes = localStorage.getItem('resepKopiData');
            if (savedRecipes) setRecipesData(JSON.parse(savedRecipes));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSaveRecipe = (e: React.FormEvent<HTMLFormElement>, recipeId?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newRecipeData: CoffeeRecipe = {
            id: recipeId || `resep-${Date.now()}`,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            taste: formData.get('taste') as string,
            aroma: formData.get('aroma') as string,
            origin: formData.get('origin') as string,
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
        setSelectedImage('');
    };

    const handleDeleteRecipe = (recipeId: string) => {
        const updatedRecipes = recipesData.filter(recipe => recipe.id !== recipeId);
        setRecipesData(updatedRecipes);
        localStorage.setItem('resepKopiData', JSON.stringify(updatedRecipes));
        toast({ title: "Dihapus!", description: "Resep kopi telah dihapus." });
    };

    if (!isClient) {
        return null;
    }
    
    const ImagePicker = ({ currentImageId, onSelect }: { currentImageId?: string, onSelect: (id: string) => void }) => {
        const [currentSelection, setCurrentSelection] = useState(currentImageId);
        const [userImages, setUserImages] = useState<ImagePlaceholder[]>([]);
        const fileInputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            try {
                const savedUserImages = localStorage.getItem('userImages');
                if (savedUserImages) setUserImages(JSON.parse(savedUserImages));
            } catch (error) { console.error("Gagal memuat gambar pengguna dari localStorage", error); }
        }, []);

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
                    const updatedUserImages = [...userImages, newImage];
                    setUserImages(updatedUserImages);
                    localStorage.setItem('userImages', JSON.stringify(updatedUserImages));
                    handleSelect(newImageId);
                    toast({ title: "Gambar Diunggah", description: "Gambar telah disimpan secara lokal." });
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

    const RecipeForm = ({ recipe, onSubmit, closeBtnId }: { recipe?: CoffeeRecipe, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, closeBtnId: string }) => (
        <form onSubmit={onSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <div className="space-y-1"><Label htmlFor="name">Nama Resep</Label><Input id="name" name="name" defaultValue={recipe?.name} required /></div>
            <div className="space-y-1"><Label htmlFor="description">Deskripsi Singkat</Label><Textarea id="description" name="description" defaultValue={recipe?.description} required rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="taste">Rasa</Label><Input id="taste" name="taste" defaultValue={recipe?.taste} required /></div>
                <div className="space-y-1"><Label htmlFor="aroma">Aroma</Label><Input id="aroma" name="aroma" defaultValue={recipe?.aroma} required /></div>
                <div className="space-y-1"><Label htmlFor="origin">Asal</Label><Input id="origin" name="origin" defaultValue={recipe?.origin} required /></div>
                <div className="space-y-1"><Label htmlFor="beansUsed">Biji Kopi</Label><Input id="beansUsed" name="beansUsed" defaultValue={recipe?.beansUsed} required /></div>
            </div>
            <div className="space-y-1"><Label htmlFor="instructions">Langkah-langkah (pisahkan dengan baris baru)</Label><Textarea id="instructions" name="instructions" defaultValue={recipe?.instructions.join('\n')} required rows={5} /></div>
            <ImagePicker currentImageId={recipe?.imageId} onSelect={setSelectedImage} />
            <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 pb-1">
                <Button type="submit">{recipe ? 'Simpan Perubahan' : 'Simpan Resep'}</Button>
                <DialogTrigger asChild><Button type="button" variant="ghost" id={closeBtnId}>Batal</Button></DialogTrigger>
            </DialogFooter>
        </form>
    );

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Resep Kopi</CardTitle>
                    <CardDescription>Tambah, edit, atau hapus resep untuk halaman "Resep Kopi".</CardDescription>
                </div>
                <Dialog onOpenChange={() => setSelectedImage('')}>
                    <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Resep</Button></DialogTrigger>
                    <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Tambah Resep Baru</DialogTitle></DialogHeader><RecipeForm onSubmit={(e) => handleSaveRecipe(e)} closeBtnId="close-recipe-new-dialog" /></DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {recipesData.map(recipe => (
                    <div key={recipe.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{recipe.name}</p>
                        <div className="flex items-center gap-2">
                            <Dialog onOpenChange={() => setSelectedImage(recipe.imageId)}>
                                <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit {recipe.name}</DialogTitle></DialogHeader><RecipeForm recipe={recipe} onSubmit={(e) => handleSaveRecipe(e, recipe.id)} closeBtnId={`close-recipe-${recipe.id}-dialog`} /></DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteRecipe(recipe.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
