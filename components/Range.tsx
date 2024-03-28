import React, { useState, useRef, useEffect, useCallback } from "react";

interface RangeProps {
  min: number;
  max: number;
  rangeValues?: number[];
  minLimit?: number;
  maxLimit?: number;
  id: string;
  onChangeMin: (value: number, id: string) => void;
  onChangeMax: (value: number, id: string) => void;
  exerciseType: "exercise1" | "exercise2";
}

const Range: React.FC<RangeProps> = ({
  min,
  max,
  rangeValues,
  minLimit = 0,
  maxLimit = 100,
  id,
  onChangeMin,
  onChangeMax,
  exerciseType,
}) => {
  const [minEditable, setMinEditable] = useState(false);
  const [maxEditable, setMaxEditable] = useState(false);
  const [positionsMin, setPositionsMin] = useState<
    { value: number; position: number; min: number; max: number }[]
  >([]);
  const [positionsMax, setPositionsMax] = useState<
    { value: number; position: number; min: number; max: number }[]
  >([]);
  const rangeLineRef = useRef<HTMLDivElement>(null);
  const rangeAreaMinRef = useRef<HTMLDivElement>(null);
  const rangeAreaMaxRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  const pulletToMoveRef = useRef<"min" | "max" | null>(null);
  const widthRef = useRef<number>(0);
  const widthStepRef = useRef<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[0].contentRect.width;
      widthRef.current = newWidth;
      if (rangeValues && rangeValues.length > 1) {
        resizeObserverFixed(newWidth);
      } else {
        resizeObserverNormal(newWidth);
      }
    });

    if (rangeLineRef.current) {
      resizeObserver.observe(rangeLineRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [rangeValues, min, max, minLimit, maxLimit]);

  const resizeObserverFixed = (newWidth: number) => {
    const steps = rangeValues ? rangeValues.length - 1 : 0;
    widthStepRef.current = newWidth / steps;
    const stepsPosition = rangeValues
      ? rangeValues.map((value, index) => {
          const position = index * widthStepRef.current;
          let max = position + widthStepRef.current / 2;
          let min = position - widthStepRef.current / 2;
          min = min < 0 ? 0 : min;
          max = max > newWidth ? newWidth : max;
          return { value, position, min, max };
        })
      : [];

    setPositionsMin(stepsPosition);
    setPositionsMax([...stepsPosition].reverse());
  };

  const resizeObserverNormal = (newWidth: number) => {
    const steps = maxLimit - minLimit;
    widthStepRef.current = newWidth / steps;
  };

  const calculatePositionPullet = useCallback(() => {
    if (!rangeLineRef.current) return;

    const rangeWidth = rangeLineRef.current.offsetWidth;
    let minPosition, maxPosition;

    if (rangeValues && rangeValues.length > 1) {
      const totalSteps = rangeValues.length - 1;
      const minIndex = rangeValues.indexOf(min);
      const maxIndex = rangeValues.indexOf(max);
      minPosition = (minIndex / totalSteps) * rangeWidth || 0;
      maxPosition = (maxIndex / totalSteps) * rangeWidth || 0;
    } else {
      minPosition =
        ((min - minLimit) / (maxLimit - minLimit)) * rangeWidth || 0;
      maxPosition =
        ((max - minLimit) / (maxLimit - minLimit)) * rangeWidth || 0;
    }

    if (rangeAreaMinRef.current && rangeAreaMaxRef.current) {
      rangeAreaMinRef.current.style.left = `${minPosition}px`;
      rangeAreaMaxRef.current.style.right = `${rangeWidth - maxPosition}px`;
    }
  }, [min, max, minLimit, maxLimit, rangeValues]);

  useEffect(() => {
    calculatePositionPullet();
  }, [calculatePositionPullet]);

  const onMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const bulletType = target.dataset.type;
      if (bulletType === "min" || bulletType === "max") {
        pulletToMoveRef.current = bulletType;
      }
    },
    []
  );

  const calculateMin = useCallback(
    (widthRange: number): number => {
      if (rangeValues) {
        const pos = positionsMin.find(
          (pos) => widthRange >= pos.min && widthRange <= pos.max
        );
        return pos ? pos.value : minLimit;
      }
      return Math.round(widthRange / widthStepRef.current) + minLimit;
    },
    [rangeValues, positionsMin, minLimit]
  );

  const calculateMax = useCallback(
    (widthRange: number): number => {
      if (rangeValues) {
        const pos = positionsMax.find(
          (pos) => widthRange >= pos.min && widthRange <= pos.max
        );
        return pos ? pos.value : maxLimit;
      }
      return maxLimit - Math.round(widthRange / widthStepRef.current);
    },
    [rangeValues, positionsMax, maxLimit]
  );

  const onMouseMoveHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!pulletToMoveRef.current || !rangeLineRef.current) return;

      const rangeRect = rangeLineRef.current.getBoundingClientRect();
      let cursorPosition = event.clientX - rangeRect.left;

      if (cursorPosition < 0) {
        cursorPosition = 0;
      } else if (cursorPosition > rangeRect.width) {
        cursorPosition = rangeRect.width;
      }

      if (pulletToMoveRef.current === "min") {
        let newValue = calculateMin(cursorPosition);
        if (newValue >= max) {
          newValue = max - 1;
        }
        onChangeMin(newValue, id);
      } else {
        let newValue;
        if (rangeValues && rangeValues.length > 1) {
          newValue = calculateMax(cursorPosition);
        } else {
          newValue = calculateMax(rangeRect.width - cursorPosition);
        }
        if (newValue <= min) {
          newValue = min + 1;
        }
        onChangeMax(newValue, id);
      }

      calculatePositionPullet();
    },
    [calculateMin, calculateMax, onChangeMin, onChangeMax, id, min, max]
  );

  const onMouseUpHandler = useCallback(() => {
    pulletToMoveRef.current = null;
  }, []);

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return;
      const target = event.target as HTMLInputElement;
      const value = parseInt(target.value);
      const name = target.name;

      if (name === "min" && value < max && value >= minLimit) {
        onChangeMin(value, id);
      } else if (name === "max" && value > min && value <= maxLimit) {
        onChangeMax(value, id);
      } else {
        alert(
          "The value entered is not valid. Please adjust the value within the allowed range."
        );
      }

      setMinEditable(false);
      setMaxEditable(false);
      calculatePositionPullet();
    },
    [min, max, minLimit, maxLimit, onChangeMin, onChangeMax, id]
  );

  const onClickLabelHandler = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      const name = event.currentTarget.dataset.name;
      if (name === "min") {
        setMinEditable(true);
        setTimeout(() => minInputRef.current?.focus(), 0);
      } else if (name === "max") {
        setMaxEditable(true);
        setTimeout(() => maxInputRef.current?.focus(), 0);
      }
    },
    []
  );

  return (
    <div className="flex items-center">
      <div className="w-28 pr-4">
        {minEditable ? (
          <input
            type="number"
            name="min"
            ref={minInputRef}
            defaultValue={min}
            onKeyDown={onKeyDownHandler}
            onBlur={() => setMinEditable(false)}
            className="w-3/4 border-none border-b outline-none p-0 border border-gray-300 p-1"
            data-testid="min-input"
          />
        ) : (
          <span
            data-name="min"
            data-testid="min-label"
            onClick={onClickLabelHandler}
            className={`cursor-pointer border-b border-gray-300 ${
              exerciseType === "exercise2"
                ? "pointer-events-none border-transparent"
                : "border border-gray-300 rounded p-1"
            }`}
          >
            {min} €
          </span>
        )}
      </div>
      <div
        className="flex items-center w-full h-6 mx-10 min-h-12"
        onMouseUp={onMouseUpHandler}
        onMouseLeave={onMouseUpHandler}
        onMouseMove={onMouseMoveHandler}
      >
        <div
          className="relative h-1 w-full bg-blue-800"
          ref={rangeLineRef}
          data-testid="range-line"
        >
          <div
            className="absolute top-0 h-full min-w-[20px] left-0 -mt-2"
            ref={rangeAreaMinRef}
            data-name="min"
          >
            <div
              className="absolute w-5 h-5 bg-blue-800 rounded-full right-0 cursor-grab"
              data-type="min"
              onMouseDown={onMouseDownHandler}
            ></div>
          </div>
          <div
            className="absolute top-0 h-full min-w-[20px] right-0 -mt-2"
            ref={rangeAreaMaxRef}
            data-name="max"
          >
            <div
              className="absolute w-5 h-5 bg-blue-800 rounded-full left-0 cursor-grab"
              data-type="max"
              onMouseDown={onMouseDownHandler}
            ></div>
          </div>
        </div>
      </div>
      <div className="w-28 pl-4 text-right">
        {maxEditable ? (
          <input
            type="number"
            name="max"
            ref={maxInputRef}
            defaultValue={max}
            onKeyDown={onKeyDownHandler}
            onBlur={() => setMaxEditable(false)}
            className="w-3/4 border-none border-b outline-none p-0"
            data-testid="max-input"
          />
        ) : (
          <span
            data-name="max"
            data-testid="max-label"
            onClick={onClickLabelHandler}
            className={`cursor-pointer border-b border-gray-300 ${
              exerciseType === "exercise2"
                ? "pointer-events-none border-transparent"
                : "border border-gray-300 rounded p-1"
            }`}
          >
            {max} €
          </span>
        )}
      </div>
    </div>
  );
};

export default Range;
