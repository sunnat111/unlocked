import { Suspense } from 'react';
import { Practice } from '@/components/app/Practice';
export default function PracticePage() {
  return (
    <Suspense>
      <Practice />
    </Suspense>
  );
}
