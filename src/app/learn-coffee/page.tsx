
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export default function LearnCoffeePage() {
    const coffeeJourneyImage: ImagePlaceholder | undefined = PlaceHolderImages.find(p => p.id === 'coffee-journey');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 md:p-8 relative">
                        {coffeeJourneyImage && (
                            <Image
                                src={coffeeJourneyImage.imageUrl}
                                alt={coffeeJourneyImage.description}
                                data-ai-hint={coffeeJourneyImage.imageHint}
                                fill
                                className="object-cover opacity-20"
                            />
                        )}
                        <div className="relative z-10">
                            <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-primary hover:bg-primary/10">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                            <CardTitle className="font-headline text-4xl md:text-5xl text-primary text-center pt-16">
                                Learn Coffee
                            </CardTitle>
                            <CardDescription className="font-body text-base md:text-lg text-foreground/80 text-center pt-2">
                                Menyelami Dunia Kopi, dari Biji hingga Cangkir
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 text-lg font-body text-foreground/90 space-y-6">
                        <p>
                            Selamat datang di perjalanan kopi saya! Di sini, kita akan menjelajahi berbagai aspek menarik dari dunia kopi. Mulai dari mengenal perbedaan antara biji Arabika dan Robusta, memahami proses roasting yang menentukan karakter rasa, hingga menguasai berbagai metode seduh untuk menghasilkan secangkir kopi yang sempurna.
                        </p>
                        <p>
                            Setiap biji kopi memiliki cerita uniknya sendiri, dipengaruhi oleh tanah tempat ia tumbuh, iklim, dan tangan-tangan terampil yang merawatnya. Mari kita temukan bersama rahasia di balik aroma yang memikat dan cita rasa yang kompleks.
                        </p>
                         <p>
                           Apakah Anda seorang pemula yang ingin belajar atau seorang penikmat kopi yang ingin memperdalam pengetahuan, halaman ini didedikasikan untuk Anda. Mari kita mulai petualangan kopi ini!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
