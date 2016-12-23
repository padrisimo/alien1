var fondoJuego;
var personaje;
var cursores; 
var balas;
var tiempoBala= 0;
var botonDisparo;
var fondos;
var enemigos;

var juego = new Phaser.Game(800,400, Phaser.CANVAS, 'bloque_juego');

var estadoPrincipal = {
    preload: function(){
        juego.load.image('fondo', 'img/fondo.png');
        juego.load.image('personaje', 'img/personaje.gif');
        juego.load.image('laser', 'img/rayo.png');
        juego.load.image('enemigo', 'img/malo.png');
    },
    create: function(){
        
        // Establecemos los límites del juego completo				
        juego.world.setBounds(0, 0, 8000, 400);
        
        //fondoJuego = juego.add.tileSprite(0, -200, 800, 600,'fondo');
        //fondoJuego2 = juego.add.tileSprite(800, -200, 800, 600,'fondo');
        
        fondos = juego.add.group();
        
        for(var i = 0; i < juego.world.bounds.width; i+=800){
             fondo = fondos.create(i, -200, 'fondo');
        }   
        
        personaje = juego.add.sprite(8, 260, 'personaje');
        juego.physics.arcade.enable(personaje);
        personaje.scale.setTo(0.6);
        personaje.anchor.setTo(3,0);
        
        // Le permitimos colisionar con los límites del juego
        personaje.body.collideWorldBounds = true;
        
        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(200, 'laser');
        balas.setAll('anchor.y',-1.5);
        balas.setAll('anchor.x', 3);
        balas.setAll('outOflBoundsKill', true);
        balas.setAll('checkWorldBounds', true);
        
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        enemigos.scale.setTo(0.1);

        
        //crear enemigos
        for (x=5000; x <80000; x+=4000){
            var enemigo = enemigos.create(x, 2760, 'enemigo');
        }
        
        //muevo enemigos
        var animation = juego.add.tween(enemigos).to({x:100}, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        
        //camara te sigue
        juego.camera.follow(personaje);
        
    },
    
    update: function(){ 
        
        //evento de disparo
        var bala;
        if(botonDisparo.isDown){
            if(juego.time.now > tiempoBala){
                bala = balas.getFirstExists(false);
            }
            if(bala){
                bala.reset(personaje.x, personaje.y); 
                bala.body.velocity.x = 1000;
                tiempoBala = juego.time.now + 400;
            }   
        }
        
        //cursores de movimiento
        if(cursores.right.isDown)
            {
                personaje.position.x += 5;
            }
        else if (cursores.left.isDown){
                personaje.position.x -= 5;

        }
        
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    },
    
    render: function() {

    juego.debug.cameraInfo(juego.camera, 32, 32);
    juego.debug.spriteCoords(personaje, 32, 500);

    }
};

function colision(bala, enemigo){
    bala.kill();
    enemigo.kill();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');