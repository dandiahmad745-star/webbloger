
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Coffee, Wind, Droplets } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

const utensils = [
    { name: "V60 Dripper", description: "Metode pour-over klasik untuk secangkir kopi yang jernih dan bersih.", icon: Wind },
    { name: "Aeropress", description: "Alat serbaguna yang menghasilkan kopi kaya rasa dengan tingkat keasaman rendah.", icon: Coffee },
    { name: "French Press", description: "Metode rendam yang menghasilkan kopi dengan body penuh dan tekstur yang kaya.", icon: Droplets },
]

export default function UtensilsPage() {
    const utensilsImage: ImagePlaceholder | undefined = PlaceHolderImages.find(p => p.id === 'coffee-utensils');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
                     <CardHeader className="p-6 md:p-8">
                        <div className="flex items-center justify-between">
                             <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                             <div className="text-center flex-grow">
                                <CardTitle className="font-headline text-4xl md:text-5xl text-primary">
                                    Coffee Utensils
                                </CardTitle>
                                <CardDescription className="font-body text-base md:text-lg text-foreground/80 pt-2">
                                    Peralatan untuk Secangkir Kopi Sempurna
                                </CardDescription>
                            </div>
                            <div className="w-10"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
                        {utensils.map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.name} className="flex flex-col items-center text-center">
                                    <div className="p-4 bg-accent/20 rounded-full mb-4">
                                        <Icon className="w-10 h-10 text-accent" />
                                    </div>
                                    <h3 className="font-headline text-2xl text-primary mb-2">{item.name}</h3>
                                    <p className="font-body text-foreground/80">{item.description}</p>
                                </div>
                            )
                        })}
                    </CardContent>
                     {utensilsImage && (
                        <div className="w-full h-48 relative mt-8">
                            <Image
                                src={utensilsImage.imageUrl}
                                alt={utensilsImage.description}
                                data-ai-hint={utensilsImage.imageHint}
                                fill
                                className="object-cover rounded-b-2xl"
                            />
                        </div>
                     )}
                </Card>
            </div>
        </main>
    );
}
