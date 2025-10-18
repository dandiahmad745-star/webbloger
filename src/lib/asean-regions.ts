
export type City = {
    name: string;
};

export type Country = {
    name: string;
    cities: City[];
};

export const aseanCountries: Country[] = [
    {
        name: 'Brunei',
        cities: [
            { name: 'Bandar Seri Begawan' },
            { name: 'Kuala Belait' },
            { name: 'Seria' },
            { name: 'Tutong' },
            { name: 'Muara' },
        ],
    },
    {
        name: 'Kamboja',
        cities: [
            { name: 'Phnom Penh' },
            { name: 'Siem Reap' },
            { name: 'Sihanoukville' },
            { name: 'Battambang' },
            { name: 'Kampot' },
            { name: 'Kep' },
        ],
    },
    {
        name: 'Indonesia',
        cities: [
            { name: 'Aceh' },
            { name: 'Bali' },
            { name: 'Bandung' },
            { name: 'Bangka Belitung' },
            { name: 'Banten' },
            { name: 'Bengkulu' },
            { name: 'Bogor' },
            { name: 'Flores' },
            { name: 'Gayo' },
            { name: 'Gorontalo' },
            { name: 'Ijen' },
            { name: 'Jakarta' },
            { name: 'Jambi' },
            { name: 'Jawa Barat' },
            { name: 'Jawa Tengah' },
            { name: 'Jawa Timur' },
            { name: 'Kalimantan' },
            { name: 'Kintamani' },
            { name: 'Lampung' },
            { name: 'Lintong' },
            { name: 'Lombok' },
            { name: 'Makassar' },
            { name: 'Malang' },
            { name: 'Maluku' },
            { name: 'Mandailing' },
            { name: 'Medan' },
            { name: 'Padang' },
            { name: 'Palembang' },
            { name: 'Papua' },
            { name: 'Riau' },
            { name: 'Semarang' },
            { name: 'Sulawesi' },
            { name: 'Sumatera' },
            { name: 'Sumbawa' },
            { name: 'Surabaya' },
            { name: 'Toraja' },
            { name: 'Yogyakarta' },
        ],
    },
    {
        name: 'Laos',
        cities: [
            { name: 'Vientiane' },
            { name: 'Luang Prabang' },
            { name: 'Pakse' },
            { name: 'Savannakhet' },
            { name: 'Bolaven Plateau' },
        ],
    },
    {
        name: 'Malaysia',
        cities: [
            { name: 'Kuala Lumpur' },
            { name: 'Penang' },
            { name: 'Johor Bahru' },
            { name: 'Ipoh' },
            { name: 'Malaka' },
            { name: 'Cameron Highlands' },
            { name: 'Sabah' },
            { name: 'Sarawak' },
        ],
    },
    {
        name: 'Myanmar',
        cities: [
            { name: 'Yangon' },
            { name: 'Mandalay' },
            { name: 'Naypyidaw' },
            { name: 'Shan State' },
            { name: 'Bagan' },
        ],
    },
    {
        name: 'Filipina',
        cities: [
            { name: 'Manila' },
            { name: 'Cebu' },
            { name: 'Davao' },
            { name: 'Benguet' },
            { name: 'Sagada' },
            { name: 'Kalinga' },
        ],
    },
    {
        name: 'Singapura',
        cities: [
            { name: 'Singapura' }
        ],
    },
    {
        name: 'Thailand',
        cities: [
            { name: 'Bangkok' },
            { name: 'Chiang Mai' },
            { name: 'Chiang Rai' },
            { name: 'Phuket' },
            { name: 'Pattaya' },
        ],
    },
    {
        name: 'Vietnam',
        cities: [
            { name: 'Hanoi' },
            { name: 'Ho Chi Minh City' },
            { name: 'Da Nang' },
            { name: 'Da Lat' },
            { name: 'Buon Ma Thuot' },
        ],
    },
    {
        name: 'Timor-Leste',
        cities: [
            { name: 'Dili' },
            { name: 'Ainaro' },
            { name: 'Ermera' },
        ],
    },
];

export const otherRegions = [
    { name: 'Italia' }
];
