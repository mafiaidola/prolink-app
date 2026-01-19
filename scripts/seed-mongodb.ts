// MongoDB Seed Script - Run with: npx tsx scripts/seed-mongodb.ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://prolink_admin:nAPlk5PyZkFig83G@prolink-cluster.nj4qwv2.mongodb.net/?appName=prolink-cluster";

// Data extracted from PostgreSQL backup
const homepageContent = {
    _id: 1,
    title: "EP Group",
    subtitle: "Your Ultimate Digital Profile Builder.",
    description: "Create, manage, and share a stunning, professional bio link page that brings all your content together.",
    features: [
        { icon: "Palette", title: "Stunning Customization", description: "Choose from multiple themes, animated backgrounds, and custom colors to make your profile truly yours." },
        { icon: "SlidersHorizontal", title: "Advanced Controls", description: "Manage unlimited links, generate custom slugs, and get suggestions for your profile fields with our AI assistant." },
        { icon: "QrCode", title: "Dynamic QR Codes", description: "Create and customize QR codes with your logo and brand colors to bridge the physical and digital worlds." },
        { icon: "Languages", title: "Bilingual Support", description: "Full support for English (LTR) and Arabic (RTL) to reach a wider audience effortlessly." }
    ],
    faviconUrl: "https://cdn.jsdelivr.net/npm/twemoji@11.3.0/2/svg/1f4ad.svg",
    logoUrl: "https://i.ibb.co/8gWMhckn/Logo-trans-small-white.png",
    heroImageUrl: "https://picsum.photos/seed/prolink-hero/1200/800",
    heroButton1Text: "Contact Dev",
    heroButton1Link: "https://fb.com/mafiaidola",
    heroButton2Text: "Admin Access",
    heroButton2Link: "/login",
    updatedAt: new Date().toISOString()
};

