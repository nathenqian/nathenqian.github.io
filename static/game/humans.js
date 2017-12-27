function Human(name, showname = "", exp = 0, hp = 40, mp = 3, pow = 0, dex = 0, speed = 10, eachTurnCards = 2, sheild = 0) {
    this.cards = [];
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
    if (name == "me") {
        this.cards.push(new Card1(5), new Card2(5));
        this.speed = 20;
    } else {
        this.cards.push(new Card1(2), new Card2(2));
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
        var ret = new Human(this.name, this.showname, this.exp, this.hp, this.mp, this.pow, this.dex, this.speed, this.eachTurnCards, this.sheild);
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
    }
};