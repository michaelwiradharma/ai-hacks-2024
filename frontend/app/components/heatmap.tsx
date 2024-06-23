// frontend/app/components/HeatMap.tsx
import React, { useEffect, useState } from "react";
import { getSentiment } from "../api/topics"; // TODO: backend
import { Chart } from 'react-chartjs-2';

interface Topic {
  name: string;
  confusion_score: number;
}

export default function HeatMap() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopics();
      if (data) {
        setTopics(data.sort((a: Topic, b: Topic) => a.confusion_score - b.confusion_score));
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: topics.map(topic => topic.name),
    datasets: [{
      label: 'Confusion Score',
      data: topics.map(topic => topic.confusion_score),
      backgroundColor: topics.map(topic => {
        const score = topic.confusion_score;
        if (score < 2) return 'green';
        if (score < 4) return 'yellow';
        return 'red';
      })
    }]
  };

  const options = {
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-100">Confusion Score Heat Map</h3>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
}
