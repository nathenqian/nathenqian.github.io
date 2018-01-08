function chapter0GStates(gHumans, gFocus, gContentStreamContainer, gBattleDraw, gBatlleHuman, gMaps) {
    function newChatEvent(content) {
        return new ChatEvent(null, content, gContentStreamContainer);
    }
    function newChatEvents(sentences) {
        var l = sentences.split("|");
        var ret = [];
        for (var i = 0; i < l.length; i ++)
            ret.push(newChatEvent(l[i]));
        return ret;
    }
    function newBattleEvent(enermy, succEvent, failEvent) {
        return new BattleEvent(null, gHumans, enermy, gBatlleHuman, gBattleDraw, succEvent, failEvent);
    }

    function newHuman(name, realName, cards, exp, hp, mp, pow, dex, speed, eachTurnCards, sheild, level) {
        // exp, hp, mp, pow, dex, speed, eachTurnCards, sheild, level
        return new Human(
        gContentStreamContainer, drawHuman, name, realName, cards, exp, hp, mp, pow, dex, speed, eachTurnCards, sheild, level);
    }
    function newLocationAddEvent(loc) {
        return new LocationAddEvent(null, gMaps, loc)
    }
    function newLocationMoveEvent(loc) {
        return new LocationMoveEvent(null, gFocus, gMaps, loc);
    }
    var drawHuman;
    for (var i in gHumans)
        drawHuman = gHumans[i].drawHuman;
    


    

    var SLIM = newHuman("slim", "史莱姆同志", [new Card1(3)], 2, 40, 2, 0, 0, 5, 2, 0);


    var seqEvent = new SeqEvent(null, []);
    seqEvent.push(newChatEvents("你漫无目的的走在新手村的野外。|忽然你发现前面有一个女孩子被史莱姆缠上了。|陌生的神官加入了队伍。"));
    seqEvent.push(new PeopleChangeEvent(null, gHumans, "gf", 1, newHuman("gf", "陌生的神官", [new Card2(5)], 0, 40, 3, 0, 0, 10, 2, 0, 1)));

    // var seqEvent2 = new SeqEvent(null, []);
    var cardGetEvent = new CardGetEvent(null, {me : [{prob:0.1, card:new Card1(8)}]}, gHumans); 
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newChatEvents("好不容易击败了史莱姆同志，你忙上去询问神官的情况。|陌生的神官向你表达了感谢。\
        |陌生的神官说她正想前往不远的中关村，想问问你能否一起前行。|你在新手村呆了很久，就同意了这个要求。|两人\
        开始向中关村前进。"));

    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newChatEvents("路上遇见了大量的史莱姆。|虽然对于你而言这并不算什么大事情。|但是对于神官来讲，没有\
        攻击技能的神官对于怪物都感到了头疼。"));
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newChatEvents("时间临近中午，你和神官依然在前往中关村的路上。|你和神官不停尬聊当中。"));
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newChatEvents("你打听着神官为什么会前往中关村。|神官说她想要见见一个人，这个人。"));
    
    seqEvent.push(newLocationAddEvent({city:"北京",spot:"中关村"}));
    
    seqEvent.push(newLocationMoveEvent({city:"北京",spot:"中关村"}));



    return seqEvent;
}
