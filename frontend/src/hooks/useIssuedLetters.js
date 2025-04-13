import { useEffect, useState } from "react";

// ✅ Use env variable for backend URL with localhost fallback
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

export default function useIssuedLetters(email, issuerId) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !issuerId) return;

    const fetchLetters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/issued/${issuerId}`);
        const data = await res.json();
        setLetters(data || []);
      } catch (err) {
        console.error("Error fetching letters:", err);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [email, issuerId]);

  return { letters, loading };
}
