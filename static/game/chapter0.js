function chapter0GStates(gHumans, gFocus, gContentStreamContainer, gBattleDraw, gBatlleHuman) {
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
    var drawHuman;
    for (var i in gHumans)
        drawHuman = gHumans[i].drawHuman;
    // var SLIM = new Human(draw, "", "史莱姆同志", exp = 2, hp = 40, mp = 3, pow = 0, dex = 0, speed = 10, eachTurnCards = 2, sheild = 0);

    var SLIM = new Human(drawHuman, "slim", "史莱姆同志", 2, 40, 2, 0, 0, 5, 2, 0, [new Card1(3)]);


    var seqEvent = new SeqEvent(null, []);
    seqEvent.push(newChatEvents("炎炎夏日，你漫无目的的走在新手村的野外。|忽然你发现前面似乎有一个女孩子被史莱姆缠上了。|陌生的神官加入了队伍。"));
    seqEvent.push(new PeopleChangeEvent(null, gHumans, "gf", 1, new Human(
        drawHuman, "gf", "陌生的神官")));

    // var seqEvent2 = new SeqEvent(null, []);
    var cardGetEvent = new CardGetEvent(null, {me : [{prob:0.5, card:new Card1(100)}]}, gHumans); 
    seqEvent.push(newBattleEvent([SLIM, SLIM], cardGetEvent, cardGetEvent));
    seqEvent.push(newChatEvents("好不容易你们击败了史莱姆同志，你忙上去询问神官的情况。"));

    return seqEvent;
}
