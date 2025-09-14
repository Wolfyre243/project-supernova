import { TriangleAlert } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export function InDevCard({ children }: { children?: React.ReactNode }) {
  return (
    <Card>
      <CardContent>
        {children || (
          <div className='text-muted flex flex-col items-center justify-center gap-2'>
            <TriangleAlert className='size-8' />
            <h1 className='font-semibold'>In Development...</h1>
            <span className='text-sm'>Please wait for future updates!</span>
          </div>
        )}
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
}
