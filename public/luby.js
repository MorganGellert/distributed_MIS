'use strict';

var site = window.site = {};

var greuler = window.greuler;

var instance = greuler({
    target: '#luby',
    height: 500,
    animationTime: 800,
    data: greuler.Graph.random({ connected: true })
}).update();

window.site.run = function () {
    var player = window.site.generator = new greuler.player.Generator(instance);
    player.run(function *algorithm(instance) {
        
        // give all nodes a random value between 0 and 1
        var node_vals = [];
        yield function () {
            instance.graph.nodes.forEach(function (element) {
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
            instance.graph.nodes.forEach(function (element) {
                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    if (node_vals[element.id] <= node_vals[this.id]) {
                        not_marked[this.id] = true;
                    }
                }, element);


                if (!not_marked[element.id]) {
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

        // visualize neighbors getting marked
        yield function () {
            instance.graph.getNodesByFn(function(n) {return neighbor_marked[n.id]}).forEach(function(element) {
                instance.selector.highlightNode(element);
                instance.selector.getNode(element)
                                    .transition()
                                    .attr('fill', 'black');

                instance.graph.getAdjacentNodes(element).forEach(function (element) {
                    console.log("hi");
                    if (!not_marked[element.id]) {
                        instance.selector.traverseAllEdgesBetween({source : element.id, target : this.id});
                    }
                }, element);
            });
        }

        // die nodes die
        yield function () {
            instance.graph.removeNodesByFn(function(node) {
                return !not_marked[node.id] || neighbor_marked[node.id];
            });
            instance.update({ skipLayout: true });
        }
    });
}