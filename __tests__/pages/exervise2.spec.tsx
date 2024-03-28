import React from "react";
import { render, waitFor } from "@testing-library/react";
import Exercise2 from "../../pages/exercise2";
import { ApiService } from "../../api/api";

jest.mock("../../api/api", () => ({
  ApiService: {
    getAllFixedRanges: jest.fn(() => Promise.resolve([])),
  },
}));

describe("Exercise2 Component", () => {
  it("renders without crashing", async () => {
    render(<Exercise2 />);
    await waitFor(() =>
      expect(ApiService.getAllFixedRanges).toHaveBeenCalled()
    );
  });
});
