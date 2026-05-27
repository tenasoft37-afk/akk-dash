require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { PrismaClient } = require("@prisma/client");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const imageCache = {};

async function uploadImage(filename) {
  if (!filename) return "";
  if (imageCache[filename]) return imageCache[filename];

  const filePath = path.join(PUBLIC_DIR, filename.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filePath}, using filename as-is`);
    return filename;
  }

  console.log(`  ↑ Uploading ${filename}...`);
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "nbs-website",
      resource_type: "auto",
    });
    imageCache[filename] = result.secure_url;
    console.log(`  ✓ ${filename} → ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`  ✗ Failed to upload ${filename}:`, err.message);
    return filename;
  }
}

async function seedHero() {
  console.log("\n── Hero ──");
  const image = await uploadImage("/pic1.jpeg");

  await prisma.hero.deleteMany();
  await prisma.hero.create({
    data: {
      heading: "Driving Excellence\nThrough Strategy\nand Trust.",
      subtitle:
        "Business consultancy specializing in FMCG, beauty, cosmetics & agrochemical — with 15+ years of expertise across the MENA region.",
      highlights: ["FMCG & Cosmetics", "Turnaround Strategy", "Odoo ERP Partner"],
      stats: [
        { value: "15+", label: "Years Experience" },
        { value: "100+", label: "Projects Delivered" },
        { value: "3", label: "Countries Active" },
      ],
      image,
      ctaText1: "Explore Our Services",
      ctaLink1: "#services",
      ctaText2: "Contact Us",
      ctaLink2: "#contact",
    },
  });
  console.log("  ✓ Hero seeded");
}

async function seedCompanyProfile() {
  console.log("\n── Company Profile ──");
  await prisma.companyProfile.deleteMany();
  await prisma.companyProfile.create({
    data: {
      sectionLabel: "Company Profile",
      heading: "Who We Are & Where We're Going.",
      pillar1Title: "Our Vision",
      pillar1Text:
        "To be the leading partner in building, rescuing and transforming distressed companies in the MENA region through integrated solutions that ensure sustainability and growth.",
      pillar2Title: "Our Mission",
      pillar2Text:
        "To rescue, build, and transform businesses by providing tailored strategies, expert guidance, and advanced systems that restore balance and unlock sustainable growth.",
      pillar3Title: "Our Promise",
      pillar3Text:
        "To serve as the ultimate partner for both active companies and new investors — covering every stage from concept to execution, and ensuring that every business reaches its true turning point.",
    },
  });
  console.log("  ✓ Company Profile seeded");
}

async function seedAbout() {
  console.log("\n── About ──");
  const image = await uploadImage("/pic2.webp");

  await prisma.about.deleteMany();
  await prisma.about.create({
    data: {
      sectionLabel: "About Us",
      heading: "NBS — Nexus Business Solutions.",
      paragraph1:
        "NBS is a business consultancy firm specializing in FMCG, beauty, cosmetics & agrochemical and other fast-growing sectors. We empower active businesses to strengthen and expand, while also guiding investors who may not know how or where to start.",
      paragraph2:
        'What sets us apart is our GOAT Union — a diverse group of business experts with over 15 years of experience across management, finance, accounting, marketing, human resources, IT, and business analysis. This unique mix ensures that any expertise a company may need is available under one roof.',
      paragraph3:
        "We don't just rescue businesses in crisis — we create, nurture, and transform them into market leaders.",
      ctaText: "Explore Our Services",
      ctaLink: "#services",
      stats: [
        { value: "100+", label: "Projects Delivered" },
        { value: "3", label: "Countries Active" },
        { value: "15+", label: "Years Experience" },
      ],
      image,
    },
  });
  console.log("  ✓ About seeded");
}

async function seedValueProposition() {
  console.log("\n── Value Proposition ──");
  await prisma.valueProposition.deleteMany();
  await prisma.valueProposition.create({
    data: {
      sectionLabel: "Our Value Proposition",
      heading: "Empowering Businesses.",
      painPoints: [
        { title: "Declining Revenues", desc: "Unstable growth threatening long-term viability." },
        { title: "Debt Accumulation", desc: "Financial liabilities restricting operations." },
        { title: "Operational Issues", desc: "Declining sales & weak organizational structure." },
        { title: "Poor Planning", desc: "Lack of vision and weak market positioning." },
        { title: "Cash Flow Issues", desc: "Poor expense control crippling daily operations." },
        { title: "Lack of Systems", desc: "No integrated records, performance or decision systems." },
        { title: "Scaling Challenges", desc: "Difficulty launching brands in competitive sectors." },
        { title: "No Clear Roadmap", desc: "Capital without a clear path to build or grow." },
      ],
    },
  });
  console.log("  ✓ Value Proposition seeded");
}

