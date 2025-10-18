
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { staticData } from "@/app/data-statis";

export default function AdminTemplatePage() {
    const { toast } = useToast();

    const handleDownload = (content: object, filename: string) => {
        const dataStr = JSON.stringify(content, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', filename);
        linkElement.click();

        toast({ title: "Unduhan Dimulai", description: `${filename} sedang diunduh.` });
    };

    const handleDownloadResepTemplate = () => {
        // Provide a sample recipe structure
        const resepTemplate = [
            {
                "id": "contoh-resep-123",
                "name": "Nama Resep Kopi Anda",
                "description": "Deskripsi singkat yang menarik tentang resep ini.",
                "taste": "Profil rasa, misal: Manis, sedikit asam, fruity.",
                "aroma": "Profil aroma, misal: Cokelat, karamel, bunga.",
                "category": "Daerah Asal, misal: Bandung, Indonesia",
                "beansUsed": "Jenis biji kopi yang direkomendasikan.",
                "instructions": [
                    "Langkah pertama dalam membuat resep.",
                    "Langkah kedua.",
                    "Dan seterusnya..."
                ],
                "imageId": "espresso-shot"
            }
        ];
        handleDownload(resepTemplate, 'resep-template.json');
    };

    const handleDownloadMenuTemplate = () => {
        // Use a subset of staticData for the main menu/content template
        const { resepKopi, ...menuTemplate } = staticData;
        handleDownload(menuTemplate, 'menu-template.json');
    };

_instruction_
    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Template Menu & Konten</CardTitle>
                    <CardDescription>Unduh template JSON untuk mengelola konten utama situs seperti data di halaman utama, kisah saya, peralatan, dll. File ini **tidak** untuk diimpor kembali, hanya sebagai referensi struktur data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleDownloadMenuTemplate} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh menu-template.json
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle>Template Resep Kopi</CardTitle>
                    <CardDescription>Unduh template JSON untuk menambahkan resep kopi dalam jumlah besar. Edit file ini lalu impor melalui halaman "Kelola Resep Kopi".</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button onClick={handleDownloadResepTemplate} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Unduh resep-template.json
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
