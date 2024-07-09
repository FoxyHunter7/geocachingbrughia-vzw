import { fetchFromServer, postToServer } from "./fetcher"

async function login(email, password) {
    const json = JSON.stringify({
        email: email,
        password: password
    });
    
    return postToServer("login", json, true);
}

async function getProfileData() {
    return fetchFromServer("profile", true);
}

async function logout() {
    return fetchFromServer("logout", true);
}

export { login, getProfileData, logout };