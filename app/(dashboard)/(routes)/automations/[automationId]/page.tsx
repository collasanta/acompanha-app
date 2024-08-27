"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

// Mock data - in a real application, this would come from your backend
const automations = [
  {
    id: 1,
    name: "Daily Calorie Adjustment",
    description:
      "Adjusts your calorie intake based on your daily activity level.",
  },
  {
    id: 2,
    name: "Weekly Meal Plan Generation",
    description:
      "Creates a personalized meal plan every week based on your progress and preferences.",
  },
  {
    id: 3,
    name: "Progress-based Workout Adjustment",
    description:
      "Modifies your workout routine based on your weekly progress report.",
  },
];

export default function ClientAutomationsView() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Active Automations</h1>
      <div className="space-y-4">
        {automations.map((automation) => (
          <div
            key={automation.id}
            className="p-4 border rounded bg-white shadow-sm flex items-start"
          >
            <CheckCircle
              className="text-green-500 mr-4 mt-1 flex-shrink-0"
              size={24}
            />
            <div>
              <h2 className="text-xl font-semibold">{automation.name}</h2>
              <p className="text-gray-600">{automation.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
