
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Coffee, BookOpen, Utensils, Mail, MessageCircle, Lock, Music } from "lucide-react";

import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import Link from "next/link";
import { staticData as initialStaticData } from "./data-statis";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<ImagePlaceholder | undefined>(PlaceHolderImages.find(p => p.id === 'profile-picture'));
  const [pageData, setPageData] = useState(initialStaticData.mainPage);

  useEffect(() => {
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
        setProfilePic(PlaceHolderImages.find(p => p.id === 'profile-picture'));
    }
  }, []);

  const socialLinks = [
    { name: "Learn Coffee", url: "/learn-coffee", icon: Coffee },
    { name: "Kisah Saya", url: "/kisah-saya", icon: BookOpen },
    { name: "learn coffee utensils", url: "/learn-coffee-utensils", icon: Utensils },
    { name: "Pesan Rahasia", url: "/pesan-rahasia", icon: Lock },
    { name: "Playlist Saya", url: "/playlist-saya", icon: Music },
    { name: "Hubungi Saya", url: `mailto:${pageData.contactEmail}`, icon: Mail },
    { name: "Ngobrol", url: "/ngobrol", icon: MessageCircle },
  ];

  if (isLoading) {
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

                const buttonComponent = (
                  <Button
                    variant="default"
                    className="w-full justify-start h-14 text-lg bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-[1.03] shadow-md hover:shadow-lg hover:shadow-accent/20"
                    aria-label={isExternal ? `Visit my ${link.name}` : `Go to ${link.name}`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    <span>{link.name}</span>
                  </Button>
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
                      {buttonComponent}
                    </a>
                  );
                }

                return (
                  <Link key={link.name} href={link.url} passHref legacyBehavior={false} className="w-full">
                    {buttonComponent}
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
