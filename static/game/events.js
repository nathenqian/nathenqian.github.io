function EventBase(parent) {
    this.parent = parent;
}

function StreamContainer(draw, lines = 100) {
    this.draw = draw;
    this.sentences = [];
    this.lines = lines;
}

StreamContainer.prototype = {
    push : function(content) {
        if (this.sentences.length > this.lines) {
            this.sentences.shift();
        }
        this.sentences.push(content);
        this.draw(this.sentences);
    }
};

function ChatEvent(parent, content, streamContainer) {
    EventBase.call(this, parent);
    this.content = content;
    this.container = streamContainer;
}

ChatEvent.prototype = {
    execute : function() {
        this.container.push(this.content);
        if (this.parent == null)
            return null;
        return this.parent.finish();
    }
};

function BattleDraw(imageDraw, streamDraw) {
    this.imageDraw = imageDraw;
    this.streamDraw = new StreamContainer(streamDraw, 10);
}

BattleDraw.prototype = {
    push : function(content) {
        this.streamDraw.push(content);
    },
    update : function() {
        this.imageDraw();
    }
};

function BattleEvent(parent, gHumans, enermy, gBatlleHuman, imageContainerDraw, streamContainerDraw) {
    EventBase.call(this, parent);
    this.battle = gBatlleHuman;
    gBatlleHuman["human"] = [];
    gBatlleHuman["enermy"] = [];

    this.turnList = [];
    this.nameReflect = {}
    for (var name in gHumans) {
        var temp = gHumans[name].deepcopy();
        gBatlleHuman["human"].push(temp);
        this.turnList.push({name : name, speed : temp.speed});
        this.nameReflect[name] = temp;
    } 
    for (var i = 0; i < enermy.length; i ++) {
        var temp = enermy[i].deepcopy();
        temp.name += i.toString();
        gBatlleHuman["enermy"].push(temp);
        // alert(temp.name);
        this.turnList.push({name : temp.name, speed : temp.speed});
        this.nameReflect[temp.name] = temp;
    }

    this.battleDraw = new BattleDraw(imageContainerDraw, streamContainerDraw);

    this.turnList.sort(function(a, b) {
        return -a["speed"] + b["speed"];
    });
    // for (var i in (this.turnList))
        // for (var j in this.turnList[i])
            // alert(this.turnList[i][j]);
    this.turn = 0;
}

BattleEvent.prototype = {
    execute : function() {
        this.battleDraw.update();
        this.battleDraw.push("start battle!");
        return this.parent.finish();
    }
};

function SeqEvent(parent, events, streamContainer) {
    EventBase.call(parent);
    this.events = events;
    this.exeIndex = 0;
}

SeqEvent.prototype = {
    push : function(event) {
        this.events.push(event);
        event.parent = this;
    },
    execute : function() {
        if (this.exeIndex == this.events.length)
            return this.finish();
        return this.events[this.exeIndex].execute();
    },
    finish : function() {
        this.exeIndex += 1;
        if (this.exeIndex == this.events.length) {
            this.exeIndex = 0;
            if (this.parent == null) {
                return null;
            } else
                return this.parent.finish();
        } else 
        return this;            
    }
};