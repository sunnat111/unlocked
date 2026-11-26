import { Suspense } from 'react';
import { Results } from '@/components/app/Results';
export default function ResultsPage() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}
