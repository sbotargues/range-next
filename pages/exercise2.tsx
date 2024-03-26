import React, { useState, useEffect } from "react";
import Link from "next/link";
import Range from "../components/Range";
import { ApiService } from "../api/api";

interface RangeData {
  id: string;
  min: number;
  max: number;
  rangeValues: number[] | undefined;
}

const Exercise2 = () => {
  const [data, setData] = useState<RangeData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeMin = (value: number, id: string) => {
    const store = [...data];
    const index = store.findIndex((range) => range.id === id);
    store[index].min = value;
    setData(store);
  };

  const onChangeMax = (value: number, id: string) => {
    const store = [...data];
    const index = store.findIndex((range) => range.id === id);
    store[index].max = value;
    setData(store);
  };

  const fetchData = async () => {
    const fetchedData = await ApiService.getAllFixedRanges();
    setData(fetchedData);
  };

  return (
    <div className="flex flex-col items-center my-8">
      <div className="mb-8">
        <Link href="/">
          <span className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out cursor-pointer">
            Back to Home
          </span>
        </Link>
      </div>
      <ul className="list-ranges space-y-4 max-w-4xl w-full">
        {data.map((range) => (
          <li key={range.id} className="bg-white shadow-md rounded-lg p-4">
            <Range
              id={range.id}
              min={range.min}
              max={range.max}
              rangeValues={range.rangeValues}
              onChangeMin={onChangeMin}
              onChangeMax={onChangeMax}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise2;
