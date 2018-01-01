
function Human(contentContainer, drawHuman, name, showname = "", cards = undefined, exp = 0, hp = 40, mp = 3, pow = 0, dex = 0, speed = 10, eachTurnCards = 2, sheild = 0, level = 1) {
    this.cards = [];
    this.undeterminedCards = [];
    this.name = name;
    this.exp = exp;
    this.hp = hp;
    this.mp = mp;
    this.pow = pow;
    this.dex = dex;
    this.speed = speed;
    this.showname = showname;   
    this.sheild = sheild;
    this.eachTurnCards = eachTurnCards;
    this.ref = this;
    this.drawHuman = drawHuman;
    this.level = level;
    this.contentContainer = contentContainer;

    if (cards != undefined) {
        this.cards = [];
        for (var i = 0; i < cards.length; i ++) {
            this.cards.push(Object.create(cards[i]));
        }
    } else 
    if (name == "me") {
        this.cards.push(new Card1(5), new Card1(5), new Card2(3));
        // this.undeterminedCards.push(new Card1(100), new Card2(20));
        this.speed = 10;
    }

    if (name in expFuncs) {
        this.expFunc = expFuncs[name];
        this.expFunc.execute(this);
    }
}

function utilStringCenter(str, width) {
    var ret = str;
    for (var i = 0; i < (width - str.length) / 2; i ++)
        ret = "&nbsp" + ret + "&nbsp";
    return ret;
}

Human.prototype = {
    deepcopy : function () {
        // var ret = new Human(this.name, this.showname, this.exp, this.hp, this.mp, this.pow, this.dex, this.speed, this.eachTurnCards, this.sheild);
        // ret.ref = this.ref;
        var ret = Object.create(this);
        return ret;
    },
    showName : function() {
        return utilStringCenter(this.showname, 8);
        // if (name == "man") return utilStringCenter(this.showname, 8);
        // if (name == "gf") return utilStringCenter(this.showname, 8);
    },
    pickCards : function() {
        var cards = [];
        var ids = [];
        for (var i = 0; i < Math.min(this.eachTurnCards, this.cards.length); i ++) {
            var id = Math.floor(Math.random() * this.cards.length);
            while (ids.some(function(element, index, array) {
                return element == id;
            })) {
                id = Math.floor(Math.random() * this.cards.length);
            }

            ids.push(id);
            cards.push(this.cards[id]);
            // alert(id);
            // alert(this.cards[id].description());
        }
        return cards;
    },
    expGet : function (exps) {
        this.exp += exps;
        this.expFunc.execute(this);
    },
    isAlive : function() {
        return this.hp > 0;
    },
    addUndertermined : function(card) {
        // alert(card.toString());
        this.undeterminedCards.push(card);
        this.drawHuman();
    },
    discardCard : function(id, own = false) {
        var cards = this.undeterminedCards;
        if (own == true) {
            cards = this.cards;
            // alert("wrong");
        }
        // alert(cards.length);
        // alert(id);
        // alert(cards[id]);
        var temp = cards[cards.length - 1];
        cards[cards.length - 1] = cards[id];
        cards[id] = temp;
        //alert(cards[])
        cards.pop();
        this.drawHuman();
    },
    acceptCard : function(id) {
        this.cards.push(this.undeterminedCards[id]);
        // alert(this.undeterminedCards[id].description());
        this.discardCard(id);
        this.drawHuman();
    }
};

function ExpBase() {

}

ExpBase.prototype.nextExp = function(human) {
    
};

ExpBase.prototype.execute = function(human) {
    while (1 == 1) {
        var lv = human.level;
        var exp = human.exp;
        var nextExp = this.nextExp(human);    
        // alert(nextExp);
        console.log(lv);
        console.log(exp);
        console.log(nextExp);
        if (exp >= nextExp) {
            human.level += 1;
            human.exp -= nextExp;
            this.trigger(human);
        } else 
            break;
    }
    human.drawHuman(false, true);
    human.nextExp = this.nextExp(human);
};

ExpBase.prototype.trigger = function(human) {

};


function MeExp() {
    ExpBase.call(this);
}

MeExp.prototype = Object.create(ExpBase.prototype);
MeExp.prototype.constructor = MeExp;
MeExp.prototype.nextExp = function(human) {
    return human.level * 10;
};
MeExp.prototype.trigger = function(human) {
    // alert(human.level);
};


function GfExp() {
    ExpBase.call(this);
}

GfExp.prototype = Object.create(ExpBase.prototype);
GfExp.prototype.constructor = GfExp;
GfExp.prototype.nextExp = function(human) {
    return human.level * 10;
};
GfExp.prototype.trigger = function(human) {
    // alert(human.level);
};

var expFuncs = {
    "me" : new MeExp(),
    "gf" : new GfExp()
};