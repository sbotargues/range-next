import React, { useState, useEffect } from "react";
import Range from "../components/Range";
import { ApiService } from "../api/api";
import Link from "next/link";

const Exercise1 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeMin = (value, id) => {
    const store = [...data];
    const index = store.findIndex((range) => range.id === id);
    store[index].min = value;
    setData(store);
  };

  const onChangeMax = (value, id) => {
    const store = [...data];
    const index = store.findIndex((range) => range.id === id);
    store[index].max = value;
    setData(store);
  };

  const fetchData = async () => {
    const fetchedData = await ApiService.getAllRanges();
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
      <ul className="space-y-4 max-w-4xl w-full">
        {data.map((range) => (
          <li key={range.id} className="bg-white shadow-md rounded-lg p-4">
            <Range
              id={range.id}
              minLimit={range.minLimit}
              maxLimit={range.maxLimit}
              min={range.min}
              max={range.max}
              onChangeMin={onChangeMin}
              onChangeMax={onChangeMax}
              exerciseType="exercise1"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise1;
