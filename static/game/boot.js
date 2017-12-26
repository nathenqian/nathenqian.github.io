var boot = function(game){
    
};

boot.prototype = {
    preload: function(){
        this.game.load.image('empty','static/images/empty.png');
    },
    create: function(){
        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        // var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);
        
        this.game.global["boot"] = {
            frameGraphics : this.game.add.graphics(0, 0),
            // cardGraphics : game.add.graphics(0, 0)
        }
        drawFrame(this.game);
        drawCard(this.game);
        // drawBasicRec(this.game, 100, 100);
    },
    update: function() {

    }
}

function drawCard(game) { 
    var graphics = game.add.graphics(0, 0);
    var baseX = 100;
    var baseY = 70;

    for (var i = 0; i < game.global["data"]["cards"].length; i ++) {
        var x = baseX + 0;
        var y = baseY + i * 40;
        var content = game.global["data"]["cards"][i]["name"] + " : " + game.global["data"]["cards"][i]["number"].toString();
        var button = game.make.button(x, y, 'empty', null, this, 2, 1, 0, 0);
        function over(data) {
            alert(10);
        }
        button.onInputOver.add(over, this);
        // button.onInputOut.add(out, this);

        // drawBasicRec(game, x, y, 100, 40, 10, );
        // game.stage.backgroundColor = '#182d3b';

        // background = game.add.tileSprite(0, 0, 800, 600, 'background');

        // button = game.add.button(x, y, game.global["cards"][i]["name"] + " : " + game.global["cards"][i]["number"].toString(), onUp, this, 2, 1, 0);

        // var textStyle = { 
        //     font: "10px Arial",
        //     // fill: "#ff0044", 
        //     wordWrap: true, 
        //     // wordWrapWidth: 10, 
        //     align: "center", 
        // };
        // var textElement = new Phaser.Text(game, x, y, "Hello World", textStyle);
        // textElement.anchor.set(-0.5);
        // textElement.setTextBounds(x, y, x + 100, y + 40);
        // graphics.addChild(textElement);
    }
}

function graphicsDrawLine(graphics, x, y, dx, dy) {
    graphics.lineStyle(1, 0x000000, 1);
    graphics.moveTo(x, y);
    graphics.lineTo(x + dx, y + dy);
}


function drawFrame(game) {
    var graphics = game.global["boot"]["frameGraphics"];
    graphicsDrawLine(graphics, 100, 40, 1500, 0);
    graphicsDrawLine(graphics, 400, 40, 0, 800);
    // graphicsBasicRec(graphics, 100, 0);
}

function graphicsBasicRec(graphics, x, y, width = 100, height = 40, radius = 10, text = "") {
    graphics.lineStyle(1, 0x000000, 1);
    graphics.drawRoundedRect(x, y, width, height, radius);
    // if (text != "") {
    //     var textStyle = { 
    //         font: "12px Arial" 
    //     };
    //     game.add.text(x + 5, y + height / 2 - 7, text, textStyle);
    // }
}