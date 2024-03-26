// Importación necesaria desde tu archivo de constantes
import { API_URL_MOCK_DATA } from "../constants/Constants";

// Actualización de la interfaz para reflejar la respuesta esperada de la API
interface NormalRangeResponse {
  min: number;
  max: number;
  step: number;
}

const getNormalRange = async (): Promise<NormalRangeResponse | Error> => {
  try {
    const response = await fetch(`${API_URL_MOCK_DATA || "http://demo3373948.mockable.io/"}/normalRanges`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: NormalRangeResponse = await response.json();
    return data;
  } catch (error) {
    // Asegurarse de retornar el error como una nueva instancia de Error para mantener el tipo consistente
    return new Error((error as Error).message);
  }
};

export default getNormalRange;
