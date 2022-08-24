import { useNavigate } from "react-router";
import { ROOT_PATH } from "../containers/Root";

export const useNavigateWithPageRoot = () => {
  const navigate = useNavigate();

  const nav = (path: string) => {
    navigate(`/${ROOT_PATH}${path}`);
  };

  return nav;
};
