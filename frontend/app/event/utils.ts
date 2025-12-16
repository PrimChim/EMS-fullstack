import wretch from "wretch";
import Cookies from "js-cookie";

const api = wretch(process.env.NEXT_PUBLIC_API_BASE_URL).accept("application/json");

/** Helper to attach Authorization header */
const apiWithAuth = () => {
  const access = Cookies.get("accessToken");
  return api.headers({ Authorization: `Bearer ${access}` });
};

/** CREATE EVENT */
const addEvent = (eventData: any) => {
  return apiWithAuth().post(eventData, "/events/").json();
};

/** GET ALL EVENTS */
const getEvents = async () => {
  try {
    const data = await apiWithAuth().get("/events/").json();
    return data;
  } catch (err: any) {
    throw err;
  }
};

/** GET SINGLE EVENT */
const getEvent = (id: number | string) => {
  return api.get(`/events/${id}/`).json();
};

/** DELETE EVENT */
const deleteEvent = (id: number | string) => {
  try {
    const response = apiWithAuth().delete(`/events/${id}/`);
    return response;
  } catch (err: any) {
    throw err;
  }
};

/** GET ALL EVENTS */
const getMyEvents = async () => {
  try {
    const data = await apiWithAuth().get("/events/my_events/").json();
    return data;
  } catch (err: any) {
    throw err;
  }
};

export const EventActions = () => {
  return { addEvent, getEvents, getEvent, deleteEvent, getMyEvents };
};
