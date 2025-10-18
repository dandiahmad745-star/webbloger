
'use client';

import { useState, useEffect } from "react";
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type CoffeeBean } from "../learn-coffee/coffee-data";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import { ImagePicker } from "@/components/image-picker";
import { fetcher, postData } from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton";

const CoffeeBeanForm = ({ bean, onSubmit, onSelectImage, closeBtnId }: { bean?: CoffeeBean, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onSelectImage: (id: string) => void, closeBtnId: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor={`name-${bean?.id || 'new'}`}>Nama</Label><Input id={`name-${bean?.id || 'new'}`} name="name" defaultValue={bean?.name} required /></div>
        <div className="space-y-2"><Label htmlFor={`origin-${bean?.id || 'new'}`}>Asal</Label><Input id={`origin-${bean?.id || 'new'}`} name="origin" defaultValue={bean?.origin} required /></div>
        <div className="space-y-2"><Label htmlFor={`type-${bean?.id || 'new'}`}>Tipe</Label><Input id={`type-${bean?.id || 'new'}`} name="type" placeholder="Arabica / Robusta / Liberica" defaultValue={bean?.type} required /></div>
        <div className="space-y-2"><Label htmlFor={`description-${bean?.id || 'new'}`}>Deskripsi</Label><Textarea id={`description-${bean?.id || 'new'}`} name="description" defaultValue={bean?.description} required /></div>
        <div className="space-y-2"><Label htmlFor={`rating-${bean?.id || 'new'}`}>Rating (1-5)</Label><Input id={`rating-${bean?.id || 'new'}`} name="rating" type="number" min="1" max="5" defaultValue={bean?.rating} required /></div>
        <ImagePicker currentImageId={bean?.imageId} onSelect={onSelectImage} />
        <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogTrigger asChild>
                <Button type="button" variant="ghost" id={closeBtnId}>Batal</Button>
            </DialogTrigger>
        </DialogFooter>
    </form>
);


export default function AdminCoffeeBeansPage() {
    const { toast } = useToast();
    const { data: coffeeBeansData, error, mutate, isLoading } = useSWR<CoffeeBean[]>('/api/data?key=coffeeBeansData', fetcher);
    const [selectedImage, setSelectedImage] = useState('');

    const handleSaveCoffeeBean = async (e: React.FormEvent<HTMLFormElement>, beanId?: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newBeanData = {
            id: beanId || `bean-${Date.now()}`,
            name: formData.get('name') as string,
            origin: formData.get('origin') as string,
            type: formData.get('type') as 'Arabica' | 'Robusta' | 'Liberica',
            description: formData.get('description') as string,
            rating: Number(formData.get('rating')),
            imageId: selectedImage || (beanId ? coffeeBeansData?.find(b => b.id === beanId)?.imageId || '' : ''),
        };

        let updatedBeans;
        if (beanId) {
            updatedBeans = coffeeBeansData!.map(bean => bean.id === beanId ? newBeanData : bean);
        } else {
            updatedBeans = [...(coffeeBeansData || []), newBeanData];
        }

        try {
            await postData('coffeeBeansData', updatedBeans);
            mutate(updatedBeans, false);
            toast({ title: "Sukses!", description: `Biji kopi ${newBeanData.name} telah disimpan.` });
        } catch(e) {
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Tidak dapat menyimpan data ke server." });
        }
        
        const closeBtnId = beanId ? `close-bean-${beanId}-dialog` : 'close-bean-new-dialog';
        document.getElementById(closeBtnId)?.click();
    };

    const handleDeleteCoffeeBean = async (beanId: string) => {
        if (!coffeeBeansData) return;
        const updatedBeans = coffeeBeansData.filter(bean => bean.id !== beanId);
        
        try {
            await postData('coffeeBeansData', updatedBeans);
            mutate(updatedBeans, false);
            toast({ title: "Dihapus!", description: "Biji kopi telah dihapus." });
        } catch(e) {
            toast({ variant: "destructive", title: "Gagal Menghapus", description: "Tidak dapat menghapus data dari server." });
        }
    };
    
    if (error) return <div className="text-red-500">Gagal memuat data. Silakan coba lagi.</div>;
    
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kelola Biji Kopi</CardTitle>
                    <CardDescription>Untuk halaman "Learn Coffee".</CardDescription>
                </div>
                <Dialog onOpenChange={(open) => !open && setSelectedImage('')}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                        <DialogHeader><DialogTitle>Tambah Biji Kopi Baru</DialogTitle></DialogHeader>
                        <div className="overflow-y-auto -mr-6 pr-6">
                            <CoffeeBeanForm onSubmit={(e) => handleSaveCoffeeBean(e)} onSelectImage={setSelectedImage} closeBtnId="close-bean-new-dialog" />
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
                 {isLoading && Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
                {coffeeBeansData && coffeeBeansData.map(bean => (
                    <div key={bean.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{bean.name}</p>
                        <div className="flex items-center gap-2">
                            <Dialog onOpenChange={(open) => { if (!open) setSelectedImage(''); else setSelectedImage(bean.imageId)}}>
                                <DialogTrigger asChild><Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button></DialogTrigger>
                                 <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                                    <DialogHeader><DialogTitle>Edit {bean.name}</DialogTitle></DialogHeader>
                                    <div className="overflow-y-auto -mr-6 pr-6">
                                        <CoffeeBeanForm bean={bean} onSubmit={(e) => handleSaveCoffeeBean(e, bean.id)} onSelectImage={setSelectedImage} closeBtnId={`close-bean-${bean.id}-dialog`} />
                                    </div>
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