async function seedServices() {
  console.log("\n── Services ──");
  const images = {};
  for (const f of ["/pic8.jpg", "/pic4.webp", "/pic3.webp", "/pic2.webp", "/pic10.jpg"]) {
    images[f] = await uploadImage(f);
  }

  await prisma.services.deleteMany();
  await prisma.services.create({
    data: {
      sectionLabel: "Our Core Services",
      heading: "Solutions to Transform Your Business.",
      items: [
        {
          step: "01",
          title: "Business Assessment",
          shortDesc: "Financial & operational analysis, performance evaluation, and loss gap identification.",
          desc: "Financial and operational situation analysis. Performance evaluation & loss gap identification. Interviews with management & understanding organizational culture. Identifying sources of financial waste & managerial dysfunction. Cultivating a data-driven culture for intelligent decision-making.",
          image: images["/pic8.jpg"],
        },
        {
          step: "02",
          title: "Turnaround & Restructuring",
          shortDesc: "Building flexible structures, rescheduling debts, and boosting productivity.",
          desc: "Building a flexible organizational structure and brand identity. Rescheduling obligations and debts. Restructuring inefficient departments and roles. Enhancing productivity and operational efficiency. Boosting market competitiveness through optimizing sales performance.",
          image: images["/pic4.webp"],
        },
        {
          step: "03",
          title: "Quick Wins Plan",
          shortDesc: "Stabilizing operations, rapid cost reduction, and restoring cash flow.",
          desc: "Stabilizing operational conditions. Rapid cost reduction without compromising quality. Restoring cash flow to healthy levels.",
          image: images["/pic3.webp"],
        },
        {
          step: "04",
          title: "Execution & Monitoring",
          shortDesc: "Direct supervision, executive training, and continuous improvement cycles.",
          desc: "Direct supervision of change implementation. Executive and managerial training. Regular reports and continuous improvement cycles.",
          image: images["/pic2.webp"],
        },
        {
          step: "05",
          title: "Additional Services",
          shortDesc: "Bank negotiations, liquidation plans, and crisis communication.",
          desc: "Negotiations with banks and suppliers. Partial or full liquidation plans if necessary. Reputation management and crisis communication.",
          image: images["/pic10.jpg"],
        },
      ],
    },
  });
  console.log("  ✓ Services seeded");
}

async function seedExpertise() {
  console.log("\n── Expertise ──");
  await prisma.expertise.deleteMany();
  await prisma.expertise.create({
    data: {
      sectionLabel: "What We Bring",
      heading: "Additional Expertise & Tools.",
      tools: [
        { label: "Odoo ERP", desc: "Certified expertise & implementation" },
        { label: "Excel & Power BI", desc: "Data analysis & visualization" },
        { label: "Financial Analysis", desc: "Budgeting & cash flow management" },
        { label: "Operations", desc: "Production & operations management" },
        { label: "Marketing & Sales", desc: "Strategies that drive growth" },
        { label: "Human Resources", desc: "People management & development" },
        { label: "Transformation", desc: "Business restructuring models" },
        { label: "Commercial Law", desc: "Bankruptcy & targeted market law" },
      ],
      odooHeading: "Digital Transformation Powered by Odoo.",
      odooDescription:
        "We are official partners of Odoo, providing professional implementation services to help companies automate operations, reduce costs, and achieve operational fluidity.",
      odooServices: [
        "System needs analysis based on your business requirements",
        "Implementation of various Odoo modules (Inventory, Sales, Purchase, Accounting, HR)",
        "Integration of Odoo with daily operations to ensure success",
        "Comprehensive team training for full system adoption (UAT)",
        "Linking Odoo with the turnaround plan to accurately measure results",
      ],
    },
  });
  console.log("  ✓ Expertise seeded");
}

