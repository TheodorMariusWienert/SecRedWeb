var sampleJSon= {

    "Channels":[    {"name":"Number1"},
                    {"name":"Number2"},
                    {"name":"Number3"}]
}
$(document).ready(function () {
    console.log(sampleJSon);
    printChannels();

})

function printChannels() {
    console.log("printChannelsFunct");

    let channelarr=sampleJSon.Channels;
    console.log(channelarr);
    for (let i in channelarr)
    {
        console.log(channelarr[i].name)
            let channel = new Channel(channelarr[i].name);
            $("#channelContainer").append(channel.$element);
    }



}
let Channel = function(name){

    this.name=name;
    console.log("Name of chanell"+this.name);

    this.generateEl = function(){
        var that = this;
        this.$element = $('<li>'+this.name+'</li>');
        this.$element.on('click', function(){
           console.log("Cick on " +name);
        });


    };


    this.
    generateEl();
};


