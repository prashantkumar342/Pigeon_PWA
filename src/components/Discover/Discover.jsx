
import { useDispatch, useSelector } from "react-redux";
import Peoples from "./Peoples";
import { setIsPeoples } from "../../redux/slices/global/globalSlice";
import { setUsers } from "../../redux/slices/api/fetchUsersSlice";

function Discover() {
  const dispatch = useDispatch();
  const { isPeoples } = useSelector(state => state.globalVar)

  return (
    isPeoples ? (
      <div className="
      outline fixed backdrop-blur-md flex 
      justify-center w-screen h-screen"
        onClick={() => { dispatch(setIsPeoples(false));dispatch(setUsers([])) }}
      >
        <div className=" bg-white w-[300px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Peoples />
        </div>
      </div>
    ) : null
  );
}

export default Discover;
