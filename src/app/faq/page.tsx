
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { staticData as initialStaticData, type FAQItem } from "../data-statis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

export default function FAQPage() {
    const [faqItems, setFaqItems] = useState<FAQItem[]>(initialStaticData.faqData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<FAQItem[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedData = localStorage.getItem('faqData');
            const items = savedData ? JSON.parse(savedData) : initialStaticData.faqData;
            setFaqItems(items);
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    useEffect(() => {
        const results = faqItems.filter(item =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }, [searchTerm, faqItems]);

    if (!isClient) {
        return <div className="min-h-screen bg-background" />;
    }

    return (
        <main className="min-h-screen w-full bg-background text-foreground fade-in">
            <div className="relative h-72 w-full bg-primary/10">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/" passHref>
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="font-headline text-4xl md:text-6xl text-primary">Tanya Jawab</h1>
                        <p className="font-body text-base md:text-lg text-foreground/80 mt-2 max-w-2xl">
                            Temukan jawaban atas pertanyaan yang paling sering diajukan seputar dunia kopi.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 -mt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari pertanyaan atau jawaban..."
                            className="pl-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                            {filteredItems.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredItems.map(item => (
                                        <AccordionItem value={item.id} key={item.id}>
                                            <AccordionTrigger className="text-left font-semibold text-primary/90 hover:text-primary">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-foreground/80">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <p className="text-lg">Tidak ada hasil yang ditemukan untuk "{searchTerm}".</p>
                                    <p className="text-sm">Coba gunakan kata kunci yang berbeda.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
