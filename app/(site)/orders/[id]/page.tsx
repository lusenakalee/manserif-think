// app/(site)/orders/[id]/page.tsx

import { Badge } from "@/components/ui/badge";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { ORDER_BY_ID_QUERY } from "@/lib/sanity/queries/orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Order Details | Man",
  description: "View your order details",
};

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Matches your GROQ query shape exactly
 */
type OrderDetails = {
  _id: string;
  orderNumber?: string;
  clerkUserId?: string;
  email?: string;
  total?: number;
  status?: "paid" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
  address?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  items?: {
    _key: string;
    quantity?: number;
    priceAtPurchase?: number;
    product?: {
      _id: string;
      name?: string;
      slug?: string;
      image?: {
        asset?: {
          _id: string;
          url?: string;
        };
      };
    };
  }[];
};

/**
 * Fix for optional array indexing
 */
type OrderItem = NonNullable<OrderDetails["items"]>[number];

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  // ✅ Live API (no generics allowed)
  const { data } = await sanityFetch({
    query: ORDER_BY_ID_QUERY,
    params: { id },
  });

  const order = data as OrderDetails;

  // ✅ Security check
  if (!order || !userId || order.clerkUserId !== userId) {
    notFound();
  }

  const status = getOrderStatus(order.status);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Order {order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Placed on {formatDate(order.createdAt, "datetime")}
            </p>
          </div>

          <Badge className={`${status.color} flex items-center gap-1.5`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Items ({order.items?.length ?? 0})
              </h2>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {order.items?.map((item: OrderItem) => {
                const imageUrl = item.product?.image?.asset?.url;

                return (
                  <div key={item._key} className="flex gap-4 px-6 py-4">
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.product?.name ?? "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                        >
                          {item.product?.name ?? "Unknown Product"}
                        </Link>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Qty: {item.quantity ?? 0}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(
                          (item.priceAtPurchase ?? 0) *
                            (item.quantity ?? 0)
                        )}
                      </p>

                      {(item.quantity ?? 0) > 1 && (
                        <p className="text-sm text-zinc-500">
                          {formatPrice(item.priceAtPurchase ?? 0)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {formatPrice(order.total ?? 0)}
                </span>
              </div>

              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {order.address.name && <p>{order.address.name}</p>}
                {order.address.line1 && <p>{order.address.line1}</p>}
                {order.address.line2 && <p>{order.address.line2}</p>}

                <p>
                  {[order.address.city, order.address.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                {order.address.country && <p>{order.address.country}</p>}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Payment
              </h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light tracking-wide">
                  Status
                </span>
                <span className="text-sm font-medium capitalize text-green-600">
                  {order.status}
                </span>
              </div>

              {order.email && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-light tracking-wide">
                    Email
                  </span>
                  <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                    {order.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}