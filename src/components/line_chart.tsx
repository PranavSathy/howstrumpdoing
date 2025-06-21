import {
  findClosestBefore,
  INAUGURATION_DAY,
  type Observation,
} from "@/lib/fred";
import * as d3 from "d3";
import { useCallback } from "react";

interface DeserializedObservation {
  date: Date;
  value: number;
}

function formatQuarter(date: Date): string {
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter} ${year}`;
}

export function LineChart(props: {
  data: Observation[];
  invertColors?: boolean;
  quarterly: boolean;
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

      // const firstData = data[0].value;
      const firstData = (
        findClosestBefore(props.data, INAUGURATION_DAY) ?? { value: 0 }
      ).value;
      const lastData = data[data.length - 1].value;

      const dataBefore = data.filter((d) => d.date <= INAUGURATION_DAY);
      const dataAfter = data.filter((d) => d.date >= INAUGURATION_DAY);

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

      const values = data.map((d) => d.value);
      const minValue = d3.min(values) ?? 0;
      const maxValue = d3.max(values) ?? 1;

      const paddingFactor = 0.05; // 5% padding
      const valueRange = maxValue - minValue;
      const yMin = minValue - valueRange * paddingFactor;
      const yMax = maxValue + valueRange * paddingFactor;

      const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

      let xAxisLabel = d3.axisBottom(xScale).ticks(6);

      if (props.quarterly) {
        xAxisLabel = xAxisLabel.tickFormat((d) => formatQuarter(d as Date));
      }

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxisLabel);

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
        .attr("id", "pre-area-gradient")
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
          { offset: "0%", color: "rgba(163,163,163,0.2)" }, // TODO(sathyp): Update this to be the right color.
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
          { offset: "0%", color: gradient },
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

      // Line BEFORE Inauguration Day (gray)
      svg
        .append("path")
        .datum(dataBefore)
        .attr("fill", "none")
        .attr("stroke", "#A3A3A3") // gray
        .attr("stroke-width", 2)
        .attr("d", line);

      // Line AFTER Inauguration Day (color)
      svg
        .append("path")
        .datum(dataAfter)
        .attr("fill", "none")
        .attr("stroke", color) // dynamic based on trend
        .attr("stroke-width", 2)
        .attr("d", line);

      svg
        .append("path")
        .datum(dataBefore)
        .attr("fill", "url(#pre-area-gradient)")
        .attr("stroke-width", "0")
        .attr("d", area);

      svg
        .append("path")
        .datum(dataAfter)
        .attr("fill", "url(#area-gradient)")
        .attr("stroke-width", "0")
        .attr("d", area);

      // Add circles for data points
      svg
        .selectAll("circle")
        .data(dataBefore)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 2)
        .attr("fill", "#A3A3A3");

      // Add circles for data points
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 2)
        .attr("fill", color);

      // Jan 20, 2025 vertical marker
      const jan2025X = xScale(INAUGURATION_DAY);

      // Only render if it's within the scale range
      if (jan2025X >= 0 && jan2025X <= width) {
        svg
          .append("line")
          .attr("x1", jan2025X)
          .attr("x2", jan2025X)
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#000") // or any contrasting color
          .attr("stroke-dasharray", "4 4") // dotted/dashed line
          .attr("stroke-width", 1)
          .attr("opacity", 0.5);

        // Add label text
        svg
          .append("text")
          .attr("x", jan2025X)
          .attr("y", -5) // position above the chart top
          .attr("text-anchor", "middle")
          .attr("fill", "#000")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text("Trump Takes Office");
      }

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
        .on("mouseover", (_, d) => {
          tooltip
            .style("display", "block")
            .html(
              `Date: ${
                props.quarterly
                  ? formatQuarter((d as DeserializedObservation).date)
                  : (d as DeserializedObservation).date.toDateString()
              }<br>Value: ${(d as DeserializedObservation).value}`
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
    [props.data, props.invertColors, props.quarterly]
  );

  return <div ref={renderChart}></div>;
}
