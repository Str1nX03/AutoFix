import asyncio
from database.db import AsyncSessionLocal
from database.models import Product

dummy_data = [
    {"product_type": "Keyboard", "product_field": "gaming", "name": "MechStrike Pro V2", "description": "Mechanical gaming keyboard with RGB backlighting and Cherry MX Red switches.", "price": "129", "Product_Webpage_url": "https://example.com/mechstrike-pro-v2", "product_issues": ""},
    {"product_type": "Mouse", "product_field": "gaming", "name": "AimMaster 8K", "description": "Ultra-lightweight gaming mouse with 8000Hz polling rate.", "price": "89", "Product_Webpage_url": "https://example.com/aimmaster-8k", "product_issues": ""},
    {"product_type": "Monitor", "product_field": "professional", "name": "ColorPro 27 4K", "description": "27-inch 4K IPS monitor with 100% sRGB for professional color grading.", "price": "399", "Product_Webpage_url": "https://example.com/colorpro-27-4k", "product_issues": ""},
    {"product_type": "Motherboard", "product_field": "gaming", "name": "Titan X670E Gaming", "description": "High-end AM5 motherboard with robust VRMs for extreme overclocking.", "price": "299", "Product_Webpage_url": "https://example.com/titan-x670e", "product_issues": ""},
    {"product_type": "Laptop", "product_field": "portable", "name": "AeroBook 13", "description": "Thin and light 13-inch laptop with exceptional battery life.", "price": "999", "Product_Webpage_url": "https://example.com/aerobook-13", "product_issues": ""},
    {"product_type": "Headset", "product_field": "streaming/editing", "name": "StudioSound V-Caster", "description": "High-fidelity closed-back headset with a broadcast-quality microphone.", "price": "149", "Product_Webpage_url": "https://example.com/studiosound-vcaster", "product_issues": ""},
    {"product_type": "Microphone", "product_field": "streaming/editing", "name": "StreamMic Pro", "description": "USB condenser microphone perfect for streaming and voiceovers.", "price": "119", "Product_Webpage_url": "https://example.com/streammic-pro", "product_issues": ""},
    {"product_type": "GPU", "product_field": "gaming", "name": "Radeon RX 7900 XT Ultra", "description": "High-performance graphics card for 4K gaming and ray tracing.", "price": "899", "Product_Webpage_url": "https://example.com/rx7900xt-ultra", "product_issues": ""},
    {"product_type": "CPU", "product_field": "professional", "name": "Core i9-14900K", "description": "24-core processor for heavy multitasking and professional rendering workloads.", "price": "589", "Product_Webpage_url": "https://example.com/i9-14900k", "product_issues": ""},
    {"product_type": "RAM", "product_field": "everyday", "name": "ValueRAM 16GB DDR4", "description": "Reliable 16GB DDR4 3200MHz memory for everyday home and office use.", "price": "45", "Product_Webpage_url": "https://example.com/valueram-16gb", "product_issues": ""},
    {"product_type": "Storage", "product_field": "gaming", "name": "SwiftDrive 2TB NVMe", "description": "Gen4 NVMe SSD with blazing fast 7300MB/s read speeds for quick game loading.", "price": "169", "Product_Webpage_url": "https://example.com/swiftdrive-2tb", "product_issues": ""},
    {"product_type": "Webcam", "product_field": "streaming/editing", "name": "ClearCam 4K", "description": "4K Ultra HD webcam with auto-focus and built-in ring light.", "price": "199", "Product_Webpage_url": "https://example.com/clearcam-4k", "product_issues": ""},
    {"product_type": "Keyboard", "product_field": "professional", "name": "ErgoType Master", "description": "Ergonomic split keyboard for comfortable typing during long coding sessions.", "price": "159", "Product_Webpage_url": "https://example.com/ergotype-master", "product_issues": ""},
    {"product_type": "Mouse", "product_field": "everyday", "name": "ClickBasic Wireless", "description": "Simple, reliable wireless mouse with an ambidextrous design.", "price": "19", "Product_Webpage_url": "https://example.com/clickbasic-wireless", "product_issues": ""},
    {"product_type": "Monitor", "product_field": "gaming", "name": "SpeedDisplay 240Hz", "description": "24-inch 1080p eSports monitor with an ultra-fast 240Hz refresh rate.", "price": "249", "Product_Webpage_url": "https://example.com/speeddisplay-240hz", "product_issues": ""},
    {"product_type": "Motherboard", "product_field": "everyday", "name": "Prime B760M-A", "description": "Micro-ATX motherboard with essential features for a reliable home PC.", "price": "109", "Product_Webpage_url": "https://example.com/prime-b760m", "product_issues": ""},
    {"product_type": "Laptop", "product_field": "gaming", "name": "Predator Helios 16", "description": "Powerful 16-inch gaming laptop with RTX 4080 and Intel i9.", "price": "2199", "Product_Webpage_url": "https://example.com/predator-helios-16", "product_issues": ""},
    {"product_type": "Headset", "product_field": "everyday", "name": "ChatterBox USB Headset", "description": "Lightweight USB headset designed for online meetings and casual use.", "price": "29", "Product_Webpage_url": "https://example.com/chatterbox-usb", "product_issues": ""},
    {"product_type": "RAM", "product_field": "professional", "name": "ProMemory 64GB Kit", "description": "64GB (2x32GB) DDR5 kit for heavy video editing and 3D rendering.", "price": "210", "Product_Webpage_url": "https://example.com/promemory-64gb", "product_issues": ""},
    {"product_type": "Storage", "product_field": "professional", "name": "Archiver 8TB HDD", "description": "High-capacity 7200RPM hard drive for mass data storage and backups.", "price": "189", "Product_Webpage_url": "https://example.com/archiver-8tb", "product_issues": ""},
    {"product_type": "Case", "product_field": "gaming", "name": "AirFlow RGB Tower", "description": "Mid-tower PC case with excellent airflow and 4 pre-installed ARGB fans.", "price": "110", "Product_Webpage_url": "https://example.com/airflow-rgb", "product_issues": ""},
    {"product_type": "Power Supply", "product_field": "gaming", "name": "VoltMax 850W Gold", "description": "850W 80+ Gold certified fully modular power supply.", "price": "125", "Product_Webpage_url": "https://example.com/voltmax-850w", "product_issues": ""},
    {"product_type": "Cooler", "product_field": "professional", "name": "FrostTower Dual 140", "description": "Massive dual-tower air cooler for keeping high-end workstation CPUs cool.", "price": "85", "Product_Webpage_url": "https://example.com/frosttower-dual", "product_issues": ""},
    {"product_type": "Cooler", "product_field": "gaming", "name": "LiquidChill 360 AIO", "description": "360mm All-In-One liquid cooler with a customizable LCD pump display.", "price": "179", "Product_Webpage_url": "https://example.com/liquidchill-360", "product_issues": ""},
    {"product_type": "Laptop", "product_field": "professional", "name": "Creator Pro 17", "description": "Mobile workstation featuring a Pantone-validated 4K OLED display.", "price": "2599", "Product_Webpage_url": "https://example.com/creator-pro-17", "product_issues": ""},
    {"product_type": "Monitor", "product_field": "streaming/editing", "name": "UltraWide 34 EditPro", "description": "34-inch ultrawide monitor offering massive screen real estate for video timelines.", "price": "499", "Product_Webpage_url": "https://example.com/ultrawide-34", "product_issues": ""},
    {"product_type": "Mouse", "product_field": "portable", "name": "TravelMouse Mini", "description": "Compact and foldable Bluetooth mouse for people on the go.", "price": "35", "Product_Webpage_url": "https://example.com/travelmouse-mini", "product_issues": ""},
    {"product_type": "Keyboard", "product_field": "portable", "name": "Foldable Type 60", "description": "60% layout keyboard that folds in half for extreme portability.", "price": "55", "Product_Webpage_url": "https://example.com/foldable-type-60", "product_issues": ""},
    {"product_type": "Capture Card", "product_field": "streaming/editing", "name": "StreamLink 4K60", "description": "External USB 3.0 capture card capable of recording uncompressed 4K at 60fps.", "price": "229", "Product_Webpage_url": "https://example.com/streamlink-4k60", "product_issues": ""},
    {"product_type": "Speakers", "product_field": "everyday", "name": "DeskTunes 2.0", "description": "Compact stereo speakers with rich sound for casual music and videos.", "price": "45", "Product_Webpage_url": "https://example.com/desktunes-2.0", "product_issues": ""}
]

async def seed():
    print("Seeding dummy product data to Neon database and generating embeddings...")
    from database.utils import generate_embeddings
    
    async with AsyncSessionLocal() as session:
        for item in dummy_data:
            combined_text = (
                f"Product: {item['name']}. "
                f"Type: {item['product_type']}. "
                f"Field: {item['product_field']}. "
                f"Price: ${item['price']}. "
                f"Description: {item['description']}."
            )
            
            print(f"Generating embedding for {item['name']}...")
            raw_embedding = generate_embeddings(combined_text)
            
            # Truncate to 768 dimensions if it's larger (e.g., bge-large-en-v1.5)
            if raw_embedding and len(raw_embedding) >= 768:
                truncated_embedding = raw_embedding[:768]
            else:
                print(f"Warning: Embedding for {item['name']} is smaller than 768 dimensions.")
                truncated_embedding = raw_embedding
                
            item["embedding"] = truncated_embedding
            
            product = Product(**item)
            session.add(product)
        
        await session.commit()
        print(f"Successfully seeded {len(dummy_data)} products to the 'products' table.")

if __name__ == "__main__":
    asyncio.run(seed())
