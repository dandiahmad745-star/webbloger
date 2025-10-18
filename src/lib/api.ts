
export const fetcher = (url: string) => fetch(url).then(res => {
    if (!res.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
});

export const postData = async (key: string, data: any) => {
    const res = await fetch(`/api/data?key=${key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to post data');
    }

    return res.json();
};

export const fetchServerData = async <T>(key: string, fallback: T): Promise<T> => {
    try {
        // This is a direct fetch on the server, so we need the full URL.
        // In a real deployment, this would be an internal service call or direct DB access.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
        const res = await fetch(`${baseUrl}/api/data?key=${key}`, {
            cache: 'no-store' // Ensure fresh data on every server-side render
        });
        if (!res.ok) {
            console.error(`Failed to fetch server data for key: ${key}. Status: ${res.status}`);
            return fallback;
        }
        return res.json();
    } catch (error) {
        console.error(`Error in fetchServerData for key: ${key}`, error);
        return fallback;
    }
};
