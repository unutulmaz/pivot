
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/I1DChart',["../common/Palette"], factory);
    } else {
        root.api_I1DChart = factory(root.common_Palette);
    }
}(this, function (Palette) {
    function I1DChart() {
    }
    I1DChart.prototype._palette = Palette.rainbow("default");

    //  Events  ---
    I1DChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return I1DChart;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/I2DChart',["../common/Palette"], factory);
    } else {
        root.api_I2DChart = factory(root.common_Palette);
    }
}(this, function (Palette) {
    function I2DChart() {
    }
    I2DChart.prototype._palette = Palette.ordinal("default");

    //  Events  ---
    I2DChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return I2DChart;
}));

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/IGraph',[], factory);
    } else {
        root.api_IGraph = factory();
    }
}(this, function () {
    function IGraph() {
    }

    //  Events  ---
    IGraph.prototype.vertex_click = function (d) {
        console.log("Vertex Click: " + d.id());
    };

    IGraph.prototype.edge_click = function (d) {
        console.log("Edge Click: " + d.id());
    };

    return IGraph;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/IInput',["../common/Widget"], factory);
    } else {
        root.api_IInput = factory(root.common_Widget);
    }
}(this, function (Widget) {
    function IInput() {
        Widget.call(this);
    }
    IInput.prototype = Object.create(Widget.prototype);

    IInput.prototype.publish("name", "", "string", "HTML name for the input");
    IInput.prototype.publish("label", "", "string", "Descriptive label");
    IInput.prototype.publish("value", "", "string", "Input Current Value");
    IInput.prototype.publish("validate", null, "string", "Input Validation");

    //  Implementation  ---
    IInput.prototype.isValid = function () {
        if (this.validate()) {
            var re = new RegExp(this.validate());
            if (!re.test(this.value())) {
                return false;
            }
        }
        return true;
    };

    IInput.prototype.hasValue = function () {
        if (typeof this.type === "function") {
            switch (this.type()) {
                case "radio":
                    /* falls through */
                case "checkbox":
                    if (this.value() && this.value() !== "false") {
                        return true;
                    }
                    break;
                default:
                    if (this.value()) {
                        return true;
                    }
                    break;
            }
            return false;
        }
        return this.value() !== "";
    };

    //  Events  ---
    IInput.prototype.blur = function (w) {
    };
    IInput.prototype.click = function (w) {
    };
    IInput.prototype.change = function (w) {
    };

    IInput.prototype.resetValue = function (w) {
        w.value(w._inputElement[0].node().value);
    };

    IInput.prototype.disable = function (disable) {
        this._inputElement.forEach(function(e, idx) {
            e.attr("disabled", disable ? "disabled" : null);
        });
    };

    return IInput;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/INDChart',["../common/Palette"], factory);
    } else {
        root.api_INDChart = factory(root.common_Palette);
    }
}(this, function (Palette) {
    function INDChart() {
    }
    INDChart.prototype._palette = Palette.ordinal("default");

    //  Events  ---
    INDChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return INDChart;
}));

