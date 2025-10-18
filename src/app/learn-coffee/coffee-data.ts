
export type CoffeeBean = {
  id: string;
  name: string;
  origin: string;
  type: 'Arabica' | 'Robusta' | 'Liberica';
  description: string;
  rating: number; // 1-5
  imageId: string;
};

export const coffeeBeans: CoffeeBean[] = [
  {
    id: 'gayo-aceh',
    name: 'Gayo Aceh',
    origin: 'Aceh, Indonesia',
    type: 'Arabica',
    description: 'Dikenal dengan body yang kuat, keasaman seimbang, dan sentuhan rasa rempah, cokelat, serta buah-buahan.',
    rating: 5,
    imageId: 'gayo-beans'
  },
  {
    id: 'kintamani-bali',
    name: 'Kintamani Bali',
    origin: 'Bali, Indonesia',
    type: 'Arabica',
    description: 'Memiliki karakter rasa yang segar dan fruity, terutama aroma jeruk dengan tingkat keasaman yang cerah dan bersih.',
    rating: 4,
    imageId: 'kintamani-beans'
  },
  {
    id: 'sidamo-ethiopia',
    name: 'Sidamo Ethiopia',
    origin: 'Sidamo, Ethiopia',
    type: 'Arabica',
    description: 'Menawarkan kompleksitas rasa bunga dan sitrus, seringkali dengan aftertaste cokelat atau anggur yang lembut.',
    rating: 5,
    imageId: 'sidamo-beans'
  },
  {
    id: 'lampung',
    name: 'Lampung',
    origin: 'Lampung, Indonesia',
    type: 'Robusta',
    description: 'Kopi robusta berkualitas tinggi dengan cita rasa pahit yang kuat, body tebal, dan aroma cokelat pekat.',
    rating: 4,
    imageId: 'lampung-beans'
  },
   {
    id: 'colombia-supremo',
    name: 'Colombia Supremo',
    origin: 'Colombia',
    type: 'Arabica',
    description: 'Keseimbangan sempurna antara keasaman, kelembutan, dan rasa kacang-kacangan dengan sedikit sentuhan sitrus.',
    rating: 4,
    imageId: 'colombia-beans'
  },
  {
    id: 'java-preanger',
    name: 'Java Preanger',
    origin: 'Jawa Barat, Indonesia',
    type: 'Arabica',
    description: 'Salah satu kopi tertua di Indonesia dengan aroma rempah yang khas, body sedang, dan keasaman yang rendah.',
    rating: 4,
    imageId: 'java-beans'
  },
];
