(function($) {
  $.fn.sawtable = function( options ) {
    var defaults = {
      classes: {
        sortable:     'sortable',
        sorted:       'sorted',
        sorted_asc:   'sorted-asc',
        sorted_desc:  'sorted-desc'
      },
      sorters: {
        string: function(a, b) {
                  return a.localeCompare(b);
                },
        number: function(a, b) {
                  return parseInt(a, 10) - parseInt(b, 10);
                }
      }
    };

    var settings = $.extend(true, {}, defaults, options);

    function do_sort(table, column, datatype, sort_direction) {
      var tb = table.tBodies[0];
      var rows = Array.prototype.slice.call(tb.rows, 0);

      var fn_sort = settings.sorters[datatype];

      if( fn_sort ) {
        rows = rows.sort(function(a, b) {
          return sort_direction * (fn_sort(a.cells[column].textContent.trim(), b.cells[column].textContent.trim()));
        });
        for(var i = 0; i < rows.length; i++) tb.appendChild(rows[i]);
      }
    }

    this.filter("table").each(function() {
      var table = this;
      var th = table.tHead;
      
      th && (th = th.rows[0]) && (th = th.cells);

      if(th) {
        for(var n = 0; n < th.length; n++) {
          var datatype = th[n].getAttribute("data-sort");
          if( datatype ) {
            $(th[n]).addClass('sortable');
            (function(n, d) {
              var sort_direction = 1;
              th[n].addEventListener('click', function() {
                do_sort(table, n, d, (sort_direction = sort_direction * -1));
                $(th).removeClass([settings.classes.sorted, settings.classes.sorted_asc, settings.classes.sorted_desc].join(' '));
                var classlist = settings.classes.sorted;
                if(sort_direction === 1) {
                  classlist = classlist + " " + settings.classes.sorted_asc;
                } else {
                  classlist = classlist + " " + settings.classes.sorted_desc;
                }
                $(th[n]).addClass(classlist).trigger('sawtable.sorted');
              });
            }(n, datatype));
          }
        }
      }
    });
  };
}( jQuery ));


