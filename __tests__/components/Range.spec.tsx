import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Range from "../../components/Range";
import { jest } from "@jest/globals";

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("Range Component", () => {
  const mockOnChangeMin = jest.fn();
  const mockOnChangeMax = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default values and labels", () => {
    const { getByText } = render(
      <Range
        min={0}
        max={100}
        id="test-id"
        onChangeMin={mockOnChangeMin}
        onChangeMax={mockOnChangeMax}
        exerciseType="exercise1"
      />
    );

    expect(getByText("0 €")).toBeInTheDocument();
    expect(getByText("100 €")).toBeInTheDocument();
  });

  it("allows editing min and max values when clicking on labels", () => {
    const { getByText, getByTestId } = render(
      <Range
        min={0}
        max={100}
        id="test-id"
        onChangeMin={mockOnChangeMin}
        onChangeMax={mockOnChangeMax}
        exerciseType="exercise1"
      />
    );

    fireEvent.click(getByText("0 €"));
    expect(getByTestId("min-input")).toBeInTheDocument();

    fireEvent.click(getByText("100 €"));
    expect(getByTestId("max-input")).toBeInTheDocument();
  });

  it("allows editing min and max values when clicking on labels with rangeValues", () => {
    const { getByTestId } = render(
      <Range
        min={0}
        max={100}
        id="test-id"
        onChangeMin={mockOnChangeMin}
        onChangeMax={mockOnChangeMax}
        exerciseType="exercise1"
        rangeValues={[0, 25, 50, 75, 100]}
      />
    );

    fireEvent.click(getByTestId("min-label"));
    expect(getByTestId("min-input")).toBeInTheDocument();

    fireEvent.click(getByTestId("max-label"));
    expect(getByTestId("max-input")).toBeInTheDocument();
  });
});
