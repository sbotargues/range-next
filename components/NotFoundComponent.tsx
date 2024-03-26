import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import img from '../../assets/notFoundImg.png';

const NotFoundComponent: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <Image src={img} alt="404 not found page" width={500} height={300} />
    <p className="text-center mt-4">
      <Link href="/exercise1">
        <a className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out">
          Ir al Ejercicio 1
        </a>
      </Link>
    </p>
  </div>
);

export default NotFoundComponent;
