.. distributed_MIS documentation master file, created by
   sphinx-quickstart on Mon May  8 13:25:57 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==========================================================
Algorithms for Distributed Maximal Independent Set
==========================================================
  By Morgan Gellert and Alex Tong


The Problem
-----------

A maximal independent set is a subset :math:`H` of a graph :math:`G` which has no nodes that connect to each other. Additionally, there are no elements in :math:`G - H` that could be added to :math:`H` that would not violate this requirement.


Lubys Algorithm
---------------

Visualization
+++++++++++++

.. raw:: html 

    <embed>

  <script src="_static/d3.v3.min.js"></script>
  <script src="_static/cola.v3.js"></script>
  <script src="_static/greuler.min.js"></script>
  <div id="luby_demo"><div id="luby"></div></div>
  <script src=_static/luby.js>  </script>
  <script>
  myrun = function() {
    window.site.run();
  }
  reset_luby = function() {
    var parent = document.getElementById("luby_demo");
    var child =  document.getElementById("luby");
    parent.removeChild(child);
    var new_child = document.createElement("div");
    new_child.id = "luby";
    parent.appendChild(new_child);
    window.site.reset();
  }
  </script>

  <button onclick="myrun()"> One Luby Iteration</button>
  <button onclick="reset_luby()"> Reset Graph </button>
  </embed>


The number associated with each node is simply a random value between 0 and 1. Nodes that will be added to the Maximal Independent Set is marked red. It's neighbors are marked black just before being removed from the graph.

The Algorithm
+++++++++++++

Luby's Algorithm presents a :math:`O(log(|V|))` algorithm from computing a Maximal Independent Set. While it is true that each node finishes with high probability in :math:`O(log \Delta)` where :math:`\Delta` is its degree, it has been notoriously difficult to improve the global time complexity.

The algorithm is incredibly simple: in each round each node is marked with a number between 0 and 1. Local minima are added to the Maximal Independent Set and their neighbors are removed from the graph. [Luby]_


Time Complexity
++++++++++++++++

1. For each edge :math:`(u,v)` replace it with two directed edges :math:`(u \rightarrow v)` and :math:`(v \rightarrow u)`. Note that :math:`|E|` is now twice as large. Define the event :math:`u \rightarrow v` to be the case that :math:`u` removes :math:`v` by becoming part of the Maximal Independent Set and is the smallest neighbor of :math:`v` and vice versa. 

2. The probability of :math:`v` being removed is :math:`\frac{1}{d(v) + d(u)}`. This is because the random number generated for :math:`v` has probability :math:`\frac{1}{d(v)}` of being the smallest, but the neighbors of :math:`w` must also be counted because they could also be neighbors of :math:`v`. The probability that :math:`w` is removed is the same.

3. The expected value of the number of edges removed for the event :math:`v \rightarrow u` is :math:`\frac{d(v)}{d(v) + d(u)}` because when :math:`v` is removed :math:`d(v)` edges are removed. :math:`\frac{d(u)}{d(v) + d(u)}` edges are removed for the event :math:`u \rightarrow v` for the same reasoning. The expected number of edges removed due to one of :math:`v` or :math:`u` being the smallest value in its neighborhood is therefore :math:`\frac{d(v)}{d(v) + d(u)} + \frac{d(u)}{d(v) + d(u)} = 1`.

4. Summing over all edges gives :math:`\sum_E 1 = |E|` edges being removed at every step. But because each edge is counted twice in this new definition, :math:`\frac{|E|}{2}` are removed in expectation instead.


Ghaffari's Algorithm
--------------------

Visualization
+++++++++++++

.. raw:: html

    <embed>
      <script src="_static/d3.v3.min.js"></script>
      <script src="_static/cola.v3.js"></script>
      <script src="_static/greuler.min.js"></script>
      <div id="ghaffari_demo"><div id="ghaffari"></div></div>
      <script src=_static/ghaffari.js>  </script>
      <script>
      myrun2 = function() {
        window.site2.run_ghaffari();
      }
      reset_ghaffari = function() {
        var parent = document.getElementById("ghaffari_demo");
        var child =  document.getElementById("ghaffari");
        parent.removeChild(child);
        var new_child = document.createElement("div");
        new_child.id = "ghaffari";
        parent.appendChild(new_child);
        window.site2.reset_ghaffari();
      }
      </script>

      <button onclick="myrun2()"> One Ghaffari Iteration</button>
      <button onclick="reset_ghaffari()"> Reset Graph </button>
    </embed>

Each node has two numbers associated with it on the left we have the *desire-level* of the node and on the right we have the *effective-degree* of that node. Each node is colored a shade of blue according to its probability of being marked in the next round. All nodes are turned green (marked) with probability equal to their *desire-level*. Then any marked green node that has no green neighbors is marked red as belonging to the Maximal Independent Set, and its neighbors are removed.


The Algorithm
+++++++++++++

