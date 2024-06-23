// frontend/app/components/HeatMap.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Post } from "../types/database";

const Heatmap = ({ data, width }: any) => {
  const ref = useRef();

  let totalScore = 0;
  for (const num of Object.values(data)) {
    totalScore += Number(num);
  }
  

  useEffect(() => {
    if (data && ref.current) {
      const colorScale = d3
        .scaleLinear()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .range([
          "white",
          "#ffcccc",
          "#ff9999",
          "#ff6666",
          "#ff3333",
          "red",
          "#cc0000",
          "#990000",
          "#660000",
          "#330000"
        ]);

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); 

      
      const containerWidth = width;

      let cumulativeWidth = 0
      const rect = svg
        .selectAll("rect")
        .data(Object.entries(data))
        .enter()
        .append("rect")
        .attr("x", (d) => {
          const x = cumulativeWidth;
          cumulativeWidth += (d[1] / totalScore) * containerWidth;
          return x;
        })
        .attr("y", 20)
        .attr("width", (d) => (d[1] / totalScore) * containerWidth)
        .attr("height", 20)
        .attr("fill", (d) => colorScale(d[1]));

      cumulativeWidth = 0; 

      svg
        .selectAll("text")
        .data(Object.entries(data))
        .enter()
        .append("text")
        .attr("x", (d) => {
          const x = cumulativeWidth + ((d[1] / totalScore) * containerWidth) / 2;
          cumulativeWidth += (d[1] / totalScore) * containerWidth;
          return x;
        })
        .attr("y", 15)
        .attr("text-anchor", "middle")
        // .attr("transform", "rotate(-45)")
        .style("fill", "white")
        .style("font-size", "12px")
        .text((d) => `${d[0]}: ${d[1]}`);
    }
  }, [data]);

  return <svg className="w-full" ref={ref}></svg>;
};

const data = {
  "boolean logic": 1,
  "while loops": 10,
  "conditionals": 3,
  "for loops" : 9,
  "environment diagram" : 7
};

const sortedData = Object.fromEntries(
  Object.entries(data).sort(([, a], [, b]) => a - b)
);

export default function HeatMap(post: Post) {
  const ref = useRef();
  return (
    <div ref={ref}>
      <h3 className="text-lg font-semibold text-gray-100">
        Confusion Score Heat Map
      </h3>
      <Heatmap data={sortedData} width={ref.current?.clientWidth} class="w-full"/>
    </div>
  );
}
