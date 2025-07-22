// pages/safety.tsx

import Image from "next/image";
import Head from "next/head";
import Header from "@/components/Header";

const features = [
  {
    name: "Hike with Others",
    icon: "/images/people-group-solid.svg",
    content:
      "Try not to hike alone. There are many hiking groups. Find others you will enjoy hiking with.",
  },
  {
    name: "Get Your NH Hike Safe Card",
    icon: "/images/credit-card-regular.svg",
    content:
      "Get your NH Hike Safe Card to support the rescuers. You never know when you will need them.",
  },
  {
    name: "The 10 Essentials",
    icon: "/images/person-hiking-solid.svg",
    content:
      "Learn what the 10 essentials are and have them in your pack.",
  },
  {
    name: "Tell Others Your Plan",
    icon: "/images/house-user-solid.svg",
    content:
      "Make sure others know your plans like where you will be hiking and when you are expected back.",
  },
  {
    name: "Check the Weather",
    icon: "/images/cloud-solid.svg",
    content:
      "Make sure you check the weather for the mountain you are hiking. In many places the weather in the mountains is different from ground level.",
  },
  {
    name: "The Mountain Will Be There",
    icon: "/images/mountain-sun-solid.svg",
    content:
      "If your hike isn't going to plan, don't worry about turning around. The mountain will always be there for you to try again.",
  },
];

export default function Safety() {
  return (
    <>
      <Head>
        <title>Be Safe! | Hiking Patches</title>
        <meta
          name="description"
          content="Stay safe while hiking by following these essential tips and practices."
        />
      </Head>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <Header/>
        <h1 className="text-4xl font-bold text-center mb-6">Be Safe!</h1>
        <p className="text-lg text-gray-700 mb-12 text-center">
          Hiking safety is paramount for a successful and enjoyable outdoor adventure.
          Prioritize preparation by researching your chosen trail, packing appropriate
          gear, and sharing your itinerary with a trusted person. Dress for the weather,
          stay hydrated, and carry essential items like a map, first-aid kit, and emergency
          communication tools. Follow trail etiquette, respect wildlife, and be ready to
          adjust your plans for unexpected weather conditions. Group hiking is recommended,
          and having a clear emergency protocol ensures you’re well-prepared for any
          situation. With these precautions, you can relish the beauty of nature while
          staying safe on the trail.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <Image
                src={feature.icon}
                alt={feature.name}
                width={48}
                height={48}
                className="mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{feature.name}</h2>
              <p className="text-gray-600">{feature.content}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

