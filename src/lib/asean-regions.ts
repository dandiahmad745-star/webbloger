
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
        ],
    },
    {
        name: 'Kamboja',
        cities: [
            { name: 'Phnom Penh' },
            { name: 'Siem Reap' },
            { name: 'Sihanoukville' },
            { name: 'Battambang' },
        ],
    },
    {
        name: 'Indonesia',
        cities: [
            { name: 'Aceh' },
            { name: 'Bali' },
            { name: 'Bandung' },
            { name: 'Flores' },
            { name: 'Jakarta' },
            { name: 'Jawa' },
            { name: 'Lampung' },
            { name: 'Medan' },
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
        ],
    },
    {
        name: 'Myanmar',
        cities: [
            { name: 'Yangon' },
            { name: 'Mandalay' },
            { name: 'Naypyidaw' },
        ],
    },
    {
        name: 'Filipina',
        cities: [
            { name: 'Manila' },
            { name: 'Cebu' },
            { name: 'Davao' },
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
        ],
    },
    {
        name: 'Timor-Leste',
        cities: [
            { name: 'Dili' }
        ],
    },
];

export const otherRegions = [
    { name: 'Italia' }
];
