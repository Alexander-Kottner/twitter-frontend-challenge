import { useEffect } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { setCurrentUser, setUserLoading } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();
  const { currentUser, userLoading } = useAppSelector((state) => ({
    currentUser: state.user.currentUser,
    userLoading: state.user.userLoading,
  }));

  useEffect(() => {
    // Only fetch if we don't have a user and we're not already loading
    if (!currentUser && !userLoading) {
      dispatch(setUserLoading(true));
      service
        .me()
        .then((user) => {
          dispatch(setCurrentUser(user));
        })
        .catch((error) => {
          console.error("Failed to fetch current user:", error);
        })
        .finally(() => {
          dispatch(setUserLoading(false));
        });
    }
  }, [currentUser, userLoading, dispatch, service]);

  return { currentUser, userLoading };
};