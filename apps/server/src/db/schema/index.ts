import * as user from "./auth";
import * as note from "./note";
export const schema = {
   ...user,
   ...note,
} as const;
export type Schema = typeof schema;

export default schema;
export { user, note };
