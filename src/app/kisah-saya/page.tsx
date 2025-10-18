
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export default function KisahSayaPage() {
    const myStoryImage: ImagePlaceholder | undefined = PlaceHolderImages.find(p => p.id === 'barista-story');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 md:p-8 relative h-64">
                         {myStoryImage && (
                            <Image
                                src={myStoryImage.imageUrl}
                                alt={myStoryImage.description}
                                data-ai-hint={myStoryImage.imageHint}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        <div className="relative z-10 flex flex-col justify-end h-full">
                             <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                            <CardTitle className="font-headline text-4xl md:text-5xl text-white text-left">
                                Kisah Saya
                            </CardTitle>
                            <CardDescription className="font-body text-base md:text-lg text-white/80 text-left pt-2">
                                Perjalanan Pribadi dalam Dunia Kopi
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 text-lg font-body text-foreground/90 space-y-6">
                        <p>
                            Kecintaan saya pada kopi dimulai dari sebuah kedai kecil di sudut kota, di mana aroma biji kopi yang baru disangrai pertama kali menyapa indra saya. Momen itu bukan hanya tentang minuman, tetapi tentang sebuah pengalaman—kehangatan, komunitas, dan seni.
                        </p>
                        <p>
                            Dari sana, saya memulai perjalanan untuk belajar. Saya menghabiskan waktu bertahun-tahun mengunjungi perkebunan, berbicara dengan para petani, belajar dari para roaster ahli, dan bereksperimen dengan setiap metode seduh yang bisa saya temukan. Kopi menjadi hasrat, obsesi, dan akhirnya, jalan hidup saya.
                        </p>
                         <p>
                           Melalui "BioLink Elegance" ini, saya ingin berbagi sebagian kecil dari perjalanan itu dengan Anda. Setiap tautan adalah sebuah bab dari cerita saya, sebuah undangan untuk menjelajahi dunia kopi melalui mata saya. Terima kasih telah menjadi bagian dari kisah ini.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
