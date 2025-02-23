declare module 'sonner' {
    import { ReactNode } from 'react';

    export interface ToasterProps {
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
        richColors?: boolean;
        children?: ReactNode;
    }

    export function Toaster(props: ToasterProps): JSX.Element;
    export function toast(message: string, options?: "success"): void;
}