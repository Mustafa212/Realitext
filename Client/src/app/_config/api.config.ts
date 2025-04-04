import { environment } from "../../environments/environment";
import { environmentdev } from "../../environments/environment.development";

export class Config {
  //server
  // public static apiUrl = environment.serverUrl;
  public static apiUrl = environmentdev.serverUrl;

  // Identity
  public static Identity = {
    login: "login",
    register: "register",
    classify: "classify",
    extract: "extract",
    feedback:"feedback",
    token:"token"
  };
}
