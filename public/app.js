// ── PRODUCT DATA ──────────────────────────────────────────────
const products = [

  // ── 전자제품 ──────────────────────────────────────────────────
  { id: 1,   category: 'electronics', emoji: '📱', brand: 'Apple',     name: 'iPhone 16 Pro Max 1TB 자연 티타늄',           price: 2190000,   original: 2490000,   rating: 4.9, reviews: 48291, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 2,   category: 'electronics', emoji: '📱', brand: 'Samsung',   name: 'Galaxy S25 Ultra 512GB 티타늄 실버',           price: 1890000,   original: 2099000,   rating: 4.8, reviews: 35102, shipping: '당일 특급배송', badge: null },
  { id: 3,   category: 'electronics', emoji: '📱', brand: 'Samsung',   name: 'Galaxy Z Fold 7 1TB 크림 골드',               price: 2490000,   original: 2790000,   rating: 4.7, reviews: 12043, shipping: '당일 특급배송', badge: null },
  { id: 4,   category: 'electronics', emoji: '📱', brand: 'Google',    name: 'Pixel 9 Pro XL 256GB 오브시디언',              price: 1390000,   original: 1590000,   rating: 4.7, reviews: 8201,  shipping: '내일 도착 보장', badge: null },
  { id: 5,   category: 'electronics', emoji: '💻', brand: 'Apple',     name: 'MacBook Pro 16" M4 Max 128GB 스페이스블랙',    price: 6990000,   original: 7490000,   rating: 4.9, reviews: 9821,  shipping: '당일 특급배송', badge: 'VIP' },
  { id: 6,   category: 'electronics', emoji: '💻', brand: 'Apple',     name: 'MacBook Air 15" M3 16GB 미드나이트',           price: 1890000,   original: 2090000,   rating: 4.8, reviews: 22381, shipping: '당일 특급배송', badge: null },
  { id: 7,   category: 'electronics', emoji: '💻', brand: 'LG',        name: 'LG 그램 Pro 17" 2025 Ultra 7 32GB',           price: 2490000,   original: 2790000,   rating: 4.7, reviews: 5102,  shipping: '내일 도착 보장', badge: null },
  { id: 8,   category: 'electronics', emoji: '💻', brand: 'Microsoft', name: 'Surface Pro 11 코파일럿+ 32GB 플래티넘',       price: 2190000,   original: 2490000,   rating: 4.6, reviews: 3801,  shipping: '내일 도착 보장', badge: null },
  { id: 9,   category: 'electronics', emoji: '📺', brand: 'Samsung',   name: 'Neo QLED 8K 98인치 QN990D 스마트TV',          price: 19900000,  original: 24900000,  rating: 4.9, reviews: 1823,  shipping: '당일 특급배송', badge: 'LUXURY' },
  { id: 10,  category: 'electronics', emoji: '📺', brand: 'LG',        name: 'OLED evo Gallery Edition 83인치 G4',          price: 9900000,   original: 12000000,  rating: 4.9, reviews: 2341,  shipping: '당일 특급배송', badge: null },
  { id: 11,  category: 'electronics', emoji: '📺', brand: 'Sony',      name: 'BRAVIA 9 Mini LED 85인치 XR A95L',            price: 7900000,   original: 9500000,   rating: 4.8, reviews: 1902,  shipping: '내일 도착 보장', badge: null },
  { id: 12,  category: 'electronics', emoji: '🖥️', brand: 'Apple',     name: 'Apple Studio Display 27" 나노텍스처',         price: 2990000,   original: 3190000,   rating: 4.8, reviews: 4201,  shipping: '당일 특급배송', badge: null },
  { id: 13,  category: 'electronics', emoji: '🖥️', brand: 'LG',        name: 'LG UltraFine OLED Pro 32" 4K',               price: 3290000,   original: 3890000,   rating: 4.7, reviews: 3102,  shipping: '내일 도착 보장', badge: null },
  { id: 14,  category: 'electronics', emoji: '🎧', brand: 'Sony',      name: 'WH-1000XM6 노이즈캔슬링 헤드폰 블랙',          price: 479000,    original: 549000,    rating: 4.9, reviews: 58291, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 15,  category: 'electronics', emoji: '🎧', brand: 'Apple',     name: 'AirPods Max USB-C 미드나이트',                price: 729000,    original: 769000,    rating: 4.7, reviews: 32109, shipping: '당일 특급배송', badge: null },
  { id: 16,  category: 'electronics', emoji: '🎧', brand: 'Bose',      name: 'QuietComfort Ultra 헤드폰 샌드스톤',           price: 499000,    original: 579000,    rating: 4.8, reviews: 19201, shipping: '당일 특급배송', badge: null },
  { id: 17,  category: 'electronics', emoji: '🎵', brand: 'Sonos',     name: 'Sonos Era 300 공간음향 스피커',               price: 699000,    original: 799000,    rating: 4.8, reviews: 8901,  shipping: '당일 특급배송', badge: null },
  { id: 18,  category: 'electronics', emoji: '🔊', brand: 'Bang & Olufsen', name: 'Beosound A9 5세대 홈 스피커 골드톤',   price: 4900000,   original: 5800000,   rating: 4.9, reviews: 1203,  shipping: '전용 배송', badge: 'LUXURY' },
  { id: 19,  category: 'electronics', emoji: '⌚', brand: 'Apple',     name: 'Apple Watch Ultra 3 49mm 자연 티타늄',        price: 1290000,   original: 1390000,   rating: 4.8, reviews: 14820, shipping: '당일 특급배송', badge: null },
  { id: 20,  category: 'electronics', emoji: '⌚', brand: 'Samsung',   name: 'Galaxy Watch Ultra 2 47mm 화이트골드',        price: 890000,    original: 990000,    rating: 4.7, reviews: 9203,  shipping: '당일 특급배송', badge: null },
  { id: 21,  category: 'electronics', emoji: '📷', brand: 'Sony',      name: 'Alpha 1 II 풀프레임 미러리스 바디',            price: 8990000,   original: 9900000,   rating: 4.9, reviews: 3201,  shipping: '당일 특급배송', badge: 'PRO' },
  { id: 22,  category: 'electronics', emoji: '📷', brand: 'Canon',     name: 'EOS R3 미러리스 + RF 28-70mm F2 L',          price: 9800000,   original: 11500000,  rating: 4.9, reviews: 2103,  shipping: '내일 도착 보장', badge: null },
  { id: 23,  category: 'electronics', emoji: '📷', brand: 'Leica',     name: 'Leica SL3 풀프레임 + APO-Summicron 35mm',    price: 18900000,  original: 21000000,  rating: 5.0, reviews: 412,   shipping: '전용 배송', badge: 'LUXURY' },
  { id: 24,  category: 'electronics', emoji: '🎮', brand: 'Sony',      name: 'PlayStation 5 Pro 2TB 디지털 에디션',         price: 749000,    original: 849000,    rating: 4.8, reviews: 42031, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 25,  category: 'electronics', emoji: '🎮', brand: 'Microsoft', name: 'Xbox Series X 2TB + Game Pass Ultimate 1년', price: 899000,    original: 999000,    rating: 4.7, reviews: 28301, shipping: '당일 특급배송', badge: null },
  { id: 26,  category: 'electronics', emoji: '💊', brand: 'Apple',     name: 'iPad Pro 13" M4 OLED 2TB WiFi+Cellular',      price: 2990000,   original: 3290000,   rating: 4.9, reviews: 18203, shipping: '당일 특급배송', badge: null },
  { id: 27,  category: 'electronics', emoji: '💊', brand: 'Samsung',   name: 'Galaxy Tab S10 Ultra 1TB S펜 포함',           price: 1990000,   original: 2290000,   rating: 4.7, reviews: 12031, shipping: '당일 특급배송', badge: null },
  { id: 28,  category: 'electronics', emoji: '🖨️', brand: 'DJI',       name: 'DJI Matrice 4 Pro 드론 + 케어 리프레시',      price: 4900000,   original: 5800000,   rating: 4.9, reviews: 2301,  shipping: '내일 도착 보장', badge: 'PRO' },
  { id: 29,  category: 'electronics', emoji: '🤖', brand: 'Samsung',   name: 'Samsung Ballie 홈 AI 로봇 컴패니언',          price: 2490000,   original: 2990000,   rating: 4.6, reviews: 5021,  shipping: '당일 특급배송', badge: 'NEW' },
  { id: 30,  category: 'electronics', emoji: '🔋', brand: 'Tesla',     name: 'Tesla Powerwall 3 가정용 에너지저장장치',      price: 12000000,  original: 14000000,  rating: 4.8, reviews: 1902,  shipping: '설치 포함 배송', badge: null },

  // ── 패션/명품 ─────────────────────────────────────────────────
  { id: 31,  category: 'fashion', emoji: '👜', brand: 'Hermès',       name: 'Birkin 30 Togo 가죽 브라이트 오렌지 팔라듐',  price: 24000000,  original: 27000000,  rating: 5.0, reviews: 412,   shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 32,  category: 'fashion', emoji: '👜', brand: 'Hermès',       name: 'Kelly 28 Epsom 루즈 드 꾀르 골드 피팅',       price: 20000000,  original: 23000000,  rating: 5.0, reviews: 289,   shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 33,  category: 'fashion', emoji: '👛', brand: 'Chanel',       name: 'Classic Flap 미디엄 블랙 캐비어 골드HW',      price: 16500000,  original: 18900000,  rating: 5.0, reviews: 1823,  shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 34,  category: 'fashion', emoji: '👛', brand: 'Louis Vuitton','name': 'Capucines MM 블랙 박스 카프스킨',             price: 9800000,   original: 11200000,  rating: 4.9, reviews: 2103,  shipping: '전용 쿠리어', badge: null },
  { id: 35,  category: 'fashion', emoji: '🎒', brand: 'Goyard',       name: 'Saint Louis PM 오브르 웨이빙 앙티부아 에디션', price: 3200000,   original: 3800000,   rating: 4.9, reviews: 1201,  shipping: '당일 특급배송', badge: null },
  { id: 36,  category: 'fashion', emoji: '👟', brand: 'Louis Vuitton','name': 'LV Archlight 스니커즈 모노그램 화이트',       price: 1650000,   original: 1890000,   rating: 4.8, reviews: 3201,  shipping: '당일 특급배송', badge: null },
  { id: 37,  category: 'fashion', emoji: '👞', brand: 'Gucci',        name: 'Horsebit 1953 로퍼 블랙 레더',                price: 1290000,   original: 1490000,   rating: 4.8, reviews: 5821,  shipping: '당일 특급배송', badge: null },
  { id: 38,  category: 'fashion', emoji: '👠', brand: 'Christian Louboutin', name: 'So Kate 120 누드 키드스킨',             price: 1190000,   original: 1390000,   rating: 4.9, reviews: 8291,  shipping: '당일 특급배송', badge: 'BEST' },
  { id: 39,  category: 'fashion', emoji: '🧥', brand: 'Brunello Cucinelli', name: '카시미어 오버코트 샌드 베이지',          price: 5900000,   original: 7200000,   rating: 4.9, reviews: 1023,  shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 40,  category: 'fashion', emoji: '🧥', brand: 'Moncler',      name: 'Maya 다운 재킷 블랙 2025 SS',                price: 2100000,   original: 2500000,   rating: 4.8, reviews: 4201,  shipping: '당일 특급배송', badge: null },
  { id: 41,  category: 'fashion', emoji: '👒', brand: 'Prada',        name: '리나일론 버킷햇 블랙 트라이앵글 로고',         price: 890000,    original: 990000,    rating: 4.7, reviews: 6821,  shipping: '당일 특급배송', badge: null },
  { id: 42,  category: 'fashion', emoji: '🕶️', brand: 'Tom Ford',     name: 'FT1000 선글라스 스모크드 사파이어',            price: 650000,    original: 750000,    rating: 4.8, reviews: 9201,  shipping: '당일 특급배송', badge: null },
  { id: 43,  category: 'fashion', emoji: '🕶️', brand: 'Cartier',      name: '팬테르 드 까르띠에 선글라스 18K 로즈골드',     price: 4800000,   original: 5500000,   rating: 4.9, reviews: 512,   shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 44,  category: 'fashion', emoji: '🧣', brand: 'Hermès',       name: 'Carré 90 실크 스카프 Jungle Love 오렌지',     price: 890000,    original: 990000,    rating: 4.9, reviews: 12031, shipping: '당일 특급배송', badge: null },
  { id: 45,  category: 'fashion', emoji: '👔', brand: 'Kiton',        name: '나폴리 핸드스티치 수트 네이비 울 카시미어',     price: 8900000,   original: 10500000,  rating: 5.0, reviews: 312,   shipping: '전용 쿠리어', badge: 'LUXURY' },

  // ── 뷰티/화장품 ───────────────────────────────────────────────
  { id: 46,  category: 'beauty', emoji: '✨', brand: 'La Mer',        name: 'La Mer 크렘 드 라 메르 보습크림 250ml',       price: 1490000,   original: 1690000,   rating: 4.9, reviews: 28301, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 47,  category: 'beauty', emoji: '💆', brand: 'SK-II',         name: 'PITERA Essence 230ml + 아이크림 세트',        price: 590000,    original: 680000,    rating: 4.8, reviews: 45201, shipping: '당일 특급배송', badge: null },
  { id: 48,  category: 'beauty', emoji: '🌿', brand: 'Sisley',        name: 'Black Rose Precious Face Oil 25ml',          price: 490000,    original: 560000,    rating: 4.8, reviews: 8901,  shipping: '당일 특급배송', badge: null },
  { id: 49,  category: 'beauty', emoji: '💧', brand: 'Augustinus Bader', name: 'The Rich Cream 50ml + TFC8 앰플 세트',   price: 890000,    original: 1050000,   rating: 4.9, reviews: 12031, shipping: '당일 특급배송', badge: null },
  { id: 50,  category: 'beauty', emoji: '🧴', brand: 'Chanel',        name: 'N°5 오 드 퍼퓸 100ml 리미티드 에디션',        price: 450000,    original: 520000,    rating: 4.9, reviews: 19201, shipping: '당일 특급배송', badge: null },
  { id: 51,  category: 'beauty', emoji: '🌸', brand: 'Tom Ford',      name: 'Soleil de Feu 오 드 퍼퓸 100ml',             price: 580000,    original: 650000,    rating: 4.8, reviews: 9821,  shipping: '당일 특급배송', badge: null },
  { id: 52,  category: 'beauty', emoji: '🌙', brand: 'Creed',         name: 'Aventus 오 드 퍼퓸 250ml 플라콘',             price: 980000,    original: 1150000,   rating: 4.9, reviews: 14201, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 53,  category: 'beauty', emoji: '💫', brand: 'Jo Malone',     name: '잉글리시 페어 & 프리지아 + 피오니 콜롱 세트', price: 390000,    original: 450000,    rating: 4.7, reviews: 31201, shipping: '당일 특급배송', badge: null },
  { id: 54,  category: 'beauty', emoji: '🔬', brand: 'Dyson',         name: 'Airwrap Multi-Styler Complete Long 골드',     price: 849000,    original: 979000,    rating: 4.8, reviews: 48201, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 55,  category: 'beauty', emoji: '💎', brand: 'NuFACE',        name: 'Trinity+ ELE 안면 리프팅 디바이스 세트',      price: 590000,    original: 690000,    rating: 4.7, reviews: 9031,  shipping: '당일 특급배송', badge: null },
  { id: 56,  category: 'beauty', emoji: '👄', brand: 'Chanel',        name: 'Les Exclusifs 립스틱 컬렉션 15종 럭셔리 세트', price: 1290000,   original: 1490000,   rating: 4.9, reviews: 3201,  shipping: '당일 특급배송', badge: 'LUXURY' },

  // ── 가전/생활 ─────────────────────────────────────────────────
  { id: 57,  category: 'appliance', emoji: '🍳', brand: 'Thermomix',  name: 'Thermomix TM7 스마트 쿠킹 시스템',            price: 2490000,   original: 2790000,   rating: 4.8, reviews: 12031, shipping: '설치 포함', badge: null },
  { id: 58,  category: 'appliance', emoji: '☕', brand: 'De\'Longhi', name: 'La Specialista Maestro 전자동 에스프레소',    price: 1490000,   original: 1790000,   rating: 4.9, reviews: 18201, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 59,  category: 'appliance', emoji: '🫧', brand: 'Miele',      name: 'Miele G7985 스팀 식기세척기 + 설치',          price: 4900000,   original: 5800000,   rating: 4.9, reviews: 3201,  shipping: '설치 포함', badge: null },
  { id: 60,  category: 'appliance', emoji: '🌀', brand: 'Dyson',      name: 'Dyson V15 Detect Absolute Extra 청소기',      price: 1090000,   original: 1290000,   rating: 4.8, reviews: 52031, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 61,  category: 'appliance', emoji: '💨', brand: 'Dyson',      name: 'Dyson Purifier Hot+Cool Formaldehyde HP09',   price: 1290000,   original: 1490000,   rating: 4.7, reviews: 28301, shipping: '당일 특급배송', badge: null },
  { id: 62,  category: 'appliance', emoji: '🧺', brand: 'Miele',      name: 'WTD 160 WCS PowerWash 워시케어 드럼세탁기',   price: 4200000,   original: 5100000,   rating: 4.9, reviews: 4201,  shipping: '설치 포함', badge: null },
  { id: 63,  category: 'appliance', emoji: '❄️', brand: 'Samsung',    name: 'BESPOKE 냉장고 4도어 패밀리허브 패널레스',    price: 4990000,   original: 5990000,   rating: 4.8, reviews: 8201,  shipping: '설치 포함', badge: null },
  { id: 64,  category: 'appliance', emoji: '🍽️', brand: 'Gaggenau',   name: 'Gaggenau VF 230 빌트인 스팀컨벡션오븐',       price: 8900000,   original: 10500000,  rating: 4.9, reviews: 1023,  shipping: '설치 포함', badge: 'LUXURY' },
  { id: 65,  category: 'appliance', emoji: '💡', brand: 'Philips Hue','name': 'Hue 스마트홈 그랜드 패키지 Matter 지원',    price: 890000,    original: 1050000,   rating: 4.7, reviews: 14031, shipping: '당일 특급배송', badge: null },
  { id: 66,  category: 'appliance', emoji: '🤖', brand: 'Roborock',   name: 'Roborock S9 MaxV Ultra 로봇청소기',           price: 1590000,   original: 1890000,   rating: 4.8, reviews: 22031, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 67,  category: 'appliance', emoji: '🛁', brand: 'LAUFEN',     name: 'LAUFEN SaphirKeramik 프리스탠딩 욕조 + 수전', price: 12000000,  original: 15000000,  rating: 4.9, reviews: 412,   shipping: '설치 포함', badge: 'LUXURY' },

  // ── 식품/와인 ─────────────────────────────────────────────────
  { id: 68,  category: 'food', emoji: '🍷', brand: 'Pétrus',          name: 'Pétrus 2015 Pomerol 750ml',                  price: 3800000,   original: 4500000,   rating: 5.0, reviews: 312,   shipping: '냉장 특급배송', badge: 'RARE' },
  { id: 69,  category: 'food', emoji: '🍾', brand: 'Dom Pérignon',    name: 'Dom Pérignon Vintage 2015 + 선물 박스',       price: 680000,    original: 790000,    rating: 5.0, reviews: 2103,  shipping: '냉장 특급배송', badge: null },
  { id: 70,  category: 'food', emoji: '🍾', brand: 'Krug',            name: 'Krug Grande Cuvée 170ème 750ml',              price: 890000,    original: 980000,    rating: 5.0, reviews: 1201,  shipping: '냉장 특급배송', badge: null },
  { id: 71,  category: 'food', emoji: '🥃', brand: 'Macallan',        name: 'Macallan 25 Year Old Sherry Oak 750ml',       price: 2900000,   original: 3500000,   rating: 5.0, reviews: 821,   shipping: '특급 안전배송', badge: 'RARE' },
  { id: 72,  category: 'food', emoji: '🥃', brand: 'Yamazaki',        name: '야마자키 18년산 싱글몰트 700ml',               price: 1800000,   original: 2200000,   rating: 5.0, reviews: 1023,  shipping: '특급 안전배송', badge: null },
  { id: 73,  category: 'food', emoji: '🥩', brand: 'Wagyu World',     name: '미야자키 와규 A5 스테이크 세트 2kg',           price: 680000,    original: 790000,    rating: 4.9, reviews: 8201,  shipping: '냉장 당일배송', badge: 'BEST' },
  { id: 74,  category: 'food', emoji: '🦞', brand: 'Premium Sea',     name: '노르웨이 랍스터 홀 2kg + 가다랑어 비스크',     price: 290000,    original: 350000,    rating: 4.8, reviews: 5021,  shipping: '냉장 당일배송', badge: null },
  { id: 75,  category: 'food', emoji: '🫒', brand: 'Eataly',          name: '이탈리아 프리미엄 미식 선물세트 25종',          price: 490000,    original: 580000,    rating: 4.8, reviews: 6201,  shipping: '당일 특급배송', badge: null },
  { id: 76,  category: 'food', emoji: '🍫', brand: 'Valrhona',        name: 'Valrhona 그랑 크뤼 컬렉션 초콜릿 박스 32종',  price: 180000,    original: 220000,    rating: 4.9, reviews: 12031, shipping: '당일 특급배송', badge: null },
  { id: 77,  category: 'food', emoji: '🫖', brand: 'TWG Tea',         name: 'TWG 럭셔리 티 컬렉션 365 캐니스터 세트',      price: 890000,    original: 1050000,   rating: 4.8, reviews: 4201,  shipping: '당일 특급배송', badge: null },
  { id: 78,  category: 'food', emoji: '🍱', brand: 'Fauchon',         name: 'Fauchon Paris 구르메 함바구르 선물 박스',       price: 290000,    original: 350000,    rating: 4.7, reviews: 8901,  shipping: '당일 특급배송', badge: null },

  // ── 스포츠/아웃도어 ───────────────────────────────────────────
  { id: 79,  category: 'sports', emoji: '⛳', brand: 'Titleist',      name: 'Titleist Pro V1x 골프공 72개 + 캐디백',        price: 590000,    original: 690000,    rating: 4.9, reviews: 28301, shipping: '당일 특급배송', badge: 'BEST' },
  { id: 80,  category: 'sports', emoji: '🏌️', brand: 'TaylorMade',   name: 'Qi35 LS 드라이버 + 아이언 8i 풀세트',          price: 4900000,   original: 5800000,   rating: 4.9, reviews: 5021,  shipping: '당일 특급배송', badge: null },
  { id: 81,  category: 'sports', emoji: '🎾', brand: 'Babolat',       name: 'Pure Aero RAFA 라켓 + 테니스백 풀셋',          price: 490000,    original: 590000,    rating: 4.8, reviews: 9201,  shipping: '당일 특급배송', badge: null },
  { id: 82,  category: 'sports', emoji: '🏄', brand: 'Rip Curl',      name: 'E-Bomb 서핑보드 7\'0" + 웻슈트 프로',           price: 1890000,   original: 2200000,   rating: 4.7, reviews: 1201,  shipping: '3일 내 배송', badge: null },
  { id: 83,  category: 'sports', emoji: '🏋️', brand: 'Technogym',    name: 'Technogym Bike 스마트 실내 자전거',             price: 2990000,   original: 3490000,   rating: 4.9, reviews: 3201,  shipping: '설치 포함', badge: 'LUXURY' },
  { id: 84,  category: 'sports', emoji: '🧘', brand: 'Peloton',       name: 'Peloton Tread+ 트레드밀 + 1년 구독권',          price: 4500000,   original: 5200000,   rating: 4.8, reviews: 4201,  shipping: '설치 포함', badge: null },
  { id: 85,  category: 'sports', emoji: '🎿', brand: 'Nordica',       name: 'Nordica Enforcer 110 스키 + 부츠 패키지',      price: 1890000,   original: 2290000,   rating: 4.8, reviews: 2103,  shipping: '3일 내 배송', badge: null },
  { id: 86,  category: 'sports', emoji: '🚴', brand: 'Specialized',   name: 'S-Works Tarmac SL8 탄소 로드바이크 Di2',       price: 12000000,  original: 14500000,  rating: 5.0, reviews: 812,   shipping: '3일 내 배송', badge: 'PRO' },
  { id: 87,  category: 'sports', emoji: '🏊', brand: 'HUUB',          name: 'HUUB Aguanta Xtrem 철인3종 풀슈트',            price: 890000,    original: 1050000,   rating: 4.8, reviews: 2031,  shipping: '당일 특급배송', badge: null },

  // ── 가구/인테리어 ─────────────────────────────────────────────
  { id: 88,  category: 'furniture', emoji: '🛋️', brand: 'B&B Italia', name: 'B&B Italia Tufty-Time 소파 풀 가죽 3인',       price: 18000000,  original: 22000000,  rating: 4.9, reviews: 312,   shipping: '배송+설치', badge: 'LUXURY' },
  { id: 89,  category: 'furniture', emoji: '🪑', brand: 'Vitra',       name: 'Vitra Eames 라운지 체어 & 오토만 블랙',        price: 7900000,   original: 9200000,   rating: 4.9, reviews: 1023,  shipping: '배송+설치', badge: null },
  { id: 90,  category: 'furniture', emoji: '🛏️', brand: 'Hästens',    name: 'Hästens 2000T 킹사이즈 침대+프레임+토퍼',      price: 28000000,  original: 35000000,  rating: 5.0, reviews: 201,   shipping: '배송+설치', badge: 'LUXURY' },
  { id: 91,  category: 'furniture', emoji: '🪞', brand: 'Flos',        name: 'Flos Arco LED 플로어 스탠드 마블 베이스',      price: 3900000,   original: 4500000,   rating: 4.9, reviews: 892,   shipping: '배송+설치', badge: null },
  { id: 92,  category: 'furniture', emoji: '🖼️', brand: 'Cassina',     name: 'Cassina LC2 암체어 페리앙 에디션 블랙',        price: 6500000,   original: 7800000,   rating: 4.9, reviews: 512,   shipping: '배송+설치', badge: null },
  { id: 93,  category: 'furniture', emoji: '🪴', brand: 'Natuzzi',     name: 'Natuzzi Editions 풀가죽 리클라이너 소파',      price: 5200000,   original: 6300000,   rating: 4.8, reviews: 2103,  shipping: '배송+설치', badge: null },
  { id: 94,  category: 'furniture', emoji: '🏺', brand: 'Louis Poulsen', name: 'PH 5 Classic 서스펜션 조명 화이트',          price: 1890000,   original: 2100000,   rating: 4.9, reviews: 3201,  shipping: '당일 특급배송', badge: null },
  { id: 95,  category: 'furniture', emoji: '🛁', brand: 'Minotti',     name: 'Minotti Leon 오크 다이닝 테이블 280cm',        price: 14000000,  original: 17000000,  rating: 4.9, reviews: 312,   shipping: '배송+설치', badge: 'LUXURY' },

  // ── 자동차 ────────────────────────────────────────────────────
  { id: 96,  category: 'car', emoji: '🏎️', brand: 'Ferrari',          name: 'Ferrari SF90 XX Stradale — 계약 패키지',      price: 1300000000,original: 1500000000,rating: 5.0, reviews: 12,    shipping: '인도 일정 협의', badge: 'EXCLUSIVE' },
  { id: 97,  category: 'car', emoji: '🚙', brand: 'Lamborghini',       name: 'Urus SE PHEV 퍼포르만테 — 계약 패키지',        price: 580000000, original: 630000000, rating: 5.0, reviews: 28,    shipping: '인도 일정 협의', badge: 'EXCLUSIVE' },
  { id: 98,  category: 'car', emoji: '🚗', brand: 'Porsche',           name: 'Porsche 911 Turbo S E-Hybrid Cabriolet',      price: 290000000, original: 320000000, rating: 5.0, reviews: 89,    shipping: '인도 일정 협의', badge: 'VIP' },
  { id: 99,  category: 'car', emoji: '🚗', brand: 'Bentley',           name: 'Bentayga EWB Azure 뮬리너 에디션',             price: 450000000, original: 520000000, rating: 5.0, reviews: 45,    shipping: '인도 일정 협의', badge: 'LUXURY' },
  { id: 100, category: 'car', emoji: '🚗', brand: 'Rolls-Royce',       name: 'Ghost Series II 스타라이트 헤드라이너',        price: 650000000, original: 750000000, rating: 5.0, reviews: 23,    shipping: '인도 일정 협의', badge: 'LUXURY' },
  { id: 101, category: 'car', emoji: '🏎️', brand: 'McLaren',           name: 'McLaren 750S Spider 볼카닉 오렌지',            price: 430000000, original: 490000000, rating: 5.0, reviews: 34,    shipping: '인도 일정 협의', badge: null },
  { id: 102, category: 'car', emoji: '⚡', brand: 'Tesla',             name: 'Tesla Cybertruck CT Beast AWD FSD 포함',      price: 99000000,  original: 115000000, rating: 4.7, reviews: 2301,  shipping: '3개월 내 인도', badge: null },
  { id: 103, category: 'car', emoji: '⚡', brand: 'Porsche',           name: 'Porsche Taycan Turbo GT 바이스사흐 패키지',    price: 280000000, original: 320000000, rating: 5.0, reviews: 201,   shipping: '인도 일정 협의', badge: 'PRO' },
  { id: 104, category: 'car', emoji: '🛞', brand: 'Pirelli',           name: 'Pirelli P Zero Trofeo RS 295/30 R21 4본',     price: 2800000,   original: 3200000,   rating: 4.9, reviews: 4201,  shipping: '당일 특급배송', badge: null },
  { id: 105, category: 'car', emoji: '🔧', brand: 'Akrapovič',         name: 'Akrapovič 포르쉐 911 GT3 RS 풀 티타늄 배기',  price: 8900000,   original: 10500000,  rating: 5.0, reviews: 812,   shipping: '3일 내 배송', badge: null },

  // ── 여행/호텔 ─────────────────────────────────────────────────
  { id: 106, category: 'travel', emoji: '✈️', brand: 'Singapore Airlines', name: '싱가포르항공 스위트 서울→뉴욕 왕복 2인',  price: 48000000,  original: 60000000,  rating: 5.0, reviews: 1823,  shipping: '즉시 발권', badge: 'VIP' },
  { id: 107, category: 'travel', emoji: '✈️', brand: 'Korean Air',    name: '대한항공 프레스티지 파리→서울 왕복 2인',        price: 16000000,  original: 20000000,  rating: 4.9, reviews: 8201,  shipping: '즉시 발권', badge: null },
  { id: 108, category: 'travel', emoji: '🏨', brand: 'Aman',           name: '아만 도쿄 그랜드 스위트 3박 + 오마카세 2인',   price: 18000000,  original: 22000000,  rating: 5.0, reviews: 1023,  shipping: '즉시 예약', badge: 'LUXURY' },
  { id: 109, category: 'travel', emoji: '🏨', brand: 'Four Seasons',   name: '포시즌스 몰디브 워터빌라 5박 2인',             price: 22000000,  original: 28000000,  rating: 5.0, reviews: 2103,  shipping: '즉시 예약', badge: 'LUXURY' },
  { id: 110, category: 'travel', emoji: '🏨', brand: 'Burj Al Arab',   name: '버즈 알 아랍 시그니처 스위트 2박 2인',          price: 15000000,  original: 19000000,  rating: 5.0, reviews: 3201,  shipping: '즉시 예약', badge: 'LUXURY' },
  { id: 111, category: 'travel', emoji: '🛥️', brand: 'Azimut',         name: '지중해 슈퍼요트 전세 7일 (16인, 승무원 포함)', price: 180000000, original: 220000000, rating: 5.0, reviews: 89,    shipping: '일정 협의', badge: 'EXCLUSIVE' },
  { id: 112, category: 'travel', emoji: '🚁', brand: 'Airbus Corporate', name: '제주 프라이빗 헬기 투어 2시간 4인',          price: 4800000,   original: 5800000,   rating: 4.9, reviews: 512,   shipping: '즉시 예약', badge: 'VIP' },
  { id: 113, category: 'travel', emoji: '🌋', brand: 'SpaceX',         name: 'Inspiration5 민간 우주여행 탑승권 1인',        price: 6000000000,original: 7000000000,rating: 5.0, reviews: 4,     shipping: '발사 스케줄 협의', badge: 'EXCLUSIVE' },
  { id: 114, category: 'travel', emoji: '🎿', brand: 'Courchevel',     name: '쿠쉐벨 1850 샬레 전세 7박 + 스키 패스',        price: 35000000,  original: 42000000,  rating: 5.0, reviews: 312,   shipping: '즉시 예약', badge: null },

  // ── 주얼리/시계 ───────────────────────────────────────────────
  { id: 115, category: 'jewelry', emoji: '⌚', brand: 'Rolex',          name: 'Rolex Daytona 18K 오이스터스틸 다이아베젤',   price: 98000000,  original: 115000000, rating: 5.0, reviews: 1023,  shipping: '전용 쿠리어', badge: 'RARE' },
  { id: 116, category: 'jewelry', emoji: '⌚', brand: 'Patek Philippe', name: 'Patek Philippe Nautilus 5711 스틸 블루다이얼', price: 280000000, original: 350000000, rating: 5.0, reviews: 212,   shipping: '전용 쿠리어', badge: 'EXCLUSIVE' },
  { id: 117, category: 'jewelry', emoji: '⌚', brand: 'Audemars Piguet','name': 'Royal Oak Perpetual Calendar 41mm 화이트골드', price: 190000000, original: 230000000, rating: 5.0, reviews: 189,   shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 118, category: 'jewelry', emoji: '⌚', brand: 'Richard Mille',  name: 'Richard Mille RM 11-03 McLaren 플라이백',     price: 450000000, original: 520000000, rating: 5.0, reviews: 67,    shipping: '전용 쿠리어', badge: 'EXCLUSIVE' },
  { id: 119, category: 'jewelry', emoji: '💍', brand: 'Cartier',        name: 'Cartier Love 브레이슬렛 18K 옐로우골드 다이아', price: 12000000,  original: 14000000,  rating: 5.0, reviews: 4201,  shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 120, category: 'jewelry', emoji: '💍', brand: 'Tiffany',        name: 'Tiffany Diamond 약혼반지 3ct GIA D-FL',       price: 89000000,  original: 105000000, rating: 5.0, reviews: 312,   shipping: '전용 쿠리어', badge: 'RARE' },
  { id: 121, category: 'jewelry', emoji: '📿', brand: 'Van Cleef & Arpels', name: 'Alhambra VCA 목걸이 18K 어니언스킨',    price: 7800000,   original: 9200000,   rating: 5.0, reviews: 2103,  shipping: '전용 쿠리어', badge: 'LUXURY' },
  { id: 122, category: 'jewelry', emoji: '💎', brand: 'Graff',          name: 'Graff Diamonds 다이아몬드 파베 리벳 목걸이',  price: 95000000,  original: 115000000, rating: 5.0, reviews: 89,    shipping: '전용 쿠리어', badge: 'EXCLUSIVE' },
  { id: 123, category: 'jewelry', emoji: '⌚', brand: 'Hublot',         name: 'Big Bang Integral 45mm 세라믹 올블랙',        price: 28000000,  original: 33000000,  rating: 4.9, reviews: 1823,  shipping: '전용 쿠리어', badge: null },
];

