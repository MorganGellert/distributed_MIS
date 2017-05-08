.. distributed_MIS documentation master file, created by
   sphinx-quickstart on Mon May  8 13:25:57 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to distributed_MIS's documentation!
===========================================

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


.. toctree::
   :maxdepth: 2
   :caption: Contents:



Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
