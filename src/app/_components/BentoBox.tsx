import { cn } from '@/lib/utils';

export default function BentoBox() {
    return (
        <main
            className={cn(
                'flex min-h-screen flex-col items-center justify-between p-24'
            )}
        >
            <div className={cn('flex border border-black w-10 h-10')}></div>
            <div className={cn('flex border border-black w-10 h-10')}></div>
        </main>
    );
}
