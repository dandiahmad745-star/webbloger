
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Sparkles, Clipboard, Check } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { staticData as initialStaticData } from '../data-statis';
import { generateRecipe } from '@/ai/flows/generate-recipe-flow';
import { useToast } from '@/hooks/use-toast';
import { type CoffeeRecipe } from '../data-statis';

type Message = {
    from: 'user' | 'bot';
    text?: string;
    recipe?: CoffeeRecipe;
    isLoading?: boolean;
};

export default function NgobrolPage() {
    const { toast } = useToast();
    const [welcomeMessage, setWelcomeMessage] = useState(initialStaticData.mainPage.chatWelcome);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});


    useEffect(() => {
        setIsClient(true);
        try {
            const savedSettings = localStorage.getItem('mainPageData');
            const parsedSettings = savedSettings ? JSON.parse(savedSettings) : initialStaticData.mainPage;
            setWelcomeMessage(parsedSettings.chatWelcome);
            setMessages([{ from: 'bot', text: parsedSettings.chatWelcome }]);
        } catch (error) {
            console.error('Failed to parse from localStorage', error);
            setMessages([{ from: 'bot', text: initialStaticData.mainPage.chatWelcome }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleCopyToClipboard = (recipe: CoffeeRecipe) => {
        const recipeString = JSON.stringify([recipe], null, 2);
        navigator.clipboard.writeText(recipeString).then(() => {
            setCopiedStates(prev => ({ ...prev, [recipe.id]: true }));
            toast({ title: "Disalin!", description: "Resep telah disalin ke clipboard." });
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [recipe.id]: false }));
            }, 2000);
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            toast({ variant: "destructive", title: "Gagal", description: "Tidak dapat menyalin resep." });
        });
    };

    const handleImportRecipe = (recipe: CoffeeRecipe) => {
        try {
            const savedRecipesRaw = localStorage.getItem('resepKopiData');
            const savedRecipes = savedRecipesRaw ? JSON.parse(savedRecipesRaw) : [];
            
            // Check if recipe with same name already exists
            if (savedRecipes.some((r: CoffeeRecipe) => r.name === recipe.name)) {
                toast({
                    variant: "destructive",
                    title: "Impor Gagal",
                    description: `Resep dengan nama "${recipe.name}" sudah ada.`,
                });
                return;
            }

            const updatedRecipes = [...savedRecipes, recipe];
            localStorage.setItem('resepKopiData', JSON.stringify(updatedRecipes));
            
            // Notify other tabs
            window.dispatchEvent(new Event('storage'));

            toast({
                title: "Impor Berhasil!",
                description: `Resep "${recipe.name}" telah ditambahkan ke koleksi Anda.`,
            });

        } catch (error) {
            console.error("Gagal mengimpor resep:", error);
            toast({ variant: "destructive", title: "Gagal Impor", description: "Terjadi kesalahan saat menyimpan resep." });
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' || isGenerating) return;

        const userMessage: Message = { from: 'user', text: input };
        const loadingMessage: Message = { from: 'bot', isLoading: true };
        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setInput('');
        setIsGenerating(true);

        try {
            const recipe = await generateRecipe({ topic: input });
            const botMessage: Message = { from: 'bot', recipe };
            setMessages(prev => [...prev.slice(0, -1), botMessage]);
        } catch (error) {
            console.error('Error generating recipe:', error);
            const errorMessage: Message = { from: 'bot', text: 'Maaf, saya tidak dapat membuat resep saat ini. Coba lagi nanti.' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    };
    
    if (!isClient) {
        return null;
    }

    const RecipeCard = ({ recipe, isCopied }: { recipe: CoffeeRecipe, isCopied: boolean }) => (
        <div className="border bg-card p-4 rounded-lg text-sm text-foreground w-full max-w-sm">
            <h4 className="font-bold text-primary font-headline">{recipe.name}</h4>
            <p className="text-muted-foreground italic mb-2">{recipe.description}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 my-2">
                <p><span className="font-semibold">Rasa:</span> {recipe.taste}</p>
                <p><span className="font-semibold">Aroma:</span> {recipe.aroma}</p>
                <p><span className="font-semibold">Biji:</span> {recipe.beansUsed}</p>
                <p><span className="font-semibold">Asal:</span> {recipe.category}</p>
            </div>
            <h5 className="font-semibold mt-3 mb-1">Langkah-langkah:</h5>
            <ol className="list-decimal list-inside space-y-1">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <div className="flex gap-2 mt-4">
                 <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(recipe)}>
                    {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Clipboard className="w-4 h-4 mr-2" />}
                    {isCopied ? 'Disalin' : 'Salin JSON'}
                </Button>
                <Button size="sm" onClick={() => handleImportRecipe(recipe)}>
                   <UploadCloud className="w-4 h-4 mr-2"/>
                    Impor Resep Ini
                </Button>
            </div>
        </div>
    );
    
    const LoadingBubble = () => (
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-primary" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse bg-primary" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full animate-pulse bg-primary" style={{ animationDelay: '0.4s' }}></div>
        </div>
    )

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in bg-background">
            <div className="w-full max-w-lg mx-auto">
                <Card className="bg-card/90 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden flex flex-col h-[80vh]">
                     <CardHeader className="p-4 border-b border-primary/10 flex-shrink-0">
                        <div className="flex items-center">
                             <Link href="/admin" passHref>
                                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 mr-2">
                                    <ArrowLeft />
                                </Button>
                            </Link>
                             <div className="text-left flex-grow">
                                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                                    <Sparkles/>
                                    Asisten Kopi AI
                                </CardTitle>
                                <CardDescription className="font-body text-sm text-foreground/80 flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                    Minta saya untuk membuatkan resep kopi!
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow overflow-y-auto flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.from === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'}`}>
                                    {msg.isLoading && <LoadingBubble />}
                                    {msg.text && <p className="text-sm">{msg.text}</p>}
                                    {msg.recipe && <RecipeCard recipe={msg.recipe} isCopied={!!copiedStates[msg.recipe.id]} />}
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </CardContent>
                    <div className="p-4 border-t border-primary/10 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            <Input 
                                placeholder="Contoh: Buatkan resep es kopi susu gula aren..." 
                                className="flex-grow" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isGenerating}
                            />
                            <Button size="icon" onClick={handleSend} disabled={isGenerating}>
                                <Send />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}

