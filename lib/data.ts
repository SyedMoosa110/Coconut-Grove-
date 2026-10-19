export const WHATSAPP_NUMBER = "923057774444"; // 0305-7774444 in international format
export const PHONE_DISPLAY = "0305-7774444";
export const PHONE_TEL = "+923057774444";
export const PHONE_HREF = `tel:${PHONE_TEL}`;
export const INSTAGRAM_HANDLE = "@coconutgrovekarachi";
export const INSTAGRAM_URL = "https://www.instagram.com/coconutgrovekarachi/";
export const OPEN_HOUR = 12; // ASSUMPTION: opening time is not in the original blueprint
export const WEEKEND_NIGHTS = [5, 6]; // Fri & Sat nights close at 2 AM (0 = Sunday)
export const MAPS_QUERY = "Coconut Grove Karachi";

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const fmt = (n: number) => `Rs ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const CATEGORIES = ["BBQ & Grills", "Steaks", "Pan-Asian", "Pizzas", "Desserts", "Cocktails"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<Category, { tagline: string }> = {
  "BBQ & Grills": { tagline: "Live charcoal, marinated overnight, served sizzling." },
  Steaks: { tagline: "Seared hard, rested slow, finished with butter." },
  "Pan-Asian": { tagline: "Wok-hot plates with chilli, garlic and glaze." },
  Pizzas: { tagline: "Wood-fired sourdough pizzas and signature burgers." },
  Desserts: { tagline: "The last word of the evening, warm or chilled." },
  Cocktails: { tagline: "Alcohol-free signature cocktails, shaken tableside style." },
};

export const BADGES = ["Chef's Signature", "Most Ordered", "Spicy"] as const;
export type Badge = (typeof BADGES)[number];

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
  // Steaks
  d("st-1", "Tenderloin Steak", "Steaks", 4200, "photo-1600891964092-4316c288032e", "Seared beef tenderloin with peppercorn jus, garlic butter and roasted vegetables.", ["Beef tenderloin", "Peppercorn jus", "Garlic butter", "Seasonal vegetables"], ["Chef's Signature"]),
  d("st-2", "Moroccan Chicken", "Steaks", 2400, "photo-1546833999-b9f581a1996d", "Chicken breast in a warm chermoula marinade, served on saffron rice with preserved lemon.", ["Chicken breast", "Chermoula", "Saffron rice", "Preserved lemon"], ["Most Ordered"]),
  d("st-3", "Tarragon Chicken", "Steaks", 2300, "photo-1598103442097-8b74394b95c6", "Pan-roasted chicken in a silky tarragon cream with buttered greens.", ["Chicken breast", "Tarragon", "Cream", "Buttered greens"]),
  // Pan-Asian
  d("pa-1", "Kung Pao Chicken", "Pan-Asian", 1650, "photo-1603133872878-684f208fb84b", "Wok-tossed chicken with dried chillies, roasted peanuts and a sweet-sour soy glaze.", ["Chicken", "Dried chillies", "Peanuts", "Soy glaze"], ["Spicy"]),
  d("pa-2", "Beef Chili Dry", "Pan-Asian", 1850, "photo-1529042410759-befb1204b468", "Crisp beef strips flash-fried with peppers, spring onion and a garlicky chilli sauce.", ["Beef strips", "Capsicum", "Spring onion", "Chilli garlic sauce"], ["Most Ordered", "Spicy"]),
  // Pizzas
  d("pz-1", "Truffle Beef Burger", "Pizzas", 2100, "photo-1568901346375-23c9450c58cd", "Double beef patty, truffle mayo, aged cheddar and caramelised onions in a brioche bun.", ["Beef patty", "Truffle mayo", "Aged cheddar", "Brioche bun"], ["Chef's Signature"]),
  d("pz-2", "Artisanal Pepperoni Pizza", "Pizzas", 1950, "photo-1628840042765-356cda07504e", "Sourdough base fired in our wood oven, with spicy pepperoni, mozzarella and hot honey.", ["Sourdough base", "Pepperoni", "Mozzarella", "Hot honey"], ["Most Ordered", "Spicy"]),
  // Desserts
  d("ds-1", "Lotus Cheesecake", "Desserts", 1250, "photo-1533134242443-d4fd215305ad", "Creamy baked cheesecake on a Biscoff crust, finished with a warm lotus drizzle.", ["Cream cheese", "Lotus biscuit", "Vanilla", "Lotus spread"], ["Most Ordered"]),
  d("ds-2", "Molten Lava", "Desserts", 1350, "photo-1624353365286-3f8d62daad51", "Warm dark chocolate cake with a liquid centre, served with vanilla gelato.", ["Dark chocolate", "Butter", "Vanilla gelato"], ["Chef's Signature"]),
  // ASSUMED ITEM: not in the original blueprint. Confirm name and price with the restaurant.
  d("ds-3", "Coconut Panna Cotta", "Desserts", 1150, "photo-1488477181946-6428a0291777", "Silken coconut cream set to a gentle wobble, with passionfruit and toasted flakes.", ["Coconut cream", "Passionfruit", "Toasted coconut", "Vanilla"]),
  // Cocktails
  d("ck-1", "Coconut Mint Mojito", "Cocktails", 900, "photo-1551538827-9c037cb4f32a", "Fresh lime, mint and coconut water over crushed ice with a splash of cream.", ["Lime", "Mint", "Coconut water", "Cream"], ["Most Ordered"]),
  // ASSUMED ITEMS: not in the original blueprint. Confirm names and prices with the restaurant.
  d("ck-2", "Grove Sunset", "Cocktails", 950, "photo-1514362545857-3bc16c4c7d1b", "Orange, passionfruit and grenadine layered into a glowing gradient, topped with soda.", ["Orange", "Passionfruit", "Grenadine", "Soda"], ["Chef's Signature"]),
  d("ck-3", "Lychee Rose Fizz", "Cocktails", 1050, "photo-1536935338788-846bb9981813", "Lychee, rose water and lime, shaken cold and finished with a sparkling top.", ["Lychee", "Rose water", "Lime", "Sparkling water"]),
];

export const HERO_IMAGES = [
  unsplash("photo-1470246973918-29a93221c455", 2000),
  unsplash("photo-1414235077428-338989a2e8c0", 2000),
  unsplash("photo-1519167758481-83f550bb49b3", 2000),
];

export const MARQUEE_WORDS = [
  "Charcoal Grills", "Fairy-Lit Cabanas", "Wood-Fired Pizza", "Pan-Asian Wok", "Prime Steaks", "Garden Nights", "Signature Cocktails",
];

export const GALLERY = [
  { title: "Garden cabanas", caption: "Private canopies under a ceiling of fairy lights.", image: unsplash("photo-1519167758481-83f550bb49b3", 1000) },
  { title: "Palm-lined paths", caption: "A quiet walk to your table, past tropical foliage.", image: unsplash("photo-1559628233-100c798642d4", 1000) },
  { title: "Indoor dining", caption: "Climate-controlled warmth with garden views.", image: unsplash("photo-1517248135467-4c7edcad34c4", 1000) },
  { title: "The grill", caption: "Live charcoal, in sight and in scent.", image: unsplash("photo-1555939594-58d7cb561ad1", 1000) },
  { title: "Private lounge", caption: "Secluded seating for family gatherings.", image: unsplash("photo-1559339352-11d035aa65de", 1000) },
];

export const STATS = [
  { value: "6", label: "Menu chapters" },
  { value: "3", label: "Dining zones" },
  { value: "1AM", label: "Late kitchen" },
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
