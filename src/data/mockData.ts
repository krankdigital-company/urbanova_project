import { Product, CollectionItem, LookbookOutfit, InstagramPost } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // ---------------- FOOTWEAR / SNEAKERS (5 Items) ----------------
  {
    id: 'prod-4',
    name: 'Architectural Lugged Leather Boot',
    category: 'footwear',
    price: 380,
    originalPrice: 450,
    currency: '$',
    rating: 5.0,
    reviewsCount: 18,
    ecoBadge: 'LWG Gold Leather',
    ecoImpactText: 'Recycled Vibram® Eco-Sole',
    co2SavedKg: 3.9,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Blackened Iron', hex: '#151619' },
      { name: 'Dark Espresso', hex: '#2A1F1B' }
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    composition: '100% Vegetable-Tanned Italian Full Grain Leather, Recycled Rubber Lug Sole',
    fitDescription: 'True to size with anatomical footbed and padded leather heel counter.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Handcrafted in Tuscany using plant-based tanners. Features a chunky exaggerated tread Vibram® sole and weatherproof Goodyear welt construction.'
  },
  {
    id: 'prod-9',
    name: 'Kojima Recycled Eco Canvas Low Sneaker',
    category: 'footwear',
    price: 195,
    originalPrice: 230,
    currency: '$',
    rating: 4.8,
    reviewsCount: 54,
    ecoBadge: '100% Organic Canvas',
    ecoImpactText: 'Natural Vulcanized Rubber',
    co2SavedKg: 2.9,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Off-White Chalk', hex: '#EAE6DF' },
      { name: 'Onyx Black', hex: '#121315' }
    ],
    sizes: ['40', '41', '42', '43', '44'],
    composition: '100% GOTS Organic Cotton Canvas & Wild Forest Rubber Sole',
    fitDescription: 'Classic low-top profile with padded collar and natural cork footbed.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Constructed using traditional Japanese kiln vulcanization. Built without petroleum glues for plastic-free biodegradability.'
  },
  {
    id: 'prod-10',
    name: 'Modular Vibram® Trail Runner',
    category: 'footwear',
    price: 260,
    originalPrice: 310,
    currency: '$',
    rating: 4.9,
    reviewsCount: 37,
    ecoBadge: 'Recycled Cordura® Mesh',
    ecoImpactText: 'PFC-Free Weatherproof Upper',
    co2SavedKg: 3.4,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Glacier White', hex: '#F0F2F5' },
      { name: 'Stealth Olive', hex: '#3E443C' }
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    composition: 'Recycled Ocean PET Mesh, EVA Bio-Foam Midsole',
    fitDescription: 'Snug performance wrap with quick-toggle speed lacing system.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'All-terrain hybrid trail runner built with high-traction Vibram Megagrip compound and recycled ocean nylon.'
  },
  {
    id: 'prod-11',
    name: 'Minimalist Vegan Leather Chelsea Boot',
    category: 'footwear',
    price: 320,
    currency: '$',
    rating: 4.7,
    reviewsCount: 22,
    ecoBadge: 'Bio-Based Apple Leather',
    ecoImpactText: 'Zero Animal Derived Materials',
    co2SavedKg: 4.1,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Matte Jet Black', hex: '#111113' },
      { name: 'Warm Oak', hex: '#3B2A22' }
    ],
    sizes: ['41', '42', '43', '44'],
    composition: 'Upcycled Apple Peel Bio-Leather, Recycled Goodyear Welt Sole',
    fitDescription: 'Sleek Italian silhouette with elasticated side gore tabs.',
    isNew: true,
    isBestSeller: false,
    isSustainable: true,
    description: 'Innovative bio-leather produced from food industry upcycled apple waste. Water resistant and ultra breathable.'
  },
  {
    id: 'prod-12',
    name: 'Zero-Waste Shearling Lined Mule',
    category: 'footwear',
    price: 220,
    originalPrice: 250,
    currency: '$',
    rating: 4.9,
    reviewsCount: 19,
    ecoBadge: 'Recycled Shearling',
    ecoImpactText: 'Traceable Wool Lining',
    co2SavedKg: 2.8,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Taupe Suede', hex: '#9E9484' },
      { name: 'Obsidian Black', hex: '#141518' }
    ],
    sizes: ['40', '41', '42', '43', '44'],
    composition: '100% Upcycled Suede & Ethical Wool Shearling Lining',
    fitDescription: 'Slip-on ease with molded cork footbed that shapes to your foot over time.',
    isNew: false,
    isBestSeller: false,
    isSustainable: true,
    description: 'An indoor-outdoor lounge slide lined with plush ethically sourced merino shearling.'
  },

  // ---------------- OUTERWEAR & JACKETS (5 Items) ----------------
  {
    id: 'prod-1',
    name: 'Architectural Wool Double Trench',
    category: 'outerwear',
    price: 345,
    originalPrice: 420,
    currency: '$',
    rating: 4.9,
    reviewsCount: 42,
    ecoBadge: '100% Traceable Wool',
    ecoImpactText: '-6.8 kg CO2 vs industry standard',
    co2SavedKg: 6.8,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#111215' },
      { name: 'Warm Charcoal', hex: '#2D3036' },
      { name: 'Bone Taupe', hex: '#B8AF9F' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '85% Traceable Circular Wool, 15% Recycled Japanese Polyamide',
    fitDescription: 'Oversized boxy architectural fit. Structured broad shoulders with relaxed drape.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'A timeless double-breasted coat crafted from zero-waste traceable merino wool. Features clean hidden magnetic closures and storm flaps.'
  },
  {
    id: 'prod-3',
    name: 'Modular Japanese Technical Flight Jacket',
    category: 'outerwear',
    price: 295,
    originalPrice: 350,
    currency: '$',
    rating: 4.9,
    reviewsCount: 31,
    ecoBadge: '100% Recycled Nylon',
    ecoImpactText: 'PFC-Free Water Repellent Coating',
    co2SavedKg: 5.1,
    images: [
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Matte Onyx', hex: '#1A1C20' },
      { name: 'Deep Sage', hex: '#3B453E' }
    ],
    sizes: ['M', 'L', 'XL'],
    composition: '100% Recycled Ocean-Bound Nylon Satin with Biodegradable Membrane',
    fitDescription: 'Modular bomber silhouette with custom riri matte black zips and utility sleeve pocket.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'A utilitarian bomber constructed from ocean-recycled nylon. Modular internal straps allow hands-free shoulder carry.'
  },
  {
    id: 'prod-13',
    name: 'Minimalist Recycled Wool Overcoat',
    category: 'outerwear',
    price: 390,
    originalPrice: 460,
    currency: '$',
    rating: 4.8,
    reviewsCount: 29,
    ecoBadge: 'Recycled Italian Wool',
    ecoImpactText: 'Zero-Waste Patterning',
    co2SavedKg: 7.2,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Camel Tan', hex: '#B88A58' },
      { name: 'Carbon Black', hex: '#161719' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '90% Recycled Italian Wool, 10% Cashmere',
    fitDescription: 'Tailored single-breasted knee length coat with notch lapel.',
    isNew: true,
    isBestSeller: false,
    isSustainable: true,
    description: 'Refined longline silhouette woven in Prato, Italy from upcycled post-consumer wool garments.'
  },
  {
    id: 'prod-14',
    name: 'Padded Plant-Dyed Technical Parka',
    category: 'outerwear',
    price: 410,
    originalPrice: 480,
    currency: '$',
    rating: 4.9,
    reviewsCount: 36,
    ecoBadge: 'Primaloft® Bio Insulation',
    ecoImpactText: '100% Biodegradable Synthetic',
    co2SavedKg: 8.4,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Earthy Olive', hex: '#444B41' },
      { name: 'Stealth Grey', hex: '#2A2C31' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% Organic Cotton Ventile Shell with Primaloft Bio Insulation',
    fitDescription: 'Extreme cold weather shell with drawcord hood and storm collar.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'Heavy duty arctic parka insulated with 100% biodegradable synthetic microfiber that breaks down harmlessly in soil or ocean.'
  },
  {
    id: 'prod-15',
    name: 'Recycled Fleece Technical Anorak',
    category: 'outerwear',
    price: 210,
    originalPrice: 240,
    currency: '$',
    rating: 4.7,
    reviewsCount: 48,
    ecoBadge: '100% Recycled Fleece',
    ecoImpactText: 'Saves 32 Bottles Per Fleece',
    co2SavedKg: 3.8,
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Chalk White', hex: '#ECE8E1' },
      { name: 'Forest Green', hex: '#2C3A2E' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% Recycled Polyester High-Pile Thermal Shearling Fleece',
    fitDescription: 'Half-zip popover with kangaroo mesh pocket and elasticated cuffs.',
    isNew: false,
    isBestSeller: false,
    isSustainable: true,
    description: 'Plush mid-layer thermal fleece providing intense warmth during mountain treks or city strolls.'
  },

  // ---------------- CLOTHING ESSENTIALS / KNITS & TEES (5 Items) ----------------
  {
    id: 'prod-2',
    name: 'GOTS Organic Heavyweight Crew Hoodie',
    category: 'knitwear',
    price: 165,
    originalPrice: 195,
    currency: '$',
    rating: 4.8,
    reviewsCount: 89,
    ecoBadge: 'GOTS 500GSM Cotton',
    ecoImpactText: '-4.2 kg CO2 & 820L Water Saved',
    co2SavedKg: 4.2,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Ecru Chalk', hex: '#ECE8E1' },
      { name: 'Pitch Black', hex: '#0F1012' },
      { name: 'Sage Stone', hex: '#7C857B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% GOTS-Certified Heavyweight Organic French Terry Cotton (500 GSM)',
    fitDescription: 'Relaxed drop-shoulder fit with double-lined hood and seamless waist ribbing.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Engineered for decades of wear. Ultra-heavyweight organic cotton brushed for unmatched warmth without chemical softeners.'
  },
  {
    id: 'prod-6',
    name: 'Circular Fine Gauge Merino Turtleneck',
    category: 'knitwear',
    price: 185,
    originalPrice: 220,
    currency: '$',
    rating: 4.9,
    reviewsCount: 27,
    ecoBadge: 'Mulesing-Free Merino',
    ecoImpactText: 'Biodegradable Wool Fiber',
    co2SavedKg: 3.2,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Charcoal Black', hex: '#1C1D21' },
      { name: 'Sand Beige', hex: '#C2B8A8' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% Extra Fine Australian Merino Wool (19.5 Micron)',
    fitDescription: 'Slim architectural silhouette designed for effortless jacket layering.',
    isNew: true,
    isBestSeller: false,
    isSustainable: true,
    description: 'Silky smooth to touch, breathable, and naturally temperature regulating. Made from non-mulesed ethically farmed merino.'
  },
  {
    id: 'prod-7',
    name: 'Minimalist Boxy Oversized Tee',
    category: 'knitwear',
    price: 85,
    originalPrice: 105,
    currency: '$',
    rating: 4.8,
    reviewsCount: 112,
    ecoBadge: '100% Plant-Dyed Cotton',
    ecoImpactText: 'Zero Synthetic Pigments',
    co2SavedKg: 2.1,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Off-White Bone', hex: '#F2EFE9' },
      { name: 'Carbon Black', hex: '#161719' },
      { name: 'Earthy Olive', hex: '#585C50' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% Organic Heavyweight Single Jersey Cotton (280 GSM)',
    fitDescription: 'Boxy drop shoulder cut with stiff high-rib collar.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'The definitive daily base layer. Heavy enough to hold its boxy drape all day without clinging.'
  },
  {
    id: 'prod-16',
    name: 'Organic Piqué Polo Shirt',
    category: 'knitwear',
    price: 110,
    originalPrice: 135,
    currency: '$',
    rating: 4.7,
    reviewsCount: 45,
    ecoBadge: 'GOTS Organic Piqué',
    ecoImpactText: 'Biodegradable Shell Buttons',
    co2SavedKg: 2.4,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Forest Green', hex: '#1C3B2B' },
      { name: 'Ash Grey', hex: '#8F939A' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% Organic Long-Staple Cotton Piqué (240 GSM)',
    fitDescription: 'Standard athletic fit with ribbed collar and genuine mother-of-pearl buttons.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Elevated luxury polo knitted from extra-long staple organic cotton for a smooth luster and soft handfeel.'
  },
  {
    id: 'prod-17',
    name: 'Heavyweight Waffle Knit Thermal Crew',
    category: 'knitwear',
    price: 140,
    originalPrice: 170,
    currency: '$',
    rating: 4.9,
    reviewsCount: 33,
    ecoBadge: '380GSM Organic Cotton',
    ecoImpactText: 'Low Impact Plant Dyes',
    co2SavedKg: 3.1,
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D6CFC4' },
      { name: 'Midnight Navy', hex: '#192231' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% GOTS Organic Cotton Waffle Thermal Knit',
    fitDescription: 'Relaxed fit with elasticated cuffs and flatlock non-chafing seams.',
    isNew: false,
    isBestSeller: false,
    isSustainable: true,
    description: 'Richly textured thermal pullover trapping body warmth naturally while maintaining peak breathability.'
  },

  // ---------------- JAPANESE SELVEDGE DENIM & PANTS (5 Items) ----------------
  {
    id: 'prod-5',
    name: 'Relaxed Tapered Selvedge Denim',
    category: 'denim',
    price: 210,
    originalPrice: 250,
    currency: '$',
    rating: 4.7,
    reviewsCount: 64,
    ecoBadge: 'Zero-Water Ozone Wash',
    ecoImpactText: '98% Less Water Used',
    co2SavedKg: 4.5,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Raw Indigo', hex: '#1B2430' },
      { name: 'Washed Charcoal', hex: '#32363D' }
    ],
    sizes: ['30', '31', '32', '33', '34', '36'],
    composition: '100% Regenerative Organic Cotton Selvedge Denim (14 oz)',
    fitDescription: 'Mid-rise with spacious thighs tapering softly into a clean ankle opening.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'Crafted in Japan on traditional shuttle looms. Dyed with natural indigo and finished with eco-friendly laser distressing.'
  },
  {
    id: 'prod-18',
    name: 'Kojima Wide Straight Raw Denim',
    category: 'denim',
    price: 240,
    originalPrice: 280,
    currency: '$',
    rating: 4.9,
    reviewsCount: 41,
    ecoBadge: '15.5oz Unwashed Selvedge',
    ecoImpactText: 'Natural Indigo Dye',
    co2SavedKg: 4.8,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Deep Indigo', hex: '#111A2E' }
    ],
    sizes: ['30', '32', '34', '36'],
    composition: '100% Organic Raw Japanese Cotton (15.5 oz Heavyweight)',
    fitDescription: 'High rise with wide straight leg cut and pink selvedge ID line.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Hefty raw denim designed to develop personalized honeycombs and fades over years of continuous wear.'
  },
  {
    id: 'prod-19',
    name: 'Architectural Pleated Wool Trousers',
    category: 'denim',
    price: 225,
    originalPrice: 270,
    currency: '$',
    rating: 4.8,
    reviewsCount: 28,
    ecoBadge: 'Traceable Merino Blend',
    ecoImpactText: 'Zero Synthetic Fibers',
    co2SavedKg: 3.9,
    images: [
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Matte Charcoal', hex: '#2B2D31' },
      { name: 'Sand Taupe', hex: '#A89E8F' }
    ],
    sizes: ['46', '48', '50', '52'],
    composition: '100% Traceable Circular Merino Wool Twill',
    fitDescription: 'Double forward front pleats with relaxed thigh and gradual taper.',
    isNew: true,
    isBestSeller: false,
    isSustainable: true,
    description: 'Sartorial dress trousers combining architectural volume with breathable, crease-resistant Italian merino wool.'
  },
  {
    id: 'prod-20',
    name: 'Modular Utility Cargo Trousers',
    category: 'denim',
    price: 195,
    originalPrice: 230,
    currency: '$',
    rating: 4.9,
    reviewsCount: 52,
    ecoBadge: 'Recycled Ripstop Cotton',
    ecoImpactText: 'Water-Repellent Eco Finish',
    co2SavedKg: 3.6,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#131417' },
      { name: 'Dark Khaki', hex: '#524B3B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% Organic Heavy Ripstop Cotton Canvas',
    fitDescription: 'Ergonomic articulated knees with adjustable magnetic ankle toggles.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'Technical cargo pants equipped with 6 hidden magnetic utility pockets and reinforced knee paneling.'
  },
  {
    id: 'prod-21',
    name: 'Relaxed Tapered Organic Chino',
    category: 'denim',
    price: 160,
    originalPrice: 190,
    currency: '$',
    rating: 4.6,
    reviewsCount: 39,
    ecoBadge: '100% Organic Twill',
    ecoImpactText: 'Botanical Plant Dyes',
    co2SavedKg: 2.7,
    images: [
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Stone Beige', hex: '#C7BFA3' },
      { name: 'Washed Olive', hex: '#4B5242' }
    ],
    sizes: ['30', '32', '34', '36'],
    composition: '98% GOTS Organic Cotton, 2% Recycled Elastane Twill',
    fitDescription: 'Comfortable stretch waist with tailored taper for office or weekend wear.',
    isNew: false,
    isBestSeller: false,
    isSustainable: true,
    description: 'Versatile everyday pants garment-dyed with natural madder root and indigo for muted vintage tones.'
  },

  // ---------------- TIMEPIECES, SCENTS & ACCESSORIES (5 Items) ----------------
  {
    id: 'prod-8',
    name: 'Modular Recycled Cordura® Tote Bag',
    category: 'accessories',
    price: 130,
    originalPrice: 160,
    currency: '$',
    rating: 4.9,
    reviewsCount: 38,
    ecoBadge: 'Recycled Canvas',
    ecoImpactText: 'Made from 24 Plastic Bottles',
    co2SavedKg: 2.8,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#121315' },
      { name: 'Stone Grey', hex: '#8C8E94' }
    ],
    sizes: ['One Size'],
    composition: '100% Post-Consumer Recycled Cordura® Nylon',
    fitDescription: 'Spacious 22L capacity with padded 16" laptop sleeve and key leash.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Weatherproof heavy-duty tote equipped with waterproof YKK AquaGuard® zippers and padded crossbody shoulder attachment.'
  },
  {
    id: 'prod-22',
    name: 'Architectural Titanium Automatic Timepiece',
    category: 'accessories',
    price: 520,
    originalPrice: 600,
    currency: '$',
    rating: 5.0,
    reviewsCount: 16,
    ecoBadge: 'Recycled Titanium Case',
    ecoImpactText: 'Self-Winding Automatic Movement',
    co2SavedKg: 5.2,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Brushed Titanium', hex: '#8E9299' },
      { name: 'DLC Matte Black', hex: '#131416' }
    ],
    sizes: ['40mm'],
    composition: 'Grade 5 Recycled Titanium Case, Sapphire Crystal Glass, Japanese Miyota Automatic Engine',
    fitDescription: 'Ultra lightweight 40mm matte titanium case with integrated FKM rubber strap.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'Precision Swiss-designed automatic watch needing zero batteries. Encased in 100% upcycled aerospace-grade titanium.'
  },
  {
    id: 'prod-23',
    name: 'Apothecary Botanical Extract EDP (100ml)',
    category: 'accessories',
    price: 145,
    originalPrice: 175,
    currency: '$',
    rating: 4.9,
    reviewsCount: 62,
    ecoBadge: '100% Organic Essence',
    ecoImpactText: 'Upcycled Cedarwood & Oakmoss',
    co2SavedKg: 1.8,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Amber Glass', hex: '#633B18' }
    ],
    sizes: ['100ml'],
    composition: '100% Organic Plant Alcohol Base, Upcycled Atlas Cedar, Bergamot, Smoked Amber',
    fitDescription: 'Long-lasting Eau de Parfum with 8+ hours wear time.',
    isNew: true,
    isBestSeller: true,
    isSustainable: true,
    description: 'An evocative Unisex perfume blended in Grasse using wild-harvested botanicals and upcycled timber essences.'
  },
  {
    id: 'prod-24',
    name: 'Vegetable-Tanned Italian Leather Wallet',
    category: 'accessories',
    price: 95,
    originalPrice: 115,
    currency: '$',
    rating: 4.8,
    reviewsCount: 71,
    ecoBadge: 'LWG Certified Leather',
    ecoImpactText: '100% Biodegradable Tannage',
    co2SavedKg: 1.5,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Onyx Black', hex: '#111215' },
      { name: 'Cognac Chestnut', hex: '#6E3A1A' }
    ],
    sizes: ['One Size'],
    composition: 'Full Grain Tuscan Vegetable-Tanned Cowhide Leather',
    fitDescription: 'Compact bifold profile with 6 card slots, billfold slot, and RFID blocking lining.',
    isNew: false,
    isBestSeller: true,
    isSustainable: true,
    description: 'Hand-burnished leather wallet that develops a deep rich patina over years of daily handling.'
  },
  {
    id: 'prod-25',
    name: 'Upcycled Acetate Polarized Sunglasses',
    category: 'accessories',
    price: 175,
    originalPrice: 210,
    currency: '$',
    rating: 4.9,
    reviewsCount: 34,
    ecoBadge: '100% Bio-Acetate',
    ecoImpactText: 'Zero Petroleum Plastics',
    co2SavedKg: 2.1,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85'
    ],
    colors: [
      { name: 'Smoked Amber', hex: '#4A321B' },
      { name: 'Matte Obsidian', hex: '#121316' }
    ],
    sizes: ['Medium'],
    composition: '100% Plant-Based Biodegradable Bio-Acetate Frame, Polarized Nylon Lenses',
    fitDescription: 'Classic square architectural frame with 100% UVA/UVB protection.',
    isNew: true,
    isBestSeller: false,
    isSustainable: true,
    description: 'Sculpted sunglasses made from plant cellulose and cotton linters. Free from chemical plasticizers.'
  }
];


export const MOCK_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Architectural Outerwear',
    subtitle: 'Sculpted coats & weatherproof shells engineered with zero-waste traceable wool.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    tag: 'NEW COLLECTION',
    itemCount: 14,
    slug: 'outerwear'
  },
  {
    id: 'col-2',
    title: 'Organic Heavyweight Knits',
    subtitle: '500 GSM GOTS French terry hoodies and zero-mulesing fine merino turtlenecks.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
    tag: 'ESSENTIALS',
    itemCount: 18,
    slug: 'knitwear'
  },
  {
    id: 'col-3',
    title: 'Japanese Zero-Water Denim',
    subtitle: 'Woven on vintage shuttle looms in Kojima using regenerative raw indigo cotton.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85',
    tag: 'SUSTAINABLE DENIM',
    itemCount: 9,
    slug: 'denim'
  },
  {
    id: 'col-4',
    title: 'Vegetable-Tanned Footwear',
    subtitle: 'Tuscan full-grain leather boots fitted with recycled lug soles.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
    tag: 'CRAFTED IN ITALY',
    itemCount: 6,
    slug: 'footwear'
  }
];

