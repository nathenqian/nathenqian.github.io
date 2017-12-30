function EventBase(parent) {
    this.parent = parent;
}


EventBase.prototype.pop = function(param) {
    this.reset();
    if (this.parent == null)
        return null;
    return this.parent.finish(param);
}
EventBase.prototype.reset = function() {
}


function StreamContainer(draw, pop, lines = 100) {
    this.draw = draw;
    this.sentences = [];
    this.lines = lines;
    this.pop = pop;
}

 
StreamContainer.prototype.push = function(content) {
    if (this.sentences.length > this.lines) {
        this.sentences.shift();
        this.pop();
    }
    this.sentences.push(content);
    this.draw(content);
}


function ChatEvent(parent, content, streamContainer) {
    EventBase.call(this, parent);
    this.content = content;
    this.container = streamContainer;
}

ChatEvent.prototype = Object.create(EventBase.prototype);
ChatEvent.prototype.constructor = ChatEvent;
ChatEvent.prototype.execute = function() {
    this.container.push(this.content);
    return this.pop();
}

function ExpEvent(parent, gBatlleHuman) {
    EventBase.call(this, parent);
    this.gBatlleHuman = gBatlleHuman;
}

ExpEvent.prototype = Object.create(EventBase.prototype);
ExpEvent.prototype.constructor = ExpEvent;
ExpEvent.prototype.execute = function() {
    // alert(1);
    var totalExp = 0;
    for (var i = 0; i < this.gBatlleHuman["enermy"].length; i ++) {
        totalExp += this.gBatlleHuman["enermy"][i].exp;
    }
    for (var i = 0; i < this.gBatlleHuman["human"].length; i ++) {
        var obj = this.gBatlleHuman["human"][i];
        if (obj.isAlive())
            obj.ref.expGet(totalExp);
        else
            obj.ref.expGet(Math.floor(totalExp / 2));
    }
    return this.pop();
}

function BattleDraw(imageDraw, streamDraw, streamPop) {
    this.imageDraw = imageDraw;
    this.streamDraw = new StreamContainer(streamDraw, streamPop, 10);
}

BattleDraw.prototype.push = function(content) {
    this.streamDraw.push(content);
}
BattleDraw.prototype.update = function() {
    this.imageDraw();
}
function BattleEvent(parent, gHumans, enermy, gBatlleHuman, battleDraw, succEvent, failEvent) {
    EventBase.call(this, parent);
    this.battle = gBatlleHuman;
    this.turn = 0;
    this.resetFunc = function() {
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
        this.turnList.sort(function(a, b) {
            return -a["speed"] + b["speed"];
        });
    }
    this.resetFunc();

    this.battleDraw = battleDraw;
    this.succEvent = succEvent;
    this.failEvent = failEvent;
    this.failEvent.parent = this;
    this.succEvent.parent = this;
    // for (var i in (this.turnList))
        // for (var j in this.turnList[i])
            // alert(this.turnList[i][j]);
}

function BattleEventAllKilled(l) {
    for (var i = 0; i < l.length; i ++)
        if (l[i].hp > 0)
            return 0;
    return 1;
}

BattleEvent.prototype = Object.create(EventBase.prototype);
BattleEvent.prototype.constructor = BattleEvent;

