
export type City = {
    name: string;
};

export type Country = {
    name: string;
    cities: City[];
};

export type Continent = {
    name: string;
    countries: Country[];
}

export const worldRegions: Continent[] = [
    {
        name: 'Afrika',
        countries: [
            { name: 'Angola', cities: [{ name: 'Luanda' }, { name: 'Huambo' }] },
            { name: 'Burundi', cities: [{ name: 'Bujumbura' }, { name: 'Gitega' }] },
            { name: 'Kamerun', cities: [{ name: 'Douala' }, { name: 'Yaoundé' }] },
            { name: 'Republik Afrika Tengah', cities: [{ name: 'Bangui' }] },
            { name: 'Kongo', cities: [{ name: 'Kinshasa' }, { name: 'Lubumbashi' }] },
            { name: 'Pantai Gading', cities: [{ name: 'Yamoussoukro' }, { name: 'Abidjan' }] },
            { name: 'Ethiopia', cities: [{ name: 'Addis Ababa' }, { name: 'Sidamo' }, { name: 'Yirgacheffe' }] },
            { name: 'Gabon', cities: [{ name: 'Libreville' }] },
            { name: 'Ghana', cities: [{ name: 'Accra' }] },
            { name: 'Guinea', cities: [{ name: 'Conakry' }] },
            { name: 'Kenya', cities: [{ name: 'Nairobi' }, { name: 'Mombasa' }] },
            { name: 'Liberia', cities: [{ name: 'Monrovia' }] },
            { name: 'Madagaskar', cities: [{ name: 'Antananarivo' }] },
            { name: 'Malawi', cities: [{ name: 'Lilongwe' }, { name: 'Blantyre' }] },
            { name: 'Mozambik', cities: [{ name: 'Maputo' }] },
            { name: 'Nigeria', cities: [{ name: 'Lagos' }, { name: 'Abuja' }] },
            { name: 'Rwanda', cities: [{ name: 'Kigali' }] },
            { name: 'Sierra Leone', cities: [{ name: 'Freetown' }] },
            { name: 'Tanzania', cities: [{ name: 'Dodoma' }, { name: 'Dar es Salaam' }] },
            { name: 'Togo', cities: [{ name: 'Lomé' }] },
            { name: 'Uganda', cities: [{ name: 'Kampala' }] },
            { name: 'Zambia', cities: [{ name: 'Lusaka' }] },
            { name: 'Zimbabwe', cities: [{ name: 'Harare' }] },
        ]
    },
    {
        name: 'Asia',
        countries: [
            { name: 'Brunei', cities: [{ name: 'Bandar Seri Begawan' }, { name: 'Kuala Belait' }, { name: 'Seria' }] },
            { name: 'Kamboja', cities: [{ name: 'Phnom Penh' }, { name: 'Siem Reap' }, { name: 'Battambang' }] },
            { name: 'Cina', cities: [{ name: 'Beijing' }, { name: 'Shanghai' }, { name: 'Yunnan' }] },
            { name: 'India', cities: [{ name: 'New Delhi' }, { name: 'Mumbai' }, { name: 'Karnataka' }, { name: 'Kerala' }] },
            { name: 'Indonesia', cities: [{ name: 'Aceh' }, { name: 'Bali' }, { name: 'Flores' }, { name: 'Jawa Barat' }, { name: 'Jawa Tengah' }, { name: 'Jawa Timur' }, { name: 'Kalimantan' }, { name: 'Lampung' }, { name: 'Papua' }, { name: 'Sulawesi' }, { name: 'Sumatera' }] },
            { name: 'Laos', cities: [{ name: 'Vientiane' }, { name: 'Luang Prabang' }, { name: 'Bolaven Plateau' }] },
            { name: 'Malaysia', cities: [{ name: 'Kuala Lumpur' }, { name: 'Penang' }, { name: 'Cameron Highlands' }] },
            { name: 'Myanmar', cities: [{ name: 'Naypyidaw' }, { name: 'Yangon' }, { name: 'Mandalay' }] },
            { name: 'Nepal', cities: [{ name: 'Kathmandu' }] },
            { name: 'Filipina', cities: [{ name: 'Manila' }, { name: 'Cebu' }, { name: 'Davao' }, { name: 'Benguet' }] },
            { name: 'Sri Lanka', cities: [{ name: 'Colombo' }] },
            { name: 'Taiwan', cities: [{ name: 'Taipei' }] },
            { name: 'Thailand', cities: [{ name: 'Bangkok' }, { name: 'Chiang Mai' }, { name: 'Chiang Rai' }] },
            { name: 'Timor-Leste', cities: [{ name: 'Dili' }, { name: 'Ainaro' }, { name: 'Ermera' }] },
            { name: 'Vietnam', cities: [{ name: 'Hanoi' }, { name: 'Ho Chi Minh City' }, { name: 'Da Lat' }] },
            { name: 'Yaman', cities: [{ name: 'Sana\'a' }] },
        ]
    },
    {
        name: 'Eropa',
        countries: [
            { name: 'Italia', cities: [{ name: 'Roma' }, { name: 'Milan' }, { name: 'Naples' }] },
            // Menambahkan negara Eropa utama lainnya untuk kelengkapan
            { name: 'Prancis', cities: [{ name: 'Paris' }, { name: 'Marseille' }, { name: 'Lyon' }] },
            { name: 'Jerman', cities: [{ name: 'Berlin' }, { name: 'Hamburg' }, { name: 'Munich' }] },
            { name: 'Spanyol', cities: [{ name: 'Madrid' }, { name: 'Barcelona' }] },
            { name: 'Inggris', cities: [{ name: 'London' }, { name: 'Manchester' }] },
        ]
    },
    {
        name: 'Amerika Utara',
        countries: [
            { name: 'Kanada', cities: [{ name: 'Ottawa' }, { name: 'Toronto' }, { name: 'Vancouver' }] },
            { name: 'Kosta Rika', cities: [{ name: 'San José' }, { name: 'Tarrazú' }] },
            { name: 'Kuba', cities: [{ name: 'Havana' }] },
            { name: 'Republik Dominika', cities: [{ name: 'Santo Domingo' }] },
            { name: 'El Salvador', cities: [{ name: 'San Salvador' }] },
            { name: 'Guatemala', cities: [{ name: 'Guatemala City' }, { name: 'Antigua' }] },
            { name: 'Haiti', cities: [{ name: 'Port-au-Prince' }] },
            { name: 'Honduras', cities: [{ name: 'Tegucigalpa' }] },
            { name: 'Jamaika', cities: [{ name: 'Kingston' }, { name: 'Blue Mountains' }] },
            { name: 'Meksiko', cities: [{ name: 'Mexico City' }, { name: 'Chiapas' }, { name: 'Veracruz' }] },
            { name: 'Nikaragua', cities: [{ name: 'Managua' }] },
            { name: 'Panama', cities: [{ name: 'Panama City' }] },
            { name: 'Puerto Riko', cities: [{ name: 'San Juan' }] },
            { name: 'Amerika Serikat', cities: [{ name: 'Washington, D.C.' }, { name: 'New York' }, { name: 'California' }, { name: 'Hawaii (Kona)' }] },
        ]
    },
    {
        name: 'Amerika Selatan',
        countries: [
            { name: 'Argentina', cities: [{ name: 'Buenos Aires' }] },
            { name: 'Bolivia', cities: [{ name: 'Sucre' }, { name: 'La Paz' }] },
            { name: 'Brazil', cities: [{ name: 'Brasília' }, { name: 'São Paulo' }, { name: 'Minas Gerais' }] },
            { name: 'Kolombia', cities: [{ name: 'Bogotá' }, { name: 'Medellín' }, { name: 'Huila' }] },
            { name: 'Ekuador', cities: [{ name: 'Quito' }, { name: 'Galápagos' }] },
            { name: 'Guyana', cities: [{ name: 'Georgetown' }] },
            { name: 'Paraguay', cities: [{ name: 'Asunción' }] },
            { name: 'Peru', cities: [{ name: 'Lima' }, { name: 'Cajamarca' }] },
            { name: 'Suriname', cities: [{ name: 'Paramaribo' }] },
            { name: 'Venezuela', cities: [{ name: 'Caracas' }] },
        ]
    },
    {
        name: 'Oseania',
        countries: [
            { name: 'Australia', cities: [{ name: 'Canberra' }, { name: 'Sydney' }, { name: 'Melbourne' }] },
            { name: 'Fiji', cities: [{ name: 'Suva' }] },
            { name: 'Selandia Baru', cities: [{ name: 'Wellington' }, { name: 'Auckland' }] },
            { name: 'Papua Nugini', cities: [{ name: 'Port Moresby' }] },
            { name: 'Samoa', cities: [{ name: 'Apia' }] },
            { name: 'Vanuatu', cities: [{ name: 'Port Vila' }] },
        ]
    }
];

// Helper untuk mendapatkan semua negara untuk dropdown
export const allCountries = worldRegions.flatMap(continent => continent.countries);
