
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default function AdminPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background fade-in">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" passHref>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-headline text-4xl text-primary">Admin Panel</h1>
                        <p className="font-body text-muted-foreground">Kelola semua konten halaman dari satu tempat.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Kelola Biji Kopi</CardTitle>
                                <CardDescription>Untuk halaman "Learn Coffee".</CardDescription>
                            </div>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="font-body text-sm">Fungsionalitas untuk menambah, mengedit, dan menghapus biji kopi akan segera hadir.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Kelola "Kisah Saya"</CardTitle>
                                <CardDescription>Untuk halaman "Kisah Saya".</CardDescription>
                            </div>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="font-body text-sm">Fungsionalitas untuk mengedit judul, deskripsi, paragraf, dan gambar akan segera hadir.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Kelola Peralatan</CardTitle>
                                <CardDescription>Untuk halaman "Coffee Utensils".</CardDescription>
                            </div>
                            <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="font-body text-sm">Fungsionalitas untuk mengedit item peralatan, deskripsi, dan ikon akan segera hadir.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
