'use strict';

var site = window.site = {};

var greuler = window.greuler;

var instance = greuler({
    target: '#ghaffari',
    height: 500,
    animationTime: 800,
    data: greuler.Graph.random({order : 15, size : 25, connected: true })
}).update();

var desire_level = [];
instance.graph.nodes.forEach(function (element) {
    desire_level[element.id] = 1.0;
});

window.site.run = function () {
    var player = window.site.generator = new greuler.player.Generator(instance);
    player.run(function *algorithm(instance) {
        // Calculate Effective Degree
        var effective_degree = [];
        yield function () {
            instance.graph.nodes.forEach(function (element) {
                instance.selector.getNode(element)
                                    .transition()
                                    .attr('fill', '#2980B9');
                effective_degree[element.id] = 0
                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    effective_degree[this.id] += desire_level[element.id]
                }, element);
                element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
                element.topRightLabel = parseFloat(effective_degree[element.id]).toFixed(4);
                //instance.selector.highlightNode(element);
            });
            instance.update({ skipLayout: true });
        };
        // update Desire Levels
        yield function () {
            instance.graph.nodes.forEach(function (element) {
                if (effective_degree[element.id] >= 2) {
                    desire_level[element.id] *= 0.5
                } else {
                    desire_level[element.id] = Math.min(2 * desire_level[element.id], 0.5)
                }
                element.topLeftLabel = parseFloat(desire_level[element.id]).toFixed(4);
            });
            instance.update({ skipLayout: true });
        };

        // Mark Nodes with probability desire_level
        var marked = [];
        var neighbor_marked = [];
        yield function () {
            instance.graph.nodes.forEach(function (element) {
                marked[element.id] = (Math.random() < desire_level[element.id])
                if (marked[element.id]) {
                    instance.selector.highlightNode(element);
                    instance.selector.getNode(element)
                                        .transition()
                                        .attr('fill', 'red');
                    // identify neighbors
                    instance.graph.getAdjacentNodes(element).forEach(function(element) {
                        neighbor_marked[element.id] = true;
                    });
                }
            });
        };

        // Calculate nodes added to the Maximal Independent Set
        var in_mis = [];
        var adjacent_to_mis = [];
        yield function () {
            instance.graph.nodes.forEach(function (element) {
                in_mis[element.id] = !neighbor_marked[element.id] && marked[element.id];
            });
        };

        // visualize neighbors getting marked
        
        yield function () {
            instance.graph.getNodesByFn(function(n) {return in_mis[n.id]}).forEach(function(element) {
                instance.selector.highlightNode(element);
                instance.selector.getNode(element)
                                    .transition()
                                    .attr('fill', 'black');

                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    adjacent_to_mis[element.id] = true
                    instance.selector.traverseAllEdgesBetween({source : element.id, target : this.id});
                }, element);
            });
            instance.update({ skipLayout: true });
        }

        // Color and remove nodes adjacent to those in the MIS
        yield function () {
            instance.graph.removeNodesByFn(function(node) {
                return in_mis[node.id] || adjacent_to_mis[node.id]
            });
            instance.graph.nodes.forEach(function (element) {
                instance.selector.getNode(element)
                                    .transition()
                                    .attr('fill', '#2980B9');
            });
            instance.update({ skipLayout: true });
        }
    });
};


window.site.reset = function () {
    instance = greuler({
        target: '#ghaffari',
        height: 500,
        animationTime: 800,
        data: greuler.Graph.random({order : 15, size : 25, connected: true })
    }).update();
    instance.graph.nodes.forEach(function (element) {
        desire_level[element.id] = 1.0;
    });
};
