import base64 from "base-64";
import { useLocation, useNavigate, createSearchParams } from "react-router-dom";

const useNavigateWithNextPathname = (pathname, replace = true) => {
  const location = useLocation();
  const navigate = useNavigate();

  const nextPathname = base64.encode(
    `${location.pathname}${location.search}${location.hash}`
  );
  navigate(
    { pathname, search: createSearchParams({ next: nextPathname }).toString() },
    { replace }
  );
};

const useNavigateNextUrl = () => {};

const useReNavigate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const nextPathname = `${location.pathname}${location.search}${location.hash}`;
  navigate({ pathname: nextPathname });
};
