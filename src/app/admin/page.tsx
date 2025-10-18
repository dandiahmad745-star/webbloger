
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { coffeeBeans as initialCoffeeBeans, type CoffeeBean } from "../learn-coffee/coffee-data";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";

export default function AdminCoffeeBeansPage() {
    const { toast } = useToast();
    const [coffeeBeansData, setCoffeeBeansData] = useState<CoffeeBean[]>(initialCoffeeBeans);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedCoffeeBeans = localStorage.getItem('coffeeBeansData');
            if (savedCoffeeBeans) setCoffeeBeansData(JSON.parse(savedCoffeeBeans));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleSaveCoffeeBean = (e: React.FormEvent<HTMLFormElement>, beanId?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newBeanData = {
            id: beanId || `new-bean-${Date.now()}`,
            name: formData.get('name') as string,
            origin: formData.get('origin') as string,
            type: formData.get('type') as 'Arabica' | 'Robusta' | 'Liberica',
            description: formData.get('description') as string,
            rating: Number(formData.get('rating')),
            imageId: formData.get('imageId') as string,
        };

        let updatedBeans;
        if (beanId) {
            updatedBeans = coffeeBeansData.map(bean => bean.id === beanId ? newBeanData : bean);
        } else {
            updatedBeans = [...coffeeBeansData, newBeanData];
        }

        setCoffeeBeansData(updatedBeans);
        localStorage.setItem('coffeeBeansData', JSON.stringify(updatedBeans));
        toast({ title: "Sukses!", description: `Biji kopi ${newBeanData.name} telah disimpan.` });
        const closeBtn = document.getElementById(`close-bean-${beanId || 'new'}-dialog`);
        if(closeBtn) closeBtn.click();
    };

    const handleDeleteCoffeeBean = (beanId: string) => {
        const updatedBeans = coffeeBeansData.filter(bean => bean.id !== beanId);
        setCoffeeBeansData(updatedBeans);
        localStorage.setItem('coffeeBeansData', JSON.stringify(updatedBeans));
        toast({ title: "Dihapus!", description: "Biji kopi telah dihapus." });
    };

    if (!isClient) {
        return null; // Render nothing until mounted on client
    }

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Biji Kopi</CardTitle>
                    <CardDescription>Untuk halaman "Learn Coffee".</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Tambah Biji Kopi Baru</DialogTitle></DialogHeader>
                        <form onSubmit={(e) => handleSaveCoffeeBean(e)} className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="name">Nama</Label><Input id="name" name="name" required /></div>
                            <div className="space-y-2"><Label htmlFor="origin">Asal</Label><Input id="origin" name="origin" required /></div>
                            <div className="space-y-2"><Label htmlFor="type">Tipe</Label><Input id="type" name="type" placeholder="Arabica / Robusta / Liberica" required /></div>
                            <div className="space-y-2"><Label htmlFor="description">Deskripsi</Label><Textarea id="description" name="description" required /></div>
                            <div className="space-y-2"><Label htmlFor="rating">Rating (1-5)</Label><Input id="rating" name="rating" type="number" min="1" max="5" required /></div>
                            <div className="space-y-2"><Label htmlFor="imageId">Image ID</Label><Input id="imageId" name="imageId" placeholder="e.g., gayo-beans" required /></div>
                            <DialogFooter>
                                <Button type="submit">Simpan</Button>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="ghost" id="close-bean-new-dialog">Batal</Button>
                                </DialogTrigger>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                {coffeeBeansData.map(bean => (
                    <div key={bean.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{bean.name}</p>
                        <div className="flex items-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Edit {bean.name}</DialogTitle></DialogHeader>
                                    <form onSubmit={(e) => handleSaveCoffeeBean(e, bean.id)} className="space-y-4">
                                        <div className="space-y-2"><Label htmlFor={`name-${bean.id}`}>Nama</Label><Input id={`name-${bean.id}`} name="name" defaultValue={bean.name} required /></div>
                                        <div className="space-y-2"><Label htmlFor={`origin-${bean.id}`}>Asal</Label><Input id={`origin-${bean.id}`} name="origin" defaultValue={bean.origin} required /></div>
                                        <div className="space-y-2"><Label htmlFor={`type-${bean.id}`}>Tipe</Label><Input id={`type-${bean.id}`} name="type" defaultValue={bean.type} required /></div>
                                        <div className="space-y-2"><Label htmlFor={`description-${bean.id}`}>Deskripsi</Label><Textarea id={`description-${bean.id}`} name="description" defaultValue={bean.description} required /></div>
                                        <div className="space-y-2"><Label htmlFor={`rating-${bean.id}`}>Rating (1-5)</Label><Input id={`rating-${bean.id}`} name="rating" type="number" min="1" max="5" defaultValue={bean.rating} required /></div>
                                        <div className="space-y-2"><Label htmlFor={`imageId-${bean.id}`}>Image ID</Label><Input id={`imageId-${bean.id}`} name="imageId" defaultValue={bean.imageId} required /></div>
                                        <DialogFooter>
                                            <Button type="submit">Simpan Perubahan</Button>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="ghost" id={`close-bean-${bean.id}-dialog`}>Batal</Button>
                                            </DialogTrigger>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteCoffeeBean(bean.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
