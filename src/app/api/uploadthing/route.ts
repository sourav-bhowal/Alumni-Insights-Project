import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "./core";

// FileRouter to upload files and routes
export const {GET, POST} = createRouteHandler({
    router: fileRouter,
});