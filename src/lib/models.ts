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
  accountId: string | null | undefined;
  userId: string | null | undefined;
  name: string | null | undefined;
  icon: string | null | undefined;
  color: string | null | undefined;
  description: string | null | undefined;
  isSavings: boolean | null | undefined;
  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
  deletedAt: Date | null | undefined;
  status: string | null | undefined;
}

export interface Transaction {
  transactionId: string | null | undefined;
  amount: number | null | undefined;
  accountId: string | null | undefined;
  type: 'income' | 'expense' | null | undefined;
  categoryId: string | null | undefined;
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
