import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Exercise1 from "../../pages/exercise1";
import { ApiService } from "../../api/api";

jest.mock("../../api/api", () => ({
  ApiService: {
    getAllRanges: jest.fn(() => Promise.resolve([])),
  },
}));

describe("Exercise1 Component", () => {
  it("renders without crashing", async () => {
    const { getByText } = render(<Exercise1 />);
    expect(getByText("Back to Home")).toBeInTheDocument();
    await waitFor(() => expect(ApiService.getAllRanges).toHaveBeenCalled());
  });
});
