// 
//  bExt.metrics.js
//  bitly_chrome_extension
//  
//  Created by gregory tomlinson on 2011-05-06.
//  Copyright 2011 the public domain. All rights reserved.
// 

(function(window, undefined){

var settings = {
    box : "#middle",
    canvas : null,
    canvas_elem : null,
    ctx : null,
    width : 800,
    height : 600
}, __lst=[];
// framing.. for animation... hmmm
window.bExt.metrics = {
    /*
        Info
            
            This API is planning to use the new window.webkitRequestAnimationFrame API
                
                This became available in chrome 10
                    https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame#AutoCompatibilityTable
            
            Mozilla docs
                
                https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame
    */
    init : function( opts ) {
        settings=jQuery.extend(true, {}, settings, opts );
        var r_meta = bExt.info.get("realtime") || {},
            popup_history=bExt.info.get("popup_history") || [],
            links, params={
                'hash' : []
            };
            
        console.log("realtime", r_meta);
        console.log("popup", popup_history);
        
        links=r_meta.realtime_links;
        for(var i=0; i<links.length; i++) {
            params.hash.push( links[i].user_hash );
        }

        bExt.api.clicks_by_minute( params, bExt.metrics_evts.clicks_by_minute);

    },
    
    assemble : function() {
        var canvas_id="bitly_metrics_canvas_tag";
        settings.canvas="#"+canvas_id;
        
        $(settings.box).append(fastFrag.create(search_frag() ) )
                       .append( fastFrag.create( canvas_frag( canvas_id ) ) );
                       
        settings.canvas_elem = document.getElementById( canvas_id, settings.width, settings.height );
        settings.ctx = settings.canvas_elem.getContext("2d");    
    },
    
    track_data : function( metrics_meta_obj  ) {
        var m = new bExt.metrics.Meta( metrics_meta_obj  );
        __lst.push( m );
        
        return m;
        
    },
    
    
    request_animation : function() {
        window.webkitRequestAnimationFrame(bExt.metrics.canvas_framerate, settings.canvas_elem);
    },
    
    
    canvas_framerate: function( time_code ) {
        var context=settings.ctx, 
            total_w=settings.width,
            total_h = settings.height;
        console.log("this", this, time_code);
        
        
        context.beginPath();
        // if(i % 7 && i !== paint_graph.length-1) {continue;}
        
        // instructions, an array or methods -- lineTo, moveTo etc
        
        /*
            [{
                name : "lineTo",
                args : [arg1,arg2,arg3]
            }]
            
            context[item.name].apply( context, items.args || [] );
        */
        
        context.clearRect( 0, 0, total_w, total_h  );          
        context.moveTo(50,0);
        context.lineTo(100,300);
        context.lineTo(10,10);
        context.lineTo(10,300);                
        context.closePath()
        context.stroke();        
        // if not complete, recall  bExt.metrics.request_animation();
    }
    
    
}

function search_frag() {
    
    return {
        content : [{
            type : "form",
            content : [{
                type : "input",
                id : "search_links",
                attr : {
                    type : "text",
                    name : "search_links",
                    value : "Search for links"
                }
            }, {
                type : "input",
                attr : {
                    type : "submit",
                    value : "Add to Chart"
                }
            }]
        }]
    }
    
}

function canvas_frag( canvas_id, w, h ) {
    
    return {
        id : "bitly_metrics_canvas_tag_box",
        content : {
            type : "canvas",
            id : canvas_id,
            attrs : {
                width : w,
                height : h
            }
        }
        
    }
}


window.bExt.metrics_evts = {
    
    clicks_by_minute : function( jo ) {
            
            /// I GET THE GLOBAL HASH BACK!!!
            // I CAN NOW CALL AND GET THE DATA FOR THE GLOBAL HASH
            // THEN I CAN CHART THEM AGAINT EACH OTHER
            console.log("clicks by minute", jo);
            var clicks_meta = jo.clicks_by_minute;
            console.log("clicks_meta", clicks_meta)

            
            for(var k in clicks_meta) {
                var meta = bExt.metrics.track_data( clicks_meta[k] );
                console.log(meta)
                
            }
            bExt.metrics.request_animation();             
            

    }
    
}


/*
    Represent the bitly data used to draw the graph
*/
window.bExt.metrics.Meta = function( opts ) {
    this.__m=jQuery.extend(true, {}, this.__m, opts);
    
    return this;
}

window.bExt.metrics.Meta.prototype = {
    
    graph : function( ctx ) {
        // ctx == context for canvas element
    },
    
    points : function() {
        // track the elemt points and their divs
        
    },
    
    pos : 0,
    // the event method and context to use when handling events
    "event_method" : null,
    
    
    __m : {
        clicks : [],
        hash : null,
        user_hash : null
    }
    
}
    
})(window);