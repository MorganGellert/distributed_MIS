'use strict';

var site = window.site = {};

var greuler = window.greuler;

var instance = greuler({
    target: '#luby',
    height: 500,
    animationTime: 800,
    data: greuler.Graph.random({order : 15, size : 25, connected: true })
}).update();


var in_mis = [];
var not_in_mis = [];


window.site.run = function () {
    var player = window.site.generator = new greuler.player.Generator(instance);
    player.run(function *algorithm(instance) {
        
        var prev_in_mis = Array.from(in_mis);
        var prev_not_in_mis = Array.from(not_in_mis);

        // give all nodes a random value between 0 and 1
        var node_vals = [];
        yield function () {
            instance.graph.getNodesByFn(function (n) {return !prev_in_mis[n.id] && !not_in_mis[n.id]}).forEach(function (element) {
                node_vals[element.id] = Math.random();
                element.topRightLabel = parseFloat(node_vals[element.id]).toFixed(2);
                instance.selector.highlightNode(element);
            });
            instance.update({ skipLayout: true });
        };

        // identify and mark local minima
        var not_marked = [];
        var neighbor_marked = [];
        yield function () {
            instance.graph.getNodesByFn(function (n) {return !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function (element) {
                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    if (!prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                        if (node_vals[element.id] <= node_vals[this.id]) {
                            not_marked[this.id] = true;
                        }
                    }
                }, element);


                if (!not_marked[element.id]) {
                    in_mis[element.id] = true;
                    instance.selector.highlightNode(element);
                    instance.selector.getNode(element)
                                        .transition()
                                        .attr('fill', 'red');
                    // identify neighbors
                    instance.graph.getAdjacentNodes(element).forEach(function(element) {
                        if(!prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                            neighbor_marked[element.id] = true;
                            not_in_mis[element.id] = true;
                        }
                    });
                }
            });
        };

        // visualize neighbors getting marked
        yield function () {
            instance.graph.getNodesByFn(function(n) {return neighbor_marked[n.id]}).forEach(function(element) {
                instance.selector.highlightNode(element);
                instance.selector.getNode(element)
                                    .transition()
                                    .attr('fill', 'black');

                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    if (!not_marked[element.id] && !prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                        instance.selector.traverseAllEdgesBetween({source : element.id, target : this.id});
                    }
                }, element);
            });
        }
    });
};


window.site.reset = function () {
    instance = greuler({
        target: '#luby',
        height: 500,
        animationTime: 800,
        data: greuler.Graph.random({order : 15, size : 25, connected: true })
    }).update();
    in_mis = [];
    not_in_mis = [];
};

window.site.k6_luby = function () {
    instance = greuler({
        target: '#luby',
        height: 500,
        animationTime: 800,
        data: greuler.Graph.random({order : 6, size : 15, connected: true })
    }).update();
    in_mis = [];
    not_in_mis = [];
}