"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export type CheckoutState = {
  error?: string;
  success?: boolean;
};

export async function createOrder(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sipariş vermek için giriş yapmalısınız." };
  }

  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!address || !phone) {
    return { error: "Adres ve telefon zorunludur." };
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { error: "Sepetiniz boş." };
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: session.user.id,
        address,
        phone,
        note: note || null,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

    return order;
  });

  revalidatePath("/siparislerim");
  revalidatePath("/sepet");

  return { success: true };
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Yetkisiz işlem.");

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/siparisler");
}