// d3.tip
// Copyright (c) 2013 Justin Palmer
//
// Tooltips for d3.js SVG visualizations

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module with d3 as a dependency.
    define('d3-tip',['d3'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = function(d3) {
      d3.tip = factory(d3)
      return d3.tip
    }
  } else {
    // Browser global.
    root.d3.tip = factory(root.d3)
  }
}(this, function (d3) {

  // Public - contructs a new tooltip
  //
  // Returns a tip
  return function() {
    var direction = d3_tip_direction,
        offset    = d3_tip_offset,
        html      = d3_tip_html,
        node      = initNode(),
        svg       = null,
        point     = null,
        target    = null

    function tip(vis) {
      svg = getSVGNode(vis)
      point = svg.createSVGPoint()
      document.body.appendChild(node)
    }

    // Public - show the tooltip on the screen
    //
    // Returns a tip
    tip.show = function() {
      var args = Array.prototype.slice.call(arguments)
      if(args[args.length - 1] instanceof SVGElement) target = args.pop()

      var content = html.apply(this, args),
          poffset = offset.apply(this, args),
          dir     = direction.apply(this, args),
          nodel   = getNodeEl(),
          i       = directions.length,
          coords,
          scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
          scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

      nodel.html(content)
        .style({ opacity: 1, 'pointer-events': 'all' })

      while(i--) nodel.classed(directions[i], false)
      coords = direction_callbacks.get(dir).apply(this)
      nodel.classed(dir, true).style({
        top: (coords.top +  poffset[0]) + scrollTop + 'px',
        left: (coords.left + poffset[1]) + scrollLeft + 'px'
      })

      return tip
    }

    // Public - hide the tooltip
    //
    // Returns a tip
    tip.hide = function() {
      var nodel = getNodeEl()
      nodel.style({ opacity: 0, 'pointer-events': 'none' })
      return tip
    }

    // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
    //
    // n - name of the attribute
    // v - value of the attribute
    //
    // Returns tip or attribute value
    tip.attr = function(n, v) {
      if (arguments.length < 2 && typeof n === 'string') {
        return getNodeEl().attr(n)
      } else {
        var args =  Array.prototype.slice.call(arguments)
        d3.selection.prototype.attr.apply(getNodeEl(), args)
      }

      return tip
    }

    // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
    //
    // n - name of the property
    // v - value of the property
    //
    // Returns tip or style property value
    tip.style = function(n, v) {
      if (arguments.length < 2 && typeof n === 'string') {
        return getNodeEl().style(n)
      } else {
        var args =  Array.prototype.slice.call(arguments)
        d3.selection.prototype.style.apply(getNodeEl(), args)
      }

      return tip
    }

    // Public: Set or get the direction of the tooltip
    //
    // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
    //     sw(southwest), ne(northeast) or se(southeast)
    //
    // Returns tip or direction
    tip.direction = function(v) {
      if (!arguments.length) return direction
      direction = v == null ? v : d3.functor(v)

      return tip
    }

    // Public: Sets or gets the offset of the tip
    //
    // v - Array of [x, y] offset
    //
    // Returns offset or
    tip.offset = function(v) {
      if (!arguments.length) return offset
      offset = v == null ? v : d3.functor(v)

      return tip
    }

    // Public: sets or gets the html value of the tooltip
    //
    // v - String value of the tip
    //
    // Returns html value or tip
    tip.html = function(v) {
      if (!arguments.length) return html
      html = v == null ? v : d3.functor(v)

      return tip
    }

    // Public: destroys the tooltip and removes it from the DOM
    //
    // Returns a tip
    tip.destroy = function() {
      if(node) {
        getNodeEl().remove();
        node = null;
      }
      return tip;
    }

    function d3_tip_direction() { return 'n' }
    function d3_tip_offset() { return [0, 0] }
    function d3_tip_html() { return ' ' }

    var direction_callbacks = d3.map({
      n:  direction_n,
      s:  direction_s,
      e:  direction_e,
      w:  direction_w,
      nw: direction_nw,
      ne: direction_ne,
      sw: direction_sw,
      se: direction_se
    }),

    directions = direction_callbacks.keys()

    function direction_n() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.n.y - node.offsetHeight,
        left: bbox.n.x - node.offsetWidth / 2
      }
    }

    function direction_s() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.s.y,
        left: bbox.s.x - node.offsetWidth / 2
      }
    }

    function direction_e() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.e.y - node.offsetHeight / 2,
        left: bbox.e.x
      }
    }

    function direction_w() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.w.y - node.offsetHeight / 2,
        left: bbox.w.x - node.offsetWidth
      }
    }

    function direction_nw() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.nw.y - node.offsetHeight,
        left: bbox.nw.x - node.offsetWidth
      }
    }

    function direction_ne() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.ne.y - node.offsetHeight,
        left: bbox.ne.x
      }
    }

    function direction_sw() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.sw.y,
        left: bbox.sw.x - node.offsetWidth
      }
    }

    function direction_se() {
      var bbox = getScreenBBox()
      return {
        top:  bbox.se.y,
        left: bbox.e.x
      }
    }

    function initNode() {
      var node = d3.select(document.createElement('div'))
      node.style({
        position: 'absolute',
        top: 0,
        opacity: 0,
        'pointer-events': 'none',
        'box-sizing': 'border-box'
      })

      return node.node()
    }

    function getSVGNode(el) {
      el = el.node()
      if(el.tagName.toLowerCase() === 'svg')
        return el

      return el.ownerSVGElement
    }

    function getNodeEl() {
      if(node === null) {
        node = initNode();
        // re-add node to DOM
        document.body.appendChild(node);
      };
      return d3.select(node);
    }

    // Private - gets the screen coordinates of a shape
    //
    // Given a shape on the screen, will return an SVGPoint for the directions
    // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
    // sw(southwest).
    //
    //    +-+-+
    //    |   |
    //    +   +
    //    |   |
    //    +-+-+
    //
    // Returns an Object {n, s, e, w, nw, sw, ne, se}
    function getScreenBBox() {
      var targetel   = target || d3.event.target;

      while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
          targetel = targetel.parentNode;
      }

      var bbox       = {},
          matrix     = targetel.getScreenCTM(),
          tbbox      = targetel.getBBox(),
          width      = tbbox.width,
          height     = tbbox.height,
          x          = tbbox.x,
          y          = tbbox.y

      point.x = x
      point.y = y
      bbox.nw = point.matrixTransform(matrix)
      point.x += width
      bbox.ne = point.matrixTransform(matrix)
      point.y += height
      bbox.se = point.matrixTransform(matrix)
      point.x -= width
      bbox.sw = point.matrixTransform(matrix)
      point.y -= height / 2
      bbox.w  = point.matrixTransform(matrix)
      point.x += width
      bbox.e = point.matrixTransform(matrix)
      point.x -= width / 2
      point.y -= height / 2
      bbox.n = point.matrixTransform(matrix)
      point.y += height
      bbox.s = point.matrixTransform(matrix)

      return bbox
    }

    return tip
  };

}));


