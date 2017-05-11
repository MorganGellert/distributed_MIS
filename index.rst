.. distributed_MIS documentation master file, created by
   sphinx-quickstart on Mon May  8 13:25:57 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==========================================================
Algorithms for Distributed Maximal Independent Set
==========================================================
  By Morgan Gellert and Alex Tong

Introduction
------------

For our final project we studied Mohsen Ghaffari's paper **"An Improved Distributed Algorithm for Maximal Independent Set"**. This paper won the Best Paper Award (co-winner) and Best Student Paper Award at SODA 2016. 
The Maximal Independent Set problem is a fundamental problem in distributed algorithms. Ghaffari's improvement of the best known global time complexity of [Barenboim_] et al. from :math:`O(log^2 \Delta) + 2 ^ {O( \sqrt{ log log n})}` to :math:`O(log \Delta) + 2 ^ {O( \sqrt{ log log n})}` therefore has great impact on other areas of the field. Ghaffari's time complexity approaches the known lower bound for distributed maximal set of :math:`\Omega( min \{ log \Delta, \sqrt{ log n} \})` [KMW04]_.

The Problem
-----------

A Maximal Independent Set has two conditions:

1. It is an independent set, defined as a set of nodes :math:`S \in V` s.t. :math:`\forall s1, s2 \in S` *s1* is not adjacent to *s2*.  
2. A maximal independent set is one in which no other nodes in the graph can be added to the independent set. 

Notice that a maximal independent set is an easily solved problem where a **maximum** independent set is a much harder problem. A maximum independent set can be stated as the largest maximal independent set possible in the graph *G*. This is because a maximal independent set problem can be solved locally where a **maximum** independent set problem is inherently global.

We demonstrate a few algorithms for solving the distributed version of maximal independent set using a specific model on how nodes interact. We use the *LOCAL* model, essentially, computation nodes are arranged in a graph :math:`G = (V,E)` where neighbors in the graph can talk in constant time and communication rounds are synchronized across the entire graph. We take :math:`|V| = n` in this model. This model is often used in distributed colorings which has applications in networking and Monte Carlo algorithms [Lub85]_.

The time complexity of these distributed algorithms bounds the possible neighborhood that the algorithm can talk to. 
Trivially,  an algorithm that runs in :math:`O(log n)` time means that each node must consider other nodes at most :math:`O(log n)` hops away [Lub85]_. 

For analysis, algorithms that restrict the range of communication allow for simpler proofs and clearer intuitions. 

Local vs. Global Time Complexity
++++++++++++++++++++++++++++++++

When we talk about time complexity generally we are considering the global time complexity, i.e. the time that it takes the algorithm to complete on all nodes with high probability.
The Local time complexity asks the question: What is the time guarantee with regards to a single node instead?

The local time complexity is equivalent to the global time complexity for deterministic algorithms, but in the distributed maximal independent set case, we would like to prove a time complexity bound on a node relative to it's degree and independent of *n*.

We define the local complexity question as the following. How long does it take till a node *v* knows whether it is in the MIS or not with high probability?

We might care about the local time complexity as it may capture information, and therefore lead to a lower overall time complexity, that a global analysis might not.


Lubys Algorithm
---------------

Visualization
+++++++++++++

The number associated with each node is simply a random value between 0 and 1. Nodes that will be added to the Maximal Independent Set is marked red. Elements that are definitely not in the MIS are marked black. 

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

The Algorithm
+++++++++++++

Luby's Algorithm presents a :math:`O(log(|V|))` algorithm from computing a Maximal Independent Set. While it is true that each node finishes with high probability in :math:`O(log \Delta)` where :math:`\Delta` is its degree, it has been notoriously difficult to improve the global time complexity.

The algorithm is incredibly simple: in each round each node is marked with a number between 0 and 1. Local minima are added to the Maximal Independent Set and their neighbors are removed from the graph. [Lub85]_


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

Each node has two numbers associated with it on the left we have the *desire-level* of the node and on the right we have the *effective-degree* of that node. Each node is colored a shade of blue according to its probability of being marked in the next round. All nodes are turned green (marked) with probability equal to their *desire-level*. Then any marked green node that has no green neighbors is marked red as belonging to the Maximal Independent Set, and its neighbors are removed.

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

The Algorithm
+++++++++++++

Ghaffari's algorithm completes with high probability in 
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

1. A node will are likely to be marked in one of two cases:

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

    Type 2 has a constant probability of getting removed by one of its neighbors in the next :math:`O(log(deg))` rounds. 

    b. Considering the above, we can conclude that with a high enough constant we can get an arbitrarily high probability that any node *v* is removed. Let probaility of *v* being removed in :math:`O(log(deg))` rounds be *z*. As the probability that *v* is removed could be expressed as:

    .. math::

        P(\text{V removed in c rounds of length } O(log(deg))) = 1 - (\frac{1}{z})^c 

    As C tends to infinity, the probability of V being removed is arbitrarily close to 1.

2. We run the algorithm for :math:`O(log \Delta)` rounds. The second part of the algorithm relys on graph shattering. Essentially, the idea that once enough nodes are randomly removed, we are left with a lot of small subgraphs. These small subgraphs can be solved with a deterministic algorithm that runs in :math:`2^{O(log n)}` time. The graph shatters to small subgraphs of size at most :math:`O(\Delta ^ 4)`. Combined with the above deterministic algorithm, this leads to an additional :math:`2^{O( \sqrt{ log \Delta + log log n})}` time.  With a small improvement we get this down to the final time complexity of :math:`O( log \Delta) + 2 ^ {O( \sqrt{log log n})}`.


References
----------
    
.. [Ghaffari] Mohsen Ghaffari, "An Improved Distributed Algorithm for Maximal Independent Set", ACM-SIAM Symposium on Discrete Algorithms (SODA) 2016. https://arxiv.org/abs/1506.05093.

.. [Barenboim] Barenboim, Leonid, and Michael Elkin. "Sublogarithmic distributed MIS algorithm for sparse graphs using Nash-Williams decomposition." Distributed Computing 22.5-6 (2010): 363-379. https://www.cs.bgu.ac.il/~elkinm/fp162-elkin.pdf.

.. [Lub85]  Michael Luby. A simple parallel algorithm for the maximal independent set problem. In Proc. of the Symp. on Theory of Comp. (STOC), pages 1–10. ACM, 1985. http://epubs.siam.org/doi/abs/10.1137/0215074

.. [KMW04] Fabian Kuhn, Thomas Moscibroda, and Roger Wattenhofer. What cannot be computed locally! In the Proc. of the Int’l Symp. on Princ. of Dist. Comp. (PODC), pages 300–309.  ACM, 2004, also coRR abs/1011.5470v1. https://www.microsoft.com/en-us/research/wp-content/uploads/2017/01/podc04.pdf.
.. toctree::
   :maxdepth: 2
   :caption: Contents:

