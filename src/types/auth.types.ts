/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/auth.types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: "member" | "admin" | "teacher" | "student";
  displayName?: string;
  email_company?: string;
  logo?: string;
  phone?: string;
  status?: string;
  country?: {
    id: number;
    name: string;
    key: string;
    code: string;
    active: boolean;
    flag: string;
  };
  balances?: Array<{
    currency: string;
    balance: string;
  }>;
  lastTransactions?: Array<{
    id: number;
    amount: string;
    currency: string;
    toUser: string | null;
    type: string;
    status?: string;
    description: string;
    createdAt: string;
  }>;
  Partners?: Array<{
    id: number;
    name: string;
    displayName: string;
    email: string;
    phone: string;
    logo: string | null;
    favorite: boolean;
    favoriteId: number;
  }>;
  pendingTransfer?: {
    id: number;
    amount: string;
    currency: string;
    fromUserId: number;
    toUserId: number;
    type: string;
    status: string;
    description: string;
    toUser: string;
    createdAt: string;
  };
  subAccounts?: any[];

  // ✅ تم إضافة bankAccounts هنا
  bankAccounts?: any[];
  createdAt?: string;
  created_at?: string;
  updated_at?: string;
  address_one?: string;
  address_two?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  first_name_administrator?: string;
  middle_name_administrator?: string;
  last_name_administrator?: string;
  mobile_administrator?: string;
}