define('css!src/api/ITooltip',[],function(){});

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/ITooltip',["d3", "d3-tip", "../common/Widget", "css!./ITooltip"], factory);
    } else {
        root.api_ITooltip = factory(root.d3, root.d3.tip, root.common_Widget);
    }
}(this, function (d3, d3Tip, Widget, AbsoluteSurface, TextBox) {
    function ITooltip() {
        Widget.call(this);

        this._valueFormatter = d3.format(this.tooltipValueFormat());

        if (this.layerEnter) {
            var layerEnter = this.layerEnter;
            this.layerEnter = function (base, svgElement, domElement) {
                this.tooltipEnter(svgElement);
                layerEnter.apply(this, arguments);
            };
            var layerUpdate = this.layerUpdate;
            this.layerUpdate = function (base) {
                layerUpdate.apply(this, arguments);
                this.tooltipUpdate();
            };
            var layerExit = this.layerExit;
            this.layerExit = function (base) {
                layerExit.apply(this, arguments);
                this.tooltipExit();
            };
        } else {
            var enter = this.enter;
            this.enter = function (domNode, element) {
                this.tooltipEnter(element);
                enter.apply(this, arguments);
            };
            var update = this.update;
            this.update = function (domNode, element) {
                update.apply(this, arguments);
                this.tooltipUpdate();
            };
            var exit = this.exit;
            this.exit = function (domNode, element) {
                exit.apply(this, arguments);
                this.tooltipExit();
            };
        }
    }
    ITooltip.prototype = Object.create(Widget.prototype);

    ITooltip.prototype.publish("tooltipStyle", "default", "set", "Style", ["default", "none"], {});
    ITooltip.prototype.publish("tooltipValueFormat", ",.2f", "string", "Value Format", null, {});
    ITooltip.prototype.publish("tooltipSeriesColor", "#EAFFFF", "html-color", "Series Color", null, {});
    ITooltip.prototype.publish("tooltipLabelColor", "#CCFFFF", "html-color", "Label Color", null, {});
    ITooltip.prototype.publish("tooltipValueColor", "white", "html-color", "Value Color", null, {});
    ITooltip.prototype.publish("tooltipTick", true, "boolean", "Show tooltip tick", null, {});
    ITooltip.prototype.publish("tooltipOffset", 8, "number", "Offset from the cursor", null, {});

    ITooltip.prototype.tooltipEnter = function (element) {
        var context = this;
        this.tooltip = d3Tip()
            .attr("class", "d3-tip")
            .offset(function (d) {
                switch (context.tooltip.direction()()) {
                    case "e":
                        return [0, context.tooltipOffset()];
                    default:
                        return [-context.tooltipOffset(), 0];
                }
            })
        ;
        element.call(this.tooltip);
    };

    ITooltip.prototype.tooltipUpdate = function () {
        var classed = this.tooltip.attr("class");
        classed = classed.split(" notick").join("") + (this.tooltipTick() ? "" : " notick") + (this.tooltipStyle() === "none" ? " hidden" : "");
        this.tooltip
            .attr("class", classed)
        ;
    };

    ITooltip.prototype.tooltipExit = function () {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
    };

    var tooltipValueFormat = ITooltip.prototype.tooltipValueFormat;
    ITooltip.prototype.tooltipValueFormat = function (_) {
        var retVal = tooltipValueFormat.apply(this, arguments);
        if (arguments.length) {
            this._valueFormatter = d3.format(_);
        }
        return retVal;
    };

    ITooltip.prototype._tooltipHTML = function (d) {
        return d;
    };

    ITooltip.prototype.tooltipHTML = function (_) {
        return this.tooltip.html(_);
    };

    ITooltip.prototype.tooltipFormat = function (opts) {
        opts = opts || {};
        opts.label = opts.label || "";
        opts.series = opts.series || "";
        if (opts.value instanceof Date) {
            opts.value = opts.value || "";
        } else {
            opts.value = this._valueFormatter(opts.value) || "";
        }
        switch (this.tooltipStyle()) {
            case "none":
                break;
            default:
                if (opts.series) {
                    return "<span style='color:" + this.tooltipSeriesColor() + "'>" + opts.series + "</span> / <span style='color:" + this.tooltipLabelColor() + "'>" + opts.label + "</span>:  <span style='color:" + this.tooltipValueColor() + "'>" + opts.value + "</span>";
                }
                return "<span style='color:" + this.tooltipLabelColor() + "'>" + opts.label + "</span>:  <span style='color:" + this.tooltipValueColor() + "'>" + opts.value + "</span>";
        }
    };

    return ITooltip;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('src/api/ITree',["../common/Palette"], factory);
    } else {
        root.api_ITree = factory(root.common_Palette);
    }
}(this, function (Palette) {
    function ITree() {
    }
    ITree.prototype._palette = Palette.ordinal("default");

    //  Events  ---
    ITree.prototype.click = function (d) {
        console.log("Click:  " + d.label);
    };

    return ITree;
}));


