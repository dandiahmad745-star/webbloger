
export type Utensil = {
    name: string;
    description: string;
    icon: string;
};

export type CoffeeRecipe = {
    id: string;
    name: string;
    description: string;
    taste: string;
    aroma: string;
    category: string;
    beansUsed: string;
    instructions: string[];
    imageId: string;
}

export const staticData = {
    mainPage: {
        name: "Arul Faathir",
        tagline: "Secangkir Semangat, Sejuta Cerita",
        bio: "Menjelajahi dunia rasa dari biji kopi pilihan. Temukan cerita di setiap cangkir dan mari nikmati perjalanan aromatik ini bersama.",
        contactEmail: "halo@kopi.com",
        chatWelcome: "Halo! Ada yang bisa saya bantu seputar kopi hari ini?",
        secretMessage: {
            title: "Sebuah Pesan Untukmu",
            content: "Terima kasih telah menemukan ini. Kamu adalah penjelajah sejati, sama seperti caramu menikmati setiap lapisan rasa dalam secangkir kopi. Teruslah mencari dan menemukan keajaiban di tempat-tempat tak terduga."
        }
    },
    kisahSaya: {
        title: "Kisah Saya",
        description: "Perjalanan Pribadi dalam Dunia Kopi",
        imageId: "barista-story",
        paragraphs: [
            "Kecintaan saya pada kopi dimulai dari sebuah kedai kecil di sudut kota, di mana aroma biji kopi yang baru disangrai pertama kali menyapa indra saya. Momen itu bukan hanya tentang minuman, tetapi tentang sebuah pengalaman—kehangatan, komunitas, dan seni.",
            "Dari sana, saya memulai perjalanan untuk belajar. Saya menghabiskan waktu bertahun-tahun mengunjungi perkebunan, berbicara dengan para petani, belajar dari para roaster ahli, dan bereksperimen dengan setiap metode seduh yang bisa saya temukan. Kopi menjadi hasrat, obsesi, dan akhirnya, jalan hidup saya.",
            "Melalui \"BioLink Elegance\" ini, saya ingin berbagi sebagian kecil dari perjalanan itu dengan Anda. Setiap tautan adalah sebuah bab dari cerita saya, sebuah undangan untuk menjelajahi dunia kopi melalui mata saya. Terima kasih telah menjadi bagian dari kisah ini."
        ]
    },
    utensils: {
        title: "Coffee Utensils",
        description: "Peralatan untuk Secangkir Kopi Sempurna",
        imageId: "coffee-utensils",
        items: [
            { name: "V60 Dripper", description: "Metode pour-over klasik untuk secangkir kopi yang jernih dan bersih.", icon: "Wind" },
            { name: "Aeropress", description: "Alat serbaguna yang menghasilkan kopi kaya rasa dengan tingkat keasaman rendah.", icon: "Coffee" },
            { name: "French Press", description: "Metode rendam yang menghasilkan kopi dengan body penuh dan tekstur yang kaya.", icon: "Droplets" },
        ] as Utensil[]
    },
    pesanRahasia: {
        title: "Pesan Rahasia",
        message: "Ini adalah pesan rahasia. Hanya untuk mata Anda.",
        imageId: "profile-picture",
    },
    playlistSaya: {
        title: "Playlist Saya",
        description: "Beberapa lagu yang menemani secangkir kopi.",
        imageId: "coffee-journey",
        songs: [] as { title: string; artist: string; audioUrl: string }[],
    },
    resepKopi: [
        {
            id: 'espresso-sempurna',
            name: 'Espresso Sempurna',
            description: 'Dasar dari semua minuman kopi, espresso yang kaya dan pekat.',
            taste: 'Pahit, manis, dengan sedikit asam',
            aroma: 'Karamel, cokelat, dan bunga',
            category: 'Italia',
            beansUsed: 'Biji Arabica Gayo',
            instructions: [
                'Giling 18-20 gram biji kopi dengan kehalusan seperti gula pasir.',
                'Ratakan dan padatkan bubuk kopi (tamping) di dalam portafilter.',
                'Pasang portafilter ke mesin espresso.',
                'Ekstrak selama 25-30 detik untuk menghasilkan sekitar 30-40 ml espresso.',
                'Sajikan segera dan nikmati crema emasnya.'
            ],
            imageId: 'espresso-shot'
        }
    ] as CoffeeRecipe[]
}
