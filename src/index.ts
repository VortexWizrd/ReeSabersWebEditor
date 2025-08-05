import * as ReeSaberBuilder from "./reesaberbuilder/";
import { UI } from "./ui";
import { Viewport } from "./viewport";

let ReeSaber = new ReeSaberBuilder.ReeSaber();

let blursaber = new ReeSaberBuilder.BlurSaberModule()
let blursaber2 = new ReeSaberBuilder.BlurSaberModule()
blursaber2.Config.LocalTransform.Position.x = 1;
blursaber.Children.push(blursaber2);

ReeSaber.Modules.push(blursaber);

console.log(ReeSaber);


let viewport = new Viewport(ReeSaber);
let ui = new UI(ReeSaber);