const flashDeals = [
  { emoji: '🍾', name: 'Dom Pérignon Vintage 2015', price: 680000, discount: '30%' },
  { emoji: '🎮', name: 'PlayStation 5 Pro 특가', price: 749000, discount: '12%' },
  { emoji: '🥩', name: '미야자키 와규 A5 2kg 세트', price: 680000, discount: '25%' },
  { emoji: '💄', name: 'La Mer 크렘 한정 세트', price: 1490000, discount: '15%' },
  { emoji: '🎧', name: 'Sony WH-1000XM6', price: 479000, discount: '13%' },
  { emoji: '🌹', name: '에콰도르 장미 200송이', price: 180000, discount: '20%' },
  { emoji: '☕', name: 'De\'Longhi 에스프레소 머신', price: 1490000, discount: '17%' },
  { emoji: '🕯️', name: 'Diptyque 캔들 컬렉션 10종', price: 380000, discount: '18%' },
  { emoji: '🍫', name: 'Valrhona 초콜릿 럭셔리 박스', price: 180000, discount: '22%' },
  { emoji: '⌚', name: 'Hublot Big Bang 한정판', price: 28000000, discount: '15%' },
];

// ── STATE ──────────────────────────────────────────────────────
let cart = [];
let filteredProducts = [...products];
let currentOrderId = null;

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  renderFlashDeals();
  startCountdown();
});

