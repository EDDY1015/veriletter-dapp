import { useEffect, useState } from "react";

export default function useIssuedLetters(email, issuerId) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email || !issuerId) return;

    const fetchLetters = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5001/issued/${issuerId}`);
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
