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
}

export interface UserFinanceDetails {
  totalBalance: number | null | undefined;
  monthlyTotalIncome: number | null | undefined;
  monthlyTotalExpenses: number | null | undefined;
}

export interface LoadingStatus {
  status: 'idle' | 'loading' | 'failed';
}
