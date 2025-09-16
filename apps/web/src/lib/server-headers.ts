export const getServerHeaders = async () => {
   if (import.meta.env.SSR) {
      const { getHeaders } = await import("@tanstack/react-start/server");
      return getHeaders();
   }
   return {};
};
