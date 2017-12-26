function Human(name, showname = "", exp = 0, hp = 40, mp = 3, pow = 0, dex = 0, speed = 10) {
    this.cards = [];
    this.name = name;
    this.exp = exp;
    this.hp = hp;
    this.mp = mp;
    this.pow = pow;
    this.dex = dex;
    this.speed = speed;
    this.showname = showname;   
    if (name == "me") {
        this.cards.push(new Card1(5), new Card2(5));
        this.speed = 20;
    } else {
        this.cards.push(new Card1(5), new Card2(0));
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
        var ret = new Human(this.name, this.showname, this.exp, this.hp, this.mp, this.pow, this.dex, this.speed);
        return ret;
    },
    showName : function() {
        return utilStringCenter(this.showname, 8);
        // if (name == "man") return utilStringCenter(this.showname, 8);
        // if (name == "gf") return utilStringCenter(this.showname, 8);
    }
};