// ── RENDER ─────────────────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge ${['VIP','LUXURY','EXCLUSIVE','RARE'].includes(p.badge) ? 'gold' : ''}">${p.badge}</div>` : ''}
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">⭐ ${p.rating} <span>(${p.reviews.toLocaleString()}개 리뷰)</span></div>
        <div class="product-price-row">
          <div class="product-price">₩${p.price.toLocaleString()}</div>
          <div class="product-original">₩${p.original.toLocaleString()}</div>
          <div class="product-discount">${Math.round((1 - p.price / p.original) * 100)}%↓</div>
        </div>
        <div class="product-shipping">💳 ${p.shipping}</div>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${p.id})">🛒 담기</button>
          <button class="btn-buy" onclick="buyNow(${p.id})">바로 구매</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFlashDeals() {
  document.getElementById('flashDeals').innerHTML = flashDeals.map(f => `
    <div class="flash-item" onclick="alert('🔥 특가 상품이 장바구니에 담겼습니다!')">
      <div class="flash-thumb">${f.emoji}</div>
      <div class="flash-info">
        <div class="flash-name">${f.name}</div>
        <div class="flash-price">₩${f.price.toLocaleString()} <span class="flash-discount">${f.discount}</span></div>
      </div>
    </div>
  `).join('');
}

