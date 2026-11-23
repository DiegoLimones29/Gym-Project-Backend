export type DbChangeAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface DbChangeEvent {
  table: string;
  action: DbChangeAction;
  id: string;
  timestamp: number;
  source?: string;
}
