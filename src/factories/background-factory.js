import k from "../kaplay-ctx";

export default function makeBackground() {
    const bgPieceWidth = 1920;
    const platformWidth = 1280;

    const bgPieces = [
        k.add([
            k.sprite("chemical-bg"), 
            k.pos(0, 0), 
            k.scale(2),
            k.opacity(0.8)
        ]),
        k.add([
            k.sprite("chemical-bg"), 
            k.pos(bgPieceWidth * 2, 0), 
            k.scale(2),
            k.opacity(0.8)
        ]),
    ];

    const platforms = [
        k.add([
            k.sprite("platforms"),
            k.pos(0, 450),
            k.scale(4)
        ]),
        k.add([
            k.sprite("platforms"),
            k.pos(platformWidth * 4, 450),
            k.scale(4)
        ]),
    ];

    return {
        bgPieces,
        bgPieceWidth,
        platforms,
        platformWidth
    }
}

export function animateBackground(bgPieces, bgPieceWidth, platforms, platformWidth, gameSpeed) {
    if(bgPieces[1].pos.x < 0) {
        bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
        bgPieces.push(bgPieces.shift());
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
        platforms[0].moveTo(platforms[1].pos.x + platformWidth * 4, 450);
        platforms.push(platforms.shift());
    }
  
    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platformWidth * 4, 450);
}