const profiles = [
    {
        slug: "mooo",
        name: "mo",
        jobTitle: "test",
        bio: "etstA short and catchy bio about you.",
        logoUrl: "https://picsum.photos/seed/mooo/200/200",
        coverUrl: "https://picsum.photos/seed/mooo-cover/800/300",
        companyInfo: "Details about where you work or what you do.",
        theme: "default",
        animatedBackground: "waves",
        layout: "minimalist-center",
        isPublished: false,
        isVerified: false,
        links: [{ id: "2025-09-15T22:54:25.326Z", url: "https://facebook.com/mafiaidola", icon: "https://www.svgrepo.com/show/475647/facebook-color.svg", title: "facebook" }],
        content: [],
        vCard: {},
        createdAt: "2025-09-15T22:53:26.575965+00:00"
    },
    {
        slug: "shahin",
        name: "Ahmed Shahine",
        jobTitle: "Personal Business Card",
        bio: "A short and catchy bio about you.",
        logoUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/435946175_1107700207131675_385740233890071741_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHWO8iH03GJ30YRD8_w4zY_AM8Hmv7RyycAzwea_tHLJ6Moj208cXEPajo_JuibFCmjMhQdjUOnUhczx-arKC5M&_nc_ohc=-Sg1_C8ttPkQ7kNvwGEEm0q&_nc_oc=AdlVnj9j49szvoe0ALSQaZDF429FB7lwLmtlKSPnOfgmJ7CGFBmeNXPoOumQGt8ugcE&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=25QsvC7xjDZBtjbz47pHMQ&oh=00_AfZbeI9y-ouP31Z__d260TWibWv8kYb-OkzOgeJckESBtg&oe=68CEFD0B",
        coverUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/474132747_1266517597916601_8890860046324652986_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeH5TbjNAw0qqatW3WeDC2xOEMAcp8xNcrwQwBynzE1yvIxnzkFSKa_JW9HQXSZ75F0nzXqcbLP30cGJbeaSqh60&_nc_ohc=t0imHyy7_B8Q7kNvwFfOtaI&_nc_oc=AdkUBs7eJ_MUPP3v4lpG-7G-s4zq4IBbaj8KzrZYyOXb5M3MftkBb3sHh6FpVDpRDqA&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=EUlLjkmXlpvFSdKyTd8RKQ&oh=00_Afa5ezj1qswJSFz9QEGmC2A287RFgLPc4E5_G-SRpAb9Tw&oe=68CEFC2F",
        companyInfo: "Details about where you work or what you do.",
        theme: "neon",
        animatedBackground: "deep-hole",
        layout: "stacked",
        isPublished: true,
        isVerified: true,
        links: [],
        content: [
            { id: "2025-09-16T10:26:45.012Z", text: "Alex Star Group", type: "heading", level: "h1" },
            { id: "2025-09-16T10:26:54.595Z", text: "EP Group ", type: "heading", level: "h3" },
            { id: "2025-09-16T10:27:00.184Z", text: "Solaris ", type: "heading", level: "h3" },
            { id: "2025-09-16T10:27:06.232Z", text: "Shifte ", type: "heading", level: "h3" },
            { id: "2025-09-16T10:27:17.592Z", text: "Down Town", type: "heading", level: "h3" }
        ],
        vCard: { email: "ahmedshahin@ep-eg.com", phone: "", title: "", company: "", website: "", lastName: "Shahin", firstName: "Mr Ahmed" },
        createdAt: "2025-09-15T22:59:38.443711+00:00"
    },
    {
        slug: "solaris",
        name: "Solaris",
        jobTitle: "EP Group",
        bio: "Alex Star Company !",
        logoUrl: "https://scontent.faly8-2.fna.fbcdn.net/v/t39.30808-6/480191608_122164153760311161_5620979480808247876_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE13tWMzu7RZz8a2O7evpH1dkQi1uq2y892RCLW6rbLz7sVEOT5rC16JGOGC47rjArjPVkUx-tU4pNqCLpsYwY5&_nc_ohc=Ch5N-QBUGyUQ7kNvwHPWO6f&_nc_oc=AdkmLXUCBPJZZUEnNtlptpaz_WiK2zwekHLBbORYJsATYO3EtUjYtJTKXTNMO4IVu0Q&_nc_zt=23&_nc_ht=scontent.faly8-2.fna&_nc_gid=yIwyz1GqdAaP3qgGmNZqNg&oh=00_AfZb8TXgrH5-0EBCR2DR20tqOY-zIWEUgMB_qOUOhfHT8w&oe=68CE58B5",
        coverUrl: "https://scontent.faly8-1.fna.fbcdn.net/v/t39.30808-6/480664795_122164155164311161_1718874371880274642_n.png?stp=dst-png_s960x960&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGxv_f3NEMSu_lovVPqj1DlKiK9gJ1XFn4qIr2AnVcWfvVvWYsPmyoN8hYwW6qp65XG4ZI5kFZi4itiHp4Eixpf&_nc_ohc=iKlAZAemgA0Q7kNvwFqMo6m&_nc_oc=Adn29xjZSjJB-9qTylafSjnrs9MWZjS3HX-O9M2xvnS6SQNr_oH9en4pc80dKoUOzhc&_nc_zt=23&_nc_ht=scontent.faly8-1.fna&_nc_gid=53pGaKzU9uj_Pk58UCFYqw&oh=00_AfYo8uYddt_liPQzZd-IsmZPuxttdQ90FaHAEwrIKrOncw&oe=68CE83C0",
        companyInfo: "Professional cosmetics Products",
        theme: "neon",
        animatedBackground: "deep-hole",
        layout: "default",
        isPublished: true,
        isVerified: true,
        links: [
            { id: "2025-09-15T23:14:52.927Z", url: "https://www.facebook.com/SolarisEP", icon: "https://www.svgrepo.com/show/475647/facebook-color.svg", title: "facebook" },
            { id: "2025-09-16T10:31:38.251Z", url: "https://www.instagram.com/solaris.ep", icon: "https://www.svgrepo.com/show/475658/instagram-color.svg", title: "Instgram" },
            { id: "2025-09-16T10:32:44.601Z", url: "https://wa.me/201155593285", icon: "https://www.svgrepo.com/show/452133/whatsapp.svg", title: "WhatsApp" }
        ],
        content: [
            { id: "2025-09-16T09:41:54.667Z", text: "Beauty & Innovation Experts ✨ ", type: "heading", level: "h1" },
            { id: "2025-09-16T09:43:36.234Z", text: "The Distributor for Elysee, PlaySkin, Kuber Science, and BS Pharm, offering advanced and comprehensive solutions for skincare, haircare", type: "heading", level: "h3" },
            {
                id: "2025-09-16T10:28:43.778Z",
                type: "logo-carousel",
                logos: [
                    { id: "2025-09-16T10:28:43.778Z", alt: "Solaris EP", imageUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/481128773_507225752410631_5524337631346136778_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=UEfJqFDNRLIQ7kNvwGX8UAQ&_nc_oc=AdmHVcS_fhdtdA0HTwNVYHLVBDLXACJ6nb8JEWgz172WWaRyyvlHuOGmMx66FBu2xnw&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=6emR2VF-nXLRG8rtX1BpbA&oh=00_AfZrs-DHyXXMNnEq8nzsxVEiVHhdJZJQt4YVz6RV8T6d8Q&oe=68CF04D4" },
                    { id: "2025-09-16T10:29:04.849Z", alt: "Solaris EP", imageUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/480318241_122165109218322261_5803216388247717651_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=tTk1Fu9GE1kQ7kNvwGUb8v_&_nc_oc=Admtvj0x6E5jnbmpRxkwRqKw5Cc9oY96kZSx5g7gZVcHVhHnpSEx8-syr9-gjeFVRW8&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=1MWhple9zVrizd1NzLTADA&oh=00_AfbGF93v6z8YYtGg1SD-xemPohmw2p_a-mTWSJ2c4x9uYA&oe=68CF1530" },
                    { id: "2025-09-16T10:29:15.157Z", alt: "Solaris EP", imageUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/476385101_122170337234300987_7691327869103363776_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-TkVIlmcxVkQ7kNvwEFZA8e&_nc_oc=AdmlLcSlRO6NgbH8p5RCDmmK9lVhi6SUVqffoHyp5tH7I0CG74w6YhB1g7TYHm-K0fE&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=vdP4wYzKrO5UcEA3PsOocA&oh=00_AfYUb_vQu5XoZWlwuzDQBEX_TYJgsjP30gmfMoJqiPwZxQ&oe=68CF08BF" },
                    { id: "2025-09-16T10:29:22.652Z", alt: "Solaris EP", imageUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/440739428_122108939924300987_1634537908407535571_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=tPKHmiISLsIQ7kNvwHg6Fup&_nc_oc=AdntQ_p8RLd6_futru_39MCYMLDyby5XkHQZX7X-45Hkz-c6Z8rLwBiuE-p64ZV89Ck&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=20NjOy01dwG3TVoBoFqGTA&oh=00_Afb-e47wqsdEAjJJhnDb9w7xc4qU8hR3aZo6eMxF4XOhpw&oe=68CF1529" },
                    { id: "2025-09-16T10:29:30.561Z", alt: "Solaris EP", imageUrl: "https://scontent.fcai19-8.fna.fbcdn.net/v/t39.30808-6/305930897_506124638183652_7134932811093860286_n.png?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=A5pORT4VgZ0Q7kNvwEpzOH2&_nc_oc=AdkJelcrhKJ83KLfsu5-6sqHR7kjK7vd3PGvBh_dUAKamJnjZvkwng7tIn8axY8HzYk&_nc_zt=23&_nc_ht=scontent.fcai19-8.fna&_nc_gid=-QeOfaaUI_u3fuzfHfN1Vg&oh=00_AfZ4xxsLX2o2-7kt30qh1XovuVR-H6qlYAhKFGLznyKPNQ&oe=68CF10D9" }
                ],
                title: "Brands"
            },
            { id: "2025-09-16T11:36:33.099Z", text: "Feel Free to contact Solaris with any method below ", type: "heading", level: "h1" }
        ],
        vCard: { email: "menna.saad@ep-eg.com", phone: "01155593285", title: "Line Assistant", company: "EP Group", website: "", lastName: "EP-Group", firstName: "Solaris" },
        createdAt: "2025-09-15T23:15:05.825204+00:00"
    }
];

async function seed() {
    console.log('🌱 Starting MongoDB seed...');

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');

        const db = client.db('prolink');

        // Seed homepage_content collection
        console.log('📝 Seeding homepage_content...');
        await db.collection('homepage_content').deleteMany({});
        await db.collection('homepage_content').insertOne(homepageContent);
        console.log('✅ Homepage content seeded');

        // Seed profiles collection
        console.log('👤 Seeding profiles...');
        await db.collection('profiles').deleteMany({});
        await db.collection('profiles').insertMany(profiles);
        console.log(`✅ ${profiles.length} profiles seeded`);

        // Create indexes
        console.log('🔧 Creating indexes...');
        await db.collection('profiles').createIndex({ slug: 1 }, { unique: true });
        await db.collection('profiles').createIndex({ isPublished: 1 });
        console.log('✅ Indexes created');

        console.log('');
        console.log('🎉 MongoDB seed completed successfully!');
        console.log('   Database: prolink');
        console.log('   Collections: homepage_content, profiles');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
