'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import messages from '@/messages.json';
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";
import Dashboard from "./dashboard/page";
import { useSession } from "next-auth/react";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const {data:session}=useSession();

  useEffect(()=>{
    if (!api)
      return;

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  },[api]);

  return (
    <>
      {!session?(<main className="flex-grow flex flex-col justify-center items-center px-4 md:px-24 bg-gray-800 py-12 md:py-17 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">Dive into the World of Anonymous Feedback</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">True Feedback - Where your identity remains a secret.</p>
        </section>
        <div className="mx-auto max-w-[10rem] sm:max-w-xs">
          <Carousel 
            orientation="horizontal"
            setApi={setApi} className="w-full max-w-xs"
            plugins={[Autoplay({ delay: 2000 })]}
          >
            <CarouselContent>
              {messages.map((mess,idx)=>(
                <CarouselItem key={idx}>
                  <Card className="m-px">
                    <CardHeader>
                      <CardTitle>{mess.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0"/>
                        <div>
                          <p>{mess.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {mess.received}
                          </p>
                        </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Slide {current} of {count}
          </div>
        </div>
      </main>):(
        <Dashboard/>
      )}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © {new Date().getFullYear()} True Feedback. All rights reserved.
      </footer>
    </>
  );
}
