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

function BattleEvent(parent, gHumans, enermy, gBatlleHuman, imageContainerDraw, streamContainerDraw, succEvent, failEvent) {
    EventBase.call(this, parent);
    this.battle = gBatlleHuman;
    gBatlleHuman["human"] = [];
    gBatlleHuman["enermy"] = [];

    this.turnList = [];
    this.nameReflect = {}
    for (var name in gHumans) {
        var temp = gHumans[name].deepcopy();
        gBatlleHuman["human"].push(temp);
        this.turnList.push({name : name, speed : temp.speed, enermy : false});
        this.nameReflect[name] = temp;
    } 
    for (var i = 0; i < enermy.length; i ++) {
        var temp = enermy[i].deepcopy();
        temp.name += i.toString();
        gBatlleHuman["enermy"].push(temp);
        this.turnList.push({name : temp.name, speed : temp.speed, enermy : true});
        this.nameReflect[temp.name] = temp;
    }

    this.battleDraw = new BattleDraw(imageContainerDraw, streamContainerDraw);

    this.turnList.sort(function(a, b) {
        return -a["speed"] + b["speed"];
    });

    this.succEvent = succEvent;
    this.failEvent = failEvent;
    this.failEvent.parent = this;
    this.succEvent.parent = this;
    // for (var i in (this.turnList))
        // for (var j in this.turnList[i])
            // alert(this.turnList[i][j]);
    this.turn = 0;
}

function BattleEventAllKilled(l) {
    for (var i = 0; i < l.length; i ++)
        if (l[i].hp > 0)
            return 0;
    return 1;
}

BattleEvent.prototype = {
    execute : function() {
        this.battleDraw.update();
        this.turn += 1;
        // alert(this.turn);
        if (this.turn == 1) {
            this.battleDraw.push("start battle!");
            return this;
        }
        else {
            if (BattleEventAllKilled(this.battle["human"])) {
                return this.failEvent.execute();
            } 
            if (BattleEventAllKilled(this.battle["enermy"])) {
                return this.succEvent.execute();
            }

            var turn = (this.turn - 2) % this.turnList.length;
            while (this.nameReflect[this.turnList[turn]["name"]].hp <= 0)
                turn = (turn + 1) % this.turnList.length;

            var obj = this.nameReflect[this.turnList[turn]["name"]];
            var cards = obj.pickCards();
            var mp = obj.mp;
            var teammates = this.battle["human"];
            var enermys = this.battle["enermy"];

            if (this.turnList[turn]["enermy"]) {
                enermys = this.battle["human"];
                teammates = this.battle["enermy"];
            }
            this.battleDraw.push(obj.showname + "开始了行动");
            // for (var i = 0; i < cards.length; i ++)
                // alert(cards[i].description());
            while (mp > 0 && cards.length > 0) {
                var used = 0;
                for (var i = 0; i < cards.length; i ++) {
                    var target = cards[i].canUse(obj, teammates, enermys);
                    if (target != null) {
                        var content = cards[i].influence(target);
                        content = content.replace("from", obj.showname + " ");
                        content = content.replace("target", target.showname + " ");
                        this.battleDraw.push(content);
                        var l = cards[cards.length - 1];
                        cards[cards.length - 1] = cards[i];
                        cards[i] = l;
                        cards.pop();
                        mp -= 1;
                        used = 1;
                        break;
                    }
                }
                if (used == 0) break;
            }
            this.battleDraw.update();
            return this;
        }

        // return this.parent.finish();
    },
    finish : function() {
        return this.parent.finish();
    }
};

function SeqEvent(parent, events) {
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