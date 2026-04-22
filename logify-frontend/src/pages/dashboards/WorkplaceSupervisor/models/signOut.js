import { useContext } from 'react';
import { AuthContext } from "../../../../contexts/AuthContext";

export function signOut () {

    const {logout } = useContext(AuthContext);

    const handleSignOut = async () => {
        await logout();
    };

    return { handleSignOut };
}