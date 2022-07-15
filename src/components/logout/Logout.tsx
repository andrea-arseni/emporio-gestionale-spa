import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { logout } from "../../store/auth-slice";

const Logout: React.FC<{}> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);
    return <div></div>;
};

export default Logout;
