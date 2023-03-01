import { Configuration, FrontendApi } from "@ory/client";

export default new FrontendApi(
  new Configuration({
    basePath: "http://localhost:4000",
    baseOptions: {
      withCredentials: true
    }
  })
);
