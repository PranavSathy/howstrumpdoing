import { type Observation } from "@/lib/fred";
import * as d3 from "d3";
import { useCallback } from "react";

interface DeserializedObservation {
  date: Date;
  value: number;
}

export function LineChart(props: {
  data: Observation[];
  invertColors?: boolean;
}) {
  const renderChart = useCallback(
    (chartRef: HTMLDivElement) => {
      const data = props.data.map((v) => ({
        date: new Date(v.date),
        value: v.value,
      }));

      // Chart dimensions
      const margin = { top: 20, right: 30, bottom: 30, left: 50 };
      const width =
        Math.min(chartRef?.clientWidth ?? 0, 1280 - 160) -
        margin.left -
        margin.right;
      const height = 400 - margin.top - margin.bottom;

      const container = d3
        .select(chartRef)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .classed("svg-content", true);

      // Create SVG container
      const svg = container
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define scales
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date) as [Date, Date])
        .range([0, width]);

      const firstData = data[0].value;
      const lastData = data[data.length - 1].value;

      const upLineColor = !props.invertColors ? "#16A34A" : "#DC2626";
      const downLineColor = !props.invertColors ? "#DC2626" : "#16A34A";

      const upGradientColor = !props.invertColors
        ? "rgba(22,163,74,0.2)"
        : "rgba(220,38,38,0.2)";
      const downGradientColor = !props.invertColors
        ? "rgba(220,38,38,0.2)"
        : "rgba(22,163,74,0.2)";

      const color = lastData > firstData ? upLineColor : downLineColor;
      const gradient =
        lastData > firstData ? upGradientColor : downGradientColor;

      const yScale = d3
        .scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.value))])
        .range([height, 0]);

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(6));

      svg.append("g").call(d3.axisLeft(yScale).ticks(6));

      // Define line generator
      const line = d3
        .line<DeserializedObservation>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX); // Smooth curve

      // Define the area fill
      const area = d3
        .area<DeserializedObservation>()
        .x((d) => xScale(d.date))
        .y0(height)
        .y1((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

      svg
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        // x1 = 100% (red will be on right horz) / y1 = 100% (red will be on bottom vert)
        // x2 = 100% (red will be on left horz) / y2 = 100% (red will be on top vert)
        // mixed values will change the angle of the linear gradient. Adjust as needed.
        .selectAll("stop")
        .data([
          { offset: "0%", color: gradient }, // TODO(sathyp): Update this to be the right color.
          { offset: "80%", color: "transparent" },
        ])
        .enter()
        .append("stop")
        .attr("offset", function (d) {
          return d.offset;
        })
        .attr("stop-color", function (d) {
          return d.color;
        });

      // Add the line
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color) // TODO(sathyp): Update this to be the right color.
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "url(#area-gradient)")
        .attr("stroke-width", "0")
        .attr("d", area);

      // Add circles for data points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 2)
        .attr("fill", color); // TODO(sathyp): Update this to be the right color.

      svg
        .selectAll("line.horizontalGrid")
        .data(yScale.ticks(6))
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "black")
        .attr("opacity", "0.1")
        .attr("stroke-width", "1px");

      // Add tooltips (optional)
      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("display", "none");

      svg
        .selectAll("circle")
        .on("mouseover", (event, d) => {
          tooltip
            .style("display", "block")
            .html(
              `Date: ${(
                d as DeserializedObservation
              ).date.toDateString()}<br>Value: ${
                (d as DeserializedObservation).value
              }`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });

      return () => {
        container.remove();
      };
    },
    [props.data, props.invertColors]
  );

  return <div ref={renderChart}></div>;
}
