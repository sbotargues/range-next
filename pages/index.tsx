// pages/index.tsx
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <h1>Inicio</h1>
      <ul>
        <li>
          <Link href="/exercise1">
            Exercise 1: Normal Range
          </Link>
        </li>
        <li>
          <Link href="/exercise2">
            Exercise 2: Fixed Value Range
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
