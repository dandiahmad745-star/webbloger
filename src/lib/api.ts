

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
    // During a build, process.env.NEXT_PUBLIC_BASE_URL might not be available or correct.
    // Also, making a fetch call to itself during SSG is an anti-pattern.
    // The proper way is to have direct access to the data source.
    // Since our "database" is Netlify Blobs, we can't access it directly here without Admin credentials.
    // The workaround is to try fetching, but if it fails (like in a build environment), use the static fallback.
    // This allows the page to be built statically. At runtime, the client-side fetch will get the fresh data.
    try {
        if (typeof window !== 'undefined') {
            // Client-side execution, fetch from the relative API endpoint
             const res = await fetch(`/api/data?key=${key}`);
             if (!res.ok) {
                console.error(`Failed to fetch client-side data for key: ${key}. Status: ${res.status}`);
                return fallback;
            }
            return res.json();
        }

        // Server-side execution (during build or SSR)
        const baseUrl = process.env.URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
        
        // In a real build environment (like Netlify), there is no localhost:9002 running.
        // This fetch will fail, and we will fall back to static data, allowing the build to succeed.
        const res = await fetch(`${baseUrl}/api/data?key=${key}`);

        if (!res.ok) {
            console.warn(`Could not fetch server data for '${key}' during build. Using fallback data.`);
            return fallback;
        }
        return res.json();
    } catch (error) {
        console.warn(`Error in fetchServerData for key: ${key}. Using fallback data. Error: ${error}`);
        return fallback;
    }
};
