export const WHATSAPP_NUMBER = "923057774444"; // 0305-7774444 in international format
export const PHONE_DISPLAY = "0305-7774444";
export const PHONE_TEL = "+923057774444";
export const OPEN_HOUR = 12; // ASSUMPTION: opening time is not in the blueprint
export const WEEKEND_NIGHTS = [5, 6]; // Fri & Sat nights close at 2 AM (0 = Sunday)
export const MAPS_QUERY = "Coconut Grove Karachi";

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const fmt = (n: number) => `Rs ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const CATEGORIES = [
  "BBQ", "Steaks & Continental", "Pan-Asian", "Gourmet Pizza", "Desserts", "Mocktails",
] as const;
export type Category = (typeof CATEGORIES)[number];
export type Badge = "Chef's Signature" | "Most Ordered" | "Spicy";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number; // PKR
  category: Category;
  image: string;
  badges: Badge[];
  ingredients: string[];
}

const d = (
  id: string, name: string, category: Category, price: number, photo: string,
  description: string, ingredients: string[], badges: Badge[] = [],
): Dish => ({ id, name, category, price, image: unsplash(photo, 800), description, ingredients, badges });

export const DISHES: Dish[] = [
  d("bbq-1", "Charcoal Malai Boti", "BBQ", 1450, "photo-1555939594-58d7cb561ad1", "Cream-marinated chicken, kissed by live charcoal and finished with smoked butter.", ["Chicken thigh", "Cream", "Green cardamom", "Smoked butter"], ["Most Ordered"]),
  d("bbq-2", "Grove Lamb Ribs", "BBQ", 2650, "photo-1529193591184-b1d58069ecdd", "Slow-rested lamb ribs glazed with pomegranate molasses and black pepper.", ["Lamb ribs", "Pomegranate molasses", "Black pepper", "Garlic"], ["Chef's Signature"]),
  d("bbq-3", "Fiery Seekh Platter", "BBQ", 1750, "photo-1544025162-d76694265947", "Hand-minced beef seekh with green chilli chutney and charred onions.", ["Beef mince", "Green chilli", "Coriander", "Charred onion"], ["Spicy"]),
  d("st-1", "Wagyu Ribeye 250g", "Steaks & Continental", 5200, "photo-1600891964092-4316c288032e", "Wagyu ribeye seared in cultured butter, served with peppercorn jus.", ["Wagyu ribeye", "Cultured butter", "Peppercorn jus", "Thyme"], ["Chef's Signature"]),
  d("st-2", "Garden Herb Chicken", "Steaks & Continental", 2400, "photo-1546833999-b9f581a1996d", "Roasted chicken breast over herb mash with a lemon-thyme cream.", ["Chicken breast", "Potato mash", "Lemon", "Thyme cream"]),
  d("st-3", "Creamy Mushroom Fillet", "Steaks & Continental", 3600, "photo-1558030006-450675393462", "Tenderloin fillet with wild mushroom cream and crisp shallots.", ["Beef tenderloin", "Wild mushrooms", "Cream", "Shallots"], ["Most Ordered"]),
  d("pa-1", "Smoky Tonkotsu Ramen", "Pan-Asian", 1850, "photo-1569718212165-3a8278d5f624", "Twelve-hour broth, chilli oil, soft egg and charred scallion.", ["Pork broth", "Ramen noodles", "Soft egg", "Chilli oil"], ["Spicy"]),
  d("pa-2", "Wok-Fired Garlic Rice", "Pan-Asian", 1250, "photo-1512058564366-18510be2db19", "Jasmine rice tossed at high heat with garlic, spring onion and sesame.", ["Jasmine rice", "Garlic", "Spring onion", "Sesame oil"]),
  d("pa-3", "Prawn Dim Sum Basket", "Pan-Asian", 1650, "photo-1496116218417-1a781b1c416c", "Steamed prawn dumplings with ginger-soy dip.", ["Prawn", "Wonton wrapper", "Ginger", "Soy"], ["Most Ordered"]),
  d("pz-1", "Truffle Burrata Pizza", "Gourmet Pizza", 2300, "photo-1565299624946-b28f40a0ae38", "Wood-fired base, burrata, wild mushrooms and black truffle oil.", ["Sourdough base", "Burrata", "Mushrooms", "Truffle oil"], ["Chef's Signature"]),
  d("pz-2", "Diavola Honey", "Gourmet Pizza", 1950, "photo-1513104890138-7c749659a591", "Spicy salami, fior di latte and a swirl of hot honey.", ["Salami", "Fior di latte", "Chilli", "Hot honey"], ["Spicy"]),
  d("pz-3", "Margherita Fresca", "Gourmet Pizza", 1650, "photo-1574071318508-1cdbab80d002", "San Marzano tomato, buffalo mozzarella and basil from our garden.", ["Tomato", "Mozzarella", "Basil", "Olive oil"], ["Most Ordered"]),
  d("ds-1", "Coconut Panna Cotta", "Desserts", 1150, "photo-1488477181946-6428a0291777", "Silky coconut cream set over passion fruit and toasted flakes.", ["Coconut cream", "Passion fruit", "Toasted coconut"], ["Chef's Signature"]),
  d("ds-2", "Molten Gold Cake", "Desserts", 1350, "photo-1578985545062-69928b1d9587", "Warm dark chocolate cake with a salted caramel centre.", ["Dark chocolate", "Salted caramel", "Vanilla gelato"], ["Most Ordered"]),
  d("ds-3", "Mango Sticky Rice", "Desserts", 1050, "photo-1551024601-bec78aea704b", "Sweet coconut rice with ripe Sindhri mango.", ["Sticky rice", "Mango", "Coconut milk"]),
  d("mk-1", "Grove Sunset", "Mocktails", 850, "photo-1544145945-f90425340c7e", "Orange, pomegranate and mint over crushed ice.", ["Orange", "Pomegranate", "Mint", "Soda"], ["Most Ordered"]),
  d("mk-2", "Coconut Mojito", "Mocktails", 900, "photo-1470337458703-46ad1756a187", "Fresh lime, mint and coconut water with a splash of cream.", ["Lime", "Mint", "Coconut water", "Cream"], ["Chef's Signature"]),
  d("mk-3", "Chilli Guava Cooler", "Mocktails", 800, "photo-1513558161293-cdaf765ed2fd", "Pink guava with a thread of green chilli heat.", ["Guava", "Green chilli", "Lime", "Black salt"], ["Spicy"]),
];

export const HERO_VIDEO = ""; // optional: paste an .mp4 URL (drone loop) to play behind the image reel
export const HERO_IMAGES = [
  unsplash("photo-1470246973918-29a93221c455", 2000),
  unsplash("photo-1414235077428-338989a2e8c0", 2000),
  unsplash("photo-1519167758481-83f550bb49b3", 2000),
];

export const GALLERY = [
  { title: "Garden cabanas", caption: "Private canopies under a ceiling of fairy lights.", image: unsplash("photo-1519167758481-83f550bb49b3", 1000) },
  { title: "Palm-lined paths", caption: "A quiet walk to your table, past tropical foliage.", image: unsplash("photo-1559628233-100c798642d4", 1000) },
  { title: "Indoor dining", caption: "Climate-controlled warmth with garden views.", image: unsplash("photo-1517248135467-4c7edcad34c4", 1000) },
  { title: "The grill", caption: "Live charcoal, in sight and in scent.", image: unsplash("photo-1555939594-58d7cb561ad1", 1000) },
  { title: "Private lounge", caption: "Secluded seating for family gatherings.", image: unsplash("photo-1559339352-11d035aa65de", 1000) },
];

export const DAY_IMAGE = unsplash("photo-1501785888041-af3ef285b470", 1600);
export const NIGHT_IMAGE = unsplash("photo-1478146059778-26028b07395a", 1600);

export const ZONES = [
  { id: "Garden Cabana", blurb: "Open-air, under fairy lights", image: unsplash("photo-1470246973918-29a93221c455", 700) },
  { id: "Indoor Dining", blurb: "Climate-controlled, cozy interior", image: unsplash("photo-1517248135467-4c7edcad34c4", 700) },
  { id: "Private Lounge", blurb: "Secluded seating for groups", image: unsplash("photo-1559339352-11d035aa65de", 700) },
] as const;
export type ZoneId = (typeof ZONES)[number]["id"];

export const TIME_SLOTS = [
  "12:30 PM", "1:30 PM", "2:30 PM", "6:00 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM", "11:00 PM",
];

export const HOURS = [
  { days: "Sunday to Thursday", time: "12:00 PM to 1:00 AM" },
  { days: "Friday and Saturday", time: "12:00 PM to 2:00 AM" },
];
