import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "../auth-client";
import { getServerHeaders } from "../server-headers";

export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: getWebRequest().headers,
      },
   });
   return session?.data?.user || null;
});
