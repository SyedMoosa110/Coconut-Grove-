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
  "BBQ & Grills", "Steaks & Continental", "Pan-Asian", "Wood-Fired Pizza & Burgers", "Mocktails & Desserts",
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
): Dish => ({ id, name, category, price, image: unsplash(photo, 900), description, ingredients, badges });

export const DISHES: Dish[] = [
  // BBQ & Grills
  d("bbq-1", "Malai Boti", "BBQ & Grills", 1450, "photo-1555939594-58d7cb561ad1", "Cream-marinated chicken, kissed by live charcoal and finished with smoked butter.", ["Chicken thigh", "Cream", "Green cardamom", "Smoked butter"], ["Most Ordered"]),
  d("bbq-2", "Lamb Ribs", "BBQ & Grills", 2650, "photo-1529193591184-b1d58069ecdd", "Slow-rested lamb ribs glazed with pomegranate molasses and black pepper.", ["Lamb ribs", "Pomegranate molasses", "Black pepper", "Garlic"], ["Chef's Signature"]),
  d("bbq-3", "Fiery Seekh Platter", "BBQ & Grills", 1750, "photo-1603360946369-dc9bb6258143", "Hand-minced beef seekh with green chilli chutney and charred onions.", ["Beef mince", "Green chilli", "Coriander", "Charred onion"], ["Spicy"]),
  d("bbq-4", "Mutton Chops", "BBQ & Grills", 2850, "photo-1544025162-d76694265947", "Tender mutton chops marinated overnight in raw papaya and whole spices, grilled over charcoal.", ["Mutton chops", "Raw papaya", "Whole spices", "Ginger"]),
  // Steaks & Continental
  d("st-1", "Tenderloin Steak", "Steaks & Continental", 4200, "photo-1600891964092-4316c288032e", "Seared beef tenderloin with peppercorn jus, garlic butter and roasted vegetables.", ["Beef tenderloin", "Peppercorn jus", "Garlic butter", "Seasonal vegetables"], ["Chef's Signature"]),
  d("st-2", "Moroccan Chicken", "Steaks & Continental", 2400, "photo-1546833999-b9f581a1996d", "Chicken breast in a warm chermoula marinade, served on saffron rice with preserved lemon.", ["Chicken breast", "Chermoula", "Saffron rice", "Preserved lemon"], ["Most Ordered"]),
  d("st-3", "Tarragon Chicken", "Steaks & Continental", 2300, "photo-1598103442097-8b74394b95c6", "Pan-roasted chicken in a silky tarragon cream with buttered greens.", ["Chicken breast", "Tarragon", "Cream", "Buttered greens"]),
  // Pan-Asian
  d("pa-1", "Kung Pao Chicken", "Pan-Asian", 1650, "photo-1603133872878-684f208fb84b", "Wok-tossed chicken with dried chillies, roasted peanuts and a sweet-sour soy glaze.", ["Chicken", "Dried chillies", "Peanuts", "Soy glaze"], ["Spicy"]),
  d("pa-2", "Beef Chili Dry", "Pan-Asian", 1850, "photo-1529042410759-befb1204b468", "Crisp beef strips flash-fried with peppers, spring onion and a garlicky chilli sauce.", ["Beef strips", "Capsicum", "Spring onion", "Chilli garlic sauce"], ["Most Ordered", "Spicy"]),
  // Wood-Fired Pizza & Burgers
  d("pz-1", "Truffle Beef Burger", "Wood-Fired Pizza & Burgers", 2100, "photo-1568901346375-23c9450c58cd", "Double beef patty, truffle mayo, aged cheddar and caramelised onions in a brioche bun.", ["Beef patty", "Truffle mayo", "Aged cheddar", "Brioche bun"], ["Chef's Signature"]),
  d("pz-2", "Artisanal Pepperoni Pizza", "Wood-Fired Pizza & Burgers", 1950, "photo-1628840042765-356cda07504e", "Sourdough base fired in our wood oven, with spicy pepperoni, mozzarella and hot honey.", ["Sourdough base", "Pepperoni", "Mozzarella", "Hot honey"], ["Most Ordered"]),
  // Mocktails & Desserts
  d("md-1", "Lotus Cheesecake", "Mocktails & Desserts", 1250, "photo-1533134242443-d4fd215305ad", "Creamy baked cheesecake on a Biscoff crust, finished with a warm lotus drizzle.", ["Cream cheese", "Lotus biscuit", "Vanilla", "Lotus spread"], ["Most Ordered"]),
  d("md-2", "Molten Lava", "Mocktails & Desserts", 1350, "photo-1624353365286-3f8d62daad51", "Warm dark chocolate cake with a liquid centre, served with vanilla gelato.", ["Dark chocolate", "Butter", "Vanilla gelato"], ["Chef's Signature"]),
  d("md-3", "Coconut Mint Mojito", "Mocktails & Desserts", 900, "photo-1551538827-9c037cb4f32a", "Fresh lime, mint and coconut water over crushed ice with a splash of cream.", ["Lime", "Mint", "Coconut water", "Cream"]),
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