BattleEvent.prototype.execute = function() {
    this.turn += 1;
    // alert(this.turn);
    if (this.turn == 1) {
        this.resetFunc();
        this.battleDraw.update();
        this.battleDraw.push("start battle!");
        return this;
    }
    else {
        this.battleDraw.update();
        if (BattleEventAllKilled(this.battle["human"])) {
            return this.failEvent.execute();
        } 
        if (BattleEventAllKilled(this.battle["enermy"])) {
            this.battleDraw.push("战斗结束!");
            return this.succEvent.execute();
        }

        var turn = (this.turn - 2) % this.turnList.length;
        // alert(this.turnList[turn]["name"]);
        // alert(this.nameReflect[this.turnList[turn]["name"]].hp);
        // alert(this.nameReflect[this.turnList[turn]["name"]].isAlive());
        while (this.nameReflect[this.turnList[turn]["name"]].isAlive() == false) {
            turn = (turn + 1) % this.turnList.length;
            this.turn += 1;
        }
        // alert(turn); alert(this.turn);
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
        // while (mp > 0 && cards.length > 0) {
            // var used = 0;
        for (var i = 0; i < cards.length; i ++) {
            var target = cards[i].canUse(obj, teammates, enermys);
            if (target != null && cards[i].data["cost"] <= mp) {
                var content = cards[i].influence(obj, target);
                content = content.replace("from", obj.showname + " ");
                content = content.replace("target", target.showname + " ");
                this.battleDraw.push(content);
                mp -= cards[i].data["cost"];
            }
        }
        // if (used == 0) break;
        // }
        this.battleDraw.update();
        return this;
    }

    // return this.parent.finish();
}
BattleEvent.prototype.finish = function() {
    this.battleDraw.update();
    return this.pop();
}
BattleEvent.prototype.reset = function() {
    this.resetFunc();
    this.turn = 0;
}

function SeqEvent(parent, events) {
    EventBase.call(parent);
    this.events = events;
    this.exeIndex = 0;
}

SeqEvent.prototype = Object.create(EventBase.prototype);
SeqEvent.prototype.constructor = SeqEvent;
SeqEvent.prototype.push = function(event) {
    if (event instanceof Array) {
        for (var i = 0; i < event.length; i ++) {
            this.events.push(event[i]);
            event[i].parent = this;
        }
    } else {
        this.events.push(event);
        event.parent = this;
    }
}
SeqEvent.prototype.execute = function() {
    console.log("SeqEvent exec");
    if (this.exeIndex == this.events.length)
        return this.finish();
    return this.events[this.exeIndex].execute();
}
SeqEvent.prototype.finish = function() {
    console.log("SeqEvent fin " + this.exeIndex.toString());
    this.exeIndex += 1;
    // alert(this.exeIndex);
    if (this.exeIndex == this.events.length) {
        return this.pop();
    } else 
        return this;            
}
SeqEvent.prototype.reset = function() {
    this.exeIndex = 0;
}

ExprEvent.prototype = Object.create(EventBase.prototype);
ExprEvent.prototype.constructor = ExprEvent;
function ExprEvent(parent, f, params = null) {
    EventBase.call(this, parent);
    this.f = f;
    this.params = params;
}

ExprEvent.prototype.execute = function() {
    return this.pop(this.f.apply(this.params));
}


CondEvent.prototype = Object.create(EventBase.prototype);
CondEvent.prototype.constructor = CondEvent;
function CondEvent(parent, exprEvent, trueEvent, falseEvent) {
    EventBase.call(this, parent);
    this.exprEvent = exprEvent;
    this.exprEvent.parent = this;
    this.trueEvent = trueEvent;
    this.trueEvent.parent = this;
    this.falseEvent = falseEvent;
    this.falseEvent.parent = this;
}


CondEvent.prototype.execute = function() {
    return this.exprEvent.execute();
}
CondEvent.prototype.finish = function(ret) {
    if (ret == true) {
        return this.trueEvent.execute();
    } else 
        return this.falseEvent.execute();
}



function LoopEvent(parent, exprEvent, seqEvent) {
    EventBase.call(this, parent);
    this.exprEvent = exprEvent;
    this.exprEvent.parent = this;
    this.seqEvent = seqEvent;   
    this.seqEvent.parent = this;
    this.condExe = true;
}
LoopEvent.prototype = Object.create(EventBase.prototype);
LoopEvent.prototype.constructor = LoopEvent;

LoopEvent.prototype.execute = function() {
    console.log("loopEvent exec");
    if (this.condExe) {
        this.condExe = false;
        return this.exprEvent.execute();
    }
}
LoopEvent.prototype.reset = function() {
    this.condExe = true;
}
LoopEvent.prototype.finish = function(ret) {
    console.log("loopEvent fin");
    if (ret == undefined) {
        this.condExe = true;
        console.log("loopEvent fin back to cond");
        return this;
    } else {
        // alert(ret);
        console.log("loopEvent fin cond callback " + ret.toString());
        if (ret == true) {
            return this.seqEvent.execute();
        } else {
            this.reset();
            return this.pop();
        }
    }
    
}

