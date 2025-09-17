import { useRouterState } from "@tanstack/react-router";

export function useIsRouteActive(path: string) {
   const {
      location: { pathname },
   } = useRouterState();
   return pathname.startsWith(path);
}
