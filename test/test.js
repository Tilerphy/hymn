var entry = require("symphony-task");
var c = new entry.conductor();
var m = new entry.metronome();
var opern = new entry.opern();

opern.setChords([{id:"aaa", nextTime:1483432688077, finished:false},
                 {id:"bbb", nextTime:1483433988077, finished: false},
                 {id:"ccc", nextTime:Date.now()+60000, finished: false}]);
c.setMetronome(m)
    .setOpern(opern);
m.start();
