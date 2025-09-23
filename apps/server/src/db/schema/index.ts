import * as user from "./auth";
import * as note from "./note";
import * as space from "./space";
export const schema = {
   ...user,
   ...note,
   ...space,
} as const;
export type Schema = typeof schema;

export default schema;
export { user, note };
