// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
      <div className="container mx-auto p-8 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Meriah Event</h1>
          <p className="text-lg mb-8">
            Create unforgettable events with our easy-to-use platform.
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-blue-500 font-bold py-2 px-4 rounded"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white bg-opacity-20 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Create Events</h2>
            <p className="text-gray-200">
              Easily set up and manage events of any size.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Sell Tickets</h2>
            <p className="text-gray-200">
              Sell tickets online and track sales effortlessly.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">
              Manage Attendees
            </h2>
            <p className="text-gray-200">
              Keep track of attendees and manage registrations seamlessly.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Gain Insights</h2>
            <p className="text-gray-200">
              Analyze event performance and make data-driven decisions.
            </p>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <Image
              src="/banner/promosi" 
              alt="Event Image"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:ml-8 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Bring Your Events to Life
            </h2>
            <p className="text-gray-200">
              Our platform provides all the tools you need to plan, promote,
              and execute successful events.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}