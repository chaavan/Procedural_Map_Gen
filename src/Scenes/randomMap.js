class randomMap extends Phaser.Scene {
    constructor() {
        super("randomMapScene")
    }

    init(){
        this.PLAYER_VELOCITY = 150
    }

    preload() {
        this.load.spritesheet('char', './assets/Character_002.png', {
            frameWidth: 48,
        })
        this.load.path = "./assets/"
        this.load.image("smb_tiles", "mapPack_tilesheet.png")
        
    }

    create() {
        this.noiseScale = 10
        this.mapHeight = 15
        this.mapWidth = 20

        this.reseed()

        this.generate_map()

        this.createPlayer()

        // this.cameras.main.startFollow(this.player)
        // this.cameras.main.setZoom(2)
       
        this.createPlayerAnimations() 

        this.increaseScale = this.input.keyboard.addKey("PERIOD")
        this.decreaseScale = this.input.keyboard.addKey("COMMA")

        document.getElementById('description').innerHTML = '<h2>RandomMap.js</h2><br>R: Reload random scene<br>, : Decrease noise scale<br>. : Increase noise scale'
        
    }

    update() {
        let playerVector = new Phaser.Math.Vector2(0, 0)
        let playerDirection = 'down'

        if (this.cursors.left.isDown || this.left.isDown) {
            playerVector.x = -1
            playerDirection = 'left'
        } else 
        if (this.cursors.right.isDown || this.right.isDown) {
            playerVector.x = 1
            playerDirection = 'right'
        }

        if (this.cursors.up.isDown || this.up.isDown) {
            playerVector.y = -1
            playerDirection = 'up'
        } else if (this.cursors.down.isDown || this.down.isDown) {
            playerVector.y = 1
            playerDirection = 'down'
        }

        playerVector.normalize()
        this.player.setVelocity(this.PLAYER_VELOCITY*playerVector.x, this.PLAYER_VELOCITY*playerVector.y)
        const playerMovement = playerVector.length() ? 'walk' : 'idle';
        this.player.play(playerMovement + '-' + playerDirection, true);


        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.reseed()
            this.generate_map()
            this.createPlayer()
        }
        if(Phaser.Input.Keyboard.JustDown(this.increaseScale)) {
            this.noiseScale = Math.min(this.noiseScale + 5);
            this.generate_map(false)
            this.createPlayer()
            // console.log(this.noiseScale)
        }
        if(Phaser.Input.Keyboard.JustDown(this.decreaseScale)) {
            this.noiseScale = Math.max(this.noiseScale - 5, 5)
            this.generate_map(false)
            this.createPlayer()
            // console.log(this.noiseScale)

        }
    }

    reseed(){
        noise.seed(Math.random())
    }
    
    noiseGen(x, y){
        const randomVal = noise.simplex2(x / this.noiseScale, y / this.noiseScale)
        return Math.round(Math.abs(randomVal) * 256)
    }

    generate_map(){
        const base = []
        const decor = []
        const water = []
        
        for(let x = 0; x < 15; x++){
            const baseRow = []
            const decorRow = []
            const waterRow = []
            for(let y = 0; y < 20; y++){
                const noiseValue = this.noiseGen(x, y)
                // baseRow.push(36)
                waterRow.push(203)
                let baseTileIndex
                if (noiseValue < 85) {
                    baseTileIndex = 23
                } else if (noiseValue > 170) {
                    baseTileIndex = 18
                } else {
                    baseTileIndex = 203    
                }

                baseRow.push(baseTileIndex)

                let decorTileIndex = -1
                if (baseTileIndex === 18 && Math.random() < 0.1) {
                    if(Math.random() < 0.25){
                        decorTileIndex = 38
                    } else if(Math.random() < 0.5 && Math.random() > 0.25) {
                        decorTileIndex = 54
                    } else {
                        decorTileIndex = 55
                    }
                } else if (baseTileIndex === 23 && Math.random() < 0.1) {
                    if(Math.random() < 0.25){
                        decorTileIndex = 42
                    } else if(Math.random() < 0.5 && Math.random() > 0.25) {
                        decorTileIndex = 43
                    } else {
                        decorTileIndex = 59
                    }
                }

                decorRow.push(decorTileIndex)
                
            }
            water.push(waterRow)
            base.push(baseRow)
            decor.push(decorRow)
        }
        const transitionMap = this.applyTransition(base)

        if(this.player) this.player.destroy()
        console.log(base)
        console.log(decor)

        const watermap = this.make.tilemap({
            data: water,
            tileWidth: tileSize,
            tileHeight: tileSize
        })

        const tilesheet = watermap.addTilesetImage("smb_tiles")

        const waterlayer = watermap.createLayer(0, tilesheet, 0, 0).setScale(0.5)

        const map = this.make.tilemap({
            data: transitionMap,
            tileWidth: tileSize,
            tileHeight: tileSize
        })
        
        const baselayer = map.createLayer(0, tilesheet, 0, 0).setScale(0.5)

        const decormap = this.make.tilemap({
            data: decor,
            tileWidth: tileSize,
            tileHeight: tileSize
        })
        const decorlayer = decormap.createLayer(0, tilesheet, 0, 0).setScale(0.5)

        this.reload = this.input.keyboard.addKey('R')

    }

    createPlayer(){
        let playerX = this.player ? this.player.x : 64;
        let playerY = this.player ? this.player.y : 64;

        this.player = this.physics.add.sprite(playerX, playerY, 'char', 1).setScale(1)
        this.player.body.setCollideWorldBounds(true)
        this.player.body.setSize(32, 32).setOffset(8, 16)
    }

    createPlayerAnimations(){
        this.anims.create({
            key: "idle-down",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 1,
                end: 1,
            }),
        })

        this.anims.create({
            key: "walk-down",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 0,
                end: 2,
            }),
        })

        this.anims.create({
            key: "walk-up",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 9,
                end: 11,
            }),
        })

        this.anims.create({
            key: "walk-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 6,
                end: 8,
            }),
        })

        this.anims.create({
            key: "walk-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('char', {
                start: 3,
                end: 5,
            }),
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.up = this.input.keyboard.addKey('W')
        this.left = this.input.keyboard.addKey('A')
        this.down = this.input.keyboard.addKey('S')
        this.right = this.input.keyboard.addKey('D')
    }

    applyTransition(base) {
        const transitionMap = JSON.parse(JSON.stringify(base)); // Clone the base array to avoid modifying the original
    
        for (let x = 0; x < this.mapHeight; x++) {
            for (let y = 0; y < this.mapWidth; y++) {
                const currentTile = base[x][y];
    
                // Get neighbors (edge cases default to currentTile)
                const top = x > 0 ? base[x - 1][y] : currentTile;
                const bottom = x < this.mapHeight - 1 ? base[x + 1][y] : currentTile;
                const left = y > 0 ? base[x][y - 1] : currentTile;
                const right = y < this.mapWidth - 1 ? base[x][y + 1] : currentTile;
    
                const topLeft = x > 0 && y > 0 ? base[x - 1][y - 1] : currentTile;
                const topRight = x > 0 && y < this.mapWidth - 1 ? base[x - 1][y + 1] : currentTile;
                const bottomLeft = x < this.mapHeight - 1 && y > 0 ? base[x + 1][y - 1] : currentTile;
                const bottomRight = x < this.mapHeight - 1 && y < this.mapWidth - 1 ? base[x + 1][y + 1] : currentTile;
    
                // Apply transitions for Grass (23)
                if (currentTile === 23) {
                    if (bottom === 203) transitionMap[x][y] = 40; // Grass-Water (bottom)
                    else if (top === 203) transitionMap[x][y] = 6; // Grass-Water (top transition tile index)
                    else if (left === 203) transitionMap[x][y] = 22; // Grass-Water (left)
                    else if (right === 203) transitionMap[x][y] = 24; // Grass-Water (right)
                    
                    if (top === 203 && bottom === 203 && left === 203 && right === 203) transitionMap[x][y] = 8;
                    else if (bottom === 203 && left === 203) transitionMap[x][y] = 39; // Grass-Water (bottom-left corner)
                    else if (bottom === 203 && right === 203) transitionMap[x][y] = 41; // Grass-Water (bottom-right corner)
                    else if (top === 203 && right === 203) transitionMap[x][y] = 7; // Grass-Water (top-right corner)
                    else if (top === 203 && left === 203 ) transitionMap[x][y] = 5; // Grass-Water (top-left corner)
                }
    
                // Apply transitions for Desert (18)
                if (currentTile === 18) {
                    if (bottom === 203) transitionMap[x][y] = 35; // Desert-Grass (bottom)
                    else if (top === 203) transitionMap[x][y] = 1; // Desert-Grass (top)
                    else if (left === 203) transitionMap[x][y] = 17; // Desert-Grass (left)
                    else if (right === 203) transitionMap[x][y] = 19; // Desert-Grass (right)
    
                    if (top === 203 && bottom === 203 && left === 203 && right === 203) transitionMap[x][y] = 3;
                    else if (bottom === 203 && left === 203) transitionMap[x][y] = 34; // Desert-Grass (bottom-left corner)
                    else if (bottom === 203 && right === 203) transitionMap[x][y] = 36; // Desert-Grass (bottom-right corner)
                    else if (top === 203 && right === 203) transitionMap[x][y] = 2; // Desert-Grass (top-right corner)
                    else if (top === 203 && left === 203) transitionMap[x][y] = 0; // Desert-Grass (top-left corner)
                }
    
                // Apply transitions for Water (203)
                // if (currentTile === 203) {
                //     if (top === 18) transitionMap[x][y] = 320; // Water-Desert (top)
                //     else if (bottom === 18) transitionMap[x][y] = 321; // Water-Desert (bottom)
                //     else if (left === 18) transitionMap[x][y] = 322; // Water-Desert (left)
                //     else if (right === 18) transitionMap[x][y] = 323; // Water-Desert (right)
    
                //     if (topLeft === 18) transitionMap[x][y] = 324; // Water-Desert (top-left corner)
                //     else if (topRight === 18) transitionMap[x][y] = 325; // Water-Desert (top-right corner)
                //     else if (bottomLeft === 18) transitionMap[x][y] = 326; // Water-Desert (bottom-left corner)
                //     else if (bottomRight === 18) transitionMap[x][y] = 327; // Water-Desert (bottom-right corner)
                // }
            }
        }
    
        return transitionMap;
    }

    
}