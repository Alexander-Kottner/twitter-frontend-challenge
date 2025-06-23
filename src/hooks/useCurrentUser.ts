import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentUser, setUserLoading } from "../redux/user";
import { useGetCurrentUser } from "./useUsers";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const { currentUser, userLoading } = useAppSelector((state) => ({
    currentUser: state.user.currentUser,
    userLoading: state.user.userLoading,
  }));

  // Check if we have a token in localStorage
  const hasToken = () => {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "" && token !== "null";
  };

  // Use React Query to fetch current user
  const {
    data: fetchedUser,
    isLoading: queryLoading,
    error,
  } = useGetCurrentUser();

  useEffect(() => {
    // Only fetch if we don't have a user and we're not already loading
    // BUT we do have a token (this handles page refreshes)
    if (!currentUser && hasToken()) {
      dispatch(setUserLoading(true));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (fetchedUser && !currentUser) {
      dispatch(setCurrentUser(fetchedUser));
      dispatch(setUserLoading(false));
    }
  }, [fetchedUser, currentUser, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setUserLoading(false));
      console.error("Error fetching current user:", error);
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(setUserLoading(queryLoading && hasToken()));
  }, [queryLoading, dispatch]);

  return { currentUser: currentUser || fetchedUser, userLoading };
};