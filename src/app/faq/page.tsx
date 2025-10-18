

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { defaultData } from "../data-statis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from "@/components/ui/button";
import { fetchServerData } from "@/lib/api";
import { FAQSearch } from './faq-search';

export default async function FAQPage() {
    const faqItems = await fetchServerData('faqData', defaultData.faqData);
    
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
                    <FAQSearch items={faqItems} />
                </div>
            </div>
        </main>
    );
}

