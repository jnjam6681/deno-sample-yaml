import Jenkins from "jenkins";
import { config } from "../config/config.ts";

export const jenkins = new Jenkins({
    baseUrl: config.jenkins.url,
    headers: {
        "x-awesome-devops-token-x": config.jenkins.token
    }
});