(function(c){var d=document,a='appendChild',i='styleSheet',s=d.createElement('style');s.type='text/css';d.getElementsByTagName('head')[0][a](s);s[i]?s[i].cssText=c:s[a](d.createTextNode(c));})
('.d3-tip,.d3-tip:after{line-height:1;pointer-events:none!important}.d3-tip{font-weight:700;padding:12px;background:rgba(0,0,0,.66);color:#fff;border-radius:2px;z-index:10}.d3-tip.hidden{visibility:hidden}.d3-tip:after{box-sizing:border-box;display:inline;font-size:10px;width:100%;color:rgba(0,0,0,.66);position:absolute}.d3-tip.n:after{content:\"\\25BC\";margin:-1px 0 0;top:100%;left:0;text-align:center}.d3-tip.e:after{content:\"\\25C0\";margin:-4px 0 0;top:50%;left:-8px}.d3-tip.s:after{content:\"\\25B2\";margin:0 0 1px;top:-8px;left:0;text-align:center}.d3-tip.w:after{content:\"\\25B6\";margin:-4px 0 0 -1px;top:50%;left:100%}.d3-tip.notick:after{content:\"\"!important}.common_Widget .over{stroke:rgba(0,0,0,.66);opacity:.66}');

define("hpcc-viz-api", function(){});
