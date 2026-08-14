"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return text
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Yetkisiz işlem.");
}

export async function getProducts(params?: { categorySlug?: string; query?: string }) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: params?.categorySlug ? { slug: params.categorySlug } : undefined,
      name: params?.query ? { contains: params.query } : undefined,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProductsAdmin() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parseFloat(String(formData.get("price") ?? "0"));
  const unit = String(formData.get("unit") ?? "adet").trim();
  const stock = parseInt(String(formData.get("stock") ?? "0"), 10);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");

  if (!name || !categoryId || Number.isNaN(price)) {
    throw new Error("Eksik ya da hatalı alanlar.");
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      price,
      unit: unit || "adet",
      stock: Number.isNaN(stock) ? 0 : stock,
      imageUrl: imageUrl || null,
      categoryId,
    },
  });

  revalidatePath("/admin/urunler");
  revalidatePath("/");
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = parseFloat(String(formData.get("price") ?? "0"));
  const unit = String(formData.get("unit") ?? "adet").trim();
  const stock = parseInt(String(formData.get("stock") ?? "0"), 10);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const isActive = formData.get("isActive") === "on";

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description: description || null,
      price,
      unit,
      stock: Number.isNaN(stock) ? 0 : stock,
      imageUrl: imageUrl || null,
      categoryId,
      isActive,
    },
  });

  revalidatePath("/admin/urunler");
  revalidatePath("/");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/urunler");
  revalidatePath("/");
}
