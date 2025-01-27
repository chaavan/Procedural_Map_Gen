// Nathan Altice
// Created: 5/4/20
// Updated: 1/13/24
// Mappy
// Tilemap examples
// Some examples adapted from Michael Hadley's "Modular Game Worlds in Phaser 3" tutorial series

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    //pixelArt: true,
    width: 640,
    height: 480,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            // debug: rtrue,
        }
    },
    scene: [ randomMap]
}

const game = new Phaser.Game(config)

// globals
let cursors
let { height, width } = game.config

const tileSize = 64