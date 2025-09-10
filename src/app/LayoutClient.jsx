'use client'

import { usePathname } from 'next/navigation'

import {
    Header
} from '@/components/index'


// paginas que no quiero mostrar el header y footer
const hiddenPaths = ['/'];


export default function LayoutClient({ childern }) {

    // creamos una constante para manejar el path
    const pathName = usePathname();

    const hidden = hiddenPaths.includes(pathName);

    return (
        <div style={{
            
        }}>

            {!hidden && <Header />}

            <main>
                {childern}
            </main>

        </div>
    )
}