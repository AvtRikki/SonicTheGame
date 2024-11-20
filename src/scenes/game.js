import k from "../kaplay-ctx";
import { makeSonic } from "../entities/sonic";
import makeBackground, { animateBackground } from "../factories/background-factory";
import makeMotobug from "../entities/motobug";
import makeRing from "../entities/ring";

export default function game() {
    k.setGravity(3100);
    const citySfx = k.play("city", { volume: 0.2, loop: true });

    const { bgPieces, bgPieceWidth, platforms, platformWidth } = makeBackground();
    let gameSpeed = 300;
    k.loop(1, () => {
        gameSpeed += 50;
    });

    k.add([
        k.rect(1920, 300),
        k.opacity(0),
        k.area(),
        k.pos(0, 832),
        k.body({
            isStatic: true
        }),
    ]);

    let score = 0;
    let scoreMultiplier = 0;

    const controlsText = k.add([
        k.text("Press Space/Click/Touch to Jump!", {
            font: "mania",
            size: 64,
        }),
        k.anchor("center"),
        k.pos(k.center()),
    ]);

    const dismissControlsAction = k.onButtonPress("jump", () => {
        k.destroy(controlsText);
        dismissControlsAction.cancel();
      });

    const scoreText = k.add([
        k.text("SCORE : 0", { font: "mania", size: 72 }),
        k.pos(20, 20),
    ]);

    const sonic = makeSonic(k.vec2(200, 745));
    sonic.setControls();
    sonic.setEvents();
    sonic.onCollide("enemy", (enemy) => {
        if (!sonic.isGrounded()) {
            k.play("destroy", { volume: 0.5 });
            k.play("hyper-ring", { volume: 0.5 });
            
            k.destroy(enemy);
            
            sonic.play("jump");
            k.play("jump");
            sonic.jump();

            scoreMultiplier += 1;
            score += 10 * scoreMultiplier;
            scoreText.text = `SCORE : ${score}`;
            if (scoreMultiplier === 1) {
                sonic.ringCollectUI.text = `+${10 * scoreMultiplier}`;
            }
                
            if (scoreMultiplier > 1) {
                sonic.ringCollectUI.text = `x${scoreMultiplier}`;
            }

            k.wait(1, () => {
                sonic.ringCollectUI.text = "";
            });
        } else {
            k.play("hurt", { volume: 0.5 });
            k.setData("current-score", score);
            k.go("game-over", citySfx);
        }
    });

    sonic.onCollide("ring", (ring) => {
        k.play("ring", { volume: 0.5 });
        k.destroy(ring);
        score++;
        scoreText.text = `SCORE : ${score}`;
        sonic.ringCollectUI.text = "+1";
        k.wait(1, () => {
          sonic.ringCollectUI.text = "";
        });
    });

    const spawnMotoBug = () => {
        const motoBug = makeMotobug(k.vec2(1950, 773));
        motoBug.onUpdate(() => {
            if (gameSpeed < 3000) {
                motoBug.move(-(gameSpeed + 300), 0)
                return;
            }

            motoBug.move(-gameSpeed, 0);
        });

        motoBug.onExitScreen(() => {
            if (motoBug.pos.x < 0) {
                k.destroy(motoBug);
            }
        });

        const waitTime = k.rand(0.5, 2.5);
        k.wait(waitTime, spawnMotoBug);
    };

    spawnMotoBug();

    const spawnRing = () => {
        const ring = makeRing(k.vec2(1950, 745));
        ring.onUpdate(() => {
            ring.move(-gameSpeed, 0);
        });

        ring.onExitScreen(() => {
            if (ring.pos.x < 0) k.destroy(ring);
        });

        const waitTime = k.rand(0.5, 3);
        k.wait(waitTime, spawnRing);
    };
    
    spawnRing();

    k.onUpdate(() => {
        if (sonic.isGrounded()) {
            scoreMultiplier = 0;
        }

        animateBackground(bgPieces, bgPieceWidth, platforms, platformWidth, gameSpeed);
    })
}