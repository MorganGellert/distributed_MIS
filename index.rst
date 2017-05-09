.. distributed_MIS documentation master file, created by
   sphinx-quickstart on Mon May  8 13:25:57 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

==========================================================
Algorithms for Distributed Maximal Independent Set
==========================================================
  By Morgan Gellert and Alex Tong


The Problem
==========================

A maximal independent set is a subset :math:`H` of a graph :math:`G` which has no nodes that connect to each other. Additionally, there are no elements in :math:`G - H` that could be added to :math:`H` that would not violate this requirement.


Lubys Algorithm
===========================


.. raw:: html 

    <embed>

  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="http://maurizzzio.github.io/greuler/scripts/lib/cola.v3.js"></script>
  <script src="http://maurizzzio.github.io/greuler/greuler.min.js"></script>
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



Ghaffari's Algorithm
--------------------

Visualization
+++++++++++++

.. raw:: html

    <embed>
      <script src="http://d3js.org/d3.v3.min.js"></script>
      <script src="http://maurizzzio.github.io/greuler/scripts/lib/cola.v3.js"></script>
      <script src="http://maurizzzio.github.io/greuler/greuler.min.js"></script>
      <div id="ghaffari_demo"><div id="ghaffari"></div></div>
      <script src=_static/ghaffari.js>  </script>
      <script>
      myrun = function() {
        window.site.run();
      }
      reset_luby = function() {
        var parent = document.getElementById("ghaffari_demo");
        var child =  document.getElementById("ghaffari");
        parent.removeChild(child);
        var new_child = document.createElement("div");
        new_child.id = "ghaffari";
        parent.appendChild(new_child);
        window.site.reset();
      }
      </script>

      <button onclick="myrun()"> One Ghaffari Iteration</button>
      <button onclick="reset_luby()"> Reset Graph </button>
    </embed>


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

3. 











References
----------
    
.. [Ghaffari] Mohsen Ghaffari, "An Improved Distributed Algorithm for Maximal Independent Set", CoRR 2015.

.. [Barenboim] Barenboim, Leonid, and Michael Elkin. "Sublogarithmic distributed MIS algorithm for sparse graphs using Nash-Williams decomposition." Distributed Computing 22.5-6 (2010): 363-379.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

