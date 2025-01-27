class player extends Phaser.Scene {
    constructor() {
        super("playerScene")
    }

    init(){
        this.PLAYER_VELOCITY = 350
    }

    preload() {
        this.load.spritesheet('char', './assets/Character_002.png', {
            frameWidth: 48
        })

    }

    create() {
        this.player = this.physics.add.sprite(width / 2, height / 2, 'char', 1).setScale(1)
        this.player.body.setCollideWorldBounds(true)
        this.player.body.setSize(32, 32).setOffset(8,16)

        this.anims.create({
            key: "idle-down",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 1, 
                end: 1
            })
        })

        this.anims.create({
            key: "walk-down",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 0, 
                end: 2
            })
        })

        this.anims.create({
            key: "walk-up",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 9, 
                end: 11
            })
        })

        this.anims.create({
            key: "walk-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 6, 
                end: 8
            })
        })

        this.anims.create({
            key: "walk-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 3, 
                end: 5
            })
        })

        cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        })
    }

    update() {
        // this.player.play('walk-down', true)
        let playerVector = new Phaser.Math.Vector2(0, 0)
        let playerDirection = 'down'

        if(cursors.left.isDown || this.wasd.left.isDown){
            playerVector.x = -1
            playerDirection = 'left'
        } else if (cursors.right.isDown || this.wasd.right.isDown){
            playerVector.x = 1
            playerDirection = 'right'
        }

        if(cursors.up.isDown || this.wasd.up.isDown){
            playerVector.y = -1
            playerDirection = 'up'
        } else if (cursors.down.isDown || this.wasd.down.isDown){
            playerVector.y = 1
            playerDirection = 'down'
        }

        playerVector.normalize()

        this.player.setVelocity(this.PLAYER_VELOCITY*playerVector.x, this.PLAYER_VELOCITY*playerVector.y)

        let playerMovement
        playerVector.length() ? playerMovement = 'walk': playerMovement = 'idle' 
        this.player.play(playerMovement + '-' + playerDirection, true)
    }

}