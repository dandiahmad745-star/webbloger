
import { getStore } from '@netlify/blobs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { defaultData } from '@/app/data-statis';

const dataKeySchema = z.enum([
    'mainPageData',
    'kisahSayaData',
    'utensilsData',
    'playlistSayaData',
    'resepKopiData',
    'faqData',
    'coffeeBeansData',
    'userImages'
]);

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const keyResult = dataKeySchema.safeParse(searchParams.get('key'));
    
    if (!keyResult.success) {
        return NextResponse.json({ error: 'Invalid data key provided' }, { status: 400 });
    }
    const key = keyResult.data;
    
    try {
        const store = getStore('appData');
        const data = await store.get(key, { type: 'json' });

        if (data === undefined || data === null) {
            // If no data in blob, return default data
            const fallbackData = defaultData[key as keyof typeof defaultData];
            return NextResponse.json(fallbackData);
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data from blob store:', error);
        // Fallback to default data in case of blob store error in production
        const fallbackData = defaultData[key as keyof typeof defaultData];
        return NextResponse.json(fallbackData);
    }
}

export const POST = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const keyResult = dataKeySchema.safeParse(searchParams.get('key'));

    if (!keyResult.success) {
        return NextResponse.json({ error: 'Invalid data key provided' }, { status: 400 });
    }
    const key = keyResult.data;

    try {
        const body = await request.json();
        const store = getStore('appData');
        await store.setJSON(key, body);

        return NextResponse.json({ success: true, message: `Data for ${key} saved successfully.` });
    } catch (error) {
        console.error(`Error saving data for ${key}:`, error);
        return NextResponse.json({ error: `Failed to save data for ${key}` }, { status: 500 });
    }
};
