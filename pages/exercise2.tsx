import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Range from "../components/RangeComponent";
import Chip from "../components/ChipComponent";
import getFixedRange from "../services/getFixedRange";

interface Value {
  min: number;
  max: number;
}

const Exercise2: React.FC = () => {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [value, setValue] = useState<Value>({ min, max });
  const [range, setRange] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await getFixedRange();
      if (data instanceof Error) {
        console.error(data.message);
        return;
      }

      const sortedRange = data.valueRanges.sort((a, b) => a - b);
      setMin(sortedRange[0]);
      setMax(sortedRange[sortedRange.length - 1]);
      setStep(1);
      setRange(sortedRange);
      setValue({
        min: sortedRange[0],
        max: sortedRange[sortedRange.length - 1],
      });
    })();
  }, []);

  const handleGoToNextExercise = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/exercise1");
  };

  return (
    <div className="p-4">
      <Range
        min={min}
        max={max}
        step={step}
        value={value}
        range={range}
        onChangeValue={setValue}
      />
      <Chip head="Min" content={`The minimum value is: ${value.min}€`} />
      <Chip head="Max" content={`The maximum value is: ${value.max}€`} />
      <button
        onClick={handleGoToNextExercise}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Exercise 1
      </button>
    </div>
  );
};

export default Exercise2;
