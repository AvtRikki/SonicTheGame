import { makeSonic } from "../entities/sonic";
import makeBackground, { animateBackground } from "../factories/background-factory";
import k from "../kaplay-ctx";

export default function mainMenu() {
    if (!k.getData("best-score")) {
        k.setData("best-score", 0)
    }

    k.onButtonPress("jump", () => k.go("game"));

    const { bgPieces, bgPieceWidth, platforms, platformWidth } = makeBackground();

    k.add([
        k.text("SONIC RING RUN", { font: "mania", size: 96 }),
        k.pos(k.center().x, 200),
        k.anchor("center")
    ]);

    k.add([
        k.text("Press Space/Click/Touch to Play", { font: "mania", size: 46 }),
        k.anchor("center"),
        k.pos(k.center().x, k.center().y - 200),
    ]);

    makeSonic(k.vec2(200, 745));

    const gameSpeed = 4000;
    k.onUpdate(() => {
        animateBackground(bgPieces, bgPieceWidth, platforms, platformWidth, gameSpeed)
    });
}