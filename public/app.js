// ═══════════════════════════════════════════════════════════════
//  BLACKCARD — Luxury Shop (Static, Client-Side, 3000+ products)
// ═══════════════════════════════════════════════════════════════

// ── PRODUCT TEMPLATES ──────────────────────────────────────────
// Format: [category, emoji, brand, baseName, basePrice, [variant1[], variant2[]?]]
// Each template generates len(variant1) * len(variant2) products.
const TPL = [

  // ═══ ELECTRONICS — Smartphones ═══
  ['electronics','📱','Apple','iPhone 16 Pro Max',2190000,[['256GB','512GB','1TB'],['자연 티타늄','데저트 티타늄','화이트 티타늄','블랙 티타늄']]],
  ['electronics','📱','Apple','iPhone 16 Pro',1690000,[['128GB','256GB','512GB','1TB'],['자연 티타늄','데저트 티타늄','화이트 티타늄','블랙 티타늄']]],
  ['electronics','📱','Apple','iPhone 16 Plus',1390000,[['128GB','256GB','512GB'],['울트라마린','틸','핑크','화이트','블랙']]],
  ['electronics','📱','Apple','iPhone 16',1250000,[['128GB','256GB','512GB'],['울트라마린','틸','핑크','화이트','블랙']]],
  ['electronics','📱','Apple','iPhone 15 Pro',1290000,[['128GB','256GB','512GB'],['내추럴','블랙','화이트','블루']]],
  ['electronics','📱','Samsung','Galaxy S25 Ultra',1890000,[['256GB','512GB','1TB'],['티타늄 블랙','티타늄 그레이','티타늄 실버','티타늄 화이트']]],
  ['electronics','📱','Samsung','Galaxy S25+',1390000,[['256GB','512GB'],['아이시 블루','코랄 레드','민트','네이비']]],
  ['electronics','📱','Samsung','Galaxy S25',1190000,[['128GB','256GB','512GB'],['아이시 블루','코랄 레드','민트','네이비']]],
  ['electronics','📱','Samsung','Galaxy Z Fold 7',2490000,[['256GB','512GB','1TB'],['크림 골드','문스톤 그레이','네이비']]],
  ['electronics','📱','Samsung','Galaxy Z Flip 7',1690000,[['256GB','512GB'],['민트','크림','블루','실버 섀도우']]],
  ['electronics','📱','Google','Pixel 9 Pro XL',1490000,[['128GB','256GB','512GB','1TB'],['오브시디언','포셀린','헤이즐','로즈 쿼츠']]],
  ['electronics','📱','Google','Pixel 9 Pro',1290000,[['128GB','256GB','512GB'],['오브시디언','포셀린','헤이즐']]],
  ['electronics','📱','Xiaomi','14 Ultra',1490000,[['256GB','512GB','1TB'],['블랙','화이트','블루']]],
  ['electronics','📱','Sony','Xperia 1 VI',1690000,[['256GB','512GB'],['블랙','플래티넘 실버','카키 그린']]],
  ['electronics','📱','OnePlus','13 Pro',1190000,[['256GB','512GB'],['오로라','미드나잇 오션','옵시디언']]],

  // ═══ ELECTRONICS — Laptops ═══
  ['electronics','💻','Apple','MacBook Pro 16"',6990000,[['M4 Pro 36GB','M4 Max 48GB','M4 Max 128GB'],['스페이스 블랙','실버']]],
  ['electronics','💻','Apple','MacBook Pro 14"',2990000,[['M4 16GB','M4 Pro 24GB','M4 Max 48GB'],['스페이스 블랙','실버']]],
  ['electronics','💻','Apple','MacBook Air 15"',1890000,[['M3 16GB','M3 24GB'],['미드나이트','스카이 블루','스타라이트','스페이스 그레이']]],
  ['electronics','💻','Apple','MacBook Air 13"',1590000,[['M3 8GB','M3 16GB','M3 24GB'],['미드나이트','스카이 블루','스타라이트','스페이스 그레이']]],
  ['electronics','💻','LG','그램 Pro 17"',2490000,[['Ultra 7 16GB','Ultra 7 32GB','Ultra 9 32GB'],['옵시디언 블랙','화이트']]],
  ['electronics','💻','LG','그램 Pro 16"',2190000,[['Ultra 7 16GB','Ultra 7 32GB'],['옵시디언 블랙','화이트']]],
  ['electronics','💻','Samsung','Galaxy Book4 Ultra',2590000,[['Ultra 7 16GB','Ultra 9 32GB'],['문 그레이','문스톤']]],
  ['electronics','💻','Microsoft','Surface Laptop 7',1990000,[['Snapdragon X 16GB','Snapdragon X Plus 32GB'],['플래티넘','블랙','사파이어','두네']]],
  ['electronics','💻','Microsoft','Surface Pro 11',2190000,[['16GB','32GB'],['플래티넘','블랙','사파이어','두네']]],
  ['electronics','💻','Dell','XPS 17 Pro',3290000,[['i7 32GB','i9 64GB'],['플래티넘','그래파이트']]],
  ['electronics','💻','ASUS','ROG Zephyrus G16',3490000,[['RTX 4080','RTX 4090'],['플래티넘 화이트','이클립스 그레이']]],
  ['electronics','💻','Razer','Blade 18',5990000,[['RTX 4090 32GB','RTX 4090 64GB'],['머큐리','블랙']]],

  // ═══ ELECTRONICS — TVs ═══
  ['electronics','📺','Samsung','Neo QLED 8K QN990D 98"',19900000,[['98인치','85인치','75인치','65인치']]],
  ['electronics','📺','Samsung','OLED S95D',7990000,[['77인치','65인치','55인치']]],
  ['electronics','📺','LG','OLED evo Gallery G4',9900000,[['97인치','83인치','77인치','65인치','55인치']]],
  ['electronics','📺','LG','OLED evo C4',4990000,[['83인치','77인치','65인치','55인치','48인치']]],
  ['electronics','📺','Sony','BRAVIA 9 Mini LED XR',7900000,[['85인치','75인치','65인치']]],
  ['electronics','📺','Sony','BRAVIA 8 OLED',5990000,[['77인치','65인치','55인치']]],
  ['electronics','📺','Hisense','UX Mini LED',4990000,[['100인치','85인치','75인치']]],
  ['electronics','📺','TCL','QM8 Mini LED',3990000,[['98인치','85인치','75인치','65인치']]],
  ['electronics','📺','Panasonic','Z95A OLED Master',6990000,[['77인치','65인치','55인치']]],

  // ═══ ELECTRONICS — Audio ═══
  ['electronics','🎧','Sony','WH-1000XM6',479000,[['블랙','실버','미드나이트 블루','플래티넘 실버']]],
  ['electronics','🎧','Apple','AirPods Max USB-C',729000,[['미드나이트','블루','오렌지','퍼플','스타라이트']]],
  ['electronics','🎧','Apple','AirPods Pro 2 USB-C',359000,[['화이트']]],
  ['electronics','🎧','Apple','AirPods 4 ANC',249000,[['화이트']]],
  ['electronics','🎧','Bose','QuietComfort Ultra Headphones',499000,[['블랙','화이트 스모크','샌드스톤','드라이프트 그레이']]],
  ['electronics','🎧','Bose','QuietComfort Ultra Earbuds',349000,[['블랙','화이트 스모크','문스톤 블루']]],
  ['electronics','🎧','Sennheiser','Momentum 4 Wireless',549000,[['블랙','화이트','코퍼']]],
  ['electronics','🎧','B&O','Beoplay H100',1990000,[['샌드 골드','네이처','블랙 안트라사이트']]],
  ['electronics','🎧','Bowers & Wilkins','Px8',790000,[['블랙','테이프 그레이','로얄 블루','007 에디션']]],
  ['electronics','🎵','Sonos','Era 300',699000,[['블랙','화이트']]],
  ['electronics','🎵','Sonos','Arc Ultra 사운드바',1490000,[['블랙','화이트']]],
  ['electronics','🔊','B&O','Beosound A9 5세대',4900000,[['골드 톤','내추럴','블랙 안트라사이트','실버']]],
  ['electronics','🔊','B&O','Beolab 90 플로어 스탠딩 (페어)',98000000,[['실버','블랙','화이트']]],
  ['electronics','🔊','KEF','LS60 Wireless',9900000,[['미네랄 화이트','로얄 블루','티타늄 그레이','카본 블랙']]],

  // ═══ ELECTRONICS — Wearables ═══
  ['electronics','⌚','Apple','Apple Watch Ultra 3 49mm',1290000,[['자연 티타늄','블랙 티타늄'],['트레일 루프','오션 밴드','알파인 루프']]],
  ['electronics','⌚','Apple','Apple Watch Series 10 46mm',649000,[['실버','로즈골드','자연','젯 블랙'],['스포츠 밴드','브레이슬렛','밀라네제']]],
  ['electronics','⌚','Apple','Apple Watch SE 44mm',379000,[['미드나이트','스타라이트','실버'],['스포츠 밴드','솔로 루프']]],
  ['electronics','⌚','Samsung','Galaxy Watch Ultra 47mm',890000,[['화이트골드','티타늄 실버','티타늄 그레이']]],
  ['electronics','⌚','Samsung','Galaxy Watch7',460000,[['크림','그린','실버']]],
  ['electronics','⌚','Garmin','Fenix 8 Sapphire Solar',1290000,[['51mm','47mm','43mm'],['티타늄 카본','티타늄 그레이']]],
  ['electronics','⌚','Garmin','MARQ Carbon 2세대',5900000,[['Adventurer','Aviator','Captain','Driver']]],

  // ═══ ELECTRONICS — Cameras ═══
  ['electronics','📷','Sony','Alpha 1 II 풀프레임 바디',8990000,[['바디 단품']]],
  ['electronics','📷','Sony','Alpha 9 III 풀프레임 바디',7990000,[['바디 단품']]],
  ['electronics','📷','Sony','Alpha 7R V',4990000,[['바디 단품','24-70mm 키트']]],
  ['electronics','📷','Canon','EOS R5 Mark II',6990000,[['바디 단품','RF 24-105mm 키트','RF 28-70mm F2 키트']]],
  ['electronics','📷','Canon','EOS R3',8990000,[['바디 단품']]],
  ['electronics','📷','Nikon','Z9',7990000,[['바디 단품']]],
  ['electronics','📷','Nikon','Z8',5490000,[['바디 단품','24-70mm 키트']]],
  ['electronics','📷','Fujifilm','GFX 100 II 미디엄포맷',12000000,[['바디 단품']]],
  ['electronics','📷','Fujifilm','X-H2S',3490000,[['바디 단품','18-55mm 키트']]],
  ['electronics','📷','Leica','SL3 풀프레임',18900000,[['바디 단품','APO-Summicron 35mm 키트','50mm Summicron 키트']]],
  ['electronics','📷','Leica','Q3 43',9900000,[['블랙']]],
  ['electronics','📷','Leica','M11 Monochrom',14900000,[['블랙']]],

  // ═══ ELECTRONICS — Tablets ═══
  ['electronics','💊','Apple','iPad Pro 13" M4',2190000,[['256GB','512GB','1TB','2TB'],['스페이스 블랙','실버']]],
  ['electronics','💊','Apple','iPad Pro 11" M4',1490000,[['256GB','512GB','1TB'],['스페이스 블랙','실버']]],
  ['electronics','💊','Apple','iPad Air 13" M3',1090000,[['128GB','256GB','512GB','1TB'],['스페이스 그레이','블루','퍼플','스타라이트']]],
  ['electronics','💊','Apple','iPad Mini 7',790000,[['128GB','256GB','512GB'],['스페이스 그레이','블루','퍼플','스타라이트']]],
  ['electronics','💊','Samsung','Galaxy Tab S10 Ultra',1690000,[['256GB','512GB','1TB'],['문 그레이']]],
  ['electronics','💊','Samsung','Galaxy Tab S10+',1290000,[['256GB','512GB'],['문 그레이','플래티넘 실버']]],

  // ═══ ELECTRONICS — Gaming ═══
  ['electronics','🎮','Sony','PlayStation 5 Pro',749000,[['디지털','디스크']]],
  ['electronics','🎮','Sony','PlayStation 5 Slim',649000,[['디지털','디스크']]],
  ['electronics','🎮','Microsoft','Xbox Series X',899000,[['1TB','2TB']]],
  ['electronics','🎮','Nintendo','Switch 2 OLED',590000,[['64GB','256GB']]],
  ['electronics','🎮','Valve','Steam Deck OLED',890000,[['512GB','1TB']]],
  ['electronics','🎮','ASUS','ROG Ally X',1290000,[['1TB']]],
  ['electronics','🎮','Meta','Quest 3 VR',790000,[['128GB','512GB']]],
  ['electronics','🎮','Sony','PlayStation VR2',650000,[['단품','HORIZON 번들']]],

  // ═══ ELECTRONICS — Smart Home / Misc ═══
  ['electronics','🖨️','DJI','DJI Matrice 4 Pro 드론',4900000,[['스탠다드 키트','컴비네이션 키트','케어 리프레시 패키지']]],
  ['electronics','🖨️','DJI','DJI Mavic 4 Pro',3490000,[['스탠다드','플라이 모어 콤보','크리에이터 콤보']]],
  ['electronics','🖨️','DJI','DJI Mini 4 Pro',1290000,[['단품','플라이 모어 콤보']]],
  ['electronics','🖨️','DJI','DJI Osmo Pocket 3',890000,[['표준 콤보','크리에이터 콤보']]],
  ['electronics','🖨️','GoPro','HERO 13 Black',590000,[['단품','크리에이터 에디션','어드벤처 번들']]],
  ['electronics','🖨️','Insta360','X4 360 액션캠',790000,[['단품','크리에이터 키트']]],
  ['electronics','🤖','Samsung','Ballie 홈 AI 로봇',2490000,[['단품']]],
  ['electronics','🤖','Boston Dynamics','Spot Explorer',95000000,[['Explorer','Enterprise','Arm 포함']]],
  ['electronics','🔋','Tesla','Powerwall 3',12000000,[['단품','솔라 패키지']]],
  ['electronics','🔋','EcoFlow','DELTA Pro Ultra',9900000,[['6kWh','12kWh','18kWh','24kWh']]],

  // ═══ ELECTRONICS — Monitors ═══
  ['electronics','🖥️','Apple','Studio Display 27"',2990000,[['스탠다드 글래스','나노텍스처'],['틸트 스탠드','높이 조절 스탠드']]],
  ['electronics','🖥️','Apple','Pro Display XDR 32"',7900000,[['스탠다드 글래스','나노텍스처']]],
  ['electronics','🖥️','LG','UltraFine OLED Pro 32"',3290000,[['단품','+캘리브레이션 키트']]],
  ['electronics','🖥️','Dell','UltraSharp 6K U3224KB',3990000,[['단품']]],
  ['electronics','🖥️','ASUS','ProArt PA32UCXR',5990000,[['단품']]],
  ['electronics','🖥️','Samsung','Odyssey OLED G9 49"',2290000,[['단품']]],
  ['electronics','🖥️','Eizo','ColorEdge CG2700X',4990000,[['단품']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ FASHION — Luxury Bags ═══
  ['fashion','👜','Hermès','Birkin 30 Togo',24000000,[['브라이트 오렌지','에토프','블랙','루즈 H','블루 인디고','베이지 듀느','말라카이트'],['팔라듐 HW','골드 HW']]],
  ['fashion','👜','Hermès','Birkin 25 Epsom',28000000,[['블랙','에토프','블루 누이','루즈 H','베이지'],['팔라듐 HW','골드 HW']]],
  ['fashion','👜','Hermès','Kelly 28 Epsom',20000000,[['블랙','에토프','루즈 드 꾀르','블루 인디고','베이지'],['팔라듐 HW','골드 HW']]],
  ['fashion','👜','Hermès','Kelly 25 Sellier',26000000,[['블랙','루즈 H','에토프'],['팔라듐 HW','골드 HW']]],
  ['fashion','👜','Hermès','Constance 24 Epsom',9800000,[['블랙','에토프','루즈','블루','베이지']]],
  ['fashion','👛','Chanel','Classic Flap 미디엄',16500000,[['블랙 캐비어','베이지 캐비어','블랙 램스킨','화이트 캐비어'],['골드 HW','실버 HW']]],
  ['fashion','👛','Chanel','Classic Flap 라지',18900000,[['블랙 캐비어','베이지 캐비어','블랙 램스킨'],['골드 HW','실버 HW']]],
  ['fashion','👛','Chanel','19 백 라지',9800000,[['블랙','베이지','화이트','네이비','버건디']]],
  ['fashion','👛','Chanel','Boy 백 미디엄',8900000,[['블랙 캐비어','블랙 램스킨','버건디']]],
  ['fashion','👛','Chanel','Coco Handle 미디엄',9200000,[['블랙','베이지','화이트','버건디']]],
  ['fashion','👛','Louis Vuitton','Capucines MM',9800000,[['블랙','오로르','베이지','루즈','네이비','화이트']]],
  ['fashion','👛','Louis Vuitton','Capucines BB',7900000,[['블랙','오로르','베이지','루즈','네이비']]],
  ['fashion','👛','Louis Vuitton','Twist MM',5900000,[['블랙','로즈','화이트','옐로','블루']]],
  ['fashion','👛','Louis Vuitton','OnTheGo MM',3990000,[['모노그램','다미에','엠피언트 카키','엠피언트 블랙']]],
  ['fashion','👛','Louis Vuitton','Neverfull MM',2890000,[['모노그램','다미에 에벤','다미에 아쥬르','모노그램 자이언트']]],
  ['fashion','👛','Dior','Lady Dior 미디엄',7200000,[['블랙','블루','베이지','로즈','화이트','네이비']]],
  ['fashion','👛','Dior','Book Tote 미디엄',4900000,[['블랙','화이트','블루','오블리크 베이지','오블리크 블루']]],
  ['fashion','👛','Dior','Saddle 백',5900000,[['블랙','로즈','오블리크 베이지','블루']]],
  ['fashion','👛','Gucci','Jackie 1961 미디엄',4900000,[['블랙','베이지','화이트','GG 캔버스']]],
  ['fashion','👛','Gucci','Bamboo 1947 스몰',5900000,[['블랙','베이지','버건디']]],
  ['fashion','👛','Prada','Galleria 사피아노 라지',5900000,[['블랙','화이트','베이지','블루','루즈']]],
  ['fashion','👛','Prada','Cleo 브러쉬드',4500000,[['블랙','화이트','코코아','베이지']]],
  ['fashion','👛','Bottega Veneta','Cassette 백',4900000,[['블랙','폰단테','뉴 카멜','블루','워머']]],
  ['fashion','👛','Bottega Veneta','Sardine 미디엄',5900000,[['블랙','뉴 카멜','폰단테']]],
  ['fashion','🎒','Goyard','Saint Louis PM',3200000,[['블랙','네이비','레드','그린','옐로','오렌지','부르고뉴','그레이']]],
  ['fashion','🎒','Goyard','Anjou Mini',3490000,[['블랙','네이비','레드','그린','옐로','오렌지']]],
  ['fashion','👜','Celine','Belt 백 미디엄',4900000,[['블랙','탄','베이지','네이비']]],
  ['fashion','👜','Loewe','Puzzle 백 미디엄',4500000,[['블랙','탄','화이트','오렌지','그린']]],
  ['fashion','👜','Saint Laurent','Loulou 미디엄',3900000,[['블랙','다크 베이지','버건디','다크 그린']]],

  // ═══ FASHION — Shoes & Sneakers ═══
  ['fashion','👟','Louis Vuitton','LV Trainer 스니커즈',1650000,[['모노그램 화이트','모노그램 블랙','자이언트 블루','데님','블랙 가죽']]],
  ['fashion','👟','Louis Vuitton','LV Archlight 2.0',1390000,[['화이트','블랙','블루','핑크']]],
  ['fashion','👟','Dior','B23 하이탑',1450000,[['오블리크 화이트','오블리크 블랙','블랙 모노','화이트 모노']]],
  ['fashion','👟','Dior','B27 미드탑',1390000,[['화이트','블랙','베이지','네이비']]],
  ['fashion','👟','Balenciaga','Triple S',1450000,[['화이트','블랙','베이지','네이비','옐로']]],
  ['fashion','👟','Balenciaga','Speed Sock 트레이너',990000,[['블랙','화이트','네이비']]],
  ['fashion','👟','Chanel','Sneakers',1290000,[['화이트','블랙','베이지','핑크']]],
  ['fashion','👟','Gucci','Rhyton 스니커즈',1190000,[['화이트','블랙','베이지']]],
  ['fashion','👟','Gucci','Screener GG',1090000,[['화이트','블랙','베이지','블루']]],
  ['fashion','👟','Nike','Air Jordan 1 High OG x Dior',6900000,[['US 8','US 9','US 10','US 11']]],
  ['fashion','👟','Nike','Air Force 1 Tiffany & Co.',2900000,[['US 8','US 9','US 10','US 11']]],
  ['fashion','👞','Gucci','Horsebit 1953 로퍼',1290000,[['블랙','갈색','베이지','버건디'],['US 8','US 9','US 10','US 11']]],
  ['fashion','👞','Berluti','Andy 로퍼 베네치아',2390000,[['커피','블랙','버건디','베이지']]],
  ['fashion','👞','Berluti','Alessandro 옥스포드',2900000,[['커피','블랙','버건디']]],
  ['fashion','👞','Tod\'s','Gommino 드라이빙슈즈',790000,[['블랙','네이비','베이지','버건디','초콜릿']]],
  ['fashion','👞','Church\'s','Consul 173 옥스포드',1290000,[['블랙','부르고뉴','커피']]],
  ['fashion','👠','Christian Louboutin','So Kate 120',1190000,[['블랙 키드','누드','레드 페이턴트','블루 스웨이드','블랙 페이턴트']]],
  ['fashion','👠','Christian Louboutin','Pigalle 100',1090000,[['블랙','누드','레드','핑크','메탈릭 골드']]],
  ['fashion','👠','Manolo Blahnik','Hangisi 105',1290000,[['블루 새틴','블랙','크리스탈 핑크','베이지']]],
  ['fashion','👠','Jimmy Choo','Romy 100',890000,[['블랙','누드','레드','글리터 골드','글리터 실버']]],

  // ═══ FASHION — Outerwear ═══
  ['fashion','🧥','Brunello Cucinelli','카시미어 오버코트',5900000,[['샌드 베이지','네이비','차콜','크림'],['46','48','50','52','54']]],
  ['fashion','🧥','Loro Piana','Storm System 카시미어 트렌치',6900000,[['샌드','네이비','블랙'],['46','48','50','52']]],
  ['fashion','🧥','Moncler','Maya 다운 재킷',2100000,[['블랙','네이비','베이지','루즈','화이트'],['1','2','3','4','5']]],
  ['fashion','🧥','Moncler','Genius 7 Fragment 컬렉션',3900000,[['블랙','베이지','옐로'],['1','2','3','4']]],
  ['fashion','🧥','Canada Goose','Snow Mantra Parka',2490000,[['블랙','네이비','레드'],['XS','S','M','L','XL']]],
  ['fashion','🧥','Burberry','Heritage 트렌치코트',3290000,[['허니','블랙','네이비'],['44','46','48','50','52','54']]],
  ['fashion','🧥','Burberry','Kensington 트렌치',2890000,[['허니','블랙','오닉스 그레이'],['44','46','48','50']]],
  ['fashion','🧥','Max Mara','101801 카멜 코트',4900000,[['카멜','블랙','네이비'],['38','40','42','44','46']]],
  ['fashion','🧥','Saint Laurent','Le Smoking 재킷',5900000,[['블랙','화이트'],['44','46','48','50']]],
  ['fashion','🧥','Bottega Veneta','가죽 보머 재킷',5900000,[['폰단테','블랙','뉴 카멜'],['46','48','50','52']]],

  // ═══ FASHION — Suits & Accessories ═══
  ['fashion','👔','Kiton','나폴리 핸드스티치 수트',8900000,[['네이비','차콜','블랙','그레이 핀스트라이프'],['46','48','50','52','54']]],
  ['fashion','👔','Brioni','수트 Vanquish II',7200000,[['네이비','차콜','미드나잇 블루'],['46','48','50','52']]],
  ['fashion','👔','Tom Ford','O\'Connor 수트',5900000,[['블랙','네이비','차콜','글렌체크'],['46','48','50','52']]],
  ['fashion','👔','Ermenegildo Zegna','Couture XXX 수트',6900000,[['네이비','차콜','베이지'],['46','48','50','52','54']]],
  ['fashion','👒','Borsalino','Federico Fellini 페도라',790000,[['블랙','그레이','베이지','네이비']]],
  ['fashion','👒','Prada','리나일론 버킷햇',890000,[['블랙','네이비','베이지','화이트']]],
  ['fashion','🕶️','Tom Ford','FT1000 선글라스',650000,[['블랙','하바나','크리스털','블론드 하바나']]],
  ['fashion','🕶️','Tom Ford','Anouk FT1031',590000,[['블랙','로즈골드','메탈릭']]],
  ['fashion','🕶️','Cartier','팬테르 드 까르띠에 선글라스',4800000,[['18K 로즈골드','18K 옐로골드','플래티넘'],['스모크 사파이어','블랙','브라운']]],
  ['fashion','🕶️','Cartier','산토스 드 까르띠에',3900000,[['옐로골드','로즈골드','플래티넘']]],
  ['fashion','🕶️','Ray-Ban','Meta Wayfarer 스마트',590000,[['매트 블랙','샤이니 블랙','베이지','캐러멜']]],
  ['fashion','🕶️','Persol','714 폴딩 스티브 맥퀸',490000,[['블랙','하바나','테라코타']]],
  ['fashion','🧣','Hermès','Carré 90 실크 스카프',890000,[['Jungle Love 오렌지','Brides de Gala','Faubourg Tropical','Le Pegase d\'Hermès','Quadrige']]],
  ['fashion','🧣','Hermès','Cashmere & Silk 쇼울',1890000,[['블랙','베이지','네이비','루즈','블루','크림']]],
  ['fashion','💼','Berluti','Un Jour 가방',5900000,[['커피','블랙','버건디','베이지']]],
  ['fashion','💼','Louis Vuitton','Taiga 브리프케이스',4900000,[['모노그램','다미에','블랙','베이지']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ BEAUTY — Skincare ═══
  ['beauty','✨','La Mer','크렘 드 라 메르 보습크림',1490000,[['100ml','250ml','500ml']]],
  ['beauty','✨','La Mer','The Concentrate',850000,[['30ml','50ml','100ml']]],
  ['beauty','✨','La Mer','The Eye Concentrate',490000,[['15ml']]],
  ['beauty','✨','La Mer','The Treatment Lotion',490000,[['150ml','300ml']]],
  ['beauty','✨','La Prairie','Skin Caviar Luxe Cream',890000,[['50ml','100ml']]],
  ['beauty','✨','La Prairie','Cellular Cream Platinum Rare',2890000,[['50ml']]],
  ['beauty','✨','La Prairie','Pure Gold Radiance Cream',1690000,[['50ml']]],
  ['beauty','💆','SK-II','Facial Treatment Essence',390000,[['75ml','160ml','230ml','330ml']]],
  ['beauty','💆','SK-II','LXP Ultimate Revival Cream',590000,[['50ml','80ml']]],
  ['beauty','💆','SK-II','GenOptics Spot Essence',390000,[['50ml']]],
  ['beauty','🌿','Sisley','Black Rose Precious Face Oil',490000,[['25ml']]],
  ['beauty','🌿','Sisley','Sisleya L\'Integral Anti-Age',790000,[['50ml']]],
  ['beauty','🌿','Sisley','Supremÿa La Nuit',890000,[['50ml']]],
  ['beauty','💧','Augustinus Bader','The Rich Cream',890000,[['50ml','100ml']]],
  ['beauty','💧','Augustinus Bader','The Cream',790000,[['30ml','50ml','100ml']]],
  ['beauty','💧','Augustinus Bader','The Eye Cream',690000,[['15ml']]],
  ['beauty','💧','Augustinus Bader','The Body Cream',490000,[['100ml','200ml']]],
  ['beauty','✨','Guerlain','Orchidée Impériale Black 크림',2890000,[['50ml']]],
  ['beauty','✨','Guerlain','Abeille Royale 더블 R',290000,[['30ml','50ml']]],

  // ═══ BEAUTY — Perfume ═══
  ['beauty','🌸','Chanel','N°5 오 드 퍼퓸',450000,[['50ml','100ml','200ml']]],
  ['beauty','🌸','Chanel','Coco Mademoiselle 오 드 퍼퓸',390000,[['35ml','50ml','100ml','200ml']]],
  ['beauty','🌸','Chanel','Chance 오 탕드르',290000,[['35ml','50ml','100ml','150ml']]],
  ['beauty','🌸','Chanel','Les Exclusifs 1932',490000,[['75ml','200ml']]],
  ['beauty','🌸','Tom Ford','Soleil de Feu',580000,[['50ml','100ml','250ml']]],
  ['beauty','🌸','Tom Ford','Tobacco Vanille',590000,[['50ml','100ml','250ml']]],
  ['beauty','🌸','Tom Ford','Oud Wood',590000,[['50ml','100ml','250ml']]],
  ['beauty','🌸','Tom Ford','Lost Cherry',590000,[['50ml','100ml','250ml']]],
  ['beauty','🌙','Creed','Aventus',780000,[['50ml','100ml','250ml']]],
  ['beauty','🌙','Creed','Silver Mountain Water',680000,[['50ml','100ml','250ml']]],
  ['beauty','🌙','Creed','Green Irish Tweed',680000,[['50ml','100ml','250ml']]],
  ['beauty','💫','Jo Malone','잉글리시 페어 & 프리지아',290000,[['30ml','100ml']]],
  ['beauty','💫','Jo Malone','Wood Sage & Sea Salt',290000,[['30ml','100ml']]],
  ['beauty','💫','Jo Malone','Velvet Rose & Oud',490000,[['50ml','100ml']]],
  ['beauty','💫','Maison Francis Kurkdjian','Baccarat Rouge 540',790000,[['35ml','70ml','200ml']]],
  ['beauty','💫','Maison Francis Kurkdjian','Oud Satin Mood',890000,[['70ml','200ml']]],
  ['beauty','💫','Le Labo','Santal 33',490000,[['15ml','50ml','100ml','500ml']]],
  ['beauty','💫','Le Labo','Rose 31',490000,[['15ml','50ml','100ml']]],
  ['beauty','🌹','Dior','Sauvage Elixir',590000,[['60ml','100ml']]],
  ['beauty','🌹','Dior','J\'adore Absolu',490000,[['50ml','75ml','100ml']]],
  ['beauty','🌹','Guerlain','Shalimar Parfum Initial',490000,[['60ml','100ml']]],

  // ═══ BEAUTY — Beauty Devices & Sets ═══
  ['beauty','🔬','Dyson','Airwrap Multi-Styler Complete Long',849000,[['니켈/구리','블루베리/블러쉬','버터컵/푸시아','니켈/푸시아 골드']]],
  ['beauty','🔬','Dyson','Supersonic 헤어드라이어',529000,[['브라이트 코퍼/니켈','블루베리','버터컵','펜션 핑크']]],
  ['beauty','🔬','Dyson','Corrale 무선 스트레이터',579000,[['브라이트 니켈/블랙','블루베리','오로라']]],
  ['beauty','🔬','Dyson','Airstrait 헤어 스트레이트너',649000,[['브라이트 니켈','로즈 골드','블루베리']]],
  ['beauty','🔬','GHD','Helios 헤어드라이어',490000,[['블랙','화이트','핑크']]],
  ['beauty','💎','NuFACE','Trinity+ ELE',590000,[['블랙','화이트','로즈']]],
  ['beauty','💎','FOREO','LUNA 4',390000,[['블랙','퍼플','민트','로즈']]],
  ['beauty','💎','LG Pra.L','MediHair',1490000,[['단품','풀세트']]],
  ['beauty','👄','Chanel','Les Exclusifs 립스틱 컬렉션',1290000,[['15종 럭셔리 세트','22종 컴플리트 세트']]],
  ['beauty','👄','Chanel','Allure 립스틱 단품',79000,[['로지','베이지','루즈','브라운','코랄','퍼플','와인','네이비','초콜릿','핑크']]],
  ['beauty','👄','Dior','Rouge Dior 립스틱',69000,[['999','100','100 로지','999 새틴','100 누드','310','846','555']]],
  ['beauty','👄','YSL','Rouge Pur Couture 립스틱',69000,[['1','21','83','156','157','201','407']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ APPLIANCE — Kitchen ═══
  ['appliance','🍳','Thermomix','TM7 스마트 쿠킹',2490000,[['단품','컬리너리 세트','마스터 셰프 키트']]],
  ['appliance','🍳','Vorwerk','Kobold VK7',1890000,[['단품','풀 액세서리']]],
  ['appliance','☕','De\'Longhi','La Specialista Maestro',1490000,[['블랙','스테인리스']]],
  ['appliance','☕','De\'Longhi','Eletta Explore',1990000,[['스테인리스','블랙']]],
  ['appliance','☕','Jura','Z10 Diamond Black',4490000,[['알루미늄 블랙','알루미늄 화이트','다이아몬드 블랙']]],
  ['appliance','☕','Jura','Giga 10',7990000,[['알루미늄 블랙','크롬']]],
  ['appliance','☕','La Marzocco','Linea Mini',1290000,[['스테인리스','옐로','레드','블루','화이트','블랙']]],
  ['appliance','☕','La Marzocco','GS3 AV',2490000,[['스테인리스','커스텀 컬러']]],
  ['appliance','☕','Breville','Oracle Touch',3490000,[['스테인리스','블랙 트러플','다마스크 블루']]],
  ['appliance','🫧','Miele','G7985 SCi AutoDos',4900000,[['옵시디언 블랙','브릴리언트 화이트','그래파이트 그레이']]],
  ['appliance','🫧','Bosch','Serie 8 식기세척기',2990000,[['스테인리스','블랙']]],
  ['appliance','🫧','Gaggenau','DF480 빌트인 식기세척기',8900000,[['스테인리스']]],

  // ═══ APPLIANCE — Cleaning ═══
  ['appliance','🌀','Dyson','V15 Detect Absolute Extra',1090000,[['옐로/니켈','블루/실버']]],
  ['appliance','🌀','Dyson','Gen5detect Absolute',1290000,[['퍼플','블루']]],
  ['appliance','🌀','Dyson','V12 Detect Slim',890000,[['옐로/니켈','블루/실버']]],
  ['appliance','🌀','Samsung','Bespoke Jet AI',1590000,[['미스티 화이트','새틴 그레이','새틴 블랙']]],
  ['appliance','🌀','LG','CordZero A9 All-in-One',1890000,[['카밍 베이지','아이언 그레이','네이처 베이지']]],
  ['appliance','🤖','Roborock','S9 MaxV Ultra',1590000,[['블랙','화이트']]],
  ['appliance','🤖','Roborock','Qrevo Curv',1290000,[['블랙','화이트']]],
  ['appliance','🤖','iRobot','Roomba j9+ Combo',1190000,[['그래파이트','샌드']]],
  ['appliance','🤖','Ecovacs','DEEBOT X8 Pro Omni',1490000,[['블랙','화이트']]],
  ['appliance','💨','Dyson','Purifier Hot+Cool HP09',1290000,[['블랙/니켈','화이트/실버']]],
  ['appliance','💨','Dyson','Purifier Big+Quiet BP04',1990000,[['프러시안 블루','새틴 실버']]],
  ['appliance','💨','LG','퓨리케어 360°',1490000,[['카밍 베이지','아이언 그레이','오브제 그린']]],
  ['appliance','💨','Coway','노블 IoT AP-2025',890000,[['클라우드 화이트','노블 베이지']]],
  ['appliance','🧺','Miele','WTD160 PowerWash',4200000,[['로터스 화이트','옵시디언 블랙']]],
  ['appliance','🧺','LG','TROMM 오브제 세탁기',2990000,[['카밍 베이지','네이처 클레이 브라운','네이처 그린']]],
  ['appliance','🧺','Samsung','BESPOKE 그랑데 AI',2890000,[['새틴 베이지','새틴 그레이','새틴 블랙','코타 네이비']]],

  // ═══ APPLIANCE — Refrigerator & Built-in ═══
  ['appliance','❄️','Samsung','BESPOKE 4도어 패밀리허브',4990000,[['글램 화이트','글램 네이비','새틴 베이지','글램 라벤더']]],
  ['appliance','❄️','LG','오브제컬렉션 디오스',4690000,[['실버','베이지','클레이 브라운','그린']]],
  ['appliance','❄️','Miele','MasterCool 빌트인',8990000,[['스테인리스','패널레디']]],
  ['appliance','❄️','SubZero','PRO 4290G',12900000,[['스테인리스','패널레디']]],
  ['appliance','❄️','Liebherr','Monolith 통합 냉장고',9900000,[['패널레디','스테인리스']]],
  ['appliance','🍽️','Gaggenau','VF 230 스팀컨벡션오븐',8900000,[['400 시리즈','200 시리즈']]],
  ['appliance','🍽️','Miele','H7860 BP 빌트인 오븐',3490000,[['옵시디언 블랙','그래파이트']]],
  ['appliance','🍽️','Wolf','M Series Pro 오븐',6900000,[['스테인리스']]],

  // ═══ APPLIANCE — Smart Home & Misc ═══
  ['appliance','💡','Philips Hue','스마트홈 그랜드 패키지',890000,[['컬러 앰비언스','화이트 앰비언스','컴플리트 셋']]],
  ['appliance','💡','Nanoleaf','Shapes 트라이앵글 패키지',490000,[['9개 패널','15개 패널','25개 패널']]],
  ['appliance','💡','Lutron','Caséta 스마트 조명 세트',790000,[['스타터','패밀리','홈 풀세트']]],
  ['appliance','🛁','LAUFEN','SaphirKeramik 욕조',12000000,[['단품','+수전','+풀세트']]],
  ['appliance','🛁','Kohler','VibrAcoustic 사운드 욕조',9900000,[['단품','+사운드 시스템']]],
  ['appliance','🛁','TOTO','네오레스트 NX2 비데일체형',8900000,[['단품','설치 포함']]],
  ['appliance','🛁','TOTO','워시렛 S550e',1290000,[['화이트','샌드 베이지','쿨 그레이']]],
  ['appliance','🍷','EuroCave','와인셀러 Premiere L',6900000,[['74병','138병','215병']]],
  ['appliance','🍷','Liebherr','Vinidor 와인냉장고',3490000,[['66병','118병','201병']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ FOOD — Wine ═══
  ['food','🍷','Pétrus','Pomerol',3800000,[['2015','2016','2018','2019','2020']]],
  ['food','🍷','Château Lafite Rothschild','Pauillac',2900000,[['2015','2016','2017','2018','2019','2020']]],
  ['food','🍷','Château Margaux','Margaux',2800000,[['2015','2016','2018','2019','2020']]],
  ['food','🍷','Château Latour','Pauillac',2700000,[['2015','2016','2018','2019']]],
  ['food','🍷','Château Mouton Rothschild','Pauillac',2400000,[['2015','2016','2018','2019']]],
  ['food','🍷','Château Haut-Brion','Pessac-Léognan',2500000,[['2015','2016','2018','2019']]],
  ['food','🍷','Domaine Romanée-Conti','La Tâche',9800000,[['2018','2019','2020']]],
  ['food','🍷','Domaine Romanée-Conti','Romanée-Conti',38000000,[['2018','2019']]],
  ['food','🍷','Domaine Leroy','Musigny Grand Cru',12000000,[['2018','2019','2020']]],
  ['food','🍷','Screaming Eagle','Cabernet Sauvignon',8900000,[['2017','2018','2019','2020']]],
  ['food','🍷','Opus One','Napa Valley',890000,[['2015','2017','2018','2019','2020']]],
  ['food','🍷','Sassicaia','Bolgheri',790000,[['2017','2018','2019','2020','2021']]],
  ['food','🍷','Solaia','Toscana',890000,[['2017','2018','2019','2020']]],
  ['food','🍷','Ornellaia','Bolgheri Superiore',690000,[['2017','2018','2019','2020']]],
  ['food','🍷','Tignanello','Toscana',390000,[['2018','2019','2020','2021']]],
  ['food','🍷','Penfolds','Grange',1290000,[['2015','2016','2017','2018']]],

  // ═══ FOOD — Champagne ═══
  ['food','🍾','Dom Pérignon','Vintage',680000,[['2013','2015','2008 P2','2003 P3'],['750ml','1.5L 매그넘']]],
  ['food','🍾','Dom Pérignon','Rosé',2490000,[['2009','2010','2013']]],
  ['food','🍾','Krug','Grande Cuvée 170ème',890000,[['750ml','1.5L']]],
  ['food','🍾','Krug','Vintage',1290000,[['2008','2011']]],
  ['food','🍾','Krug','Clos du Mesnil',6900000,[['2008','2009']]],
  ['food','🍾','Louis Roederer','Cristal',790000,[['2013','2014','2015'],['750ml','1.5L']]],
  ['food','🍾','Louis Roederer','Cristal Rosé',1490000,[['2013','2014']]],
  ['food','🍾','Salon','Le Mesnil Blanc de Blancs',2890000,[['2008','2012']]],
  ['food','🍾','Bollinger','La Grande Année',490000,[['2012','2014','2015']]],
  ['food','🍾','Veuve Clicquot','La Grande Dame',390000,[['2012','2015']]],
  ['food','🍾','Moët & Chandon','Imperial Brut',89000,[['750ml','1.5L 매그넘','3L 제로보암']]],

  // ═══ FOOD — Whisky / Spirits ═══
  ['food','🥃','Macallan','Sherry Oak',2900000,[['18년','25년','30년']]],
  ['food','🥃','Macallan','Fine Oak',1890000,[['18년','25년','30년']]],
  ['food','🥃','Macallan','M Decanter',9900000,[['스탠다드','블랙']]],
  ['food','🥃','Yamazaki','싱글몰트',1800000,[['12년','18년','25년']]],
  ['food','🥃','Hibiki','블렌디드',890000,[['17년','21년','30년']]],
  ['food','🥃','Hakushu','싱글몰트',1290000,[['12년','18년','25년']]],
  ['food','🥃','Glenfiddich','싱글몰트',790000,[['18년','21년','26년','30년']]],
  ['food','🥃','Glenlivet','싱글몰트',690000,[['18년','21년','25년']]],
  ['food','🥃','Balvenie','싱글몰트',890000,[['21년','25년','30년']]],
  ['food','🥃','Lagavulin','싱글몰트',790000,[['16년','25년','30년']]],
  ['food','🥃','Ardbeg','싱글몰트',590000,[['10년','25년','TEN','UIGEADAIL']]],
  ['food','🥃','Hennessy','코냑',490000,[['XO','Paradis','Paradis Impérial','Richard Hennessy']]],
  ['food','🥃','Rémy Martin','루이 13세',6900000,[['700ml','1.5L 매그넘']]],
  ['food','🥃','Dalmore','싱글몰트',1290000,[['25년','40년','50년']]],

  // ═══ FOOD — Premium Food ═══
  ['food','🥩','Wagyu World','미야자키 와규 A5 스테이크',680000,[['1kg','2kg','5kg'],['스테이크 세트','샤브샤브','풀세트']]],
  ['food','🥩','Wagyu World','마츠자카 와규 A5',790000,[['1kg','2kg','5kg']]],
  ['food','🥩','Wagyu World','고베 와규 A5',890000,[['1kg','2kg','5kg']]],
  ['food','🥩','Wagyu World','오미 와규 A5',690000,[['1kg','2kg','3kg']]],
  ['food','🦞','Premium Sea','노르웨이 랍스터 홀',290000,[['1kg','2kg','5kg']]],
  ['food','🦞','Premium Sea','메인주 랍스터',390000,[['1kg','2kg','3kg']]],
  ['food','🦀','Premium Sea','홋카이도 킹크랩',490000,[['2kg','3kg','5kg']]],
  ['food','🦀','Premium Sea','알래스카 킹크랩',590000,[['2kg','3kg','5kg']]],
  ['food','🐟','Premium Sea','참다랑어 오토로 1kg',890000,[['오토로','츄토로','아카미']]],
  ['food','🐟','Premium Sea','이베리코 베요타 5J',590000,[['1kg','3kg','5kg 통하몽']]],
  ['food','🫒','Eataly','이탈리아 프리미엄 미식 세트',490000,[['스탠다드','디럭스','마에스트로']]],
  ['food','🍫','Valrhona','그랑 크뤼 컬렉션',180000,[['32종 박스','64종 박스','마스터 박스']]],
  ['food','🍫','La Maison du Chocolat','파리 럭셔리 박스',290000,[['스몰','미디엄','라지']]],
  ['food','🍫','Pierre Marcolini','초콜릿 컬렉션',390000,[['스탠다드','시그니처','메종']]],
  ['food','🫖','TWG Tea','럭셔리 365 캐니스터',890000,[['스탠다드 65','디럭스 100','컴플리트 365']]],
  ['food','🫖','Mariage Frères','파리 365 컬렉션',790000,[['100종','200종','365종']]],
  ['food','🍱','Fauchon','파리 구르메 박스',290000,[['스몰','미디엄','라지','마에스트로']]],
  ['food','🍱','Hediard','프리미엄 미식 박스',390000,[['스탠다드','시그니처']]],
  ['food','🍯','Manuka Health','MGO 1000+ 마누카 꿀',390000,[['250g','500g','1kg']]],
  ['food','🐚','Beluga','캐비어',1890000,[['30g','50g','125g','250g']]],
  ['food','🐚','Petrossian','오세트라 캐비어',990000,[['30g','50g','125g','250g']]],
  ['food','🍄','Urbani','화이트 트러플 100g',2890000,[['100g 박스','250g 박스']]],
  ['food','🍄','Urbani','블랙 트러플 100g',890000,[['100g 박스','250g 박스']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ SPORTS — Golf ═══
  ['sports','⛳','Titleist','Pro V1x 골프공',590000,[['12개','36개','72개','144개']]],
  ['sports','⛳','Titleist','Pro V1 골프공',490000,[['12개','36개','72개','144개']]],
  ['sports','🏌️','TaylorMade','Qi35 LS 드라이버',790000,[['9.0도','10.5도','12.0도']]],
  ['sports','🏌️','TaylorMade','Qi35 LS 풀 아이언세트',2890000,[['4-PW','5-PW','전체 풀세트']]],
  ['sports','🏌️','Titleist','TSR3 드라이버',890000,[['9.0도','10.0도','11.0도']]],
  ['sports','🏌️','Titleist','T100 아이언세트',2490000,[['4-PW','5-PW']]],
  ['sports','🏌️','Callaway','Paradym Ai Smoke 드라이버',790000,[['9.0도','10.5도','12.0도']]],
  ['sports','🏌️','PXG','0317 ST 블레이드 아이언',3490000,[['4-PW','5-PW']]],
  ['sports','🏌️','Honma','베레스 BERES 골프세트',12900000,[['BERES 9.0','BERES 5.0','BERES 3.0']]],
  ['sports','🏌️','Honma','TR20 아이언세트',6900000,[['4-PW','5-PW']]],
  ['sports','⛳','Scotty Cameron','Phantom X 5.5 퍼터',890000,[['33"','34"','35"']]],
  ['sports','⛳','Scotty Cameron','Special Select Newport',990000,[['33"','34"','35"']]],
  ['sports','🎒','PXG','투어 캐디백',1290000,[['블랙','화이트','네이비','레드']]],
  ['sports','🎒','TaylorMade','TM 투어 스탠드백',490000,[['블랙','블루','화이트','레드']]],
  ['sports','🎒','Honma','베레스 캐디백',1890000,[['블랙','화이트','레드','블루']]],

  // ═══ SPORTS — Tennis ═══
  ['sports','🎾','Babolat','Pure Aero RAFA 라켓',490000,[['300g','290g','280g']]],
  ['sports','🎾','Wilson','Pro Staff RF97 v14',490000,[['340g','310g']]],
  ['sports','🎾','HEAD','Speed Pro Djokovic',390000,[['310g','300g']]],
  ['sports','🎾','Yonex','EZONE 100 Tour',390000,[['310g','300g']]],
  ['sports','🎾','Babolat','퓨어 드라이브 노바크',390000,[['300g','285g']]],
  ['sports','🎾','Babolat','테니스백 RH X12',290000,[['블랙','네이비','레드']]],

  // ═══ SPORTS — Cycling ═══
  ['sports','🚴','Specialized','S-Works Tarmac SL8',12000000,[['Di2','SRAM Red AXS'],['M','L','XL']]],
  ['sports','🚴','Pinarello','Dogma F12 Disk',13900000,[['Di2','EPS','SRAM AXS'],['M','L','XL']]],
  ['sports','🚴','Cervélo','S5 Disc',10900000,[['Di2','SRAM Red'],['M','L','XL']]],
  ['sports','🚴','Trek','Madone SLR 9 Gen 8',13900000,[['SRAM Red AXS','Di2'],['M','L','XL']]],
  ['sports','🚴','Colnago','C68 Disc',15900000,[['Di2','SRAM Red'],['M','L','XL']]],
  ['sports','🚴','Bianchi','Specialissima',10900000,[['Di2','EPS'],['M','L','XL']]],
  ['sports','🚴','Brompton','C Line Explore',2890000,[['블랙','화이트','네이비','레드','옐로']]],
  ['sports','🚴','Brompton','T Line',6900000,[['Storm','Lava','Lunar']]],

  // ═══ SPORTS — Fitness Equipment ═══
  ['sports','🏋️','Technogym','Technogym Bike',2990000,[['단품','+1년 멤버십']]],
  ['sports','🏋️','Technogym','Run Personal',12900000,[['스탠다드','우드 디자인']]],
  ['sports','🏋️','Technogym','MyRun',3490000,[['단품','+태블릿']]],
  ['sports','🧘','Peloton','Tread+ 트레드밀',4500000,[['단품','+1년 구독','+컬렉션 세트']]],
  ['sports','🧘','Peloton','Bike+',2900000,[['단품','+1년 구독','+엑세서리 세트']]],
  ['sports','🧘','NordicTrack','Commercial 2950',3900000,[['단품']]],
  ['sports','🧘','Tonal','스마트홈 짐',4900000,[['단품','+1년 멤버십']]],

  // ═══ SPORTS — Skiing / Snow / Surf ═══
  ['sports','🎿','Nordica','Enforcer 110 스키',1890000,[['172cm','177cm','182cm']]],
  ['sports','🎿','Atomic','Bent Chetler 120',2190000,[['180cm','188cm','193cm']]],
  ['sports','🎿','K2','Mindbender 116C 알파',1890000,[['179cm','184cm','189cm']]],
  ['sports','🎿','Salomon','S/Pro Supra 부츠',890000,[['25.5','26.5','27.5','28.5']]],
  ['sports','🎿','Tecnica','Mach1 MV 부츠',790000,[['25.5','26.5','27.5','28.5']]],
  ['sports','🏂','Burton','Custom 캠버 스노보드',890000,[['154cm','158cm','162cm']]],
  ['sports','🏄','Rip Curl','E-Bomb 서핑보드',1890000,[['6\'8"','7\'0"','7\'4"']]],
  ['sports','🏄','Channel Islands','Happy 서핑보드',1290000,[['6\'0"','6\'4"','6\'8"']]],
  ['sports','🏊','HUUB','Aguanta Xtrem 풀슈트',890000,[['XS','S','M','L','XL']]],
  ['sports','🏊','Speedo','LZR Racer X',590000,[['XS','S','M','L','XL']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ FURNITURE — Sofas ═══
  ['furniture','🛋️','B&B Italia','Tufty-Time 소파',18000000,[['3인 풀가죽','4인 풀가죽','코너 모듈']]],
  ['furniture','🛋️','B&B Italia','Bend 모듈러',14900000,[['2인','3인','코너 5인']]],
  ['furniture','🛋️','Minotti','Lawrence 풀가죽 소파',16900000,[['3인','4인','코너 5인']]],
  ['furniture','🛋️','Minotti','Connery 모듈러',19900000,[['3인','4인','7인 모듈']]],
  ['furniture','🛋️','Poliform','Mondrian',12900000,[['2인','3인','4인']]],
  ['furniture','🛋️','Cassina','Mex Cube 알폰소 카사스',9900000,[['2인','3인','4인']]],
  ['furniture','🛋️','Flexform','Magnum 풀가죽',14900000,[['3인','4인','코너']]],
  ['furniture','🛋️','Natuzzi Editions','풀가죽 리클라이너',5200000,[['1인','2인','3인','코너']]],
  ['furniture','🛋️','Roche Bobois','Mah Jong 4피스 세트',12900000,[['Misia 컬렉션','블랙','베이지','케네디 컬렉션']]],
  ['furniture','🛋️','Vitra','Polder Sofa',9900000,[['2인','3인','4인']]],
  ['furniture','🛋️','Ligne Roset','Togo',8900000,[['1인 라운지','2인 세터','코너 5피스']]],
  ['furniture','🛋️','Edra','On the Rocks 모듈',24900000,[['3피스','5피스','7피스']]],

  // ═══ FURNITURE — Chairs ═══
  ['furniture','🪑','Vitra','Eames Lounge Chair & Ottoman',7900000,[['블랙 레더 / 월넛','초콜릿 / 산토스 팔리산드르','크림 / 메이플']]],
  ['furniture','🪑','Vitra','Eames Plastic Chair DSW',890000,[['화이트','블랙','베이지','네이비','옐로','올리브']]],
  ['furniture','🪑','Cassina','LC2 암체어 페리앙',6500000,[['블랙','화이트','베이지','네이비']]],
  ['furniture','🪑','Cassina','LC4 샤이즈 롱',9900000,[['포니헤어','블랙 가죽','크롬']]],
  ['furniture','🪑','Knoll','Barcelona Chair',7900000,[['블랙','화이트','베이지','루즈','네이비']]],
  ['furniture','🪑','Herman Miller','Aeron 오피스 체어',2490000,[['B 사이즈','C 사이즈'],['그라파이트','민철','카본']]],
  ['furniture','🪑','Herman Miller','Eames Office Chair',5900000,[['블랙','화이트','베이지']]],
  ['furniture','🪑','Carl Hansen','Wishbone Chair',1290000,[['오크 화이트오일','월넛','블랙','블루','옐로','레드']]],
  ['furniture','🪑','Fritz Hansen','Egg Chair',12900000,[['풀가죽 블랙','풀가죽 화이트','크림','네이비']]],
  ['furniture','🪑','Fritz Hansen','Swan Chair',8900000,[['풀가죽 블랙','풀가죽 화이트','크림']]],
  ['furniture','🪑','&Tradition','Mayor 소파',8900000,[['오크','월넛','블랙']]],

  // ═══ FURNITURE — Beds ═══
  ['furniture','🛏️','Hästens','2000T 킹사이즈',28000000,[['프레임+토퍼','풀 풀세트']]],
  ['furniture','🛏️','Hästens','Vividus',125000000,[['킹','퀸','캘리포니아 킹']]],
  ['furniture','🛏️','Hästens','Lenoria Eden',38000000,[['킹','퀸']]],
  ['furniture','🛏️','Duxiana','Dux 8008',22000000,[['킹','퀸']]],
  ['furniture','🛏️','Vispring','Magnificence Superb',18900000,[['킹','퀸','캘리포니아 킹']]],
  ['furniture','🛏️','Tempur','Original Supreme',2900000,[['싱글','퀸','킹','캘리포니아 킹']]],

  // ═══ FURNITURE — Tables ═══
  ['furniture','🪞','Minotti','Leon 오크 다이닝 테이블',14000000,[['200cm','240cm','280cm','320cm']]],
  ['furniture','🪞','Cassina','LC6 르 코르뷔지에 테이블',8900000,[['225cm','270cm']]],
  ['furniture','🪞','B&B Italia','Doge 글라스 테이블',9900000,[['180cm','220cm','280cm']]],
  ['furniture','🪞','Cassina','Mexique 테이블',6900000,[['180cm','200cm']]],
  ['furniture','🪞','Poliform','Concorde 테이블',12900000,[['200cm','240cm','280cm']]],
  ['furniture','🪞','Vitra','Eames Plywood Coffee Table',2890000,[['오크','월넛','애쉬']]],
  ['furniture','🪞','Knoll','Saarinen Tulip 테이블',5900000,[['120cm','152cm','198cm 라운드']]],

  // ═══ FURNITURE — Lighting & Decor ═══
  ['furniture','🖼️','Flos','Arco LED 플로어 스탠드',3900000,[['스탠다드','LED 에디션']]],
  ['furniture','🖼️','Flos','IC F1 플로어 스탠드',890000,[['블랙','화이트','크롬','브라스']]],
  ['furniture','🖼️','Louis Poulsen','PH 5 클래식',1890000,[['화이트','블랙','블루','퍼플','블랙 브라스']]],
  ['furniture','🖼️','Louis Poulsen','PH Artichoke 600',12900000,[['화이트','코퍼','브라스']]],
  ['furniture','🖼️','Artemide','Tolomeo',590000,[['데스크','플로어','월 마운트']]],
  ['furniture','🖼️','Foscarini','Twiggy 플로어 스탠드',1890000,[['화이트','블랙','레드','옐로','그린']]],
  ['furniture','🖼️','Tom Dixon','Beat Lights 트리오',3490000,[['블랙','브라스','화이트']]],
  ['furniture','🪴','HAY','Result Chair',490000,[['화이트','블랙','오커','블루']]],
  ['furniture','🪴','HAY','LBM 데스크 램프',390000,[['블랙','화이트','옐로','레드','그린']]],
  ['furniture','🪞','Gubi','Pacha 라운지 체어',2890000,[['벨벳 베이지','블랙','버건디','그린']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ CAR — Supercars ═══
  ['car','🏎️','Ferrari','SF90 XX Stradale',1300000000,[['로쏘 코르사','지알로 모데나','블랙','블루'],['풀 옵션','컴팩트 옵션']]],
  ['car','🏎️','Ferrari','296 GTB',520000000,[['로쏘 코르사','지알로','블랙','블루','화이트']]],
  ['car','🏎️','Ferrari','12Cilindri',790000000,[['로쏘','블랙','실버','블루','옐로']]],
  ['car','🏎️','Ferrari','Roma Spider',390000000,[['로쏘','블랙','블루 토스카나','옐로','화이트']]],
  ['car','🏎️','Ferrari','Purosangue',590000000,[['로쏘','블루','블랙','옐로','화이트']]],
  ['car','🏎️','Lamborghini','Revuelto',890000000,[['로쏘','옐로','블랙','블루','퍼플','그린']]],
  ['car','🏎️','Lamborghini','Huracán Sterrato',490000000,[['옐로','블루','오렌지','그린','블랙']]],
  ['car','🏎️','Lamborghini','Urus SE PHEV',580000000,[['블랙','화이트','블루','옐로','그린']]],
  ['car','🏎️','McLaren','750S Spider',430000000,[['볼카닉 오렌지','블랙','옐로','블루','화이트']]],
  ['car','🏎️','McLaren','Artura',390000000,[['오렌지','블랙','블루','화이트','옐로']]],
  ['car','🏎️','McLaren','GTS',390000000,[['블랙','오렌지','블루','옐로','화이트']]],
  ['car','🏎️','Aston Martin','Vantage 2024',290000000,[['그린','블랙','화이트','옐로','블루']]],
  ['car','🏎️','Aston Martin','DB12',390000000,[['블랙','그린','블루','화이트','실버']]],
  ['car','🏎️','Aston Martin','DBS 770 Ultimate',590000000,[['그린','블랙','옐로','블루','화이트']]],

  // ═══ CAR — Luxury Sedans / SUVs ═══
  ['car','🚗','Rolls-Royce','Ghost Series II',650000000,[['실버','블랙','블루','화이트','버건디']]],
  ['car','🚗','Rolls-Royce','Phantom EWB',1200000000,[['블랙','실버','화이트','블루','버건디']]],
  ['car','🚗','Rolls-Royce','Cullinan',850000000,[['블랙','실버','블루','버건디','화이트']]],
  ['car','🚗','Rolls-Royce','Spectre EV',790000000,[['블랙','블루','실버','화이트']]],
  ['car','🚗','Bentley','Continental GT Speed',490000000,[['블랙','블루','실버','버건디','그린']]],
  ['car','🚗','Bentley','Bentayga EWB',450000000,[['블랙','블루','실버','버건디','그린']]],
  ['car','🚗','Bentley','Flying Spur Speed',390000000,[['블랙','블루','실버','버건디']]],
  ['car','🚗','Porsche','911 Turbo S Cabriolet',290000000,[['블랙','실버','블루','옐로','그린']]],
  ['car','🚗','Porsche','911 GT3 RS',390000000,[['블랙','실버','블루','옐로','그린','오렌지']]],
  ['car','🚗','Porsche','Panamera Turbo S E-Hybrid',290000000,[['블랙','실버','블루','옐로','화이트']]],
  ['car','🚗','Porsche','Cayenne Turbo GT',230000000,[['블랙','실버','블루','옐로','화이트']]],
  ['car','🚗','Mercedes-Benz','Maybach S680',280000000,[['블랙','실버','블루','화이트','버건디']]],
  ['car','🚗','Mercedes-Benz','G63 AMG',230000000,[['블랙','실버','블루','옐로','화이트','버건디']]],
  ['car','🚗','Mercedes-AMG','SL63 4MATIC+',230000000,[['블랙','실버','블루','레드','화이트']]],
  ['car','🚗','BMW','M5 CS',180000000,[['블랙','블루','옐로','실버']]],
  ['car','🚗','BMW','XM',230000000,[['블랙','화이트','옐로','블루']]],
  ['car','⚡','Tesla','Cybertruck Beast',99000000,[['스테인리스','블랙 랩','레드 랩','블루 랩']]],
  ['car','⚡','Tesla','Model S Plaid',180000000,[['블랙','화이트','블루','실버','레드']]],
  ['car','⚡','Tesla','Model X Plaid',180000000,[['블랙','화이트','블루','실버','레드']]],
  ['car','⚡','Lucid','Air Sapphire',290000000,[['스텔라 화이트','옵시디언 블랙','코스모스 실버']]],
  ['car','⚡','Porsche','Taycan Turbo GT',280000000,[['블랙','실버','블루','화이트']]],

  // ═══ CAR — Parts ═══
  ['car','🛞','Pirelli','P Zero Trofeo RS 295/30 R21',2800000,[['4본 세트','2본 세트']]],
  ['car','🛞','Michelin','Pilot Sport 4S 285/35 R20',1890000,[['4본 세트','2본 세트']]],
  ['car','🛞','Bridgestone','Potenza Sport',1690000,[['4본 세트','2본 세트']]],
  ['car','🔧','Akrapovič','911 GT3 RS 풀 티타늄 배기',8900000,[['스탠다드','카본','블랙']]],
  ['car','🔧','Akrapovič','Lamborghini Urus 배기',6900000,[['카본','블랙','티타늄']]],
  ['car','🔧','Brembo','GT BBK 브레이크 키트',6900000,[['전륜','후륜','전후 풀세트']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ TRAVEL — Flights ═══
  ['travel','✈️','Singapore Airlines','스위트 서울→뉴욕 왕복',48000000,[['1인','2인','2인+의전']]],
  ['travel','✈️','Singapore Airlines','퍼스트 서울→런던 왕복',32000000,[['1인','2인']]],
  ['travel','✈️','Emirates','퍼스트 두바이→파리 왕복',28000000,[['1인','2인','2인+의전']]],
  ['travel','✈️','Etihad','The Residence 아부다비→런던',58000000,[['더 레지던스','퍼스트 아파트먼트']]],
  ['travel','✈️','Qatar Airways','Qsuite 도하→뉴욕',34000000,[['1인','2인','2인 더블']]],
  ['travel','✈️','ANA','The Suite 도쿄→뉴욕',38000000,[['1인','2인']]],
  ['travel','✈️','Korean Air','프레스티지 파리→서울 왕복',16000000,[['1인','2인','패밀리 4인']]],
  ['travel','✈️','Korean Air','퍼스트 LA→서울 왕복',24000000,[['1인','2인']]],
  ['travel','✈️','Asiana','비즈니스 스위트 LA→서울',18000000,[['1인','2인']]],
  ['travel','✈️','Lufthansa','퍼스트 프랑크푸르트→서울',26000000,[['1인','2인']]],
  ['travel','✈️','Air France','La Première 파리→뉴욕',38000000,[['1인','2인']]],
  ['travel','✈️','Cathay Pacific','퍼스트 홍콩→뉴욕',26000000,[['1인','2인']]],

  // ═══ TRAVEL — Hotels ═══
  ['travel','🏨','Aman','아만 도쿄 그랜드 스위트',18000000,[['3박','5박','7박'],['1인','2인','4인 패밀리']]],
  ['travel','🏨','Aman','아만 베네치아 팰리스 스위트',24000000,[['3박','5박','7박']]],
  ['travel','🏨','Aman','아만얀카 모로코',25000000,[['3박','5박','7박']]],
  ['travel','🏨','Aman','아만 뉴욕 시그니처',22000000,[['3박','5박','7박']]],
  ['travel','🏨','Aman','아만 쿄토',26000000,[['3박','5박','7박']]],
  ['travel','🏨','Four Seasons','몰디브 워터빌라',22000000,[['3박','5박','7박'],['1베드룸','2베드룸','3베드룸']]],
  ['travel','🏨','Four Seasons','보라보라 오버워터 방갈로',26000000,[['3박','5박','7박']]],
  ['travel','🏨','Four Seasons','파리 조지5세',18000000,[['3박','5박','7박']]],
  ['travel','🏨','Four Seasons','뉴욕 다운타운 펜트하우스',28000000,[['3박','5박','7박']]],
  ['travel','🏨','Burj Al Arab','시그니처 스위트',15000000,[['2박','3박','5박','7박']]],
  ['travel','🏨','Burj Al Arab','로얄 스위트',45000000,[['2박','3박','5박']]],
  ['travel','🏨','Ritz Paris','코쿄 샤넬 스위트',32000000,[['2박','3박','5박']]],
  ['travel','🏨','Hôtel Plaza Athénée','에펠 스위트',24000000,[['2박','3박','5박']]],
  ['travel','🏨','The Peninsula','홍콩 더 페닌슐라 스위트',16000000,[['2박','3박','5박','7박']]],
  ['travel','🏨','The Peninsula','파리 더 페닌슐라 스위트',18000000,[['2박','3박','5박']]],
  ['travel','🏨','Mandarin Oriental','뱅콕 어소시', 9000000,[['3박','5박','7박']]],
  ['travel','🏨','Park Hyatt','도쿄 프레지덴셜 스위트',14000000,[['2박','3박','5박']]],
  ['travel','🏨','Bulgari Hotel','로마 BVLGARI 스위트',26000000,[['2박','3박','5박']]],
  ['travel','🏨','Bulgari Hotel','파리 BVLGARI 스위트',28000000,[['2박','3박','5박']]],
  ['travel','🏨','Cheval Blanc','파리 디오르 스파 스위트',32000000,[['2박','3박','5박']]],
  ['travel','🏨','Hotel de Crillon','파리 로얄 스위트',38000000,[['2박','3박','5박']]],

  // ═══ TRAVEL — Yacht / Heli / Experience ═══
  ['travel','🛥️','Azimut','지중해 슈퍼요트 전세',180000000,[['7일 (16인)','14일 (16인)','30일 (16인)']]],
  ['travel','🛥️','Sunseeker','지중해 요트 전세',120000000,[['7일 (12인)','14일 (12인)']]],
  ['travel','🛥️','Lürssen','메가요트 차터',390000000,[['7일 (20인)','14일 (20인)']]],
  ['travel','🛥️','Benetti','코트다쥐르 요트 차터',98000000,[['7일','14일']]],
  ['travel','🚁','Airbus','제주 프라이빗 헬기 투어',4800000,[['2시간 (4인)','4시간 (4인)','종일 (4인)']]],
  ['travel','🚁','Sikorsky','서울→제주 프라이빗 헬기',9800000,[['편도 (4인)','왕복 (4인)']]],
  ['travel','🛩️','NetJets','프라이빗 제트 25시간 카드',180000000,[['Phenom 300','Citation Latitude','Global 6000']]],
  ['travel','🛩️','VistaJet','글로벌 7500 카드',290000000,[['25시간','50시간','100시간']]],
  ['travel','🌋','SpaceX','민간 우주여행 탑승권',6000000000,[['Inspiration5','Polaris Mission']]],
  ['travel','🌋','Virgin Galactic','준궤도 우주비행',650000000,[['스탠다드','VIP']]],
  ['travel','🎿','Courchevel 1850','샬레 전세 7박',35000000,[['8인','12인','16인']]],
  ['travel','🎿','Verbier','샬레 전세 7박',38000000,[['8인','12인','16인']]],
  ['travel','🎿','Aspen','샬레 전세 7박',42000000,[['8인','12인','16인']]],
  ['travel','🏝️','Necker Island','버진 그룹 프라이빗 아일랜드',280000000,[['주말','1주','2주']]],
  ['travel','🏝️','Musha Cay','데이비드 카퍼필드 프라이빗 아일랜드',420000000,[['주말','1주','2주']]],

  // ═══════════════════════════════════════════════════════════
  // ═══ JEWELRY — Watches (lots of variants) ═══
  ['jewelry','⌚','Rolex','Daytona 18K 옐로골드',98000000,[['옐로골드','로즈골드','화이트골드'],['샴페인 다이얼','블랙 다이얼','다이아 베젤']]],
  ['jewelry','⌚','Rolex','Daytona 스테인리스',45000000,[['블랙 다이얼','화이트 다이얼','파나마 다이얼']]],
  ['jewelry','⌚','Rolex','Submariner Date',22000000,[['블랙/스틸','블루/스틸','그린/스틸','블랙/2톤','블루/골드']]],
  ['jewelry','⌚','Rolex','GMT-Master II',28000000,[['펩시 베젤','배트맨 베젤','쥬빌리 브레이슬렛','옐로골드','로즈골드']]],
  ['jewelry','⌚','Rolex','Day-Date 40',45000000,[['옐로골드/샴페인','옐로골드/블랙','로즈골드/초콜릿','화이트골드/오션 블루','플래티넘/아이스']]],
  ['jewelry','⌚','Rolex','Sky-Dweller',38000000,[['옐로골드 옥스터','로즈골드 옥스터','화이트골드 옥스터','스틸 옥스터']]],
  ['jewelry','⌚','Rolex','Yacht-Master 42',32000000,[['로즈골드','옐로골드','화이트골드','RLX 티타늄']]],
  ['jewelry','⌚','Patek Philippe','Nautilus 5711/1A',280000000,[['블루 다이얼','블랙 다이얼','옐로골드','로즈골드']]],
  ['jewelry','⌚','Patek Philippe','Nautilus 5712/1R',180000000,[['로즈골드','화이트골드','옐로골드']]],
  ['jewelry','⌚','Patek Philippe','Aquanaut 5167A',98000000,[['블랙','블루','카키','초콜릿']]],
  ['jewelry','⌚','Patek Philippe','Calatrava 5227',58000000,[['옐로골드','로즈골드','화이트골드','플래티넘']]],
  ['jewelry','⌚','Patek Philippe','Grand Complications 5740',680000000,[['화이트골드','로즈골드','플래티넘']]],
  ['jewelry','⌚','Audemars Piguet','Royal Oak 15400',58000000,[['스틸','옐로골드','로즈골드','화이트골드'],['41mm','39mm']]],
  ['jewelry','⌚','Audemars Piguet','Royal Oak Perpetual',190000000,[['화이트골드','로즈골드','옐로골드','플래티넘']]],
  ['jewelry','⌚','Audemars Piguet','Royal Oak Offshore Chrono',78000000,[['스틸/블랙','로즈골드/블랙','블랙 세라믹','화이트 세라믹']]],
  ['jewelry','⌚','Audemars Piguet','Code 11.59 클로노',98000000,[['로즈골드','화이트골드','블랙 세라믹']]],
  ['jewelry','⌚','Richard Mille','RM 11-03 McLaren',450000000,[['카본 TPT','쿼츠 TPT','티타늄','로즈골드']]],
  ['jewelry','⌚','Richard Mille','RM 27-04 Rafael Nadal',1290000000,[['카본 TPT','퀵스카프']]],
  ['jewelry','⌚','Richard Mille','RM 35-03 Rafa Automatic',390000000,[['카본 TPT','쿼츠 TPT','옐로 쿼츠','블루 쿼츠']]],
  ['jewelry','⌚','A. Lange & Söhne','Lange 1',98000000,[['플래티넘','로즈골드','옐로골드','화이트골드']]],
  ['jewelry','⌚','A. Lange & Söhne','Datograph Up/Down',128000000,[['플래티넘','로즈골드','화이트골드']]],
  ['jewelry','⌚','Vacheron Constantin','Overseas',58000000,[['스틸','로즈골드','화이트골드','블루 다이얼','실버 다이얼']]],
  ['jewelry','⌚','Vacheron Constantin','Patrimony',38000000,[['로즈골드','화이트골드','옐로골드','플래티넘']]],
  ['jewelry','⌚','Vacheron Constantin','Traditionnelle Tourbillon',290000000,[['로즈골드','화이트골드','플래티넘']]],
  ['jewelry','⌚','IWC','Big Pilot Top Gun',18000000,[['세라믹 블랙','세라믹 그레이','세라믹 화이트','브론조']]],
  ['jewelry','⌚','IWC','Portugieser Chronograph',12000000,[['스틸','로즈골드','화이트골드']]],
  ['jewelry','⌚','Hublot','Big Bang Integral',28000000,[['세라믹 올블랙','티타늄','킹 골드','매직 골드']]],
  ['jewelry','⌚','Hublot','Spirit of Big Bang',32000000,[['티타늄','킹 골드','블랙 매직','블루 매직']]],
  ['jewelry','⌚','Panerai','Luminor Marina 44mm',12000000,[['스틸','티타늄','브론조','카본']]],
  ['jewelry','⌚','Panerai','Submersible 47mm',18000000,[['티타늄','카본','브론조','골드 테크']]],
  ['jewelry','⌚','Tag Heuer','Carrera Chronograph',6900000,[['블랙','블루','실버','로즈골드']]],
  ['jewelry','⌚','Tag Heuer','Monaco',8900000,[['블루','블랙','레드 그란드','그레이']]],
  ['jewelry','⌚','Omega','Speedmaster Moonwatch',12000000,[['핸드 와인딩','코액시얼 마스터','새핀','메테오라이트']]],
  ['jewelry','⌚','Omega','Seamaster Diver 300M',9900000,[['블랙','블루','그린','옐로','화이트']]],

  // ═══ JEWELRY — Rings & Engagement ═══
  ['jewelry','💍','Cartier','Love 링 18K',12000000,[['옐로골드','로즈골드','화이트골드'],['플레인','다이아 1개','풀 다이아']]],
  ['jewelry','💍','Cartier','Trinity 링',6900000,[['스몰','클래식','라지']]],
  ['jewelry','💍','Cartier','Just un Clou 링',8900000,[['옐로골드','로즈골드','화이트골드'],['플레인','다이아']]],
  ['jewelry','💍','Tiffany','Diamond 약혼반지 3ct',89000000,[['플래티넘','옐로골드','로즈골드'],['GIA D-FL','GIA E-VVS1','GIA F-VS1']]],
  ['jewelry','💍','Tiffany','T True 링',5900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💍','Bulgari','B.zero1 링',6900000,[['옐로골드','로즈골드','화이트골드','쟁이르','블랙 세라믹']]],
  ['jewelry','💍','Bulgari','Serpenti 링',12900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💍','Van Cleef & Arpels','Perlée 링',8900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💍','Harry Winston','Round Brilliant 4ct',290000000,[['플래티넘','로즈골드','옐로골드']]],
  ['jewelry','💍','Graff','Promise Round Diamond 5ct',490000000,[['플래티넘','로즈골드']]],
  ['jewelry','💍','Chopard','Happy Diamonds 링',6900000,[['옐로골드','로즈골드','화이트골드']]],

  // ═══ JEWELRY — Necklaces ═══
  ['jewelry','📿','Van Cleef & Arpels','Alhambra 목걸이',7800000,[['옐로골드','로즈골드','화이트골드'],['10모티프','20모티프']]],
  ['jewelry','📿','Cartier','Love 목걸이',9800000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Tiffany','T Smile 목걸이',5900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Tiffany','HardWear Link 목걸이',12900000,[['옐로골드','로즈골드']]],
  ['jewelry','📿','Bulgari','Serpenti Viper 목걸이',9800000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Bulgari','B.zero1 목걸이',8900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Mikimoto','아코야 진주 목걸이',8900000,[['7mm','8mm','9mm','10mm']]],
  ['jewelry','📿','Mikimoto','남양 진주 목걸이',12900000,[['9-11mm','11-13mm','13-15mm']]],
  ['jewelry','💎','Graff','다이아몬드 파베 리벳 목걸이',95000000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💎','Harry Winston','Lily Cluster 목걸이',58000000,[['플래티넘','로즈골드']]],

  // ═══ JEWELRY — Bracelets ═══
  ['jewelry','📿','Cartier','Love 브레이슬렛',12000000,[['옐로골드','로즈골드','화이트골드'],['플레인','다이아 4개','풀 다이아']]],
  ['jewelry','📿','Cartier','Juste un Clou 브레이슬렛',9800000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Cartier','Panthère 브레이슬렛',98000000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Tiffany','T1 브레이슬렛',6900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Tiffany','HardWear Link 브레이슬렛',12900000,[['옐로골드','로즈골드']]],
  ['jewelry','📿','Van Cleef & Arpels','Perlée 브레이슬렛',8900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Bulgari','Serpenti Viper 브레이슬렛',9800000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','📿','Hermès','Collier de Chien 브레이슬렛',2900000,[['에토프','블랙','루즈','블루']]],

  // ═══ JEWELRY — Earrings ═══
  ['jewelry','💎','Tiffany','Solitaire Diamond 귀걸이',38000000,[['1ct','2ct','3ct','5ct']]],
  ['jewelry','💎','Cartier','Trinity 귀걸이',5900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💎','Bulgari','Serpenti Viper 귀걸이',6900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💎','Van Cleef & Arpels','Alhambra 귀걸이',5900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💎','Chopard','Happy Diamonds 귀걸이',4900000,[['옐로골드','로즈골드','화이트골드']]],
  ['jewelry','💎','Mikimoto','아코야 진주 귀걸이',2900000,[['7mm','8mm','9mm','10mm']]],
  ['jewelry','💎','Harry Winston','Sunflower 다이아 귀걸이',58000000,[['플래티넘','로즈골드']]],
];

// ── PRODUCT GENERATOR ─────────────────────────────────────────
const SHIPPING_MSG = [
  '당일 특급배송 (블랙카드 무료)',
  '내일 도착 보장',
  '전용 쿠리어 배송 (무료)',
  '특급 안전배송',
];
const BADGE_POOL = ['BEST','NEW','HOT','LUXURY','VIP','RARE','LIMITED','PRO','EXCLUSIVE'];

function seededRand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function generateProducts() {
  const out = [];
  let id = 0;
  for (const tpl of TPL) {
    const [cat, emoji, brand, name, basePrice, variants] = tpl;
    const v1 = (variants && variants[0]) || [''];
    const v2 = (variants && variants[1]) || [''];
    for (let i = 0; i < v1.length; i++) {
      for (let j = 0; j < v2.length; j++) {
        id++;
        const variantStr = [v1[i], v2[j]].filter(Boolean).join(' ');
        const v1Mul = v1.length > 1 ? 1 + (i / (v1.length - 1)) * 0.35 : 1;
        const v2Mul = v2.length > 1 ? 1 + (j / (v2.length - 1)) * 0.08 : 1;
        const price = Math.round(basePrice * v1Mul * v2Mul / 10000) * 10000;
        const original = Math.round(price * (1.10 + seededRand(id) * 0.18) / 10000) * 10000;
        const reviewBase = Math.floor(seededRand(id + 1) * 48000) + 200;
        const ratingBase = (4.5 + seededRand(id + 2) * 0.5).toFixed(1);
        const shipping = SHIPPING_MSG[id % SHIPPING_MSG.length];
        let badge = null;
        if (id % 11 === 0)      badge = 'BEST';
        else if (id % 17 === 0) badge = 'LUXURY';
        else if (id % 23 === 0) badge = 'NEW';
        else if (id % 29 === 0) badge = 'HOT';
        else if (id % 37 === 0) badge = 'VIP';
        else if (id % 41 === 0) badge = 'LIMITED';
        else if (price > 100000000) badge = 'EXCLUSIVE';
        else if (price > 50000000)  badge = 'RARE';
        out.push({
          id,
          category: cat,
          emoji,
          brand,
          name: variantStr ? `${name} ${variantStr}` : name,
          price,
          original,
          rating: parseFloat(ratingBase),
          reviews: reviewBase,
          shipping,
          badge,
        });
      }
    }
  }
  return out;
}

const products = generateProducts();
console.log(`Generated ${products.length} products`);

// ── FLASH DEALS ────────────────────────────────────────────────
const flashDeals = [
  { emoji: '🍾', name: 'Dom Pérignon Vintage 2015', price: 680000, discount: '30%' },
  { emoji: '🎮', name: 'PlayStation 5 Pro 특가',     price: 749000, discount: '12%' },
  { emoji: '🥩', name: '미야자키 와규 A5 2kg',        price: 680000, discount: '25%' },
  { emoji: '💄', name: 'La Mer 크렘 한정 세트',       price: 1490000, discount: '15%' },
  { emoji: '🎧', name: 'Sony WH-1000XM6',           price: 479000, discount: '13%' },
  { emoji: '🌹', name: '에콰도르 장미 200송이',       price: 180000, discount: '20%' },
  { emoji: '☕', name: 'De\'Longhi 에스프레소',       price: 1490000, discount: '17%' },
  { emoji: '🕯️', name: 'Diptyque 캔들 10종',         price: 380000, discount: '18%' },
  { emoji: '🍫', name: 'Valrhona 럭셔리 박스',        price: 180000, discount: '22%' },
  { emoji: '⌚', name: 'Hublot Big Bang 한정판',     price: 28000000, discount: '15%' },
];

// ── STATE ──────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('blackcard_cart') || '[]');
let filteredProducts = [...products];
let currentSort = 'default';
let renderedCount = 0;
let currentOrderId = null;
const PAGE_SIZE = 36;

function saveCart() { localStorage.setItem('blackcard_cart', JSON.stringify(cart)); }

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  resetAndRender();
  renderFlashDeals();
  startCountdown();
  updateCartUI();
});

// ── RENDER ─────────────────────────────────────────────────────
function productCardHTML(p) {
  return `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge ${['VIP','LUXURY','EXCLUSIVE','RARE'].includes(p.badge) ? 'gold' : ''}">${p.badge}</div>` : ''}
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${escapeHTML(p.name)}</div>
        <div class="product-rating">⭐ ${p.rating} <span>(${p.reviews.toLocaleString()})</span></div>
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
    </div>`;
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function resetAndRender() {
  document.getElementById('productGrid').innerHTML = '';
  renderedCount = 0;
  loadMore();
}

function loadMore() {
  const next = filteredProducts.slice(renderedCount, renderedCount + PAGE_SIZE);
  const html = next.map(productCardHTML).join('');
  document.getElementById('productGrid').insertAdjacentHTML('beforeend', html);
  renderedCount += next.length;
  updateLoadMoreUI();
}

function updateLoadMoreUI() {
  const btn = document.getElementById('loadMoreBtn');
  const info = document.getElementById('loadMoreInfo');
  const total = filteredProducts.length;
  if (renderedCount >= total) {
    btn.style.display = 'none';
    info.textContent = total === 0 ? '검색 결과가 없습니다' : `🎉 총 ${total.toLocaleString()}개 상품 모두 표시됨`;
  } else {
    btn.style.display = 'inline-block';
    btn.textContent = `더보기 ⬇ (${renderedCount.toLocaleString()} / ${total.toLocaleString()})`;
    info.textContent = `${total.toLocaleString()}개 중 ${renderedCount.toLocaleString()}개 표시`;
  }
}

function renderFlashDeals() {
  document.getElementById('flashDeals').innerHTML = flashDeals.map(f => `
    <div class="flash-item" onclick="alert('🔥 ${f.name} 특가 상품이 장바구니에 담겼습니다!')">
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
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) {
    filteredProducts = [...products];
    document.getElementById('categoryTitle').textContent = '전체 상품';
  } else {
    filteredProducts = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
    document.getElementById('categoryTitle').textContent = `"${q}" 검색 결과`;
  }
  applySortAndRender();
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
  applySortAndRender();
}

function sortProducts(by) {
  currentSort = by;
  applySortAndRender();
}

function applySortAndRender() {
  if (currentSort === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
  else if (currentSort === 'rating') filteredProducts.sort((a, b) => b.rating - a.rating);
  resetAndRender();
}

// ── CART ───────────────────────────────────────────────────────
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
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
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
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
          <div class="cart-item-name">${escapeHTML(item.name)}</div>
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
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#111;color:#c9a84c;padding:12px 24px;border-radius:12px;font-weight:700;z-index:9999;font-size:14px;border:1px solid #c9a84c;animation:slideUp .3s ease;max-width:90%';
  t.textContent = `✅ "${name.slice(0, 26)}..." 장바구니 추가!`;
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
        <span>${item.emoji} ${escapeHTML(item.name.slice(0, 26))}... × ${item.qty}</span>
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

// ── ORDER (CLIENT-SIDE) ────────────────────────────────────────
function generateOrderId() {
  return 'BLK' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
}

function saveOrder(order) {
  const all = JSON.parse(localStorage.getItem('blackcard_orders') || '{}');
  all[order.orderId] = order;
  localStorage.setItem('blackcard_orders', JSON.stringify(all));
}

function getOrder(id) {
  const all = JSON.parse(localStorage.getItem('blackcard_orders') || '{}');
  return all[id] || null;
}

function getDeliveryStages(orderedAt) {
  const elapsed = Date.now() - orderedAt;
  const M = 60 * 1000;
  const stages = [
    { key: 'ordered',   label: '주문 완료',    icon: '✅', delay: 0 },
    { key: 'paid',      label: '결제 완료',    icon: '💳', delay: 1 * M },
    { key: 'preparing', label: '상품 준비 중', icon: '📦', delay: 3 * M },
    { key: 'shipped',   label: '배송 출발',    icon: '🚚', delay: 6 * M },
    { key: 'transit',   label: '배송 중',      icon: '🛣️',  delay: 10 * M },
    { key: 'nearby',    label: '근처 도착',    icon: '📍', delay: 15 * M },
    { key: 'delivered', label: '배송 완료',    icon: '🎉', delay: 20 * M },
  ];
  let currentIdx = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (elapsed >= stages[i].delay) { currentIdx = i; break; }
  }
  return stages.map((s, i) => ({
    ...s,
    done: i <= currentIdx,
    current: i === currentIdx,
    time: i <= currentIdx
      ? new Date(orderedAt + s.delay).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      : null,
  }));
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

  const order = {
    orderId: generateOrderId(),
    items: cart.map(({ id, emoji, name, price, qty }) => ({ id, emoji, name, price, qty })),
    total,
    address: `${address} (${recipient})`,
    orderedAt: Date.now(),
  };
  saveOrder(order);
  currentOrderId = order.orderId;

  closeCheckout();
  cart = [];
  saveCart();
  updateCartUI();

  document.getElementById('orderIdDisplay').textContent = currentOrderId;
  document.getElementById('successOverlay').classList.add('open');

  btn.textContent = '결제 완료 ₩' + document.getElementById('payAmount').textContent;
  btn.disabled = false;
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

function showTrackingPage(orderId) {
  document.getElementById('trackingPage').classList.remove('hidden');
  refreshTracking(orderId);
}

function refreshTracking(orderId) {
  const id = typeof orderId === 'string' ? orderId : currentOrderId;
  if (!id) return;
  const order = getOrder(id);
  if (!order) { alert('주문을 찾을 수 없습니다'); return; }
  renderTrackingPage({ ...order, stages: getDeliveryStages(order.orderedAt) });
}

function renderTrackingPage(order) {
  const currentStage = order.stages.find(s => s.current);

  document.getElementById('trackingOrderInfo').innerHTML = `
    <p><strong>주문번호</strong> &nbsp;${order.orderId}</p>
    <p><strong>배송지</strong> &nbsp;${escapeHTML(order.address)}</p>
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
        <div class="tracking-item-name">${escapeHTML(item.name)} × ${item.qty}</div>
        <div class="tracking-item-price">₩${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('')}
  `;
}

// ── CARD MODAL ─────────────────────────────────────────────────
function showCardModal() { document.getElementById('cardModalOverlay').classList.add('open'); }
function closeCardModal() { document.getElementById('cardModalOverlay').classList.remove('open'); }

document.getElementById('cardModalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('cardModalOverlay')) closeCardModal();
});
document.getElementById('checkoutOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('checkoutOverlay')) closeCheckout();
});
document.getElementById('successOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('successOverlay')) closeSuccess();
});