function CardGetEvent(parent, cardsList, gHumans) {
    EventBase.call(this, parent);
    this.cardsList = cardsList;
    this.gHumans = gHumans;
}
CardGetEvent.prototype = Object.create(EventBase.prototype);
CardGetEvent.prototype.constructor = CardGetEvent;

CardGetEvent.prototype.execute = function() {
    var redraw = 0;
    for (var name in this.cardsList) {
        var rand = Math.random();
        if (name in this.gHumans) {
            var list = this.cardsList[name];
            var prob = 0.0;
            for (var i = 0; i < list.length; i ++) {
                var card = list[i]["card"];
                prob += list[i]["prob"];
                if (rand < prob) {
                    this.gHumans[name].addUndertermined(Object.create(card));
                    redraw = 1;
                    console.log("  " + name + " get card");
                    break;
                }
            }
        }
    }
    if (redraw) 
        for (var i in this.gHumans)
            {this.gHumans[i].drawHuman(); break;}
    return this.pop();
}

CardGetEvent.prototype.finish = function() {
    return this.pop();
}

var gBtnId = 0;
function BtnClickEvent(parent, events, container) { 
    EventBase.call(this, parent);
    this.clickId = [undefined];
    this.events = events;
    this.container = container;
    this.firstExec = 0;
    for (var i = 0; i < events.length; i ++) {
        this.events[i].parent = this;
    }
} 
BtnClickEvent.prototype = Object.create(EventBase.prototype);
BtnClickEvent.prototype.constructor = BtnClickEvent;

BtnClickEvent.prototype.execute = function() {
    console.log("btn click execute");
    if (this.firstExec == 0) {
        var datas = this.clickId;
        this.firstExec = 1;
        var s = "";
        var idLeft = gBtnId;
        for (var i = 0; i < this.events.length; i ++) {
            s += '<div class="btn btn-default" data-id="'+i.toString()+'" id="btn-click-event-btn' + gBtnId.toString() + '">' + this.events[i]["desc"] + '</div>';
            gBtnId += 1;
        }
        this.container.push(s);
        for (var i = 0; i < this.events.length; i ++) {
            $('#btn-click-event-btn' + (gBtnId - this.events.length + i).toString()).attr("data-id-left", idLeft);
            $('#btn-click-event-btn' + (gBtnId - this.events.length + i).toString()).attr("data-id-right", gBtnId);

            $('#btn-click-event-btn' + (gBtnId - this.events.length + i).toString()).click(function() {
                datas[0] = Number($(this).attr("data-id"));
                var l = Number($(this).attr("data-id-left"));
                var r = Number($(this).attr("data-id-right"));
                $(this).addClass("btn-success");
                for (var i = l; i < r; i ++)
                    $('#btn-click-event-btn' + (i).toString()).unbind("click");
            });
        }
    }
    if (this.clickId[0] != undefined) {
        var id = this.clickId[0];
        return this.events[id]["event"].execute();
    } else
        return this;
};
BtnClickEvent.prototype.finish = function() {
    return this.pop();
};
BtnClickEvent.prototype.reset = function() {
    this.firstExec = 0;
};


function PeopleChangeEvent(parent, gHumans, changeName, opt, human = undefined) {
    EventBase.call(this, parent);
    this.changeName = changeName;
    this.gHumans = gHumans;
    this.opt = opt;
    this.human = human;
}
PeopleChangeEvent.prototype = Object.create(EventBase.prototype);
PeopleChangeEvent.prototype.constructor = PeopleChangeEvent;

PeopleChangeEvent.prototype.execute = function() {
    
    if (this.opt == 0) {
        if (this.changeName in this.gHumans) {
            delete this.gHumans[this.changeName];
        }
    } else {
        if (!(this.changeName in this.gHumans)) {
            this.gHumans[this.changeName] = Object.create(this.human);
        }
    }

    this.human.drawHuman();
    return this.pop();
};

