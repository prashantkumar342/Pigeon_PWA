import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/slices/api/fetchFriendsSlice";
import { useEffect } from "react";
import FriendsList from "./FriendsList";

function Friend() {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);
console.log({friends: friends});
  return (
    <div className="flex flex-col h-screen max-sm:w-screen overflow-hidden border-gray border-r-2">
      <FriendsList/>
    </div>
  );
}

export default Friend;
