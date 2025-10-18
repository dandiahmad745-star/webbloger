
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates = [
    { name: 'Resep Kopi', fileName: 'resep-kopi-template.json', description: 'Struktur dasar untuk menambahkan resep kopi baru.' },
    { name: 'Peralatan', fileName: 'peralatan-template.json', description: 'Struktur dasar untuk menambahkan item peralatan kopi.' },
    { name: 'Tanya Jawab (FAQ)', fileName: 'faq-template.json', description: 'Struktur dasar untuk menambahkan item FAQ baru.' },
    { name: 'Playlist', fileName: 'playlist-template.json', description: 'Struktur dasar untuk menambahkan playlist dan lagu baru.' },
];

export default function TemplatePage() {
    const { toast } = useToast();

    const handleDownload = (fileName: string) => {
        const link = document.createElement('a');
        link.href = `/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Template Diunduh",
            description: `${fileName} telah berhasil diunduh.`,
        });
    };

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardHeader>
                <CardTitle>Unduh Template JSON</CardTitle>
                <CardDescription>Gunakan file-file ini sebagai petunjuk untuk format impor data massal. Anda dapat mengisi kontennya lalu mengimpornya di halaman masing-masing.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                    <div key={template.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                            <div className="flex items-center gap-2">
                                <FileJson className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">{template.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                        <Button onClick={() => handleDownload(template.fileName)}>
                            <Download className="h-4 w-4 mr-2" />
                            Unduh
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