export const MOCK_LOOKBOOK_OUTFIT: LookbookOutfit = {
  id: 'lookbook-fall-26',
  title: 'Look 04 — The Modular Urbanite',
  subtitle: 'Monochromatic boxy proportions rendered in 100% GOTS organic cotton and zero-waste wool.',
  image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=90',
  hotspots: [
    {
      id: 'hs-1',
      xPercent: 48,
      yPercent: 28,
      productId: 'prod-1' // Trench
    },
    {
      id: 'hs-2',
      xPercent: 52,
      yPercent: 48,
      productId: 'prod-2' // Hoodie
    },
    {
      id: 'hs-3',
      xPercent: 46,
      yPercent: 70,
      productId: 'prod-5' // Denim
    },
    {
      id: 'hs-4',
      xPercent: 54,
      yPercent: 88,
      productId: 'prod-4' // Leather Boot
    }
  ]
};

export const MOCK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'insta-1',
    handle: '@alex.m.studio',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    likes: 2410,
    caption: 'Tokyo morning layers in the @UrbanovaOfficial double trench. Heavyweight drape feels incredible.',
    productId: 'prod-1'
  },
  {
    id: 'insta-2',
    handle: '@urbanova_official',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    likes: 1890,
    caption: '500 GSM organic French Terry cotton. Zero plastic fibers, 100% circular design.',
    productId: 'prod-2'
  },
  {
    id: 'insta-3',
    handle: '@julien_vance',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    likes: 3120,
    caption: 'Clean lines, zero clutter. Minimalist tailoring done right.',
    productId: 'prod-3'
  },
  {
    id: 'insta-4',
    handle: '@kaito_minimal',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    likes: 1450,
    caption: 'Fine gauge merino turtlenecks for transition season.',
    productId: 'prod-6'
  },
  {
    id: 'insta-5',
    handle: '@marcus.taylor',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80',
    likes: 2780,
    caption: '14oz Japanese selvedge denim built to age with character.',
    productId: 'prod-5'
  }
];

export const SUSTAINABLE_PILLARS = [
  {
    title: '100% Traceable Organic Materials',
    description: 'We source exclusively GOTS certified organic cotton, mulesing-free circular wool, and certified recycled Japanese technical fabrics.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Zero Chemical Dyestuffs',
    description: 'Our colorways use plant-derived non-toxic dyes and ozone closed-loop water treatment that saves over 80% water per garment.',
    icon: 'Droplets'
  },
  {
    title: 'Lifetime Circular Repair Guarantee',
    description: 'Send back any Urbanova garment after years of wear for free lifetime repairs or earn 20% trade-in credit toward circular recycling.',
    icon: 'RefreshCw'
  },
  {
    title: 'Carbon-Neutral Direct Delivery',
    description: 'Every shipment is 100% carbon compensated, delivered in plastic-free recycled paper packaging with soy-ink detailing.',
    icon: 'Truck'
  }
];
