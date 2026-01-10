import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MagazineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const MagazineLayout = React.forwardRef<HTMLDivElement, MagazineLayoutProps>(
  ({ className, columns = 3, gap = 'md', children, ...props }, ref) => {
    const columnClasses = {
      2: '[column-count:1] sm:[column-count:2]',
      3: '[column-count:1] sm:[column-count:2] md:[column-count:3]',
      4: '[column-count:1] sm:[column-count:2] md:[column-count:3] lg:[column-count:4]',
    };

    const gapClasses = {
      sm: '[column-gap:1rem]',
      md: '[column-gap:2rem]',
      lg: '[column-gap:3rem]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          columnClasses[columns],
          gapClasses[gap],
          '[column-rule:1px_solid_hsl(var(--border))]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MagazineLayout.displayName = 'MagazineLayout';

interface MagazineImageProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  float?: 'left' | 'right' | 'none';
  spanColumns?: string; // CSS width value like '50%', '400px', '80%' - omit for column-span:all
  caption?: string;
  aspectRatio?: 'video' | 'square' | '4/3' | '3/2';
}

const MagazineImage = React.forwardRef<HTMLElement, MagazineImageProps>(
  (
    {
      className,
      src,
      alt,
      float = 'none',
      spanColumns,
      caption,
      aspectRatio = 'video',
      ...props
    },
    ref
  ) => {
    const floatClasses = {
      left: 'float-left mr-6',
      right: 'float-right ml-6',
      none: 'mb-4',
    };

    const aspectRatioClasses = {
      video: 'aspect-video',
      square: 'aspect-square',
      '4/3': 'aspect-[4/3]',
      '3/2': 'aspect-[3/2]',
    };

    return (
      <figure
        ref={ref}
        className={cn(
          '[break-inside:avoid]',
          floatClasses[float],
          spanColumns ? `w-[${spanColumns}]` : 'my-6 w-full [column-span:all]',
          className
        )}
        {...props}
      >
        <div
          className={cn('relative w-full ', aspectRatioClasses[aspectRatio])}
        >
          <Image src={src} alt={alt} fill className="object-contain" />
        </div>
        {caption && (
          <figcaption className="text-sm italic text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }
);
MagazineImage.displayName = 'MagazineImage';

interface MagazineBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  spanColumns?: string; // CSS width value like '50%', '400px', '80%' - omit for column-span:all
  float?: 'left' | 'right' | 'none';
}

const MagazineBlock = React.forwardRef<HTMLDivElement, MagazineBlockProps>(
  ({ className, spanColumns, float = 'none', children, ...props }, ref) => {
    const floatClasses = {
      left: 'float-left mr-6 mb-4',
      right: 'float-right ml-6 mb-4',
      none: 'mb-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          '[break-inside:avoid]',
          floatClasses[float],
          spanColumns ? `w-[${spanColumns}]` : 'my-6 [column-span:all]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MagazineBlock.displayName = 'MagazineBlock';

interface MagazineHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  spanColumns?: boolean;
}

const MagazineHeading = React.forwardRef<
  HTMLHeadingElement,
  MagazineHeadingProps
>(
  (
    { className, as: Tag = 'h2', spanColumns = false, children, ...props },
    ref
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          '[break-inside:avoid]',
          spanColumns && 'my-6 [column-span:all]',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
MagazineHeading.displayName = 'MagazineHeading';

export { MagazineLayout, MagazineImage, MagazineBlock, MagazineHeading };
