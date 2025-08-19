import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className='min-h-[60vh] flex flex-col items-center justify-center text-center'>
      <h1 className='text-4xl font-bold mb-4 text-red-600'>403 Forbidden</h1>
      <p className='mb-8 text-lg text-gray-700'>
        You do not have permission to access this page.
        <br />
        If you believe this is an error, please contact support.
      </p>
      <Link
        href='/'
        className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors'
      >
        Return to Home
      </Link>
    </div>
  );
}
