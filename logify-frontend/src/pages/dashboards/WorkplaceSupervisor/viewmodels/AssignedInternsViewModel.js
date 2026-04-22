import { useState, useEffect } from "react";
import { assignedInternsRepository } from "../models/assignedInterns";

export function assignedInternsViewModel() {
  const [assignedInterns, setAssignedInterns] = useState({
    interns: [],
    totalInterns: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignedInterns = async () => {
    setLoading(true);

    try {
      const data = await assignedInternsRepository.getAssignedInterns();
      setAssignedInterns(data);
    } catch (error) {
      console.error("Failed to fetch assigned interns:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedInterns();
  }, []);

  return { assignedInterns, loading, error };
}
