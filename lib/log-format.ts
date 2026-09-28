export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function methodVariant(method: string): BadgeVariant {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'default';
    case 'POST':
      return 'secondary';
    case 'PUT':
    case 'PATCH':
      return 'outline';
    case 'DELETE':
      return 'destructive';
    default:
      return 'outline';
  }
}

export type StatusTone = 'success' | 'info' | 'warning' | 'error' | 'default';

export function getStatusTone(status: number): StatusTone {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'info';
  if (status >= 200) return 'success';

  return 'default';
}
