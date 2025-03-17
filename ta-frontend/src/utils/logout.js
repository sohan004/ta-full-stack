
import Cookies from "js-cookie";

const logout = () => {
    Cookies.remove(process.env.NEXT_PUBLIC_ACCESS_TOKEN);
    window.location.href = "/sign-in";
}

export default logout;