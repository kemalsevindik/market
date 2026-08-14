"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");
  return session.user.id;
}

export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });
}

export async function addToCart(productId: string, quantity = 1) {
  const userId = await requireUserId();

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
  });

  revalidatePath("/sepet");
  revalidatePath("/");
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const userId = await requireUserId();

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { id: cartItemId, userId } });
  } else {
    await prisma.cartItem.updateMany({
      where: { id: cartItemId, userId },
      data: { quantity },
    });
  }

  revalidatePath("/sepet");
}

export async function removeFromCart(cartItemId: string) {
  const userId = await requireUserId();
  await prisma.cartItem.deleteMany({ where: { id: cartItemId, userId } });
  revalidatePath("/sepet");
}
