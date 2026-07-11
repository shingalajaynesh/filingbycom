import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import VirtualLocation from "../src/models/VirtualLocation.model.js";

dotenv.config();

const realCities = [
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    tagline: "Connaught Place, Saket & Dwarka",
    rate: "999",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Connaught Place Center",
        slug: "connaught-place",
        address: "Level 2, Connaught Circus, Block G, Connaught Place, New Delhi - 110001",
        feature: "Premium CBD Center, Metro Connectivity",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenities: ["High-speed Wi-Fi", "Mail Forwarding", "Conference Rooms", "Front Desk Representative", "GST Officer Inspection Support"],
        description: "Establish your corporate identity at Delhi's iconic business hub. Fully compliant with MCA and GST regulations, including dedicated name boards and physical desk space.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.5843468305084!2d77.21447087627464!3d28.627252075667232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a32d1bb5%3A0x6b7fa15f8de50a21!2sConnaught%20Place%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Saket Business District",
        slug: "saket",
        address: "3rd Floor, Rectangle One, Saket District Centre, Saket, New Delhi - 110017",
        feature: "Elite South Delhi Commercial Address",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        priceGST: "1,099",
        priceIncorp: "1,399",
        priceMail: "649",
        amenities: ["Premium Address", "Boardroom Access", "Courier Collection", "Lounge Access", "Name Board Listing"],
        description: "Situated in South Delhi's premium corporate hub. Ideal for companies seeking a high-status business address with professional mailbox management.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.748301131102!2d77.2189679!3d28.5307524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1f707f15437%3A0xb35a0cfcf57b988f!2sSaket%20District%20Centre%2C%20Saket%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Is physical verification supported for GST registration in Delhi?", a: "Yes, our local representatives coordinate with the GST inspector, set up the physical desk/name-board, and assist with document verification." },
      { q: "Can I use this address for MCA/Company Registration?", a: "Absolutely. We provide a complete documentation set, including the Rent Agreement, NOC, and Utility Bill, to verify legal business occupancy." }
    ]
  },
  {
    slug: "noida",
    name: "Noida",
    state: "Uttar Pradesh",
    tagline: "Sector 62, Sector 2 & Sector 18",
    rate: "999",
    image: "https://images.unsplash.com/photo-1627998797960-449e7b233a76?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3995819777977!2d77.3708304!3d28.6177897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef90123f15c7%3A0xe54ef48f86f7881c!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Sector 62 IT Hub",
        slug: "sector-62",
        address: "5th Floor, C-Block, Sector 62, Noida, Uttar Pradesh - 201301",
        feature: "Premium IT Park Location, Sprawling Infrastructure",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenities: ["High-speed Internet", "Front Desk Support", "Meeting Rooms", "Secure Mailbox", "GST Physical Desk"],
        description: "Perfect for IT, technology, and e-commerce companies seeking a business presence in Uttar Pradesh's prime economic zone.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3995819777977!2d77.3708304!3d28.6177897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef90123f15c7%3A0xe54ef48f86f7881c!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Is the UP GST registration process different?", a: "The documentation checklist remains standard, but local inspections can be detailed. We provide fully compliant, local commercial utility bills to ensure smooth clearance." }
    ]
  },
  {
    slug: "gurugram",
    name: "Gurugram",
    state: "Haryana",
    tagline: "Cyber City, Golf Course Road & Sohna Road",
    rate: "1,099",
    image: "https://images.unsplash.com/photo-1595841696660-1e5cff0dce8a?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.9732104332997!2d77.0863073!3d28.4953745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19385b000001%3A0x6a2df8566ff7c9b!2sDLF%20Cyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Cyber City Prestige",
        slug: "cyber-city",
        address: "Building 10B, DLF Cyber City, Phase 2, Gurugram, Haryana - 122002",
        feature: "Iconic Cyber City Corporate Address",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        priceGST: "1,499",
        priceIncorp: "1,899",
        priceMail: "799",
        amenities: ["Grade-A Building Address", "Executive Meeting Rooms", "Front Desk Coordinator", "Digital Mail Processing", "Inspection Desk Support"],
        description: "A premium business address in India's leading corporate hub, home to Fortune 500 corporations. Instantly elevate your brand authority.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.9732104332997!2d77.0863073!3d28.4953745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19385b000001%3A0x6a2df8566ff7c9b!2sDLF%20Cyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Is the NOC valid for corporate bank accounts?", a: "Yes, our documentation set is fully accepted for corporate bank account opening, GST registration, and MCA company incorporation." }
    ]
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    tagline: "Indiranagar, Koramangala & MG Road",
    rate: "1,199",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.975466827052!2d77.6405786!3d12.9734139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a6ce5d5d67%3A0x2863a32f4be8c8e6!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Indiranagar Business Park",
        slug: "indiranagar",
        address: "100 Feet Rd, Hal 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038",
        feature: "Prime Indiranagar 100 Ft Rd Landmark",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
        priceGST: "1,299",
        priceIncorp: "1,599",
        priceMail: "699",
        amenities: ["Premium Commercial Address", "Courier Handling", "Meeting Rooms", "Visitor Reception", "GST Verification Desk"],
        description: "Perfect address in India's startup capital. Located on the main 100 Feet Road, giving high credibility to your business invoices and corporate files.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.975466827052!2d77.6405786!3d12.9734139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a6ce5d5d67%3A0x2863a32f4be8c8e6!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "Is Karnataka GST verification easy?", a: "Yes, we provide valid commercial property tax receipts and building approvals with the NOC, making the registration process seamless." }
    ]
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    tagline: "Kharadi, Hinjewadi & Baner",
    rate: "999",
    image: "https://images.unsplash.com/photo-1601962386997-6a1ec1ee3b5b?auto=format&fit=crop&w=800&q=80",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2613145453006!2d73.9478817!3d18.5622359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e7c10b4b2efc8f%3A0x33b8277259074bb9!2sWorld%20Trade%20Center%20Kharadi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    addresses: [
      {
        name: "Kharadi IT Park Center",
        slug: "kharadi",
        address: "World Trade Center, Tower 2, Kharadi, Pune, Maharashtra - 411014",
        feature: "Grade-A WTC IT Park Address",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        priceGST: "999",
        priceIncorp: "1,299",
        priceMail: "599",
        amenities: ["Premium Address", "Meeting Space", "Digital Mail Scan", "Courier Processing", "Physical Verification Assistance"],
        description: "WTC Kharadi represents Pune's IT and corporate prestige. Get mapped on Google Maps and MCA directory at this global landmark.",
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2613145453006!2d73.9478817!3d18.5622359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e7c10b4b2efc8f%3A0x33b8277259074bb9!2sWorld%20Trade%20Center%20Kharadi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        photos: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    faqs: [
      { q: "How is incoming mail forwarded?", a: "Incoming physical mail is scanned and emailed to you on the same day. Original copies can be forwarded weekly by courier." }
    ]
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding real cities...");

    // Remove any mock virtual locations first (like 'minim-non-iusto-enim' or 'non-qui-incididunt-b')
    const allLocations = await VirtualLocation.find();
    for (const loc of allLocations) {
      if (!["surat", "mumbai", "delhi", "noida", "gurugram", "bangalore", "pune"].includes(loc.slug)) {
        console.log(`Removing mock location: "${loc.name}" (slug: "${loc.slug}")...`);
        await VirtualLocation.findByIdAndDelete(loc._id);
      }
    }

    // Seed or update the real locations
    for (const city of realCities) {
      const existing = await VirtualLocation.findOne({ slug: city.slug });
      if (!existing) {
        await VirtualLocation.create(city);
        console.log(`Seeded city: ${city.name}`);
      } else {
        console.log(`City ${city.name} already exists. Updating details...`);
        Object.assign(existing, city);
        await existing.save();
      }
    }

    console.log("Real cities database seeding completed successfully!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding real cities failed:", error);
    process.exit(1);
  }
};

seed();
