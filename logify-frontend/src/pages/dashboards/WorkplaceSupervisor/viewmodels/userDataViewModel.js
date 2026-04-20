import { useState, useEffect } from 'react';
import { userRepository } from '../models/userModel';

export function userDataViewModel(){
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchUserData = async () => {

        setLoading(true);

        try {
            const data = await userRepository.getUserData();
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setError(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return { userData, loading, error };
}