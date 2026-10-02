import app from "./app";
import docsApp from "./docsServer";
import env from "./config/env";

app.listen(env.PORT, () => console.log(`Server Online on http://localhost:${env.PORT}`));

docsApp.listen(env.DOCS_PORT, () =>
    console.log(`Swagger docs on http://localhost:${env.DOCS_PORT}/docs`),
);
