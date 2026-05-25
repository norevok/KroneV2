import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Sonderangebote-Seite wurde entfernt — weiterleitung zur Gutschein-Seite
export default function Offers() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/gutscheine', { replace: true }); }, [navigate]);
  return null;
}