import { API_URL_MOCK_DATA } from "../constants/Constants";

interface FixedRangeResponse {
  valueRanges: number[];
}

const getFixedRange = async (): Promise<FixedRangeResponse | Error> => {
  try {
    const response = await fetch(`${API_URL_MOCK_DATA || "http://demo3373948.mockable.io/"}/fixedRanges`);  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FixedRangeResponse = await response.json();
    return data;
  } catch (error) {
    return new Error((error as Error).message);
  }
};

export default getFixedRange;
