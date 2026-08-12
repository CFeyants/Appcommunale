'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--pc-rayon)] text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primaire: 'bg-[var(--pc-accent)] text-white hover:bg-[var(--pc-accent-encre)]',
        contour: 'border border-[var(--pc-trait-fort)] bg-[var(--pc-fond-eleve)] hover:bg-[var(--pc-fond-enfonce)]',
        discret: 'hover:bg-[var(--pc-fond-enfonce)] text-[var(--pc-encre-douce)] hover:text-[var(--pc-encre)]',
        lien: 'text-[var(--pc-accent)] underline underline-offset-4 hover:text-[var(--pc-accent-encre)]',
      },
      taille: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4',
        lg: 'h-11 px-6',
        icone: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'contour', taille: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, taille, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, taille }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { buttonVariants };
