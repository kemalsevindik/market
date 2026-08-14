import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@market.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@market.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categories = [
    { name: "Meyve & Sebze", slug: "meyve-sebze" },
    { name: "Süt Ürünleri", slug: "sut-urunleri" },
    { name: "Fırın", slug: "firin" },
    { name: "İçecekler", slug: "icecekler" },
    { name: "Temel Gıda", slug: "temel-gida" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const meyveSebze = await prisma.category.findUniqueOrThrow({
    where: { slug: "meyve-sebze" },
  });
  const sutUrunleri = await prisma.category.findUniqueOrThrow({
    where: { slug: "sut-urunleri" },
  });
  const firin = await prisma.category.findUniqueOrThrow({ where: { slug: "firin" } });
  const icecekler = await prisma.category.findUniqueOrThrow({
    where: { slug: "icecekler" },
  });
  const temelGida = await prisma.category.findUniqueOrThrow({
    where: { slug: "temel-gida" },
  });

  const img = (codepoint: string) =>
    `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`;

  const products = [
    { name: "Domates", slug: "domates", price: 24.9, unit: "kg", stock: 50, categoryId: meyveSebze.id, imageUrl: img("1f345") },
    { name: "Salatalık", slug: "salatalik", price: 19.9, unit: "kg", stock: 40, categoryId: meyveSebze.id, imageUrl: img("1f952") },
    { name: "Muz", slug: "muz", price: 39.9, unit: "kg", stock: 35, categoryId: meyveSebze.id, imageUrl: img("1f34c") },
    { name: "Elma", slug: "elma", price: 29.9, unit: "kg", stock: 45, categoryId: meyveSebze.id, imageUrl: img("1f34e") },
    { name: "Tam Yağlı Süt", slug: "tam-yagli-sut", price: 34.5, unit: "lt", stock: 60, categoryId: sutUrunleri.id, imageUrl: img("1f95b") },
    { name: "Beyaz Peynir", slug: "beyaz-peynir", price: 89.9, unit: "500g", stock: 25, categoryId: sutUrunleri.id, imageUrl: img("1f9c0") },
    { name: "Yoğurt", slug: "yogurt", price: 44.9, unit: "kg", stock: 30, categoryId: sutUrunleri.id, imageUrl: img("1f963") },
    { name: "Ekmek", slug: "ekmek", price: 8, unit: "adet", stock: 100, categoryId: firin.id, imageUrl: img("1f35e") },
    { name: "Simit", slug: "simit", price: 12, unit: "adet", stock: 60, categoryId: firin.id, imageUrl: img("1f96f") },
    { name: "Maden Suyu", slug: "maden-suyu", price: 9.9, unit: "adet", stock: 80, categoryId: icecekler.id, imageUrl: img("1f964") },
    { name: "Portakal Suyu", slug: "portakal-suyu", price: 45, unit: "lt", stock: 20, categoryId: icecekler.id, imageUrl: img("1f9c3") },
    { name: "Pirinç", slug: "pirinc", price: 79.9, unit: "kg", stock: 40, categoryId: temelGida.id, imageUrl: img("1f35a") },
    { name: "Makarna", slug: "makarna", price: 22.5, unit: "500g", stock: 70, categoryId: temelGida.id, imageUrl: img("1f35d") },
    { name: "Zeytinyağı", slug: "zeytinyagi", price: 249.9, unit: "lt", stock: 15, categoryId: temelGida.id, imageUrl: img("1fad2") },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("Seed tamamlandı. Admin girişi: admin@market.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
