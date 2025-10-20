'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/index';

// Páginas donde no se debe mostrar el header ni el footer
const hiddenPaths = ['/', '/page.jsx']; // puedes agregar más rutas si es necesario

export default function LayoutClient({ children }) {
  const pathName = usePathname();
  const hidden = hiddenPaths.includes(pathName);

  return (
    <div>
      {!hidden && <Header />}

      <main>
        {children}
      </main>
    </div>
  );
}
