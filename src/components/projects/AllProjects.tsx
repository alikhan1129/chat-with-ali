"use client";
import { Card, Carousel } from "@/components/projects/apple-cards-carousel";
import { data } from "@/components/projects/ConfigData";


export default function AllProjects() {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full pt-8 flex items-center justify-center">
        <p className="text-neutral-500">No projects found in configuration.</p>
      </div>
    );
  }

  const cards = data.map((card, index) => (
    <Card key={card.title} card={card} index={index} layout={true} />
  ));
  console.log(data[0]);

  return (
    <div className="w-full h-full pt-8">
      <h2 className="max-w-7xl mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        My Projects
      </h2>
      <Carousel items={cards} />
    </div>
  );
}
