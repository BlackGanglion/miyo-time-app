export interface KeyResult {
  resultName: string;
  goalId: number;
  id: number;
}
export interface Task {
  id: number;
  taskName: string;
  taskTime: string;
  taskCron: string;
  goalId: number;
  status: 'PENDING' | 'COMPLETED';
}