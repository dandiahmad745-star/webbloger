
export type Utensil = {
    name: string;
    description: string;
    icon: string;
};

export const staticData = {
    mainPage: {
        name: "Arul Faathir",
        tagline: "Secangkir Semangat, Sejuta Cerita",
        bio: "Menjelajahi dunia rasa dari biji kopi pilihan. Temukan cerita di setiap cangkir dan mari nikmati perjalanan aromatik ini bersama.",
        contactEmail: "halo@kopi.com",
        chatWelcome: "Halo! Ada yang bisa saya bantu seputar kopi hari ini?",
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
    }
}
