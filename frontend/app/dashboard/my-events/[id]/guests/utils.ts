import wretch from "wretch";
import Cookies from "js-cookie";

const api = wretch(process.env.NEXT_PUBLIC_API_BASE_URL).accept("application/json");

/** Helper to attach Authorization header */
const apiWithAuth = () => {
    const access = Cookies.get("accessToken");
    return api.headers({ Authorization: `Bearer ${access}` });
};

/** REGISTER GUEST **/
const registerGuest = (guestData: {}) => {
    return api.post(guestData, "/guests/").json();
}

/** GET GUESTS OF AN EVENT **/
const getEventGuests = (id : number | string ) => {
    return api.get(`/guests/by-event/${id}/`).json();
}

/** CHECK-IN GUEST **/
const checkInGuest = (payload: {
    guest_id: number | string;
    event_id: number | string;
    email: string;
}) => {
    return apiWithAuth()
        .post(payload, "/guests/check-in/")
        .json();
};


export const GuestActions = () => {
    return { registerGuest, getEventGuests, checkInGuest }
}