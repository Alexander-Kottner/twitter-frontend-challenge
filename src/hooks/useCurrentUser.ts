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
    // Check if we have a token in localStorage
    const hasToken = () => {
      const token = localStorage.getItem("token");
      return token && token.trim() !== "" && token !== "null";
    };

    // Only fetch if we don't have a user and we're not already loading
    // BUT we do have a token (this handles page refreshes)
    if (!currentUser && !userLoading && hasToken()) {
      dispatch(setUserLoading(true));
      service
        .me()
        .then((user) => {
          dispatch(setCurrentUser(user));
        })
        .catch((error) => {
          console.error("Failed to fetch current user:", error);
          // If the token is invalid (401, 403), clear it
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            console.warn("Token is invalid, removing it");
            localStorage.removeItem("token");
          }
        })
        .finally(() => {
          dispatch(setUserLoading(false));
        });
    }
  }, [currentUser, userLoading, dispatch, service]);

  return { currentUser, userLoading };
};