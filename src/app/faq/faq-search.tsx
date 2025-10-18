
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { type FAQItem } from "../data-statis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

export function FAQSearch({ items }: { items: FAQItem[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<FAQItem[]>(items);

    useEffect(() => {
        const results = items.filter(item =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    return (
        <>
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
        </>
    );
}
