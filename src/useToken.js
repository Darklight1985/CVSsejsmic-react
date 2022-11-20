import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const token = localStorage.getItem('accessToken');
        console.log(token);
        return token
      };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('accessToken', JSON.stringify(userToken.access_token))
        localStorage.setItem('refreshToken', JSON.stringify(userToken.refresh_token))
      
      setToken(userToken.access_token)
    };

    return {
        setToken: saveToken,
        token
    }
}