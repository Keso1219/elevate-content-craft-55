import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/vault?section=uploads', { replace: true });
  }, [navigate]);

  return null;
}