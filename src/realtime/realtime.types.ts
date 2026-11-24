export type DbChangeAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface DbChangeEvent {
  table: string;
  action: DbChangeAction;
  id: string;
  timestamp: number;
  source?: string;
}

export interface SequencedDbChangeEvent extends DbChangeEvent {
  seq: number;
}

export interface RealtimePollResponse {
  cursor: number;
  events: SequencedDbChangeEvent[];
  reset: boolean;
}