async function seedIndustries() {
  console.log("\n── Industries ──");

  const industryImages = {
    "/pic5.webp": null,
    "/pic9.jpg": null,
    "/pic4.webp": null,
    "/pic6.jpg": null,
    "/pic7.jpg": null,
    "/pic8.jpg": null,
    "/pic11.jpg": null,
    "/pic3.webp": null,
    "/pic2.webp": null,
  };
  for (const f of Object.keys(industryImages)) {
    industryImages[f] = await uploadImage(f);
  }

  await prisma.industries.deleteMany();
  await prisma.industries.create({
    data: {
      sectionLabel: "Proud Projects",
      heading: "Breaking Boundaries, Building Dreams.",
      subtitle: "We craft tailored solutions that address challenges across vital sectors.",
      spotlightTitle: "FMCG, Beauty & Cosmetics.",
      spotlightDesc:
        "Comprehensive analysis and operations with extensive practical experience and a strong supplier network locally and internationally.",
      spotlightImage: industryImages["/pic5.webp"],
      fmcgServices: [
        "Sales data analysis by categories, channels, and regions",
        "Inventory, distribution, and stock turnover analysis",
        "Commercial contract reviews and supplier cooperation improvement",
        "Supporting private label creation & building brand identity",
        "Financial profitability and margin analysis by product or group",
        "Leveraging a trusted supplier network for quality products at competitive prices",
      ],
      items: [
        { label: "FMCG & Cosmetics", tag: "Connect", image: industryImages["/pic9.jpg"] },
        { label: "Agrochemical", tag: "Grow", image: industryImages["/pic4.webp"] },
        { label: "Retail & Distribution", tag: "Scale", image: industryImages["/pic6.jpg"] },
        { label: "Logistics", tag: "Support", image: industryImages["/pic7.jpg"] },
        { label: "Manufacturing", tag: "Empower", image: industryImages["/pic8.jpg"] },
        { label: "Beauty & Healthcare", tag: "Nurture", image: industryImages["/pic11.jpg"] },
        { label: "Technology & Digital", tag: "Innovate", image: industryImages["/pic3.webp"] },
        { label: "Family Businesses", tag: "Sustain", image: industryImages["/pic2.webp"] },
      ],
    },
  });
  console.log("  ✓ Industries seeded");
}

async function seedWhyNBS() {
  console.log("\n── Why NBS ──");
  const bgImage = await uploadImage("/pic10.jpg");

  await prisma.whyNBS.deleteMany();
  await prisma.whyNBS.create({
    data: {
      sectionLabel: "Our Difference",
      heading: "Why Choose NBS?",
      differentiators: [
        { title: "Official Odoo Partner", desc: "Certified team implementing Odoo ERP across all business operations." },
        { title: "Proven Experience", desc: "Real-world track record rescuing and transforming distressed companies." },
        { title: "Consulting + Digital", desc: "Management consulting and digital transformation under one roof." },
        { title: "Advanced Analysis", desc: "Cutting-edge planning, reporting, and analysis tools for data-driven decisions." },
        { title: "Market Knowledge", desc: "Deep understanding of local and regional MENA markets." },
        { title: "Confidentiality", desc: "Full commitment to transparency and tangible measurable results." },
      ],
      counters: [
        { value: "100", suffix: "%", label: "Projects Completed" },
        { value: "3", suffix: "M", label: "Reach Worldwide" },
        { value: "5", suffix: "X", label: "Faster Growth" },
        { value: "15", suffix: "+", label: "Awards Achieved" },
      ],
      bgImage,
    },
  });
  console.log("  ✓ Why NBS seeded");
}

async function seedContact() {
  console.log("\n── Contact Section ──");
  await prisma.contactSection.deleteMany();
  await prisma.contactSection.create({
    data: {
      ctaHeading: "Let's Build the Future Together.",
      ctaText:
        "Ready to transform your business? Start a conversation and discover how NBS can help you achieve sustainable growth.",
      ctaButton: "Get Started Now",
      contacts: [
        { label: "Email", value: "moh.siblani@nexus-nbs.com", href: "mailto:moh.siblani@nexus-nbs.com" },
        { label: "Lebanon", value: "+961 03 522 664", href: "tel:+96103522664" },
        { label: "Qatar", value: "+974 6683 6848", href: "tel:+97466836848" },
        { label: "Website", value: "www.nexus-nbs.com", href: "https://www.nexus-nbs.com" },
      ],
      locations: [
        { name: "Lebanon", detail: "Beirut Office", phone: "+961 03 522 664" },
        { name: "Qatar", detail: "Doha Office", phone: "+974 6683 6848" },
        { name: "KSA", detail: "Regional Office", phone: "Coming soon" },
      ],
      footerText:
        "Business consultancy specializing in FMCG, beauty, cosmetics & agrochemical. Your trusted partner for sustainable growth.",
    },
  });
  console.log("  ✓ Contact Section seeded");
}

async function main() {
  console.log("🚀 Seeding NBS website data...\n");
  console.log("Images will be uploaded from:", PUBLIC_DIR);

  await seedHero();
  await seedCompanyProfile();
  await seedAbout();
  await seedValueProposition();
  await seedServices();
  await seedExpertise();
  await seedIndustries();
  await seedWhyNBS();
  await seedContact();

  console.log("\n✅ All sections seeded successfully!");
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
