export interface UserDetails {
  name: string | null | undefined;
  email: string | null | undefined;
  gender: string | null | undefined;
  dob: Date | null | undefined;
  username: string | null | undefined;
  avatarUrl: string | null | undefined;
  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
  deletedAt: Date | null | undefined;
  status: string | null | undefined;
}

export interface Category {
  categoryId: string | null | undefined;
  userId: string | null | undefined;
  name: string | null | undefined;
  type: 'income' | 'expense' | null | undefined;
  icon: string | null | undefined;
  color: string | null | undefined;
  description: string | null | undefined;
  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
  deletedAt: Date | null | undefined;
  status: string | null | undefined;
}

export interface Account {
  accountId: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  description: string | null | undefined;
  isSavings: boolean | null | undefined;
  total: number | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  status: string;
}

export interface Transaction {
  transactionId: string | null | undefined;
  amount: number;
  type: 'income' | 'expense' | null | undefined;
  accountId: string | null | undefined;
  accountName?: string;
  accountIcon?: string;
  accountColor?: string;
  categoryId: string | null | undefined;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  notes: string | null | undefined;
  date: Date | null | undefined;
  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
  deletedAt: Date | null | undefined;
  status: string | null | undefined;
}

export interface UserFinanceDetails {
  totalBalance: number | null | undefined;
  monthlyTotalIncome: number | null | undefined;
  monthlyTotalExpenses: number | null | undefined;
}

export interface LoadingStatus {
  status: 'idle' | 'loading' | 'failed';
}
