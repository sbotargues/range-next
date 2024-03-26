import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Range from "../components/RangeComponent";
import Chip from "../components/ChipComponent";
import getNormalRange from "../services/getNormalRange";

interface Value {
  min: number;
  max: number;
}

const Exercise1: React.FC = () => {
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [step, setStep] = useState<number>(100);
  const [value, setValue] = useState<Value>({ min, max });
  const [range, setRange] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await getNormalRange();
      if (result instanceof Error) {
        console.error(result.message);
        return;
      }

      const { min, max, step } = result;
      setMin(min ?? 0);
      setMax(max ?? 0);
      setStep(step ?? 100);
      setValue({ min: min ?? 0, max: max ?? 0 });
    })();
  }, []);

  const handleGoToNextExercise = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/exercise2");
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
        Go to Exercise 2
      </button>
    </div>
  );
};

export default Exercise1;
