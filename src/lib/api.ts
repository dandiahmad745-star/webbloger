
export const fetcher = (url: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    return fetch(absoluteUrl).then(res => {
        if (!res.ok) {
            console.error(`Failed to fetch ${absoluteUrl}`, { status: res.status, statusText: res.statusText });
            throw new Error('An error occurred while fetching the data.');
        }
        return res.json();
    });
};

export const postData = async (key: string, data: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/data?key=${key}`, {
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
        const baseUrl = process.env.URL || process.env.NEXT_PUBLIC_BASE_URL;

        if (!baseUrl) {
            console.warn(`Base URL not found for '${key}'. Using fallback data for build.`);
            return fallback;
        }

        const res = await fetch(`${baseUrl}/api/data?key=${key}`, { next: { revalidate: 3600 } });

        if (!res.ok) {
            console.warn(`Could not fetch server data for '${key}' during build (Status: ${res.status}). Using fallback data.`);
            return fallback;
        }
        return res.json();
    } catch (error) {
        console.warn(`Error in fetchServerData for key: ${key}. Using fallback data. Error: ${error}`);
        return fallback;
    }
};
