import React, { Component, RefObject } from "react";

interface RangeProps {
  min: number;
  max: number;
  rangeValues?: number[];
  minLimit?: number;
  maxLimit?: number;
  id: string;
  onChangeMin: (value: number, id: string) => void;
  onChangeMax: (value: number, id: string) => void;
}

interface RangeState {
  minEditable: boolean;
  maxEditable: boolean;
  positionsMin: { value: number; position: number; min: number; max: number }[];
  positionsMax: { value: number; position: number; min: number; max: number }[];
}

export class Range extends Component<RangeProps, RangeState> {
  private rangeLineRef: RefObject<HTMLDivElement>;
  private rangeAreaMinRef: RefObject<HTMLDivElement>;
  private rangeAreaMaxRef: RefObject<HTMLDivElement>;
  private minInputRef: RefObject<HTMLInputElement>;
  private maxInputRef: RefObject<HTMLInputElement>;
  private width: number;
  private widthStep: number;
  private pulletToMove: HTMLElement | null;
  private resizeObserver: ResizeObserver | null;

  constructor(props: RangeProps) {
    super(props);
    this.state = {
      minEditable: false,
      maxEditable: false,
      positionsMin: [],
      positionsMax: [],
    };
    this.rangeLineRef = React.createRef();
    this.rangeAreaMinRef = React.createRef();
    this.rangeAreaMaxRef = React.createRef();
    this.minInputRef = React.createRef();
    this.maxInputRef = React.createRef();
    this.width = 0;
    this.widthStep = 0;
    this.pulletToMove = null;
    this.resizeObserver = null;
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver((resizeEntity) => {
      this.width = resizeEntity[0].target.clientWidth;
      if (this.props.rangeValues) {
        this.resizeObserverFixed();
      } else {
        this.resizeObserverNormal();
      }
    });
    if (this.rangeLineRef.current) {
      this.resizeObserver.observe(this.rangeLineRef.current);
    }
  }

  resizeObserverFixed() {
    const steps = this.props.rangeValues!.length - 1;
    this.widthStep = this.width / steps;
    const stepsPosition = [];
    this.props.rangeValues!.forEach((value, i) => {
      const position = i * this.widthStep;
      let max = position + this.widthStep / 2;
      let min = position - this.widthStep / 2;
      min = min < 0 ? 0 : min;
      max = max > this.width ? this.width : max;
      stepsPosition.push({ value, position, min, max });
    });
    const positionsMin = stepsPosition.map((pos) => ({
      value: pos.value,
      ...pos,
    }));
    const positionsMax = stepsPosition.reverse().map((pos) => ({
      value: pos.value,
      ...pos,
    }));
    this.setState({ positionsMin, positionsMax });
    this.calculatePositionPullet();
  }

  resizeObserverNormal() {
    const steps = this.props.maxLimit - this.props.minLimit;
    this.widthStep = this.width / steps;
    this.calculatePositionPullet();
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onMouseDownHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    this.pulletToMove = event.target as HTMLElement;
    if (this.pulletToMove) {
      this.pulletToMove.classList.add("bullet--draggable");
      const parentElement = this.rangeLineRef.current?.parentElement;
      if (parentElement) {
        parentElement.classList.add("range__content--dragable");
      }
    }
  };

  onMouseUpHandler = () => {
    if (this.pulletToMove !== null) {
      this.pulletToMove.classList.remove("bullet--draggable");
      const parentElement = this.rangeLineRef.current?.parentElement;
      if (parentElement) {
        parentElement.classList.remove("range__content--dragable");
      }
      this.pulletToMove = null;
      if (this.props.rangeValues) {
        this.calculatePositionPullet();
      }
    }
  };

  onMouseMoveHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (this.pulletToMove !== null) {
      const rangeToMove = this.pulletToMove.parentElement;
      const { offsetLeft, clientWidth } = this.rangeLineRef.current!;
      const name = rangeToMove?.dataset.name;
      if (name === "min" || name === "max") {
        let widthRange;
        let value;
        if (name === "min") {
          widthRange = event.clientX - offsetLeft;
          widthRange = widthRange > this.width ? this.width : widthRange;
          value = this.calculateMin(widthRange);
          if (value >= this.props.max!) {
            return;
          }
          this.props.onChangeMin(value, this.props.id);
        } else {
          widthRange = offsetLeft + clientWidth - event.clientX;
          widthRange = widthRange > this.width ? this.width : widthRange;
          value = this.calculateMax(widthRange);
          if (value <= this.props.min!) {
            return;
          }
          this.props.onChangeMax(value, this.props.id);
        }
        if (rangeToMove) {
          rangeToMove.style.width = `${widthRange}px`;
        }
        const input =
          name === "min" ? this.minInputRef.current : this.maxInputRef.current;
        if (input !== null) {
          input.value = value.toString();
        }
      }
    }
  };
  onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const { name, value } = event.currentTarget;
      const numberValue = parseInt(value);
      if (
        numberValue < this.props.minLimit ||
        numberValue > this.props.maxLimit ||
        (name === "min" && numberValue >= this.props.max) ||
        (name === "max" && numberValue <= this.props.min)
      ) {
        event.currentTarget.value = this.props[name].toString();
        return;
      }

      if (name === "min") {
        this.props.onChangeMin(numberValue, this.props.id);
      } else {
        this.props.onChangeMax(numberValue, this.props.id);
      }

      this.setState(
        (prevState) => ({
          ...prevState,
          [`${name}Editable`]: false,
        }),
        () => {
          this.calculatePositionPullet();
        }
      );
    }
  };

  onClickLabelHandler = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    if (this.props.rangeValues !== undefined) {
      event.preventDefault();
      return false;
    }

    const name = event.currentTarget.dataset.name;
    if (name === "min" || name === "max") {
      this.setState(
        (prevState) => ({
          ...prevState,
          [`${name}Editable`]: true,
        }),
        () => {
          const input =
            name === "min"
              ? this.minInputRef.current
              : this.maxInputRef.current;
          if (input !== null) {
            input.value = this.props[name].toString();
            input.select();
          }
        }
      );
    }
  };

  calculatePositionPullet() {
    let minWidth;
    let maxWidth;

    if (this.props.rangeValues) {
      const minPosition = this.state.positionsMin.find(
        (pos) => pos.value === this.props.min
      );
      minWidth = minPosition ? minPosition.position : 0;

      const maxPosition = this.state.positionsMax.find(
        (pos) => pos.value === this.props.max
      );
      maxWidth = maxPosition ? maxPosition.position : 0;
    } else {
      minWidth =
        this.widthStep *
        (parseInt(this.props.min.toString()) - this.props.minLimit);
      maxWidth =
        this.width -
        this.widthStep *
          (parseInt(this.props.max.toString()) - this.props.minLimit);
    }

    if (!minWidth) minWidth = 0;
    if (!maxWidth) maxWidth = 0;

    if (this.rangeAreaMinRef.current) {
      this.rangeAreaMinRef.current.style.width = `${minWidth}px`;
    }
    if (this.rangeAreaMaxRef.current) {
      this.rangeAreaMaxRef.current.style.width = `${maxWidth}px`;
    }
  }

  calculateMin(widthRange: number) {
    if (this.props.rangeValues) {
      return this.state.positionsMin.find(
        (pos) => widthRange >= pos.min && widthRange <= pos.max
      )!.value;
    }
    const value = widthRange / this.widthStep + this.props.minLimit;
    return value < this.props.minLimit ? this.props.minLimit : value;
  }

  calculateMax(widthRange: number) {
    if (this.props.rangeValues) {
      return this.state.positionsMax.find(
        (pos) => widthRange >= pos.min && widthRange <= pos.max
      )!.value;
    }

    const value = this.props.maxLimit - widthRange / this.widthStep;
    return value > this.props.maxLimit ? this.props.maxLimit : value;
  }

  render() {
    const { min, max, rangeValues } = this.props;
    const { minEditable, maxEditable } = this.state;

    const formattedMin = min.toFixed(2);
    const formattedMax = max.toFixed(2);

    return (
      <div className="range">
        <div className="range__value range__value-min">
          {rangeValues === undefined && minEditable ? (
            <input
              type="number"
              name="min"
              ref={this.minInputRef}
              onKeyDown={this.onKeyDownHandler}
            />
          ) : (
            <span data-name="min" onClick={this.onClickLabelHandler}>
              {formattedMin}
            </span>
          )}{" "}
          €
        </div>
        <div
          className="range__content"
          onMouseUp={this.onMouseUpHandler}
          onMouseLeave={this.onMouseUpHandler}
          onMouseMove={this.onMouseMoveHandler}
        >
          <div className="range__line" ref={this.rangeLineRef}>
            <div
              className="range__area range__area-min"
              ref={this.rangeAreaMinRef}
              data-name="min"
            >
              <div
                className="bullet bullet-min"
                onMouseDown={this.onMouseDownHandler}
              ></div>
            </div>
            <div
              className="range__area range__area-max"
              ref={this.rangeAreaMaxRef}
              data-name="max"
            >
              <div
                className="bullet bullet-max"
                onMouseDown={this.onMouseDownHandler}
              ></div>
            </div>
          </div>
        </div>
        <div className="range__value range__value-max">
          {rangeValues === undefined && maxEditable ? (
            <input
              type="text"
              name="max"
              ref={this.maxInputRef}
              onKeyDown={this.onKeyDownHandler}
            />
          ) : (
            <span data-name="max" onClick={this.onClickLabelHandler}>
              {formattedMax}
            </span>
          )}{" "}
          €
        </div>
      </div>
    );
  }
}
