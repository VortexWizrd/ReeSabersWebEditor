import * as ReeSaberBuilder from "./reesaberbuilder/";
import { UI } from "./ui";
import { Viewport } from "./viewport";

let ReeSaber = new ReeSaberBuilder.ReeSaber();

let blursaber = new ReeSaberBuilder.BlurSaberModule()

ReeSaber.Modules.push(blursaber);

let viewport = new Viewport(ReeSaber);
let ui = new UI(ReeSaber);