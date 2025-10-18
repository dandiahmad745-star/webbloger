
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function AdminPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-background fade-in">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                         <Link href="/" passHref>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                             <h1 className="font-headline text-4xl text-primary">Admin Panel</h1>
                            <p className="font-body text-muted-foreground">Kelola konten halaman kopi Anda.</p>
                        </div>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Biji Kopi Baru
                    </Button>
                </div>

                <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>Daftar Biji Kopi</CardTitle>
                        <CardDescription>Lihat dan kelola biji kopi yang ditampilkan di halaman "Learn Coffee".</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="font-body">Fungsionalitas pengelolaan data akan segera hadir di sini.</p>
                            <p className="text-sm font-body">(Saat ini, data masih dikelola secara statis di dalam kode).</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
