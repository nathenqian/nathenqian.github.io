function CardBase(dict) {
    var keywords = ["name", "damage", "sheild", "cost"];
    var defau = ["null", 0, 0, 0];
    this.data = {}
    for (var i = 0; i < keywords.length; i ++) {
        var v = defau[i]
        if (keywords[i] in dict) {
            v = dict[keywords[i]];
        }
        this.data[keywords[i]] = v;
    }
}

function Card1(damage) {
    dict = {};
    dict["name"] = "砍";
    dict["damage"] = damage;
    dict["cost"] = 1;
    CardBase.call(this, dict);
    // Card1.prototype = Object.create(CardBase.prototype);
}
Card1.prototype = {
    toString : function() {
        return "砍：" + this.data["damage"].toString();
    },
    description : function() {
        return "用力砍人造成" + this.data["damage"].toString() + "伤害";
    },
    canUse : function(myself, teammates, enermys) {
        for (var i = 0; i < enermys.length; i ++)
            if (enermys[i].hp > 0)
                return enermys[i];
        return null;
    },
    influence : function(target) {
        var dmg = this.data["damage"];
        if (target.sheild >= dmg) {
            target.sheild -= dmg;
            dmg = 0;
        } else {
            dmg -= target.sheild;
            target.sheild = 0;
        }

        target.hp = Math.max(0, target.hp - dmg);
        return "from攻击了target 造成" +this.data["damage"] + "伤害" ;
    }
};

function Card2(sheild) {
    dict = {};
    dict["name"] = "盾";
    dict["sheild"] = sheild;
    dict["cost"] = 1;
    CardBase.call(this, dict);
    // Card1.prototype = Object.create(CardBase.prototype);
}
Card2.prototype = {
    toString : function() {
        return "防御：" + this.data["sheild"].toString();
    },
    description : function() {
        return "用力防守" + this.data["damage"].toString() + "格挡";
    },
    canUse : function(myself, teammates, enermys) {
        return myself;
    },
    influence : function(target) {
        target.sheild += this.data["sheild"];
        return "from防御！！";
    }
};
    