Ghaffari's Algorithm presents an algorithm that completes with high probability in 
:math:`O(log \Delta) + 2 ^ {O \sqrt{log log n}}` time where :math:`\Delta` is maximum degree. 
This improved the previous results of :math:`O(log ^ 2 \Delta) + 2 ^ {O \sqrt{log log n}}` by Barenboim et al [Barenboim]_.


In each round *t*, each node *v* has a *desire-level* :math:`p_t(v)` for joining MIS, which initially is set to :math:`p_1(v) = \frac{1}{2}`. We call total sum of the desire-levels of neighbors of *v* it's *effective-degree* :math:`d_t(v)`, i.e., :math:`d_t(v) = \sum_{u \in N(v)} p_t(u)`. The desire-levels change over time as follows:

.. math::
    :label: ghaffari

    p_{t+1}(v) = 
    \begin{cases}
    p_t(v) / 2, & \text{ if } d_t(v) \ge 2 \\ 
    min\{2p_t(v), 1/2\} & \text{ if } d_t(v) < 2.
    \end{cases}

The desire-levels are used as follows: In each round, node *v* gets *marked* with probability :math:`p_t(v)` and if no neighbor of *v* is marked, *v* joins the MIS and gets removed along with its neighbors [Ghaffari]_.

The Intuition
+++++++++++++

1. A node will are likely two be marked in one of two cases:

    a. The node has a high *desire-level* and all of its neighbors have low *desire-level*. 
    b. The node has a low *desire-level* and one of its neighbors have high *desire-level*
   
  In case a, the node is likely to join the MIS in the next round, in case b, one of the node's neighbors is likely to join the MIS and remove the node along with it. This can also be expressed as when a nodes *desire-level* and its *effective-degree* are very different the node is likely to be removed.

2. The update formula for :math:`p_{t+1}(v)` drives *desire-level* and *effective-degree* of a node apart. When the *desire-level* is high :math:`p_t(v)` gets lower, and when *desire-level* is low :math:`p_t(v)` gets highter. 

3. If we perform local analysis, i.e. analyze time complexity in terms of the degree of each node :math:`\Delta` instead of in terms of :math:`n` then this leads to a tighter upper bound on time complexity in problems which are very separable. For the distributed MIS problem we only need to consider neighbors at distance less than or equal to 2 to find the probability of a specific node *v* being removed at a timestep. We can exploit this local property to get a time complexity in terms of :math:`\Delta`.

Time Complexity Sketch Proof
++++++++++++++++++++++++++++

The full proof can be found in [Ghaffari]_'s paper. Here we will provide a short summary of the proof. 

1. Let :math:`G = (V,E)`, for all :math:`v \in V` the probability that v still exists after :math:`O(log(deg) + log(\epsilon))` rounds is at most :math:`\epsilon`.

    a. Consider rounds where (1) :math:`d_t(v) \lt 2` and :math:`p_t(v) = 1/2` and (2) rounds where :math:`d_v(t) \ge 1` and at least :math:`d_t(v) / 10` of it is contributed by *low-degree* neighbors where low degree is defined as :math:`d_v(t) \lt 2`. 

    Type 1 has a high probability of becoming part of the maximal independent set, in fact it has a constant chance of doing so in :math:`O(log(deg))` rounds. 

    Type 2 has a constant probaiity of getting removed by one of its neighbors in the next :math:`O(log(deg))` rounds. 

    b. Considering the above, we can conclude that with a high enough constant we can get an arbitrarily high probability that any node *v* is removed. Let probaility of *v* being removed in :math:`O(log(deg))` rounds be *z*. As the probability that *v* is removed could be expressed as:

    .. math::

        P(\text{V removed in c rounds of length } O(log(deg))) = 1 - (\frac{1}{z})^c 

    As C tends to infinity, the probability of V being removed is arbitrarily close to 1.

2. We run the algorithm for :math:`O(log \Delta)` rounds. The second part of the algorithm relys on graph shattering. Essentially, the idea that once enough nodes are randomly removed, we are left with a lot of small subgraphs. These small subgraphs can be solved with a deterministic algorithm that runs in :math:`2^{O(log n)}` time. The graph shatters to small subgraphs of size at most :math:`O(\Delta ^ 4)`. Combined with the above deterministic algorithm, this leads to an additional :math:`2^{O( \sqrt{ log \Delta + log log n})}` time.  With a small improvement we get this down to the final time complexity of :math:`O( log \Delta) + 2 ^ {O( \sqrt{log log n})}`.


References
----------
    
.. [Ghaffari] Mohsen Ghaffari, "An Improved Distributed Algorithm for Maximal Independent Set", CoRR 2015.

.. [Barenboim] Barenboim, Leonid, and Michael Elkin. "Sublogarithmic distributed MIS algorithm for sparse graphs using Nash-Williams decomposition." Distributed Computing 22.5-6 (2010): 363-379.

.. [Luby] Luby, Michael. "A Simple Parallel Algorithm for the Maximal Independent Set Problem." SIAM Journal on Computing. 1985.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

