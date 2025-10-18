
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Coffee, BookOpen, Utensils, Mail, MessageCircle, Lock, Music } from "lucide-react";

import { LoadingScreen } from "@/components/loading-screen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Link from "next/link";
import { staticData as initialStaticData } from "./data-statis";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<ImagePlaceholder | undefined>(PlaceHolderImages.find(p => p.id === 'profile-picture'));
  const [pageData, setPageData] = useState(initialStaticData.mainPage);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on the client
    setIsClient(true);
    
    const loadData = () => {
       try {
        const savedUserImages = localStorage.getItem('userImages');
        const savedSettings = localStorage.getItem('mainPageData');

        const allImages = [...PlaceHolderImages];
        if (savedUserImages) {
            allImages.push(...JSON.parse(savedUserImages));
        }
        
        if (savedSettings) {
            setPageData(JSON.parse(savedSettings));
        }

        const pic = allImages.find(p => p.id === 'profile-picture');
        setProfilePic(pic);
      } catch (e) {
          console.error("Failed to load from local storage", e);
          // Fallback to initial data if localStorage fails
          setProfilePic(PlaceHolderImages.find(p => p.id === 'profile-picture'));
      }
    }
    
    loadData();
    
    const handleStorageChange = () => {
        loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const loadingTimer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearTimeout(loadingTimer);
    };
  }, []);

  const socialLinks = [
    { name: "Learn Coffee", description: "Jelajahi berbagai jenis biji kopi.", url: "/learn-coffee", icon: Coffee },
    { name: "Kisah Saya", description: "Perjalanan saya dalam dunia kopi.", url: "/kisah-saya", icon: BookOpen },
    { name: "Peralatan Kopi", description: "Alat-alat untuk secangkir kopi sempurna.", url: "/learn-coffee-utensils", icon: Utensils },
    { name: "Pesan Rahasia", description: "Sebuah catatan khusus untuk Anda.", url: "/pesan-rahasia", icon: Lock },
    { name: "Playlist Saya", description: "Lagu-lagu yang menemani secangkir kopi.", url: "/playlist-saya", icon: Music },
    { name: "Hubungi Saya", description: "Kirimkan saya email untuk kolaborasi.", url: `mailto:${pageData.contactEmail}`, icon: Mail },
    { name: "Ngobrol", description: "Mari berbincang santai tentang kopi.", url: "/ngobrol", icon: MessageCircle },
  ];

  if (!isClient || isLoading) {
    return <LoadingScreen onLoaded={() => setIsLoading(false)} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 fade-in">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5 rounded-2xl overflow-hidden">
          <CardHeader className="items-center text-center p-6 md:p-8">
            {profilePic && (
              <Image
                src={profilePic.imageUrl}
                alt={profilePic.description}
                data-ai-hint={profilePic.imageHint}
                width={128}
                height={128}
                className="rounded-full border-4 border-accent mb-4 shadow-lg"
                priority
              />
            )}
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
              {pageData.name}
            </CardTitle>
            <CardDescription className="font-body text-base md:text-lg text-foreground/80 pt-2">
              {pageData.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0">
            <p className="text-center font-body text-foreground/90 mb-6">
              {pageData.bio}
            </p>
            <Separator className="my-6 bg-primary/10" />
            <div className="flex flex-col space-y-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                const isExternal = link.url.startsWith('mailto:');
                const displayName = link.name;

                const LinkContent = () => (
                    <div 
                        className={cn(
                            "group flex w-full items-center p-4 rounded-lg transition-all duration-300",
                            "bg-primary/5 hover:bg-primary/10 border border-primary/10"
                        )}
                    >
                        <Icon className="mr-4 h-8 w-8 text-accent/80 transition-colors group-hover:text-accent" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-base text-primary truncate">{displayName}</span>
                            <span className="text-sm font-normal text-foreground/70 truncate">{link.description}</span>
                        </div>
                    </div>
                );

                if (isExternal) {
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <LinkContent />
                    </a>
                  );
                }

                return (
                  <Link key={link.name} href={link.url} passHref className="w-full">
                     <LinkContent />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BioLink Elegance. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}
