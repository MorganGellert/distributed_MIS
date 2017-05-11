'use strict';

 window.site2 = {};

var greuler = window.greuler;

var instance2 = greuler({
    target: '#ghaffari',
    height: 500,
    animationTime: 800,
    data: greuler.Graph.random({order : 15, size : 25, connected: true })
}).update();

var desire_level = [];
var in_mis = [];
var not_in_mis = [];
instance2.graph.nodes.forEach(function (element) {
    desire_level[element.id] = 0.5;
    in_mis[element.id] = false;
    element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
});

function float_to_color (x) {
    return '#2980' + Number(parseInt(x * 255 * 2 , 10)).toString(16);
}

window.site2.run_ghaffari = function () {
    var player = window.site.generator = new greuler.player.Generator(instance2);
    player.run(function *algorithm(instance2) {
        var prev_in_mis = Array.from(in_mis);
        var prev_not_in_mis = Array.from(not_in_mis);

        // Calculate Effective Degree
        var effective_degree = [];
        yield function () {
            instance2.graph.getNodesByFn(function(n) {return !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function(element) {
                effective_degree[element.id] = 0
                instance2.graph.getAdjacentNodes(element).forEach(function (element) {
                    if(!prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                        effective_degree[this.id] += desire_level[element.id]
                    }
                }, element);
                element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
                element.topRightLabel = parseFloat(effective_degree[element.id]).toFixed(4);
                instance2.selector.highlightNode(element);
            });
            // instance2.update({ skipLayout: true });
        };
        // update Desire Levels
        yield function () {
            instance2.graph.getNodesByFn(function(n) {return !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function(element) {
                if (effective_degree[element.id] >= 2) {
                    desire_level[element.id] *= 0.5
                } else {
                    desire_level[element.id] = Math.min(2 * desire_level[element.id], 0.5)
                }
                element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
                instance2.selector.getNode(element)
                                    .transition()
                                    .attr('fill', float_to_color(desire_level[element.id]));
            });
            instance2.update({ skipLayout: true });
        };

        // Mark Nodes with probability desire_level
        var marked = [];
        var neighbor_marked = [];
        yield function () {
            instance2.graph.getNodesByFn(function(n) {return !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function(element) {
                marked[element.id] = (Math.random() < desire_level[element.id])
                if (marked[element.id]) {
                    instance2.selector.highlightNode(element);
                    instance2.selector.getNode(element)
                                        .transition()
                                        .attr('fill', 'green');
                    // identify neighbors
                    instance2.graph.getAdjacentNodes(element).forEach(function(element) {
                        if(!prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                            neighbor_marked[element.id] = true;
                        }
                    });
                }
            });
        };

        // Calculate nodes added to the Maximal Independent Set
        var adjacent_to_mis = [];
        yield function () {
            instance2.graph.getNodesByFn(function(n) {return !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function(element) {
                in_mis[element.id] = !neighbor_marked[element.id] && marked[element.id];
            });
        };

        // visualize neighbors getting marked
        
        yield function () {
            instance2.graph.getNodesByFn(function(n) {return in_mis[n.id] && !prev_in_mis[n.id] && !prev_not_in_mis[n.id]}).forEach(function(element) {
                // instance2.selector.highlightNode(element);
                instance2.selector.getNode(element)
                                    .transition()
                                    .attr('fill', 'red');

                instance2.graph.getAdjacentNodes(element).forEach(function (element) {
                    if (!prev_in_mis[element.id] && !prev_not_in_mis[element.id]) {
                        instance2.selector.getNode(element)
                                        .transition()
                                        .attr('fill', 'black');
                        not_in_mis[element.id] = true;
                        instance2.selector.traverseAllEdgesBetween({source : this.id, target : element.id});
                    }
                }, element);
            });
            instance2.update({ skipLayout: true });
        }

        // Color and remove nodes adjacent to those in the MIS
        yield function () {
            // instance2.graph.removeNodesByFn(function(node) {
            //     return adjacent_to_mis[node.id]
            // });
            instance2.graph.getNodesByFn(function(n) {return !in_mis[n.id] && !not_in_mis[n.id]}).forEach(function(element) {
                instance2.selector.getNode(element)
                                    .transition()
                                    .attr('fill', float_to_color(desire_level[element.id]));
            });
            instance2.update({ skipLayout: true });
        }
    });
};


window.site2.reset_ghaffari = function () {
    instance2 = greuler({
        target: '#ghaffari',
        height: 500,
        animationTime: 800,
        data: greuler.Graph.random({order : 15, size : 25, connected: true })
    }).update();
    in_mis = [];
    not_in_mis = [];
    instance2.graph.nodes.forEach(function (element) {
        desire_level[element.id] = 0.5;
        in_mis[element.id] = false;
        element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
    });
    instance2.update({ skipLayout: true });
};


window.site2.k6_ghaffari = function () {
    instance2 = greuler({
        target: '#ghaffari',
        height: 500,
        animationTime: 800,
        data: greuler.Graph.random({order : 6, size : 15, connected: true })
    }).update();
    in_mis = [];
    not_in_mis = [];
    instance2.graph.nodes.forEach(function (element) {
        desire_level[element.id] = 0.5;
        in_mis[element.id] = false;
        element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
    });
    instance2.update({ skipLayout: true });
}