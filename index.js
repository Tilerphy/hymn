var CONFIG={
    //duration is alway one day.
    //millionseconds.
    duration : 86400000,
    //check per 30 seconds;
    rhythm : 30000,
    beat: 3000
};

var SESSION = {
    currentPoint : 0,
    nextPoint : 0,
};

function checkPoint(startTime) {
            var now = Date.now();
            var point = CONFIG.rhythm * parseInt((now - startTime)/CONFIG.rhythm);
            SESSION.currentPoint = point;
            SESSION.nextPoint = point + CONFIG.rhythm;
            return [point, now];
}

var conductor = function(){
   

    ///get the floor
    this.reset = ()=>{
        this.startPoint = parseInt(Date.now()/CONFIG.duration);
        this.startTime = this.startPoint * CONFIG.duration;
    };
    
    //init point
    this.reset();
    checkPoint(this.startTime);
    this.setMetronome = (metronome)=>{
        
        this.metronome = metronome;
        this.metronome.on("step", ()=>{
            
            var current = checkPoint(this.startTime);
            var point = current[0];
            if (point == CONFIG.duration) {
                this.reset();
            }
            console.log(`point is : ${point}, opern: ${Object.keys(this.opern.chords)}`);
            if (this.opern.chords) {
                var chords = this.opern.chords;
                var result = [];
                var keys = Object.keys(chords);

                if (chords[point]) {
                    this.chordsPoped(chords[point]);
                    for (var chord of chords[point]) {
                        chord.finished = true;
                    }
                }
            }else{
                //IGNORE
                console.log(`step next. but no opern is set.`);
            }
        });
        return this;
    };
    
    this.setOpern=(opern)=>{
        this.opern = opern;
        this.opern.startTime = this.startTime;
        this.opern.transform();
        return this;
    };
    
    //this.metronome.on("taskPoped", ()=>{});
    //this.setWorker =  (worker) => {
    //            this.worker = worker;
    //            return this;
    //};
    this.chordsPoped = (chords)=> {
            //TODO: can be changed by user
            for(var chord of chords){
                console.log(`${chord.id}'s state: ${chord.finished}`);
            }
        };
    
};

///chord only need two propreties named "nextTime" and "id"
///[{id:"aaa", nextTime:"10000", finished: true}]
var opern = function(startTime){
    this.chords = {};
    this.originChords = {};
    this.startTime = startTime;
    this.setChords = (chords)=>{
        this.originChords = chords;
    };
    this.transform = ()=>{
        for(var chord of this.originChords){
            
            var point = CONFIG.rhythm * parseInt((chord.nextTime - this.startTime)/CONFIG.rhythm);
            console.log(this.startTime+" "+point);
            point = point > 0 ? point : SESSION.nextPoint;
            if (point < CONFIG.duration) {
              
                if( this.chords[point] == null){
                     this.chords[point]= [];
                      this.chords[point][0] = chord;
                }else{
                   
                     this.chords[point][this.chords[point].length] = chord;
                }
                
            }else{
                //IGNORE
                console.log(`{chord.id} is no in time, ignore it.`);
            }
        }
        
        return this;
    };
    
    
       
    
};

var metronome = function(){
    this.handlers = {};
    this.on = (key, func)=>{
        if (func) {
            var handler = this.handlers[key];
            if (handler) {
                handler[handler.length] = func;
            }
            else{
                this.handlers[key] = [func];
            }
        }
    }
    
    this.start = ()=> {
        this._timer = setInterval(()=>{
                this.trigger("step");
            }, CONFIG.beat);
    }
    
    this.stop = () =>
    {
        clearInterval(this._timer);
    }
    
    this.trigger= (key) =>{
        if (this.handlers && this.handlers[key]) {
            for(var func of this.handlers[key]){
                func();
            }
        }
    }
};


module.exports.conductor = conductor;
module.exports.metronome = metronome;
module.exports.opern = opern;
module.exports.session = SESSION;
