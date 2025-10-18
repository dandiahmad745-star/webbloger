
"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { staticData as initialStaticData } from "../data-statis";

export default function NgobrolPage() {
    const [welcomeMessage, setWelcomeMessage] = useState(initialStaticData.mainPage.chatWelcome);
    const [messages, setMessages] = useState<{ from: string; text: string; }[]>([]);
    const [input, setInput] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('mainPageData');
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                setWelcomeMessage(parsedSettings.chatWelcome);
                setMessages([{ from: "bot", text: parsedSettings.chatWelcome }]);
            } else {
                 setMessages([{ from: "bot", text: welcomeMessage }]);
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
            setMessages([{ from: "bot", text: welcomeMessage }]);
        }
    }, [welcomeMessage]);

    const handleSend = () => {
        if (input.trim() === "") return;
        
        const newMessages = [...messages, { from: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            setMessages(prev => [...prev, {from: "bot", text: "Terima kasih atas pertanyaan Anda. Tim kami akan segera merespons."}]);
        }, 1000);
    };

    if (!isClient) {
        return null; // or a loading spinner
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-lg mx-auto">
                <Card className="bg-card/90 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden flex flex-col h-[70vh]">
                     <CardHeader className="p-4 border-b border-primary/10 flex-shrink-0">
                        <div className="flex items-center">
                             <Link href="/" passHref>
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 mr-2">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                             <div className="text-left flex-grow">
                                <CardTitle className="font-headline text-2xl text-primary">
                                    Ngobrol dengan Arul
                                </CardTitle>
                                <CardDescription className="font-body text-sm text-foreground/80 flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                    Biasanya membalas dalam beberapa menit
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow overflow-y-auto flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.from === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t border-primary/10 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            <Input 
                                placeholder="Ketik pesan Anda..." 
                                className="flex-grow" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button size="icon" onClick={handleSend}>
                                <Send />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}
