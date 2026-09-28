import { redirect } from 'next/navigation';
import { getWorkspace } from '@/lib/mockApi';

export default function Home() {
  redirect(`/${getWorkspace()[0].slug}`);
}
