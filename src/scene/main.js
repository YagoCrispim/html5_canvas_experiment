window.log = console.log;

import { Canvas2D, Scene, engine } from "../engine";
import { Player, Ground } from "./game-objects";

engine
  .setScene(
    new Scene({
      children: [new Canvas2D({
        children: [Player(), Ground()]
      })],
    }),
  )
  .start();
