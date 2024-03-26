import React, { useState, useEffect } from 'react';

interface RangeValue {
  min: number;
  max: number;
}

interface RangeComponentProps {
  min: number;
  max: number;
  step: number;
  value: RangeValue;
  range: number[];
  onChangeValue: (value: RangeValue) => void;
}

const RangeComponent: React.FC<RangeComponentProps> = ({
  min,
  max,
  step,
  value,
  range,
  onChangeValue,
}) => {
  const [minValue, setMinValue] = useState<number>(value ? value.min : min);
  const [maxValue, setMaxValue] = useState<number>(value ? value.max : max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(+e.target.value, maxValue - step);
    onChangeValue({ min: newMinVal, max: maxValue });
  };

  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(+e.target.value, minValue + step);
    onChangeValue({ min: minValue, max: newMaxVal });
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <input
          className="form-range"
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinValueChange}
        />
        <input
          className="form-range"
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxValueChange}
        />
      </div>
      <div className="mt-2">
        <div className="absolute" style={{ left: `${minPos}%` }}>
          {minValue}€
        </div>
        <div className="relative bg-gray-300 w-full h-2">
          <div
            className="absolute bg-blue-500"
            style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
          ></div>
        </div>
        <div className="absolute" style={{ left: `${maxPos}%` }}>
          {maxValue}€
        </div>
      </div>
    </div>
  );
};

export default RangeComponent;