// ── COUNTDOWN ──────────────────────────────────────────────────
function startCountdown() {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  setInterval(() => {
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) { document.getElementById('countdown').textContent = '00:00:00'; return; }
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ── SEARCH & FILTER ────────────────────────────────────────────
function searchProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const result = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );
  renderProducts(result);
  document.getElementById('categoryTitle').textContent = `"${q}" 검색 결과 (${result.length}개)`;
}

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchProducts();
});

function filterCategory(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const catNames = {
    all: '전체 상품', electronics: '전자제품', fashion: '패션/명품',
    beauty: '뷰티/화장품', appliance: '가전/생활', food: '식품/와인',
    sports: '스포츠/아웃도어', furniture: '가구/인테리어', car: '자동차',
    travel: '여행/호텔', jewelry: '주얼리/시계'
  };
  document.getElementById('categoryTitle').textContent = catNames[cat] || '전체 상품';
  filteredProducts = cat === 'all' ? [...products] : products.filter(p => p.category === cat);
  renderProducts(filteredProducts);
}

function sortProducts(by) {
  const sorted = [...filteredProducts];
  if (by === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (by === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (by === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  renderProducts(sorted);
}

// ── CART ───────────────────────────────────────────────────────
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartUI();
  showCartToast(p.name);
}

function buyNow(id) {
  cart = [];
  addToCart(id);
  openCheckout();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('cartCount').textContent = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cartTotal').textContent = '₩' + total.toLocaleString();
  document.getElementById('cartItems').innerHTML = cart.length === 0
    ? '<div style="text-align:center;color:#aaa;padding:40px">장바구니가 비어있습니다</div>'
    : cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          </div>
        </div>
        <span class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</span>
      </div>
    `).join('');
}

function showCartToast(name) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#c9a84c;padding:12px 24px;border-radius:12px;font-weight:700;z-index:9999;font-size:14px;border:1px solid #c9a84c;animation:slideUp .3s ease';
  t.textContent = `✅ "${name.slice(0, 22)}..." 장바구니 추가!`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ── CHECKOUT ───────────────────────────────────────────────────
function goToCheckout() {
  if (cart.length === 0) return alert('장바구니가 비어있습니다');
  toggleCart();
  openCheckout();
}

function openCheckout() {
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('payAmount').textContent = total.toLocaleString();
  document.getElementById('checkoutSummary').innerHTML = `
    ${cart.map(item => `
      <div class="checkout-summary-item">
        <span>${item.emoji} ${item.name.slice(0, 24)}... × ${item.qty}</span>
        <span>₩${(item.price * item.qty).toLocaleString()}</span>
      </div>
    `).join('')}
    <hr style="margin:10px 0;border:none;border-top:1px solid #eee">
    <div class="checkout-summary-item" style="font-weight:800">
      <span>💳 블랙카드 결제 총액</span>
      <span style="color:#c9a84c">₩${total.toLocaleString()}</span>
    </div>
    <div class="checkout-summary-item" style="color:#2ecc71;font-size:12px">
      <span>✈️ 배송비</span><span>무료 (블랙카드 혜택)</span>
    </div>
  `;
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
}

async function placeOrder() {
  const address = document.getElementById('addressInput').value.trim();
  const recipient = document.getElementById('recipientInput').value.trim();
  if (!address || !recipient) { alert('배송지와 받는 분을 입력해주세요'); return; }

  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);

  const btn = document.querySelector('.confirm-btn');
  btn.textContent = '결제 처리 중...';
  btn.disabled = true;

  await new Promise(r => setTimeout(r, 1200));

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total, address: `${address} (${recipient})` }),
    });
    const data = await res.json();
    currentOrderId = data.orderId;

    closeCheckout();
    cart = [];
    updateCartUI();

    document.getElementById('orderIdDisplay').textContent = currentOrderId;
    document.getElementById('successOverlay').classList.add('open');
  } catch (e) {
    alert('결제 오류가 발생했습니다. 다시 시도해주세요.');
  } finally {
    btn.textContent = '결제 완료 ₩' + document.getElementById('payAmount').textContent;
    btn.disabled = false;
  }
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('open');
}

// ── TRACKING ───────────────────────────────────────────────────
function goToTracking() {
  document.getElementById('successOverlay').classList.remove('open');
  showTrackingPage(currentOrderId);
}

function backToShop() {
  document.getElementById('trackingPage').classList.add('hidden');
}

async function showTrackingPage(orderId) {
  document.getElementById('trackingPage').classList.remove('hidden');
  document.getElementById('trackingTimeline').innerHTML = '<div style="text-align:center;padding:40px;color:#aaa">로딩 중...</div>';
  await refreshTracking(orderId);
}

async function refreshTracking(orderId) {
  const id = orderId || currentOrderId;
  if (!id) return;
  try {
    const res = await fetch(`/api/order/${id}`);
    if (!res.ok) { alert('주문을 찾을 수 없습니다'); return; }
    const order = await res.json();
    renderTrackingPage(order);
  } catch (e) {
    alert('조회 오류가 발생했습니다.');
  }
}

function renderTrackingPage(order) {
  const currentStage = order.stages.find(s => s.current);

  document.getElementById('trackingOrderInfo').innerHTML = `
    <p><strong>주문번호</strong> &nbsp;${order.orderId}</p>
    <p><strong>배송지</strong> &nbsp;${order.address}</p>
    <p><strong>현재 상태</strong> &nbsp;<span style="color:var(--gold);font-weight:800">${currentStage?.label || '확인 중'}</span></p>
    <p><strong>결제 금액</strong> &nbsp;₩${order.total.toLocaleString()} (블랙카드 자동 결제)</p>
  `;

  document.getElementById('trackingTimeline').innerHTML = `
    <h3 style="margin-bottom:20px;font-size:16px;font-weight:800">배송 현황</h3>
    ${order.stages.map(s => `
      <div class="timeline-item ${s.done ? 'done' : ''} ${s.current ? 'current' : ''}">
        <div class="timeline-dot">${s.done ? s.icon : '○'}</div>
        <div class="timeline-info">
          <div class="timeline-label">
            ${s.label}
            ${s.current ? '<span class="timeline-current-badge">현재</span>' : ''}
          </div>
          ${s.time ? `<div class="timeline-time">${s.time}</div>` : ''}
        </div>
      </div>
    `).join('')}
  `;

  document.getElementById('trackingItems').innerHTML = `
    <h3>주문 상품</h3>
    ${order.items.map(item => `
      <div class="tracking-item">
        <div class="tracking-item-emoji">${item.emoji}</div>
        <div class="tracking-item-name">${item.name} × ${item.qty}</div>
        <div class="tracking-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('')}
  `;
}

// ── CARD MODAL ─────────────────────────────────────────────────
function showCardModal() {
  document.getElementById('cardModalOverlay').classList.add('open');
}
function closeCardModal() {
  document.getElementById('cardModalOverlay').classList.remove('open');
}
document.getElementById('cardModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('cardModalOverlay')) closeCardModal();
});
document.getElementById('checkoutOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
});
document.getElementById('successOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('successOverlay')) closeSuccess();
});
