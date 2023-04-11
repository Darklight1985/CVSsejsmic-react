import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const token = localStorage.getItem('accessToken');
        return token
      };
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('accessToken', JSON.stringify(userToken.access_token))
        localStorage.setItem('refreshToken', JSON.stringify(userToken.refresh_token))
        let user = JSON.stringify(userToken.user);
        user = JSON.parse(user);
        user = JSON.parse(user);
        console.log(user)
        let role = user.authorities[0].authority;
        localStorage.setItem('role', role)
      setToken(userToken.access_token)
    };

    return {
        setToken: saveToken,
        token
    }
}