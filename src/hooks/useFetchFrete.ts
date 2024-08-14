import { useState } from "react";

const useFetchAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao buscar endereço");
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError((err as Error).message);
      return null;
    }
  };

  return { fetchAddress, loading, error };
};

export default useFetchAddress;
