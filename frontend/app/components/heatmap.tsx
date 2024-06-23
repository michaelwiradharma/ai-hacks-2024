// frontend/app/components/HeatMap.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Post } from "../types/database";
import { getSentiment } from "../api/api";

type HeatMapProps = {
  post: Post;
};

function Heatmap({ data, width }: any) {
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
          "#330000",
        ]);

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const containerWidth = width;
      const barHeight = 20;

      let cumulativeWidth = 0;
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
        .attr("y", barHeight)
        .attr("width", (d) => (d[1] / totalScore) * containerWidth)
        .attr("height", barHeight)
        .attr("fill", (d) => colorScale(d[1]));

      cumulativeWidth = 0;

      svg
        .selectAll("text")
        .data(Object.entries(data))
        .enter()
        .append("text")
        .attr("x", (d) => {
          const x =
            cumulativeWidth + ((d[1] / totalScore) * containerWidth) / 2;
          cumulativeWidth += (d[1] / totalScore) * containerWidth;
          return x;
        })
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "12px")
        .text((d) => `${d[0]}: ${d[1]}`);
    }
  }, [data, width]);

  return <svg className="w-full" ref={ref}></svg>;
}

export default function HeatMap({ post }: HeatMapProps) {
  const divref = useRef();

  const [sentiment, setSentiment] = useState<object>(null);
  const [width, setWidth] = useState<number>(700);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSentiment(post.id, post.content);
      const jsonparsed = JSON.parse(result.replaceAll("'", '"'));
      const sortedData = Object.fromEntries(
        Object.entries(jsonparsed).sort(([, a], [, b]) => a - b)
      );
      setSentiment(sortedData);
    };
    fetchData();
  }, [post.id, post.content]);


  useEffect(() => {
    if (divref && divref.current && divref.current.clientWidth) {
      setWidth(divref.current.clientWidth);
    }
  }, [divref]);

  return (
    <div>
      <h3 ref={divref} className="text-lg font-semibold text-gray-100">
        Confusion Score Heat Map
      </h3>
      {sentiment && (
        <Heatmap data={sentiment} width={width} className="w-full" />
      )}
    </div>
  );
}
