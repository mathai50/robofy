"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"

const chartData = [
  { metric: "ROI", value: 87, fill: "#3b82f6" },       // Blue 500
  { metric: "Conversion", value: 64, fill: "#2563eb" }, // Blue 600
  { metric: "Engagement", value: 78, fill: "#60a5fa" }, // Blue 400
  { metric: "Retention", value: 92, fill: "#1d4ed8" },  // Blue 700
  { metric: "Growth", value: 75, fill: "#1e40af" },     // Blue 800
]

import { useEffect, useRef, useState } from "react"

export function ChartRadialLabel() {
  const [isInView, setIsInView] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={chartRef}>
      <Card className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
        <CardHeader className="items-center pb-0">
          <h3 className="text-xl font-normal text-gray-900 dark:text-white">Marketing Performance</h3>
          <p className="text-gray-600 dark:text-gray-400">Q1 - Q4 2024</p>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px]">
            {isInView && (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={chartData}
                  startAngle={-90}
                  endAngle={380}
                  innerRadius={30}
                  outerRadius={110}
                >
                  <RadialBar
                    dataKey="value"
                    background
                    animationBegin={0}
                    animationDuration={2000} // Double the default duration
                  >
                    <LabelList
                      position="insideStart"
                      dataKey="metric"
                      className="fill-white capitalize"
                      fontSize={11}
                    />
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm pt-4">
          <div className="flex items-center gap-2 leading-none font-medium text-gray-900 dark:text-white">
            Trending up by 12.5% this quarter <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-gray-600 dark:text-gray-400 leading-none">
            Showing key marketing performance indicators
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}