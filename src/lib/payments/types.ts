import type { PackageId } from "@/config/packages";

export type PaymentMode = "demo" | "live";

export interface Order {
  orderId: string;
  deity: string;
  packageId: PackageId;
  amountPaise: number;
  currency: "INR";
  mode: PaymentMode;
  createdAt: string;
}

export interface SignedOrder {
  order: Order;
  /** HMAC over the canonical order — proves the server set the amount. */
  token: string;
}

export interface Receipt {
  receiptId: string;
  orderId: string;
  paymentId: string;
  deity: string;
  packageId: PackageId;
  amountPaise: number;
  currency: "INR";
  mode: PaymentMode;
  /** "demo_completed" means NO money moved. */
  status: "demo_completed" | "paid";
  issuedAt: string;
  signature: string;
}

export interface ApiError {
  error: string;
  code: string;
}
