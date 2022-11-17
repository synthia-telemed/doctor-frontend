import axios from "axios";
import { useSelector } from "react-redux";

const useAPIMeasurement = () => {
  const { token } = useSelector(state => state.user);
  const instance = axios.create({
    baseURL: "https://api.synthia.tech/measurement/api",
    withCredentials: false
  });
  if (token) instance.defaults.headers.Authorization = "Bearer " + token;
  return [instance];
};

export default useAPIMeasurement;
