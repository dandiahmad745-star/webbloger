
'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { worldRegions } from '@/lib/world-regions';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type FilterContextType = {
    filter: string;
    setFilter: (filter: string) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function RecipeFilterProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('filter') || 'Semua';
    const [filter, setFilterState] = useState(initialFilter);

    const setFilter = (newFilter: string) => {
        setFilterState(newFilter);
        const params = new URLSearchParams(searchParams.toString());
        params.set('filter', newFilter);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const contextValue = useMemo(() => ({ filter, setFilter }), [filter, setFilter]);

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a RecipeFilterProvider');
    }
    return context;
}

export function RecipeFilterDropdown() {
    const { filter, setFilter } = useFilter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter: {filter}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Filter berdasarkan Wilayah</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setFilter('Semua')}>Semua</DropdownMenuItem>
                 {worldRegions.map(continent => (
                    <DropdownMenuSub key={continent.name}>
                        <DropdownMenuSubTrigger>{continent.name}</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {continent.countries.map(country => (
                                    <DropdownMenuItem key={country.name} onSelect={() => setFilter(country.name)}>
                                        {country.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                 ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
